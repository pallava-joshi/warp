Building an Application on Top of OpenCode

Two Integration Modes

flowchart LR
    subgraph embedded [Embedded Mode]
        YourApp[Your App]
        Server[OpenCode Server]
        YourApp -->|createOpencode| Server
        YourApp -->|client| Server
    end

    subgraph remote [Remote Mode]
        YourApp2[Your App]
        ExistingServer[opencode serve]
        YourApp2 -->|createOpencodeClient| ExistingServer
    end

Embedded mode – Your app starts and owns the OpenCode server (e.g. Slack integration).
Remote mode – Your app connects to an existing opencode serve (e.g. web app, CLI).



1. SDK vs Direct HTTP







Approach



Use when





SDK (@opencode-ai/sdk)



Type safety, SSE helpers, full API coverage. Preferred for most apps.





Direct HTTP



Custom clients (non-JS), simple scripts, or custom REST handling. OpenAPI spec at GET /doc.



2. Client Setup

SDK: Client only (remote server)

import { createOpencodeClient } from "@opencode-ai/sdk";

const client = createOpencodeClient({
  baseUrl: "http://localhost:4096",
  // Optional: custom fetch, headers, signal
});

SDK: Embedded server + client

import { createOpencode } from "@opencode-ai/sdk";

const { client, server } = await createOpencode({
  hostname: "127.0.0.1",
  port: 4096, // or 0 for random
  config: { model: "anthropic/claude-3-5-sonnet-20241022" },
});
// server.url, server.close()

Authentication

Server can use HTTP Basic Auth via OPENCODE_SERVER_PASSWORD (and optionally OPENCODE_SERVER_USERNAME):

const client = createOpencodeClient({
  baseUrl: "http://localhost:4096",
  headers: {
    Authorization: `Basic ${btoa("opencode:your-password")}`,
  },
});

Reference: packages/app/src/utils/server.ts



3. Core APIs for Building an App

Sessions and prompts





client.session.list({ directory? }) – List sessions



client.session.create({ body: { title?, directory? } }) – Create session



client.session.get({ sessionID }) – Get session



client.session.prompt({ sessionID, body }) – Sync prompt (waits for full AI response)



client.session.promptAsync({ sessionID, body }) – Fire-and-forget prompt; use with events for streaming



client.session.command({ sessionID, body }) – Run a command



client.session.messages({ sessionID, limit? }) – List messages

Prompt body shape

{
  parts: [
    { type: "text", text: "..." },
    { type: "file", mime: "text/plain", url: "file:///path" },
    // ...
  ],
  model?: { providerID, modelID },
  agent?: string,
  format?: { type: "json_schema", schema: {...} },  // structured output
}

Directory scoping

Many session/project APIs accept directory as a query param to scope to a workspace:

client.session.list({ directory: "/path/to/project" });



4. Real-Time Streaming via Events

Streaming to your UI is done via SSE, not by streaming tokens directly from the prompt endpoint.

Subscribe to events

const events = await client.global.event({
  signal: abortController.signal,
  onSseError: (err) => console.error(err),
});

for await (const event of events.stream) {
  const { directory, payload } = event;
  // payload: { type, properties }
  switch (payload.type) {
    case "message.part.delta":
      // Append payload.properties.delta to text part
      break;
    case "message.part.updated":
      // Full part update (tool result, reasoning, etc.)
      break;
    case "message.updated":
      // Message metadata
      break;
  }
}

Event types for streaming UI:





message.part.delta – { messageID, partID, field, delta } – append text



message.part.updated – { part } – full part (tool call, reasoning, text)



message.updated – { info } – message metadata



session.status – busy/idle/retry

Reference: packages/app/src/context/global-sync/event-reducer.ts

Typical streaming flow





Call session.promptAsync() (or session.prompt() if you want the full response at the end).



Subscribe to global.event in parallel.



Apply message.part.delta / message.part.updated to your local state.



Render UI incrementally as events arrive.



5. Endpoints vs SDK

All SDK methods map to HTTP endpoints. Main routes:







Area



Path prefix



Examples





Global



/global/



/global/health, /global/event, /global/config





Project



/project/



/project/list, /project/current





Session



/session/



/session, /session/:id, /session/:id/message





Auth



/auth/



/auth/:providerID





MCP



/mcp/



MCP server management





TUI



/tui/



Remote TUI control (IDE integrations)

OpenAPI spec: GET http://localhost:4096/doc



6. Reference Integrations







Integration



Mode



Key pattern





packages/slack/src/index.ts



Embedded



createOpencode(), session.create, session.prompt, event.subscribe





github/index.ts



Remote



createOpencodeClient({ baseUrl }), session APIs





packages/opencode/src/cli/cmd/run.ts



Remote



session.prompt, event.subscribe for streaming





packages/app



Remote



createOpencodeClient, global.event SSE, event-reducer for store





packages/sdk/js/example/example.ts



Embedded



session.create, session.prompt (sync)



7. Decision Checklist





Run OpenCode yourself or use existing server? → Embedded vs Remote



Need streaming UI? → Use promptAsync + global.event SSE



Browser vs Node? → Both work; use directory for project scope when relevant



Auth? → Set OPENCODE_SERVER_PASSWORD and pass Basic auth in headers



Custom model/config? → Pass config to createOpencode() or use session.prompt body