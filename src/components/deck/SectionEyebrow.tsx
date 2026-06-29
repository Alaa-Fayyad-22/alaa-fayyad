import React from 'react';

/**
 * Section header eyebrow: a large monospace index number ("01", "02", …) and a
 * thin vertical rule, both in the violet accent. ScreenFrame lays this out on
 * one row immediately before the section heading, giving "01 | About".
 *
 * Purely presentational and theme-aware — the number and rule use the --primary
 * token, so they read in both light and dark mode. The number is decorative
 * ordering (the heading carries the section name), hence aria-hidden.
 *
 * Replaces the old terminal "$ cmd" PromptLabel.
 */
export default function SectionEyebrow({ num }: { num: number }) {
  return (
    <div className="screen-eyebrow" aria-hidden="true">
      <span className="screen-eyebrow__num">{String(num).padStart(2, '0')}</span>
      <span className="screen-eyebrow__rule" />
    </div>
  );
}
