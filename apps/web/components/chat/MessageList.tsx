import { useRef, useEffect } from "react";
import styles from "./chat.module.css";
import { MessageBubble } from "./MessageBubble";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

type MessageListProps = {
  messages: Message[];
};

export function MessageList({ messages }: MessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.messageList}>
      {messages.map((msg, i) => (
        <MessageBubble key={i} role={msg.role} content={msg.content} />
      ))}
      <div ref={listRef} aria-hidden />
    </div>
  );
}
