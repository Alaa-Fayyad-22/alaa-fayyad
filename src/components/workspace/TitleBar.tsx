import styles from './workspace.module.css';

/** 36px window titlebar: macOS traffic-light dots, workspace path, status. */
export default function TitleBar({ path, problems }: { path: string; problems: string }) {
  return (
    <div className={styles.titlebar}>
      <div className={styles.dots} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <span className={styles.titlebarPath}>{path}</span>
      <div className={styles.titlebarStatus}>
        <span className={styles.statusOk}>● {problems}</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}
