# OpenCode MVP – Testing Steps

## Prerequisites

1. **OpenCode server** running locally (e.g. `opencode serve` on port 4096)
2. **Environment variables** – Copy `.env.example` to `.env` and configure:

   ```
   OPENCODE_BASE_URL=http://localhost:4096
   OPENCODE_SERVER_USERNAME=opencode
   OPENCODE_SERVER_PASSWORD=   # Leave empty if no auth
   ```

---

## Task 1: Env Setup

**Verify:**
- [ ] `.env.example` includes `OPENCODE_BASE_URL`, `OPENCODE_SERVER_USERNAME`, `OPENCODE_SERVER_PASSWORD`
- [ ] README has a "Connecting to OpenCode" section
- [ ] A new developer can run `cp .env.example .env` and start the app

---

## Task 2: OpenCode SDK Client

**Verify:**
- [ ] `packages/opencode` builds: `pnpm build --filter=@repo/opencode`
- [ ] Package exports `opencode` via `createOpencodeClient({ baseUrl })`
- [ ] Default base URL is `http://localhost:4096` when `OPENCODE_BASE_URL` is unset

**Health check (requires OpenCode server):**
```bash
# Start opencode serve in a separate terminal
opencode serve

# In another terminal, run the web app and submit a prompt (see Task 5)
```

---

## Task 3: Auth Headers

**Verify:**
- [ ] When `OPENCODE_SERVER_PASSWORD` is set, the client sends `Authorization: Basic` header
- [ ] Username defaults to `opencode` when `OPENCODE_SERVER_USERNAME` is unset
- [ ] With password set and server requiring auth, prompts succeed

**Test with auth:**
1. Set `OPENCODE_SERVER_PASSWORD=your-secret` in `.env`
2. Start OpenCode server with auth enabled
3. Submit a prompt; it should succeed
4. Remove the password or use a wrong one; requests should fail

---

## Task 4: Prompt Flow

**Verify:**
- [ ] Server action `submitPrompt(text)` exists in `app/actions/prompt.ts`
- [ ] Flow: `session.create` → `session.prompt` → return assistant text
- [ ] Empty prompts return `{ ok: false, error: "..." }`
- [ ] Successful responses return `{ ok: true, content: "..." }`

**Quick test:**
- Use the Chat UI (Task 5) or call the server action from a test script

---

## Task 5: Chat UI

**Verify:**
- [ ] Home page (`/`) renders `ChatScreen`
- [ ] Text input and Send button are visible
- [ ] Submitting shows loading state
- [ ] After completion, user message and assistant response appear
- [ ] Errors show a dismissible message

**Manual test:**
1. `pnpm dev` (ensure port 3000 is free)
2. Open http://localhost:3000
3. Type a prompt (e.g. "What is 2+2?")
4. Click Send
5. Confirm:
   - Loading indicator appears
   - User message appears
   - Assistant response appears below
6. Submit an invalid or empty prompt and confirm error handling

---

## End-to-End Test

1. Start OpenCode server:
   ```bash
   opencode serve
   ```

2. Start the app:
   ```bash
   pnpm dev
   ```

3. Open http://localhost:3000

4. Enter: `Write a haiku about coding` and click Send

5. Expect: loading state, then a short AI-generated haiku (or error if OpenCode has no model configured)

6. (Optional) Add `OPENCODE_SERVER_PASSWORD` to `.env` if your OpenCode server uses Basic auth and retest

---

## Build & Type-Check

```bash
pnpm check-types   # All packages pass
pnpm build         # Full monorepo build
pnpm build --filter=web   # Web app only
```
