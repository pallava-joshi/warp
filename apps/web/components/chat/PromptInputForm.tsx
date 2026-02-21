"use client";

import { useRef } from "react";
import styles from "./chat.module.css";

type PromptInputFormProps = {
  onSubmit: (prompt: string) => void;
  disabled: boolean;
  placeholder?: string;
};

export function PromptInputForm({
  onSubmit,
  disabled,
  placeholder = "Enter your prompt…",
}: PromptInputFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = textareaRef.current?.value?.trim();
    if (!value || disabled) return;
    onSubmit(value);
    if (textareaRef.current) textareaRef.current.value = "";
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = (e.target as HTMLTextAreaElement).form;
      form?.requestSubmit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form}
      aria-label="Chat prompt form"
    >
      <textarea
        ref={textareaRef}
        name="prompt"
        placeholder={placeholder}
        disabled={disabled}
        className={styles.textarea}
        aria-label="Prompt input"
        rows={2}
        onKeyDown={handleKeyDown}
      />
      <button
        type="submit"
        disabled={disabled}
        className={styles.submitBtn}
      >
        Send
      </button>
    </form>
  );
}
