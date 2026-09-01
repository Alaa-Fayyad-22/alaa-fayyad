import Link from 'next/link';
import styles from './workspace.module.css';

/** 24px bottom statusbar: branch, active filename, cursor, indent, language,
 *  plus the unobtrusive link across to the `/classic` design and the language
 *  toggle (the workspace's only chrome toggle — see WorkspaceShell). */
export default function StatusBar({
  activeName,
  language,
  indentLabel,
  classicLabel,
  localeToggleLabel,
  onToggleLocale,
}: {
  activeName: string | null;
  language: string;
  indentLabel: string;
  classicLabel: string;
  localeToggleLabel: string;
  onToggleLocale: () => void;
}) {
  return (
    <div className={styles.statusbar}>
      <span>⎇ main</span>
      <span>{activeName ?? '—'}</span>
      <span className={styles.statusPush}>Ln 1, Col 1</span>
      <span>{indentLabel}</span>
      <span>{language}</span>
      <Link href="/classic">/classic · {classicLabel}</Link>
      <button
        type="button"
        onClick={onToggleLocale}
        className={styles.segBtn}
        style={{ color: 'inherit', padding: 0 }}
      >
        {localeToggleLabel}
      </button>
    </div>
  );
}
