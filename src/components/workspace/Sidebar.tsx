import Link from 'next/link';
import { useTranslation } from '../../hooks/useTranslation';
import styles from './workspace.module.css';
import { cx } from './cx';
import type { WsFile } from './files';

/**
 * File-tree explorer. A closed file (no open tab) renders dimmed; clicking it
 * reopens a tab. The dimmed `classic.tsx` row is a real link across to the
 * `/classic` design (it also replaces the reference's invented "3 commits
 * today" line).
 */
export default function Sidebar({
  files,
  openIds,
  activeId,
  onOpen,
  explorerLabel,
  classicItemLabel,
}: {
  files: WsFile[];
  openIds: string[];
  activeId: string | null;
  onOpen: (id: string) => void;
  explorerLabel: string;
  classicItemLabel: string;
}) {
  const { isRTL } = useTranslation();
  return (
    <div className={styles.sidebar}>
      <div className={styles.explorerLabel}>{explorerLabel}</div>
      <div className={styles.treeFolder}>▾ src/</div>

      {files.map((f) => {
        const closed = !openIds.includes(f.id);
        const active = activeId === f.id;
        return (
          <div key={f.id}>
            {f.folder && <div className={styles.treeFolder}>▾ {f.folder}</div>}
            <button
              type="button"
              className={cx(
                styles.treeItem,
                active && styles.treeItemActive,
                closed && styles.treeItemClosed,
              )}
              aria-current={active ? 'true' : undefined}
              data-closed={closed ? 'true' : undefined}
              onClick={() => onOpen(f.id)}
            >
              <span className={styles.treeIcon} aria-hidden="true">
                {f.icon}
              </span>
              {f.name}
            </button>
          </div>
        );
      })}

      <div className={styles.treeFolder} style={{ marginTop: '1rem', borderTop: '1px solid var(--line)', paddingTop: '1rem' }}>
        ▾ ../
      </div>
      <Link
        href="/classic"
        className={`${styles.treeItem} ${styles.treeItemClosed}`}
      >
        <span className={styles.treeIcon} aria-hidden="true">{isRTL ? '↖' : '↗'}</span>
        {classicItemLabel}
      </Link>
    </div>
  );
}
