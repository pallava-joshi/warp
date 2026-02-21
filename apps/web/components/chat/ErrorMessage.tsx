import styles from "./chat.module.css";

type ErrorMessageProps = {
  message: string | null;
  onDismiss?: () => void;
};

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  if (!message) return null;
  return (
    <div className={styles.error} role="alert" aria-live="assertive">
      <p>{message}</p>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className={styles.errorDismiss}>
          Dismiss
        </button>
      )}
    </div>
  );
}
