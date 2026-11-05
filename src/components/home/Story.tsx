import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { experiences } from '../../data/portfolio';
import styles from './home.module.css';
import { cx } from '../workspace/cx';

const ROLL_HALF_MS = 230;

/** First 4-digit year in a period string — same rule as workspace/meta.ts. */
const yearOf = (period: string) => period.match(/\d{4}/)?.[0] ?? '';

/** Split a paragraph into its sentences so they read as a short bullet list. */
const sentences = (text: string) => text.split(/(?<=[.!؟])\s+/).filter(Boolean);

/**
 * "My story": a sticky giant year on the left that follows a vertical timeline
 * on the right, built from experiences[] (bilingual fields).
 *
 * Layout contract: nothing above the sticky element may use overflow:hidden
 * (that makes a scroll container and un-pins it) — .story uses overflow:clip.
 * The year is never faded out; on change it rolls like an odometer.
 */
export default function Story() {
  const { t, isRTL } = useTranslation();
  const items = experiences;
  const [active, setActive] = useState(0);
  const [shownYear, setShownYear] = useState(() => yearOf(items[0].period));
  const [roll, setRoll] = useState('');
  const activeRef = useRef(0);
  const listRef = useRef<HTMLOListElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const raf = useRef<number | null>(null);

  const clearRoll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (raf.current !== null) cancelAnimationFrame(raf.current);
  };

  const activate = (i: number) => {
    if (i === activeRef.current) return; // ignore no-op updates
    const goingDown = i > activeRef.current;
    activeRef.current = i;
    setActive(i);

    const nextYear = yearOf(items[i].period);
    let reduce = false;
    try {
      reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      /* animate */
    }
    clearRoll();
    if (reduce) {
      setShownYear(nextYear);
      setRoll('');
      return;
    }
    // 1) old year rolls out, 2) swap text while off-screen on the opposite side
    // with transitions off, 3) next frame: transitions on, roll into place.
    setRoll(goingDown ? styles.yearOutUp : styles.yearOutDown);
    timers.current.push(
      setTimeout(() => {
        setShownYear(nextYear);
        setRoll(cx(styles.yearNoAnim, goingDown ? styles.yearOutDown : styles.yearOutUp));
        raf.current = requestAnimationFrame(() => {
          raf.current = requestAnimationFrame(() => setRoll(''));
        });
      }, ROLL_HALF_MS),
    );
  };

  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof IntersectionObserver === 'undefined') return;
    const nodes = Array.from(list.children);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) activate(nodes.indexOf(e.target));
        });
      },
      { rootMargin: '-40% 0px -40% 0px' },
    );
    nodes.forEach((n) => io.observe(n));
    return () => {
      io.disconnect();
      clearRoll();
    };
    // Observer is created once; activate() only touches refs and stable setters.
  }, []);

  const current = items[active];
  const periodOf = (e: (typeof items)[number]) => (isRTL ? e.periodAr : e.period);
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section className={styles.story} id="story">
      <div
        className={styles.glow}
        style={{ left: -120, top: 80, width: 820, height: 820, background: 'radial-gradient(circle,var(--glow-a) 0%,transparent 62%)' }}
      />
      <div className={styles.ringsBg} />
      <div className={cx(styles.wrap, styles.storyGrid)}>
        <div className={styles.storyLeft}>
          <div className={styles.sticky}>
            <span className={styles.eyebrow}>{t.home.story.eyebrow}</span>
            <h2 className={styles.storyTitle}>
              <span>{t.home.story.title1}</span>
              <br />
              <span>{t.home.story.title2}</span>
            </h2>
            <div className={styles.yearBox}>
              <span className={cx(styles.year, roll)} data-testid="story-year">
                {shownYear}
              </span>
            </div>
            <span className={styles.period}>{periodOf(current)}</span>
            <div className={styles.prog}>
              <span>{pad(active + 1)}</span>
              <span className={styles.progOf}>/ {pad(items.length)}</span>
              <span className={styles.progTrack}>
                <i className={styles.progFill} style={{ width: `${((active + 1) / items.length) * 100}%` }} />
              </span>
            </div>
            <span className={cx(styles.mono, styles.logLine)} dir="ltr">
              {t.home.story.log}
            </span>
          </div>
        </div>

        <ol className={styles.timeline} ref={listRef} data-testid="story-timeline">
          {items.map((e, i) => (
            <li
              key={e.role + e.company}
              className={cx(styles.tlItem, i === active && styles.tlOn)}
              data-active={i === active ? 'true' : undefined}
            >
              <span className={styles.period}>{periodOf(e)}</span>
              <h3 className={styles.tlTitle}>{isRTL ? e.roleAr : e.role}</h3>
              <span className={styles.tlCo}>{isRTL ? e.companyAr : e.company}</span>
              <ul className={styles.tlList}>
                {sentences(isRTL ? e.descriptionAr : e.description).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <div className={styles.chips}>
                {e.tech.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
