"use client";

import { useState, useCallback } from "react";
import styles from "./chat.module.css";
import { MessageArea } from "./MessageArea";
import { PromptInputForm } from "./PromptInputForm";
import { submitPrompt } from "../../app/actions/prompt";
import type { Message } from "./MessageList";

export function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (promptText: string) => {
    setError(null);
    const userMsg: Message = { role: "user", content: promptText };
    setMessages((prev) => [...prev, userMsg]);
    setIsPending(true);

    try {
      const result = await submitPrompt(promptText);

      if (result.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: result.content },
        ]);
      } else {
        setError(result.error);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsPending(false);
    }
  }, []);

  const handleDismissError = useCallback(() => setError(null), []);

  return (
    <div className={styles.chatScreen}>
      <MessageArea
        messages={messages}
        isLoading={isPending}
        error={error}
        onDismissError={handleDismissError}
      />
      <PromptInputForm
        onSubmit={handleSubmit}
        disabled={isPending}
        placeholder="Enter your prompt…"
      />
    </div>
  );
}
