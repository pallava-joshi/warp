# Warp

AI-assisted coding with OpenCode, supporting two runtime modes:

- Direct OpenCode mode
- Tart-isolated OpenCode mode (VM-backed)

## Demo Videos

- Direct mode demo video: `[ADD_VIDEO_LINK_DIRECT_MODE]`
- Tart isolated mode demo video: `[ADD_VIDEO_LINK_TART_MODE]`
- Existing recording: [Screen Recording](./docs/demo-recording.mov)

## Quick Start

```sh
pnpm install
pnpm dev
```

- **Web**: [http://localhost:3000](http://localhost:3000)
- **Demo**: [http://localhost:3000/demo](http://localhost:3000/demo)
- **API**: [http://localhost:4000](http://localhost:4000)

## Testing Steps

See the full validated runbook in:

- [`task/TESTING-STEPS.md`](./task/TESTING-STEPS.md)

## Environment

Core variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | API base URL for web app |
| `OPENCODE_BASE_URL` | Direct mode OpenCode URL (fallback mode) |
| `OPENCODE_USE_TART` | `true` to route prompts through Tart/API flow |
| `TART_VM_NAME` | Tart VM name to run and reuse |
| `PORT` | API service port |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all dev servers (web + api-service) |
| `pnpm build` | Build all packages/apps |
| `pnpm lint` | Run lint checks |
| `pnpm format` | Format files with Prettier |
| `pnpm check-types` | Run TypeScript checks |
