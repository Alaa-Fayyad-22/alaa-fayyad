import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import styles from './home.module.css';
import { cx } from '../workspace/cx';

const SEEN_KEY = 'home-loaded';
// Progress thresholds at which each fake build-log line appears.
const LOG_AT = [20, 45, 70, 92];

// useLayoutEffect warns during SSR on React 18; fall back to useEffect there.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * "COMPILING THE WORK" splash. The loader is part of the SERVER HTML so it is
 * already covering the page on first paint (no flash of the hero before it).
 * Returning visitors never see it: a tiny inline script in pages/index.tsx sets
 * <html data-home-loaded> before paint when sessionStorage "home-loaded" exists
 * or prefers-reduced-motion is on, and the stylesheet hides it from that. Here
 * we then unmount it before the first paint (layout effect, also covers client
 * navigations back to "/"). Without JS a <noscript> rule hides it, so nothing is
 * ever blocked.
 */
export default function Loader() {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<'idle' | 'running' | 'closing'>('running');
  const [n, setN] = useState(0);

  useIsoLayoutEffect(() => {
    let reduce = false;
    let seen = false;
    try {
      reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      seen = sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      /* storage / matchMedia unavailable — treat as first visit */
    }
    if (reduce || seen) {
      setPhase('idle');
      return;
    }
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* best-effort */
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timers: ReturnType<typeof setTimeout>[] = [];
    let count = 0;
    const iv = setInterval(() => {
      count = Math.min(100, count + Math.ceil(Math.random() * 4));
      setN(count);
      if (count >= 100) {
        clearInterval(iv);
        timers.push(
          setTimeout(() => {
            setPhase('closing');
            document.body.style.overflow = prevOverflow;
            // Unmount once the 0.6s fade has finished.
            timers.push(setTimeout(() => setPhase('idle'), 650));
          }, 350),
        );
      }
    }, 40);

    return () => {
      clearInterval(iv);
      timers.forEach(clearTimeout);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (phase === 'idle') return null;

  const lines = t.home.loader.lines.filter((_, i) => n >= LOG_AT[i]);

  return (
    <div
      className={cx(styles.loader, phase === 'closing' && styles.loaderDone)}
      data-home-loader=""
      aria-hidden="true"
    >
      <div
        className={styles.glow}
        style={{
          left: -220,
          bottom: -280,
          width: 780,
          height: 780,
          background: 'radial-gradient(circle,rgba(200,121,74,.26) 0%,transparent 65%)',
        }}
      />
      <div className={styles.loaderTop}>
        <span style={{ fontWeight: 800 }}>
          {t.home.loader.brand} <span className={styles.loaderDim}>{t.home.loader.brandSuffix}</span>
        </span>
        <span className={styles.loaderDim}>{t.home.loader.tagline}</span>
      </div>
      <div className={styles.loaderMid}>
        <div className={styles.pill}>{t.home.loader.name}</div>
        <div className={cx(styles.pill, styles.pillCmd)} dir="ltr">
          {t.home.loader.cmd}
          <span className={styles.caret} />
        </div>
        <div className={styles.log}>
          {lines.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>
      <div className={styles.loaderBottom}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span className={cx(styles.mono, styles.loaderKicker)}>{t.home.loader.compiling}</span>
          <span className={styles.counter}>{String(n).padStart(3, '0')}</span>
        </div>
        <div className={styles.loaderRight}>
          <span className={cx(styles.mono, styles.loaderHello)}>{t.home.loader.greeting}</span>
          <div className={styles.bar}>
            <i className={styles.barFill} style={{ width: `${n}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
