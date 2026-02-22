"use server";

import { opencode } from "@repo/opencode";

export type PromptResult =
  | { ok: true; content: string }
  | { ok: false; error: string };

// In this monorepo, apps/web may run without directly loading repo-root .env.
// Default to Tart/API mode unless explicitly disabled.
const useTart = (process.env.OPENCODE_USE_TART ?? "true") === "true";
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/**
 * Server action: create session → send prompt (sync) → return assistant text.
 * When OPENCODE_USE_TART=true, uses API service which spawns Tart VM.
 */
export async function submitPrompt(text: string): Promise<PromptResult> {
  if (!text.trim()) {
    return { ok: false, error: "Prompt cannot be empty." };
  }

  if (useTart) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    try {
      const res = await fetch(`${apiUrl}/api/prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
        signal: controller.signal,
      });
      const raw = await res.text();
      let data: { content?: string; error?: string } = {};
      try {
        data = raw ? (JSON.parse(raw) as { content?: string; error?: string }) : {};
      } catch {
        data = { error: raw || "Non-JSON response from API service." };
      }
      if (!res.ok) {
        return {
          ok: false,
          error: data.error ?? `Tart API failed (${res.status})`,
        };
      }
      return { ok: true, content: data.content ?? "No response." };
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Unknown error while calling Tart API";
      return { ok: false, error: `Tart API request failed: ${message}` };
    } finally {
      clearTimeout(timeout);
    }
  }

  try {
    const createRes = (await opencode.session.create({
      body: {},
    })) as { data?: { id?: string }; error?: { data?: { message?: string } } };
    if (createRes.error || !createRes.data) {
      const msg =
        createRes.error?.data?.message ?? "Failed to create session";
      return { ok: false, error: String(msg) };
    }

    const sessionId = createRes.data.id;
    if (!sessionId) {
      return { ok: false, error: "Invalid session response." };
    }

    const promptRes = (await opencode.session.prompt({
      path: { id: sessionId },
      body: { parts: [{ type: "text", text: text.trim() }] },
    })) as {
      data?: {
        info?: { role?: string };
        parts?: Array<{ type?: string; text?: string }>;
      };
      error?: { data?: { message?: string } };
    };

    if (promptRes.error || !promptRes.data) {
      const msg = promptRes.error?.data?.message ?? "Prompt failed";
      return { ok: false, error: String(msg) };
    }

    const data = promptRes.data;
    const parts = data.parts ?? [];
    const textParts = parts.filter(
      (p): p is { type: "text"; text: string } =>
        p.type === "text" && typeof p.text === "string"
    );
    const content = textParts.map((p) => p.text).join("\n").trim();

    return { ok: true, content: content || "No response." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: message };
  }
}
