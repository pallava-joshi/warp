# Tart Context for Warp Isolated Assistant

Tart is chosen for Firecracker-like isolation on Mac. Firecracker is Linux-only.

## Installation

```bash
brew install cirruslabs/cli/tart
```

**Requirements:** macOS 13+ (Ventura), Apple Silicon.

## Linux Images (OpenCode runs on Linux)

- `ghcr.io/cirruslabs/ubuntu:latest`
- `ghcr.io/cirruslabs/debian:latest`
- `ghcr.io/cirruslabs/fedora:latest`

```bash
tart clone ghcr.io/cirruslabs/ubuntu:latest ubuntu
tart set ubuntu --disk-size 50   # resize from default 20GB
tart run ubuntu
```

**Credentials:** `admin` / `admin` (SSH, console).

## Networking

- **Host → Guest:** `tart ip <vm-name>` returns guest IP. Host can reach services in the VM at `http://$(tart ip vm-name):4096`.
- **SSH:** `ssh admin@$(tart ip vm-name)`
- **Run script in VM:** `sshpass -p admin ssh -o StrictHostKeyChecking=no admin@$(tart ip vm-name) "command"`
- **Orchard (remote):** `orchard port-forward vm <vm-name> <local>:<remote>` for port forwarding.

## VM Lifecycle

```bash
tart clone ghcr.io/cirruslabs/ubuntu:latest my-vm
tart run my-vm          # start (blocking; use & or subprocess)
tart ip my-vm           # get IP
tart stop my-vm         # stop
```

## Directory Mount (optional)

```bash
tart run --dir=project:~/src/project vm
# Linux guest: mount at /mnt/shared (virtiofs)
```

## Custom OpenCode Image

Use the build script:

```bash
./scripts/tart-opencode-image.sh [VM_NAME]
```

Defaults to `warp-opencode`. Requires `tart` and `sshpass` (brew install cirruslabs/cli/tart sshpass).

The script: clones Ubuntu, runs VM, SSHs in, runs `curl -sL opencode.ai/install | bash`, configures systemd user service for `opencode serve --port 4096 --hostname 0.0.0.0`, verifies health. VM is stopped but image is kept for reuse.
