import { useMemo } from 'react';
import styles from './workspace.module.css';
import { cx } from './cx';
import type { WsFile } from './files';

/**
 * Minimap rail: one entry per file (open or not), each a handful of
 * random-width bars standing in for lines of code. Clicking opens/switches to
 * that file, exactly like a sidebar click. Bar widths are memoised so they stay
 * put across renders.
 */
export default function Minimap({
  files,
  activeId,
  onOpen,
}: {
  files: WsFile[];
  activeId: string | null;
  onOpen: (id: string) => void;
}) {
  const bars = useMemo(
    () =>
      files.map((_, i) => {
        const count = 8 + (i % 3) * 3;
        return Array.from({ length: count }, () => 30 + Math.random() * 60);
      }),
    [files],
  );

  return (
    <div className={styles.minimapRail} data-testid="workspace-minimap" aria-hidden="true">
      {files.map((f, i) => (
        <button
          type="button"
          key={f.id}
          tabIndex={-1}
          data-file={f.id}
          className={cx(styles.mmFile, activeId === f.id && styles.mmFileActive)}
          onClick={() => onOpen(f.id)}
        >
          <div className={styles.mmLabel}>{f.name}</div>
          <div className={styles.mmLines}>
            {bars[i].map((w, j) => (
              <div key={j} style={{ width: `${w}%` }} />
            ))}
          </div>
        </button>
      ))}
    </div>
  );
}
