# OpenCode Integration – Prioritized Task List & Architecture

## Overview

This document provides a prioritized task list with complexity scores and architecture discussion for building an OpenCode-powered application within the Warp monorepo. Tasks are stored in `.taskmaster/tasks/tasks.json` for use with Task Master.

---

## Prioritized Task List

Tasks are ordered by **priority** (high → medium → low) and **dependency order** (foundational tasks first). Use this sequence for implementation.

| # | ID | Title | Priority | Complexity (1–10) | Story Points | Dependencies |
|---|----|-------|----------|-------------------|--------------|--------------|
| 1 | 1 | Integration Mode Selection and Client Factory | high | 5 | 3 | — |
| 2 | 2 | OpenCode SDK Client Setup | high | 4 | 2 | 1 |
| 3 | 3 | HTTP Basic Auth for OpenCode | high | 3 | 1 | 2 |
| 4 | 4 | Session Management APIs | high | 5 | 3 | 2 |
| 5 | 5 | Prompt API (Sync and Async) | high | 5 | 3 | 4 |
| 6 | 6 | SSE Event Subscription | high | 6 | 4 | 2 |
| 7 | 7 | Event Reducer and Local State | high | 7 | 5 | 6 |
| 8 | 9 | Express API Service Layer | high | 7 | 5 | 4, 5, 6 |
| 9 | 10 | React Context and Hooks for OpenCode | high | 6 | 4 | 7, 9 |
| 10 | 11 | Chat or Prompt UI Component | high | 6 | 4 | 10 |
| 11 | 6 | Isolated Env Strategy (Mac) | high | 4 | 2 | — |
| 12 | 7 | OpenCode VM/Container Image | high | 6 | 4 | 6 |
| 13 | 8 | Env Orchestration (Spawn on Demand) | high | 8 | 5 | 7 |
| 14 | 9 | Network Bridge (API → Isolated OpenCode) | high | 5 | 3 | 8 |
| 15 | 10 | Wire Isolation into Prompt Flow | high | 7 | 4 | 4, 9 |
| 16 | 8 | Project and Directory Scoping | medium | 4 | 2 | 4 |
| 17 | 12 | Session List and Selection UI | medium | 4 | 2 | 10 |
| 18 | 13 | Error Handling and Resilience | medium | 5 | 3 | 6, 7 |
| 19 | 14 | Documentation and Environment Setup | low | 2 | 1 | 1, 2, 3 |

**Total story points:** 44

---

## Complexity Score Guide

Complexity is scored 1–10 (aligned with Task Master’s `analyze-complexity` scale):

| Range | Meaning | Examples |
|-------|---------|----------|
| 1–2 | Trivial | Docs, env config |
| 3–4 | Low | Auth wiring, scoping, simple UI |
| 5–6 | Medium | Client factory, session APIs, SSE, hooks |
| 7–8 | High | Event reducer, API service layer, streaming UX |
| 9–10 | Very high | Large cross-cutting changes |

**Tasks recommended for expansion (complexity ≥ 6):**

- **6** – SSE Event Subscription  
- **7** – Event Reducer and Local State  
- **9** – Express API Service Layer  
- **10** – React Context and Hooks  
- **11** – Chat or Prompt UI Component  

Use Task Master’s `expand` command to break these into subtasks.

---

## Suggested Phases

### Phase 1: Foundation (Tasks 1–3)

- Integration mode selection and client factory  
- SDK client setup  
- Auth wiring  

**Outcome:** Warp can connect to OpenCode (embedded or remote) with auth.

### Phase 2: Core APIs (Tasks 4–6)

- Session management  
- Prompt (sync/async) and command APIs  
- SSE event subscription  

**Outcome:** Warp can create sessions, send prompts, and consume streaming events.

### Phase 3: State and Backend (Tasks 7, 9)

- Event reducer and local state  
- Express API service layer  

**Outcome:** Centralized state for streaming and a backend that proxies OpenCode for the frontend.

### Phase 4: Frontend (Tasks 10–12)

- React context and hooks  
- Chat/prompt UI  
- Session list and selection UI  

**Outcome:** End-to-end chat UI with streaming responses.

### Phase 5: Polish (Tasks 13–14)

- Error handling and resilience  
- Documentation and environment setup  

**Outcome:** Production-ready UX and onboarding docs.

---

