# Warp – Testing Steps

## Prerequisites

- **macOS 13+ (Ventura), Apple Silicon** for Tart
- **Tart:** `brew install cirruslabs/cli/tart`
- **sshpass:** `brew install sshpass` (for VM image build)

---

## Mode 1: Direct OpenCode (no isolation)

Use when OpenCode runs locally (e.g. `opencode serve` on port 4096).

1. Copy `.env.example` to `.env`
2. Set `OPENCODE_BASE_URL=http://localhost:4096` and `OPENCODE_USE_TART=false`
3. Start OpenCode: `opencode serve`
4. Start app: `pnpm dev`
5. Open http://localhost:3000, submit a prompt

---

## Mode 2: Tart isolated mode

Assistant runs inside a Tart Linux VM.

### Task 6: Build Tart OpenCode VM image

```bash
./scripts/tart-opencode-image.sh [VM_NAME]
```

Defaults to `warp-opencode`. Requires `tart` and `sshpass`.

**Verify:**
- [ ] Script clones Ubuntu, installs OpenCode, configures systemd
- [ ] After completion: `tart run warp-opencode`
- [ ] `curl http://$(tart ip warp-opencode):4096/health` returns `{"healthy":true,...}`
- [ ] `tart stop warp-opencode` stops the VM

### Task 7–9: Orchestration and prompt flow

1. Build the image (Task 6)
2. In `.env`: `OPENCODE_USE_TART=true`, `NEXT_PUBLIC_API_URL=http://localhost:4000`, `TART_VM_NAME=warp-opencode`
3. Start API service: `pnpm dev --filter=api-service` (port 4000)
4. Start web: `pnpm dev --filter=web` (port 3000)
5. Open http://localhost:3000, submit a prompt

**Verify:**
- [ ] First prompt triggers `tart run` (VM spawns)
- [ ] API waits for OpenCode healthy, then runs prompt
- [ ] Response appears in chat
- [ ] Subsequent prompts reuse the same VM (no re-spawn)

---

## Build & type-check

```bash
pnpm check-types
pnpm build
```

---

## Quick reference

| Mode   | OPENCODE_USE_TART | OPENCODE_BASE_URL      | Flow                    |
|--------|-------------------|------------------------|-------------------------|
| Direct | false             | http://localhost:4096  | Web → OpenCode direct   |
| Tart   | true              | (ignored)              | Web → API → Tart VM → OpenCode |
