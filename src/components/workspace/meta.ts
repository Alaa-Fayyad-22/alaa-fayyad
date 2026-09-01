import { projects, experiences, skillCategories } from '../../data/portfolio';

/**
 * Stats shown in the workspace are DERIVED from the real content in
 * portfolio.ts — never hardcoded mockup numbers. If the data changes, these
 * follow.
 */

/** Earliest 4-digit year mentioned in any experience's `period` string. */
export const CAREER_START_YEAR = Math.min(
  ...experiences
    .map((e) => Number(e.period.match(/\d{4}/)?.[0]))
    .filter((n): n is number => Number.isFinite(n)),
);

/** Whole years from the earliest role to now (never below 1). */
export const yearsShipping = Math.max(1, new Date().getFullYear() - CAREER_START_YEAR);

export const projectCount = projects.length;

export const skillCount = skillCategories.reduce((n, c) => n + c.skills.length, 0);

/**
 * Stable 7-char hex stand-in for a git short-hash, styled like `git log` output
 * in experience.log. Decorative (like the reference) — deterministic per input,
 * not a claim of a real commit. FNV-1a.
 */
export function pseudoHash(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
}
