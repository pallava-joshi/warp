import { createOpencodeClient } from "@opencode-ai/sdk";

const baseUrl = process.env.OPENCODE_BASE_URL ?? "http://localhost:4096";

/**
 * OpenCode client for remote mode. Connects to an existing OpenCode server
 * (e.g. `opencode serve`). See: https://opencode.ai/docs/sdk/#client-only
 */
export const opencode = createOpencodeClient({ baseUrl });

/** Create a client with a custom baseUrl (e.g. for Tart VM). */
export { createOpencodeClient };
