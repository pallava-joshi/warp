# Warp

AI-assisted coding with OpenCode, supporting two runtime modes:

- Tart-isolated OpenCode mode (VM-backed)

https://github.com/user-attachments/assets/2c815eef-9ab6-4e46-88d0-8cd76c13123d

Hero Section
<img width="1453" height="849" alt="image" src="https://github.com/user-attachments/assets/fc32b1b1-246c-4520-80ec-bba9784e0d82" />

## Quick Start

```sh
pnpm install
pnpm dev
```

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
