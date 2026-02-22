import styles from "./chat.module.css";
import { EmptyState } from "./EmptyState";
import { MessageList, type Message } from "./MessageList";
import { LoadingIndicator } from "./LoadingIndicator";

type MessageAreaProps = {
  messages: Message[];
  isLoading: boolean;
};

export function MessageArea({
  messages,
  isLoading,
}: MessageAreaProps) {
  const hasMessages = messages.length > 0;

  return (
    <div className={styles.messageArea}>
      {!hasMessages && <EmptyState />}
      {hasMessages && <MessageList messages={messages} />}
      {isLoading && <LoadingIndicator />}
    </div>
  );
}
