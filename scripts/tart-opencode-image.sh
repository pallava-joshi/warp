#!/usr/bin/env bash
# Build a Tart Linux VM image with OpenCode installed and opencode serve at boot.
# Requires: tart (brew install cirruslabs/cli/tart), sshpass (brew install sshpass)
# Usage: ./scripts/tart-opencode-image.sh [VM_NAME]
#
set -e

VM_NAME="${1:-warp-opencode}"
IMAGE_SOURCE="ghcr.io/cirruslabs/ubuntu:latest"
SSH_USER="admin"
SSH_PASS="admin"
MAX_WAIT=120  # seconds for boot/SSH

echo "==> Building Tart OpenCode image: $VM_NAME"
echo "    Source: $IMAGE_SOURCE"
echo ""

# Clone if not exists
if ! tart list 2>/dev/null | grep -q "^$VM_NAME"; then
  echo "==> Cloning $IMAGE_SOURCE..."
  tart clone "$IMAGE_SOURCE" "$VM_NAME"
  tart set "$VM_NAME" --disk-size 50
else
  echo "==> VM $VM_NAME already exists. Delete it first to rebuild: tart delete $VM_NAME"
  exit 1
fi

# Start VM in background
echo "==> Starting VM (this may take a minute)..."
tart run "$VM_NAME" &
TART_PID=$!
trap "tart stop $VM_NAME 2>/dev/null || true; exit 1" EXIT

# Wait for VM to get IP
echo "==> Waiting for VM IP..."
for i in $(seq 1 $MAX_WAIT); do
  IP=$(tart ip "$VM_NAME" 2>/dev/null || true)
  if [ -n "$IP" ]; then
    echo "    IP: $IP"
    break
  fi
  sleep 1
  [ $i -eq $MAX_WAIT ] && { echo "Timeout waiting for IP"; exit 1; }
done

# Wait for SSH
echo "==> Waiting for SSH..."
SSH_OPTS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=2"
for i in $(seq 1 $MAX_WAIT); do
  if sshpass -p "$SSH_PASS" ssh $SSH_OPTS "${SSH_USER}@${IP}" "echo ok" 2>/dev/null; then
    echo "    SSH ready"
    break
  fi
  sleep 2
  [ $i -eq $MAX_WAIT ] && { echo "Timeout waiting for SSH"; exit 1; }
done

# Install OpenCode and configure opencode serve at boot
echo "==> Installing OpenCode..."
sshpass -p "$SSH_PASS" ssh $SSH_OPTS "${SSH_USER}@${IP}" "bash -s" << 'REMOTE'
set -e
# Install OpenCode (installs to ~/.opencode/bin)
curl -sL opencode.ai/install | bash
export PATH="$HOME/.opencode/bin:$PATH"
opencode version || true

# Create system-level service (starts on boot; user services + linger can be flaky)
sudo tee /etc/systemd/system/opencode-serve.service > /dev/null << EOF
[Unit]
Description=OpenCode serve
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=admin
WorkingDirectory=/home/admin
ExecStart=/home/admin/.opencode/bin/opencode serve --port 4096 --hostname 0.0.0.0
Restart=on-failure
RestartSec=5
Environment=PATH=/usr/local/bin:/usr/bin:/bin:/home/admin/.opencode/bin

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable opencode-serve.service
sudo systemctl start opencode-serve.service

# Wait for opencode serve to be up
sleep 5
curl -s http://localhost:4096/global/health 2>/dev/null || true
echo ""
echo "==> Service status (inside VM):"
sudo systemctl --no-pager -l status opencode-serve.service || true
REMOTE

echo "==> Verifying opencode serve..."
sleep 3
HEALTH=$(curl -s --max-time 5 "http://${IP}:4096/global/health" 2>/dev/null || echo "")
if echo "$HEALTH" | grep -q "healthy"; then
  echo "    OpenCode serve is healthy at http://${IP}:4096"
else
  echo "    Warning: opencode serve may not be ready. Check manually: curl http://${IP}:4096/global/health"
  echo "==> Collecting diagnostics from VM..."
  sshpass -p "$SSH_PASS" ssh $SSH_OPTS "${SSH_USER}@${IP}" "sudo systemctl --no-pager -l status opencode-serve.service || true"
  sshpass -p "$SSH_PASS" ssh $SSH_OPTS "${SSH_USER}@${IP}" "sudo journalctl -u opencode-serve.service -n 200 --no-pager || true"
fi

# Graceful shutdown to persist filesystem changes
echo "==> Shutting down VM gracefully..."
sshpass -p "$SSH_PASS" ssh $SSH_OPTS "${SSH_USER}@${IP}" "sudo sync; sudo shutdown -h now" || true

# Wait for the VM process to exit
for i in $(seq 1 60); do
  if ! kill -0 "$TART_PID" 2>/dev/null; then
    break
  fi
  sleep 1
done

if kill -0 "$TART_PID" 2>/dev/null; then
  echo "==> VM did not shut down in time, forcing stop..."
  tart stop "$VM_NAME" 2>/dev/null || true
fi

trap - EXIT
wait $TART_PID 2>/dev/null || true

echo ""
echo "==> Done. Image '$VM_NAME' is ready."
echo "    Run: tart run $VM_NAME"
echo "    Then: curl http://\$(tart ip $VM_NAME):4096/global/health"
