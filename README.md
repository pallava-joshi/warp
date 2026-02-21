# Warp

AI-assisted coding with OpenCode. Autometa landing page and chat demo.

## Demo

https://github.com/user-attachments/assets/515904ac-d540-4828-86e7-16a81b43a519

## Quick Start

```sh
pnpm install
pnpm dev
```

- **Web**: [http://localhost:3000](http://localhost:3000) — Landing page
- **Demo**: [http://localhost:3000/demo](http://localhost:3000/demo) — Chat / prompt interface
- **API**: [http://localhost:4000](http://localhost:4000)

## Testing Steps

1. **Landing page** — Open `/`, verify hero (badge, headline, dashboard mockup, trusted logos). Click **Get a Demo**.
2. **Demo page** — Confirm navigation to `/demo`. Enter a prompt, submit, check response.
3. **OpenCode** — For chat replies, ensure OpenCode runs (`opencode serve`) and `.env` has `OPENCODE_BASE_URL`, `OPENCODE_SERVER_USERNAME`, `OPENCODE_SERVER_PASSWORD`.

## Env

| Variable | Description |
|----------|-------------|
| `OPENCODE_BASE_URL` | OpenCode server URL (default `http://localhost:4096`) |
| `OPENCODE_SERVER_USERNAME` | Basic auth username |
| `OPENCODE_SERVER_PASSWORD` | Basic auth password (optional) |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev servers |
| `pnpm build` | Build all packages |
| `pnpm lint` | Lint |
| `pnpm format` | Format with Prettier |
| `pnpm check-types` | TypeScript check |
