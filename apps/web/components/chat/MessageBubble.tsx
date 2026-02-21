import styles from "./chat.module.css";

type MessageBubbleProps = {
  role: "user" | "assistant";
  content: string;
};

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";
  return (
    <div
      className={`${styles.bubbleWrap} ${
        isUser ? styles.bubbleWrapUser : styles.bubbleWrapAssistant
      }`}
    >
      <div
        className={`${styles.bubble} ${
          isUser ? styles.bubbleUser : styles.bubbleAssistant
        }`}
      >
        <p>{content}</p>
      </div>
    </div>
  );
}