## Architecture Discussion

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Warp Monorepo                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐     ┌─────────────────────┐     ┌──────────────┐  │
│  │  apps/web    │────▶│  apps/api-service   │────▶│  OpenCode    │  │
│  │  (Next.js)   │     │  (Express)          │     │  Server      │  │
│  │              │◀────│                     │◀────│  (remote or  │  │
│  └──────────────┘     └─────────────────────┘     │   embedded)  │  │
│         │                        │                 └──────────────┘  │
│         │                        │                        │          │
│         ▼                        ▼                        │          │
│  ┌──────────────┐         ┌──────────────┐                │          │
│  │ React context│         │ OpenCode     │────────────────┘          │
│  │ + hooks      │         │ SDK client   │  (direct if embedded)     │
│  └──────────────┘         └──────────────┘                           │
│         │                                                             │
│         ▼                                                             │
│  ┌──────────────┐                                                    │
│  │ Event stream │  message.part.delta, message.part.updated,          │
│  │ → Reducer    │  session.status → local state → UI                  │
│  └──────────────┘                                                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Isolated Environment (Mac / Firecracker-like)

**Core principle:** Assistant runs in an isolated environment. User asks question → spawn isolated env → OpenCode runs inside → answer returns to chat.

**Why not Firecracker on Mac?** Firecracker is Linux/KVM-only; it does not run on macOS.

**Mac alternatives for isolation:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **Tart** | Apple Silicon VMs via Virtualization.framework | Native, fast boot, Linux support (Ubuntu/Debian), OCI registry | Apple Silicon only |
| **OrbStack** | Lightweight Linux VMs on Mac | Popular, Docker-compatible | Less isolation than full VM |
| **Lima** | Linux VMs on Mac | Lightweight, QEMU-based | More setup |
| **Docker** | Containers | Simple, cross-platform | Less isolation than VM |

**Recommended for Warp (Mac):** [Tart](https://tart.run) — `brew install cirruslabs/cli/tart`. Use `ghcr.io/cirruslabs/ubuntu` or similar Linux image with OpenCode.

**Flow:**
```
Browser (user prompt) → API → Orchestrator → Spawn Tart/Docker env
                                              ↓
                                    OpenCode runs inside
                                              ↓
                                    Response → API → Chat UI
```

Tasks 6–10 implement this: strategy → image → orchestration → network bridge → wire into prompt flow.

---

### Integration Mode

| Mode | Use case | Pros | Cons |
|------|----------|------|------|
| **Embedded** | Slack-style integrations, CLI, desktop | Full control, no external server | Resource usage, lifecycle |
| **Remote** | Web app, shared deployment | Lighter clients, centralized server | Network dependency, auth |

Recommendation for Warp:

- **apps/web** → Remote (use `createOpencodeClient` against existing `opencode serve`)  
- **apps/api-service** → Remote or Embedded (env-driven: `OPENCODE_MODE`)  

### Data Flow for Streaming

1. User submits prompt in UI → `promptAsync(sessionID, body)`  
2. API service (or frontend) calls OpenCode SDK  
3. Frontend subscribes to `client.global.event` (SSE)  
4. Events: `message.part.delta`, `message.part.updated`, `message.updated`, `session.status`  
5. Event reducer updates local state  
6. React re-renders with incremental content  

This follows the pattern in `packages/app/src/context/global-sync/event-reducer.ts`.

### Where to Place OpenCode Logic

| Layer | Responsibility |
|-------|----------------|
| **packages/opencode** (new) | SDK client factory, mode selection, auth setup |
| **apps/api-service** | REST endpoints for sessions, prompts, event proxy |
| **apps/web** | React context, hooks, event reducer, chat UI |

Reuse and extend `packages/app` patterns where applicable, but keep Warp-specific logic in `packages/` and `apps/`.

### Security

- No secrets in code; use env vars (e.g. `OPENCODE_SERVER_PASSWORD`)  
- Auth headers set server-side or via trusted config  
- API service validates and scopes requests by user/workspace  
- CORS configured for known frontend origins  

### Tech Fit with Warp

- **Next.js** – Client-side fetch + SSE via EventSource or fetch stream  
- **Express** – REST and optional SSE proxy for OpenCode events  
- **React** – Context + hooks for sessions, messages, streaming state  

---

## Task Master Commands

After configuring `PERPLEXITY_API_KEY` (optional) for research-backed analysis:

```bash
# Generate complexity report (requires API key)
task-master analyze-complexity --research

# View complexity report
task-master complexity-report

# Expand complex tasks
task-master expand --id=7

# Find next task
task-master next
```

Tasks live in `.taskmaster/tasks/tasks.json`. Update status with `set_task_status` (MCP) or `task-master set-status`.
