import { useEffect, useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTheme } from '../../hooks/useTheme';
import { smoothScrollTo } from '../../lib/scroll';
import { Sun, Moon, Languages } from 'lucide-react';

/**
 * Clean, minimal top navigation. Name + section links + theme/language toggles,
 * smooth-scrolls (via Lenis) to sections, collapses to a hamburger on mobile.
 */
export default function SiteNav() {
  const { t, locale, isRTL, toggleLocale } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { id: 'about', label: t.nav.about },
    { id: 'skills', label: t.nav.skills },
    { id: 'projects', label: t.nav.projects },
    { id: 'experience', label: t.nav.experience },
    { id: 'contact', label: t.nav.contact },
  ];

  // Scroll-spy: highlight whichever section crosses a thin band near the
  // viewport centre. IntersectionObserver only — no scroll-event spam.
  useEffect(() => {
    const sections = links
      .map(l => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => { setOpen(false); smoothScrollTo(id); };
  const ThemeIcon = theme === 'dark' ? Sun : Moon;
  const themeLabel = theme === 'dark'
    ? (isRTL ? 'الوضع الفاتح' : 'Switch to light mode')
    : (isRTL ? 'الوضع الداكن' : 'Switch to dark mode');

  return (
    <nav className={`snav ${scrolled ? 'is-scrolled' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="snav__inner">
        <button className="snav__logo" onClick={() => smoothScrollTo('top')}>
          {locale === 'ar' ? 'علاء فياض' : 'Alaa Fayyad'}
          <span className="snav__caret" aria-hidden="true" />
        </button>

        <div className="snav__links">
          {links.map(l => (
            <button key={l.id} className={`snav__link ${active === l.id ? 'is-active' : ''}`}
              aria-current={active === l.id ? 'true' : undefined} onClick={() => go(l.id)}>{l.label}</button>
          ))}
        </div>

        <div className="snav__actions">
          {/* Bar-only: theme + language live in the header on desktop, but move
              into the hamburger drawer on mobile (hidden here below 760px). */}
          <button className="snav__icon snav__bar-only" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel}>
            <ThemeIcon size={17} />
          </button>
          <button className="snav__icon snav__icon--text snav__bar-only" onClick={toggleLocale}
            aria-label={isRTL ? 'English' : 'العربية'}>
            {locale === 'en' ? 'عربي' : 'EN'}
          </button>
          <button className={`snav__burger ${open ? 'is-open' : ''}`} onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
            <span className="snav__burger-box" aria-hidden="true">
              <span className="snav__burger-bar" />
              <span className="snav__burger-bar" />
              <span className="snav__burger-bar" />
            </span>
          </button>
        </div>
      </div>

      <div className={`snav__drawer ${open ? 'is-open' : ''}`}>
          {links.map(l => (
            <button key={l.id} className={`snav__drawer-link ${active === l.id ? 'is-active' : ''}`}
              aria-current={active === l.id ? 'true' : undefined} onClick={() => go(l.id)}>{l.label}</button>
          ))}

          {/* Theme + language toggles (mobile only — the drawer is desktop-hidden) */}
          <div className="snav__drawer-toggles">
            <button className="snav__drawer-toggle" onClick={toggleTheme} aria-label={themeLabel}>
              <ThemeIcon size={18} />
              <span>{theme === 'dark'
                ? (isRTL ? '' : '')
                : (isRTL ? '' : '')}</span>
            </button>
            <button className="snav__drawer-toggle" onClick={toggleLocale}
              aria-label={isRTL ? 'English' : 'العربية'}>
              <Languages size={18} />
              <span>{locale === 'en' ? 'العربية' : 'English'}</span>
            </button>
          </div>
        </div>
    </nav>
  );
}
