import styles from "./chat.module.css";
import { EmptyState } from "./EmptyState";
import { MessageList, type Message } from "./MessageList";
import { LoadingIndicator } from "./LoadingIndicator";
import { ErrorMessage } from "./ErrorMessage";

type MessageAreaProps = {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onDismissError?: () => void;
};

export function MessageArea({
  messages,
  isLoading,
  error,
  onDismissError,
}: MessageAreaProps) {
  const hasMessages = messages.length > 0;

  return (
    <div className={styles.messageArea}>
      {!hasMessages && <EmptyState />}
      {hasMessages && <MessageList messages={messages} />}
      {isLoading && <LoadingIndicator />}
      <ErrorMessage message={error} onDismiss={onDismissError} />
    </div>
  );
}
