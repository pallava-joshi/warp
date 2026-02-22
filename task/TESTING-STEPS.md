# Warp – Testing Steps

## Prerequisites

```bash
brew install cirruslabs/cli/tart
brew install sshpass
```
Expected: `tart` and `sshpass` commands are available.

```bash
cp .env.example .env
```
Expected: `.env` exists at repo root.

---

## Mode 1: Direct OpenCode (no isolation)

```bash
opencode serve --port 4096 --hostname 0.0.0.0
```
Expected: OpenCode server starts and logs listening on `4096`.

```bash
pnpm dev
```
Expected: Web app runs (usually `http://localhost:3000`).

Open `http://localhost:3000`, submit a prompt.
Expected: prompt succeeds and assistant response is shown.

---

## Mode 2: Tart isolated mode

Assistant runs inside a Tart VM.  
Use Tart routing (VM-backed OpenCode via API service).

### 1) Build the Tart image (Task 6)

```bash
tart delete warp-opencode
./scripts/tart-opencode-image.sh warp-opencode
```
Expected:
- Script clones Ubuntu image
- Installs OpenCode
- Creates/enables `opencode-serve.service`
- Shows `OpenCode serve is healthy`
- Performs graceful shutdown and exits

### 2) Start VM and verify service persistence

```bash
tart run warp-opencode
```
Expected: VM starts and keeps running in this terminal.

```bash
IP=$(tart ip warp-opencode)
sshpass -p admin ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null admin@$IP "sudo ls -l /etc/systemd/system/opencode-serve.service"
sshpass -p admin ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null admin@$IP "sudo systemctl status opencode-serve --no-pager -l"
curl http://$IP:4096/global/health
```
Expected:
- Service file exists
- Service status is `active (running)`
- Health returns JSON like `{"healthy":true,"version":"..."}`

### 3) Run API + Web (Tasks 7–9)

Set in `.env`:
- `OPENCODE_USE_TART=true`
- `NEXT_PUBLIC_API_URL=http://localhost:4000`
- `TART_VM_NAME=warp-opencode`
- `PORT=4000`

```bash
pnpm dev
```
Expected: Turborepo starts both `apps/api-service` and `apps/web` together.
You should see API logs for port `4000` and web logs for port `3000`.

Open `http://localhost:3000`, submit a prompt.
Expected:
- API calls Tart-backed OpenCode
- Chat returns assistant response
- Subsequent prompts reuse same VM
- Browser Network may show only `POST /demo` (server action), which is expected.

Important:
- In browser Network tab, seeing only `POST /demo` is expected for Next.js server actions.
- The server action runs on the Next.js server and then calls API service (`/api/prompt`) server-side, so `/api/prompt` may not appear in browser Network.

### 4) Proven working checks (copy/paste)

```bash
IP=$(tart ip warp-opencode)
curl http://$IP:4096/global/health
```
Expected: `{"healthy":true,"version":"..."}`

```bash
sshpass -p admin ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null admin@$IP "sudo systemctl status opencode-serve --no-pager -l"
```
Expected: `opencode-serve.service` is `active (running)` and listening on `0.0.0.0:4096`.

```bash
curl http://localhost:4000/health
curl -X POST http://localhost:4000/api/prompt \
  -H "Content-Type: application/json" \
  -d '{"text":"hello from test"}'
```
Expected:
- Health returns `{"status":"ok"}`
- Prompt returns `{"content":"..."}` from Tart-backed OpenCode.

---

## Build and type-check

```bash
pnpm check-types
pnpm build
```
Expected: both commands pass without errors.
