import React from 'react';
import styles from './workspace.module.css';

/**
 * The "code" register of a file-pane: a gutter-numbered stack of lines with
 * syntax-coloured spans, matching the reference's `.line / .ln / .code` markup
 * and `kw/fn/str/cm/num/type` classes. Prose / cards / buttons (the "rendered
 * output" register) are plain elements rendered after this by each file.
 */

export const Kw = ({ children }: { children: React.ReactNode }) => (
  <span className={styles.kw}>{children}</span>
);
export const Fn = ({ children }: { children: React.ReactNode }) => (
  <span className={styles.fn}>{children}</span>
);
export const Str = ({ children }: { children: React.ReactNode }) => (
  <span className={styles.str}>{children}</span>
);
export const Cm = ({ children }: { children: React.ReactNode }) => (
  <span className={styles.cm}>{children}</span>
);
export const Num = ({ children }: { children: React.ReactNode }) => (
  <span className={styles.num}>{children}</span>
);
export const Type = ({ children }: { children: React.ReactNode }) => (
  <span className={styles.type}>{children}</span>
);

export function CodeBlock({
  lines,
  startAt = 1,
}: {
  lines: React.ReactNode[];
  startAt?: number;
}) {
  return (
    <div aria-hidden="true">
      {lines.map((content, i) => (
        <div className={styles.line} key={i}>
          <span className={styles.ln}>{startAt + i}</span>
          <span className={styles.code}>{content}</span>
        </div>
      ))}
    </div>
  );
}
