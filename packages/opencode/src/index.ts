import { createOpencodeClient } from "@opencode-ai/sdk";

const baseUrl = process.env.OPENCODE_BASE_URL ?? "http://localhost:4096";

const headers: Record<string, string> = {};
if (process.env.OPENCODE_SERVER_PASSWORD) {
  const user = process.env.OPENCODE_SERVER_USERNAME ?? "opencode";
  const encoded = Buffer.from(
    `${user}:${process.env.OPENCODE_SERVER_PASSWORD}`,
    "utf-8",
  ).toString("base64");
  headers.Authorization = `Basic ${encoded}`;
}

/**
 * OpenCode client for remote mode. Connects to an existing OpenCode server
 * (e.g. `opencode serve`). Uses Basic auth when OPENCODE_SERVER_PASSWORD is set.
 * See: https://opencode.ai/docs/sdk/#client-only
 */
export const opencode = createOpencodeClient({ baseUrl, headers });
