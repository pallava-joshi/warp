import styles from "./chat.module.css";

export function LoadingIndicator() {
  return (
    <div
      className={styles.loadingIndicator}
      aria-live="polite"
      aria-busy="true"
    >
      <span className={styles.spinner} />
      <span>Thinking…</span>
    </div>
  );
}
