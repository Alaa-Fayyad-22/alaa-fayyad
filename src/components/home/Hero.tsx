import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '../../hooks/useTranslation';
import { smoothScrollTo } from '../../lib/scroll';
import { logEvent } from '../../lib/track';
import styles from './home.module.css';
import { cx } from '../workspace/cx';

const AUTO_MS = 3200;
// Half of the 0.45s flap: the text swaps while the card face is edge-on.
const SWAP_MS = 220;

/**
 * Greeting + ring-bound flip card that cycles roles (auto every 3.2s, paused
 * while hovered or focused, click to flip), the three CTAs, and the always-LTR
 * code-editor card.
 */
export default function Hero() {
  const { t } = useTranslation();
  const roles = t.home.hero.roles;
  const [index, setIndex] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [paused, setPaused] = useState(false);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flip = useCallback(
    (manual: boolean) => {
      let reduce = false;
      try {
        reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      } catch {
        /* no matchMedia — animate */
      }
      if (manual) logEvent('home_role_flip', { via: 'click' });
      if (!reduce) setFlipping(true);
      if (swapTimer.current) clearTimeout(swapTimer.current);
      swapTimer.current = setTimeout(() => setIndex((i) => (i + 1) % roles.length), reduce ? 0 : SWAP_MS);
    },
    [roles.length],
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => flip(false), AUTO_MS);
    return () => clearInterval(id);
  }, [paused, flip]);

  useEffect(() => () => {
    if (swapTimer.current) clearTimeout(swapTimer.current);
  }, []);

  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    smoothScrollTo(id);
  };

  return (
    <section className={styles.hero} id="home">
      <div
        className={styles.glow}
        style={{ left: -200, bottom: -260, width: 760, height: 760, background: 'radial-gradient(circle,var(--glow-a) 0%,transparent 65%)' }}
      />
      <div
        className={styles.glow}
        style={{ right: -160, top: -200, width: 640, height: 640, background: 'radial-gradient(circle,var(--glow-b) 0%,transparent 65%)' }}
      />

      <div className={cx(styles.wrap, styles.heroMain)}>
        <div className={styles.heroCopy}>
          <span className={cx(styles.eyebrow, styles.eyebrowLive)}>{t.home.hero.eyebrow}</span>
          <h1 className={styles.heroTitle}>
            <span>{t.home.hero.greeting}</span>
            <br />
            <span className={styles.dim}>{t.home.hero.build}</span>
          </h1>

          <button
            type="button"
            className={styles.flip}
            aria-label={t.home.hero.flipAria}
            onClick={() => flip(true)}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <span className={styles.rings} aria-hidden="true">
              {Array.from({ length: 8 }, (_, i) => (
                <i key={i} />
              ))}
            </span>
            <span className={styles.card}>
              <span
                className={cx(styles.role, flipping && styles.roleFlipping)}
                aria-live="polite"
                onAnimationEnd={() => setFlipping(false)}
              >
                {roles[index]}
              </span>
              <span className={styles.count}>
                {String(index + 1).padStart(2, '0')} / {String(roles.length).padStart(2, '0')} · {t.home.hero.roleHint}
              </span>
            </span>
          </button>

          <div className={styles.ctas}>
            <Link href="/#contact" className={cx(styles.btn, styles.btnPrimary)} onClick={goTo('contact')}>
              <span>{t.home.hero.hire}</span>
              <span className={styles.btnArr} aria-hidden="true">→</span>
            </Link>
            <Link href="/#work" className={styles.btn} onClick={goTo('work')}>
              {t.home.hero.seeWork}
            </Link>
            <Link href="/classic" className={cx(styles.btn, styles.btnGhost)} title={t.home.hero.terminalTitle}>
              {t.home.hero.terminal}
            </Link>
          </div>
        </div>

        <div className={styles.heroSide}>
          <div className={styles.editor} aria-label={t.home.hero.editorAria}>
            <div className={styles.edBar}>
              <i className={styles.edDot} style={{ background: '#C8794A' }} />
              <i className={styles.edDot} style={{ background: '#CFC8BF' }} />
              <i className={styles.edDot} style={{ background: '#5EC4B6' }} />
              <span className={styles.edName}>alaa.tsx</span>
              <a
                href="/Alaa_Fayyad_CV.pdf"
                download
                className={styles.edCv}
                onClick={() => logEvent('cta_click', { cta: 'download_cv' })}
              >
                {t.home.hero.cv}
              </a>
            </div>
            {/* No whitespace between the line spans: <pre> would render it. */}
            <pre className={styles.edCode}>
              <span className={styles.ln}><span className={styles.kw}>const</span>{' alaa = {'}</span>
              <span className={styles.ln}>{'  based:  '}<span className={styles.str}>{'"Beirut, LB"'}</span>,</span>
              <span className={styles.ln}>{'  speaks: ['}<span className={styles.str}>{'"en"'}</span>, <span className={styles.str}>{'"ar"'}</span>],</span>
              <span className={styles.ln}>{'  stack:  ['}<span className={styles.str}>{'"Next.js"'}</span>, <span className={styles.str}>{'"TS"'}</span>, <span className={styles.str}>{'"Supabase"'}</span>],</span>
              <span className={styles.ln}>{'  craft:  ['}<span className={styles.str}>{'"code"'}</span>, <span className={styles.str}>{'"design"'}</span>],</span>
              <span className={styles.ln}>{'  status: '}<span className={styles.str}>{'"available"'}</span>,</span>
              <span className={styles.ln}>{'};'}</span>
              <span className={styles.ln}>
                <span className={styles.kw}>export default</span>
                {' alaa;'}
                <span className={styles.typing} />
              </span>
            </pre>
            <div className={styles.edStatus}>
              <span><b>●</b> main</span>
              <span>TypeScript · UTF-8</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.wrap}>
        <div className={styles.strip}>
          <span>{t.home.hero.stripAvailable}</span>
          <span>{t.home.hero.stripStack}</span>
          <span>
            {t.home.hero.stripScroll} <span className={styles.bob}>↓</span>
          </span>
        </div>
      </div>
    </section>
  );
}
