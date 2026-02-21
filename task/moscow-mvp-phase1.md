# MoSCoW Prioritization & MVP Phase 1 (Build Fast)

---

## Must-Haves Only – MVP Phase 1 Task List

**Goal:** User types a prompt and sees the AI response. Remote OpenCode only, no session management, no streaming.

| # | Task | Est. |
|---|------|------|
| 1 | **OpenCode SDK Client** – Add `@opencode-ai/sdk`, create `createOpencodeClient({ baseUrl })` with `OPENCODE_BASE_URL` | 1–2h |
| 2 | **Auth headers** – Add Basic auth from `OPENCODE_SERVER_PASSWORD` when set | 30m |
| 3 | **Prompt flow** – Server action or API route: inline session create → `session.prompt` (sync) → return response | 2h |
| 4 | **Chat UI** – Simple page: text input, submit button, loading state, response display | 1–2h |
| 5 | **Env setup** – `.env.example` + README snippet for OpenCode config | 30m |

**Total:** ~5–6 hours.

---

## MoSCoW (Reference)

### Must Have (Phase 1)

- OpenCode SDK Client (remote only)
- HTTP Basic Auth (optional)
- Prompt flow (create session inline, sync prompt, return messages)
- Simple chat UI
- Env setup

### Should Have (Phase 2)

- Integration mode selection (embedded)
- SSE + streaming
- Event reducer
- Express API layer
- React context/hooks
- Session list UI

### Could Have (Phase 3+)

- Directory scoping
- session.command
- Error resilience

### Won't Have (Phase 1)

- Session management (list, selection, persistence)
- Embedded mode
- Streaming
- Express proxy
- session.promptAsync, session.command

---

## Implementation Sketch

### 1. Client (Task 1 + 2)

```ts
import { createOpencodeClient } from "@opencode-ai/sdk";

const baseUrl = process.env.OPENCODE_BASE_URL ?? "http://localhost:4096";
const headers: Record<string, string> = {};
if (process.env.OPENCODE_SERVER_PASSWORD) {
  const user = process.env.OPENCODE_SERVER_USERNAME ?? "opencode";
  headers.Authorization = `Basic ${Buffer.from(`${user}:${process.env.OPENCODE_SERVER_PASSWORD}`).toString("base64")}`;
}

export const opencode = createOpencodeClient({ baseUrl, headers });
```

### 2. Prompt flow (Task 3)

```ts
// Inline: create session → prompt (sync) → return messages
const session = await opencode.session.create({ body: {} });
await opencode.session.prompt({ sessionID: session.id, body: { parts: [{ type: "text", text }] } });
const { messages } = await opencode.session.messages({ sessionID: session.id });
return messages;
```

### 3. Page (Task 4)

- Form with textarea + Submit
- `useFormStatus` or local loading state
- Display response after completion

---

## Dependency Graph

```
[1: Client] ──▶ [2: Auth] ──▶ [3: Prompt flow] ──▶ [4: Chat UI]
                                                      │
[5: .env] ────────────────────────────────────────────┘
```
