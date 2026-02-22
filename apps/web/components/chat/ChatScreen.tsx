"use client";

import { useState, useCallback } from "react";
import styles from "./chat.module.css";
import { MessageArea } from "./MessageArea";
import { PromptInputForm } from "./PromptInputForm";
import { ErrorMessage } from "./ErrorMessage";
import { submitPrompt } from "../../app/actions/prompt";
import type { Message } from "./MessageList";

type ChatScreenProps = {
  className?: string;
  compact?: boolean;
  fill?: boolean;
};

export function ChatScreen({ className, compact, fill }: ChatScreenProps) {
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
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${result.error}` },
        ]);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError(message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${message}` },
      ]);
    } finally {
      setIsPending(false);
    }
  }, []);

  const handleDismissError = useCallback(() => setError(null), []);

  const sizeClass = fill
    ? styles.chatScreenFill
    : compact
      ? styles.chatScreenCompact
      : "";

  return (
    <div
      className={`${styles.chatScreen} ${sizeClass} ${className ?? ""}`}
    >
      <MessageArea messages={messages} isLoading={isPending} />
      <ErrorMessage message={error} onDismiss={handleDismissError} />
      <PromptInputForm
        onSubmit={handleSubmit}
        disabled={isPending}
        placeholder="Enter your prompt…"
      />
    </div>
  );
}
