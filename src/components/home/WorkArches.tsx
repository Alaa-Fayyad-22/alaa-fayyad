import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from '../../hooks/useTranslation';
import { logEvent } from '../../lib/track';
import styles from './home.module.css';
import { cx } from '../workspace/cx';
import { useReveal } from './useReveal';

// The doors swing wide over 1.1s (.archEntering) and the frame zooms in after a
// .35s delay; we navigate just before the swing ends so the next page takes over.
const ENTER_MS = 1000;

const ARCHES = [
  { slug: 'frontend', door: styles.doorBlue, mid: false },
  { slug: 'design', door: styles.doorSage, mid: true },
  { slug: 'backend', door: styles.doorRust, mid: false },
] as const;

type Slug = (typeof ARCHES)[number]['slug'];

/**
 * The Beirut triple-arch wall. Each arch is a real link to /work/<slug>. A plain
 * left click plays the door animation and then navigates; modified clicks
 * (Ctrl/Cmd/Shift/Alt, middle button) are left alone so they open the link
 * the normal way. Hover / keyboard focus (pure CSS) opens both leaves a crack,
 * INWARD (away from the screen). Behind the doors there is only warm light.
 * Sizes are all "design px × --k" (see .arches in the stylesheet), so the arches
 * scale as one piece; on phones they become a scroll-snap row.
 */
export default function WorkArches() {
  const { t } = useTranslation();
  const router = useRouter();
  const [entering, setEntering] = useState<Slug | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [headRef, headShown] = useReveal<HTMLDivElement>();

  useEffect(() => {
    // Coming back through the bfcache restores the DOM mid-animation.
    const reset = (e: PageTransitionEvent) => {
      if (e.persisted) setEntering(null);
    };
    window.addEventListener('pageshow', reset);
    return () => {
      window.removeEventListener('pageshow', reset);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const open = (slug: Slug) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (entering) return;
    logEvent('home_arch_open', { slug });
    let reduce = false;
    try {
      reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      /* animate */
    }
    setEntering(slug);
    timer.current = setTimeout(() => router.push(`/work/${slug}`), reduce ? 0 : ENTER_MS);
  };

  return (
    <section id="work">
      <div ref={headRef} className={cx(styles.wrap, styles.head, styles.rv, headShown && styles.rvIn)}>
        <div>
          <span className={styles.eyebrow}>{t.home.work.eyebrow}</span>
          <h2 className={styles.headTitle}>
            <span>{t.home.work.title1}</span>
            <br />
            <span>{t.home.work.title2}</span>
          </h2>
        </div>
        <p className={styles.headIntro}>{t.home.work.intro}</p>
      </div>

      <div className={styles.wall}>
        <div className={styles.arches}>
          {ARCHES.map(({ slug, door, mid }) => {
            const room = t.home.work[slug];
            return (
              <Link
                key={slug}
                href={`/work/${slug}`}
                className={cx(styles.arch, door, mid && styles.archMid, entering === slug && styles.archEntering)}
                aria-label={room.title}
                data-entering={entering === slug ? 'true' : undefined}
                onClick={open(slug)}
              >
                <div className={styles.frame}>
                  <div className={styles.inside}>
                    <div className={styles.room} aria-hidden="true" />
                    {(['L', 'R'] as const).map((side) => (
                      <div key={side} className={cx(styles.leaf, side === 'L' ? styles.leafL : styles.leafR)} aria-hidden="true">
                        <span className={styles.edge} />
                        <span className={cx(styles.hinge, styles.hingeTop)} />
                        <span className={cx(styles.hinge, styles.hingeBottom)} />
                        <span className={styles.knob} />
                      </div>
                    ))}
                    <span className={styles.plaque} aria-hidden="true">
                      {room.plaque2 ? `${room.plaque1} ${room.plaque2}` : room.plaque1}
                    </span>
                  </div>
                  <span className={styles.spill} aria-hidden="true" />
                </div>
                <span className={styles.stack}>{room.stack}</span>
              </Link>
            );
          })}
        </div>
        <div className={styles.floor} />
        <p className={styles.swipe} aria-hidden="true">
          {t.home.work.swipe}
        </p>
      </div>
    </section>
  );
}
