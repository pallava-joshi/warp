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
trap "kill $TART_PID 2>/dev/null; tart stop $VM_NAME 2>/dev/null; exit 1" EXIT

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
# Install OpenCode
curl -sL opencode.ai/install | bash
# Ensure binary in PATH
export PATH="$HOME/.local/bin:$PATH"
opencode version || true

# Create systemd user service for opencode serve
mkdir -p ~/.config/systemd/user
cat > ~/.config/systemd/user/opencode-serve.service << 'EOF'
[Unit]
Description=OpenCode serve
After=network.target

[Service]
Type=simple
ExecStart=%h/.local/bin/opencode serve --port 4096 --hostname 0.0.0.0
Restart=on-failure
RestartSec=5
Environment=PATH=/usr/local/bin:/usr/bin:/bin:%h/.local/bin

[Install]
WantedBy=default.target
EOF

# Enable lingering so user services run without login
sudo loginctl enable-linger "$USER" 2>/dev/null || true
systemctl --user daemon-reload
systemctl --user enable opencode-serve.service
systemctl --user start opencode-serve.service

# Wait for opencode serve to be up
sleep 5
curl -s http://localhost:4096/health 2>/dev/null || true
REMOTE

echo "==> Verifying opencode serve..."
sleep 3
HEALTH=$(curl -s --max-time 5 "http://${IP}:4096/health" 2>/dev/null || echo "")
if echo "$HEALTH" | grep -q "healthy"; then
  echo "    OpenCode serve is healthy at http://${IP}:4096"
else
  echo "    Warning: opencode serve may not be ready. Check manually: curl http://${IP}:4096/health"
fi

# Stop VM (keep image for reuse)
echo "==> Stopping VM..."
trap - EXIT
kill $TART_PID 2>/dev/null || true
tart stop "$VM_NAME" 2>/dev/null || true
wait $TART_PID 2>/dev/null || true

echo ""
echo "==> Done. Image '$VM_NAME' is ready."
echo "    Run: tart run $VM_NAME"
echo "    Then: curl http://\$(tart ip $VM_NAME):4096/health"
