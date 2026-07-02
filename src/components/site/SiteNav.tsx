import { useCallback, useEffect, useRef, useState } from 'react';
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

  // Shared traveling indicator (desktop horizontal nav only). Positions are
  // measured from the active link and applied to one arrow + one underline
  // element, which glide via a CSS transition on left/width.
  const linksRef = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState({ left: 0, width: 0, arrowAnchor: 0, ready: false });
  const [animate, setAnimate] = useState(false);

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

  // Measure the active link and reposition the shared arrow + underline. Bails
  // when the horizontal nav is hidden (mobile: .snav__links is display:none, so
  // offsetParent is null) — the drawer keeps its own static markers.
  const updateIndicator = useCallback(() => {
    const container = linksRef.current;
    if (!container || container.offsetParent === null) {
      setInd(s => (s.ready ? { ...s, ready: false } : s));
      return;
    }
    const el = container.querySelector<HTMLElement>('.snav__link.is-active');
    if (!el) {
      setInd(s => (s.ready ? { ...s, ready: false } : s));
      return;
    }
    const left = el.offsetLeft;
    const width = el.offsetWidth;
    // Anchor the arrow at the link edge nearest its reading-order start: the
    // left edge in LTR, the right edge in RTL. CSS applies the snug gap/mirror.
    const arrowAnchor = isRTL ? left + width : left;
    setInd({ left, width, arrowAnchor, ready: true });
  }, [isRTL]);

  // Reposition whenever the active link or language/direction changes.
  useEffect(() => { updateIndicator(); }, [active, locale, updateIndicator]);

  // One frame after the first measured placement, drop the inline transition:none
  // so subsequent left/width changes glide. This lands the first appearance in
  // place (no slide-in-from-0) without ever leaving a real move un-transitioned.
  useEffect(() => {
    if (!ind.ready || animate) return;
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, [ind.ready, animate]);

  // Measure after layout, once web fonts have loaded (JetBrains Mono changes the
  // link widths), on full load, and on resize — so the offsets are never stale.
  // A ResizeObserver on the links row is the catch-all: it fires on ANY layout
  // change of the row (late font swap, locale label change, sub-pixel reflow)
  // even when no resize event fires. No feedback loop — the arrow/underline are
  // absolutely positioned overlays and don't affect the row's size.
  useEffect(() => {
    updateIndicator();
    const raf = requestAnimationFrame(updateIndicator);
    const onResize = () => updateIndicator();
    window.addEventListener('resize', onResize);
    window.addEventListener('load', onResize);
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => updateIndicator()).catch(() => {});
    }
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined' && linksRef.current) {
      ro = new ResizeObserver(() => updateIndicator());
      ro.observe(linksRef.current);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onResize);
      ro?.disconnect();
    };
  }, [updateIndicator]);

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

        <div className="snav__links" ref={linksRef}>
          {/* Shared traveling indicator: one arrow + one underline that glide
              (CSS transition on left/width) to the active link. */}
          <span aria-hidden="true"
            className={`snav__arrow ${ind.ready ? 'is-on' : ''}`}
            style={{ left: ind.arrowAnchor, transition: animate ? undefined : 'none' }}>&gt;</span>
          <span aria-hidden="true"
            className={`snav__underline ${ind.ready ? 'is-on' : ''}`}
            style={{ left: ind.left, width: ind.width, transition: animate ? undefined : 'none' }} />
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
