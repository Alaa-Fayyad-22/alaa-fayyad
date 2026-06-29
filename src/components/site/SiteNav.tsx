import { useEffect, useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTheme } from '../../hooks/useTheme';
import { smoothScrollTo } from '../../lib/scroll';
import { Sun, Moon, Menu, X } from 'lucide-react';

/**
 * Clean, minimal top navigation. Name + section links + theme/language toggles,
 * smooth-scrolls (via Lenis) to sections, collapses to a hamburger on mobile.
 */
export default function SiteNav() {
  const { t, locale, isRTL, toggleLocale } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
        </button>

        <div className="snav__links">
          {links.map(l => (
            <button key={l.id} className="snav__link" onClick={() => go(l.id)}>{l.label}</button>
          ))}
        </div>

        <div className="snav__actions">
          <button className="snav__icon" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel}>
            <ThemeIcon size={17} />
          </button>
          <button className="snav__icon snav__icon--text" onClick={toggleLocale}
            aria-label={isRTL ? 'English' : 'العربية'}>
            {locale === 'en' ? 'عربي' : 'EN'}
          </button>
          <button className="snav__burger" onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="snav__drawer">
          {links.map(l => (
            <button key={l.id} className="snav__drawer-link" onClick={() => go(l.id)}>{l.label}</button>
          ))}
        </div>
      )}
    </nav>
  );
}
