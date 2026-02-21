import styles from "./chat.module.css";

export function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <p>Enter a prompt below to start.</p>
    </div>
  );
}
