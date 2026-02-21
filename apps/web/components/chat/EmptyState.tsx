import styles from "./chat.module.css";

export function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <p>Enter your prompt below to get started.</p>
    </div>
  );
}
