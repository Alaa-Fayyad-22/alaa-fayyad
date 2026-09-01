import type { ReactNode } from 'react';
import styles from './workspace.module.css';
import { cx } from './cx';

/**
 * One open file's content. Exactly one pane is `visible` at a time; the one
 * just switched away from is briefly `leaving` (slides the opposite way) before
 * settling back to the hidden resting position. The pane itself scrolls
 * (`overflow-y: auto` in the stylesheet) — wheel events are never intercepted.
 */
export default function FilePane({
  state,
  labelledBy,
  children,
}: {
  state: 'visible' | 'leaving' | 'hidden';
  labelledBy?: string;
  children: ReactNode;
}) {
  return (
    <div
      role="tabpanel"
      aria-labelledby={labelledBy}
      aria-hidden={state !== 'visible'}
      className={cx(
        styles.filePane,
        state === 'visible' && styles.filePaneVisible,
        state === 'leaving' && styles.filePaneLeaving,
      )}
    >
      {children}
    </div>
  );
}
