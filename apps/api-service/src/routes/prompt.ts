import { Router } from "express";
import { createOpencodeClient } from "@repo/opencode";
import { getOrCreateVM } from "../tart/orchestrator.js";

const router = Router();

router.post("/", async (req, res) => {
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  if (!text) {
    res.status(400).json({ error: "Prompt cannot be empty." });
    return;
  }

  try {
    const baseUrl = await getOrCreateVM();
    const client = createOpencodeClient({ baseUrl });

    const createRes = (await client.session.create({ body: {} })) as {
      data?: { id?: string };
      error?: { data?: { message?: string } };
    };

    if (createRes.error || !createRes.data) {
      const msg = createRes.error?.data?.message ?? "Failed to create session";
      res.status(500).json({ error: msg });
      return;
    }

    const sessionId = createRes.data.id;
    if (!sessionId) {
      res.status(500).json({ error: "Invalid session response." });
      return;
    }

    const promptRes = (await client.session.prompt({
      path: { id: sessionId },
      body: { parts: [{ type: "text", text }] },
    })) as {
      data?: {
        parts?: Array<{ type?: string; text?: string }>;
      };
      error?: { data?: { message?: string } };
    };

    if (promptRes.error || !promptRes.data) {
      const msg = promptRes.error?.data?.message ?? "Prompt failed";
      res.status(500).json({ error: msg });
      return;
    }

    const parts = promptRes.data.parts ?? [];
    const textParts = parts.filter(
      (p): p is { type: "text"; text: string } =>
        p.type === "text" && typeof p.text === "string"
    );
    const content = textParts.map((p) => p.text).join("\n").trim();

    res.json({ content: content || "No response." });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

export default router;
