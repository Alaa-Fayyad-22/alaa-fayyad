import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '../../hooks/useTranslation';
import { smoothScrollTo } from '../../lib/scroll';
import { logEvent } from '../../lib/track';
import styles from './home.module.css';
import { cx } from '../workspace/cx';
import { useBeirutClock } from './useBeirutClock';

const SECTIONS = ['home', 'work', 'story', 'contact'] as const;
type SectionId = (typeof SECTIONS)[number];

/**
 * Sticky blurred bar. On "/" the pills smooth-scroll to their section and an
 * IntersectionObserver keeps the active one in sync; on the /work/* rooms
 * (`onHome` false) they are plain links back to the matching "/#section".
 */
export default function TopNav({ onHome = true }: { onHome?: boolean }) {
  const { t, locale, toggleLocale } = useTranslation();
  const { time, date } = useBeirutClock();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<SectionId>('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: the section crossing a thin band at mid-viewport is active.
  useEffect(() => {
    if (!onHome || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id as SectionId);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [onHome]);

  const go = (id: SectionId) => (e: React.MouseEvent) => {
    if (!onHome) return; // let the link navigate to "/#id"
    e.preventDefault();
    smoothScrollTo(id === 'home' ? 'top' : id);
  };

  const onToggleLocale = () => {
    logEvent('home_lang_toggle', { value: locale === 'en' ? 'ar' : 'en' });
    toggleLocale();
  };

  const items: { id: SectionId; label: string }[] = [
    { id: 'home', label: t.home.nav.home },
    { id: 'work', label: t.home.nav.work },
    { id: 'story', label: t.home.nav.story },
    { id: 'contact', label: t.home.nav.contact },
  ];

  return (
    <header className={cx(styles.top, scrolled && styles.topScrolled)}>
      <div className={styles.wrap}>
        <Link href="/#home" className={styles.brand} onClick={go('home')}>
          {t.home.nav.brand}
        </Link>
        <nav className={styles.nav} aria-label={t.home.nav.ariaMain}>
          {items.map(({ id, label }) => (
            <Link
              key={id}
              href={`/#${id}`}
              className={cx(styles.navLink, onHome && active === id && styles.navActive)}
              aria-current={onHome && active === id ? 'true' : undefined}
              onClick={go(id)}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className={styles.right}>
          <div className={styles.clock}>
            <span className={styles.clockMuted}>{t.home.nav.city}</span>
            <b>{time}</b>
            <span className={cx(styles.clockMuted, styles.clockDate)}>{date}</span>
          </div>
          <button type="button" className={styles.lang} onClick={onToggleLocale} aria-label={t.home.nav.langAria}>
            {t.home.nav.langLabel}
          </button>
        </div>
      </div>
    </header>
  );
}
