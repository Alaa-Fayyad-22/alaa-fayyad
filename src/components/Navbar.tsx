import { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Menu, X } from 'lucide-react';

function smoothScroll(id: string) {
  const start = document.documentElement.scrollTop;
  const target = id === 'top' ? 0 : (() => {
    const el = document.getElementById(id);
    if (!el) return 0;
    return el.getBoundingClientRect().top + document.documentElement.scrollTop - 72;
  })();
  const duration = id === 'top' ? 3000 : 800;
  const startTime = performance.now();

  function ease(t: number) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    document.documentElement.scrollTop = start + (target - start) * ease(progress);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

export default function Navbar() {
  const { t, locale, isRTL, toggleLocale } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { id: 'about',      label: t.nav.about      },
    { id: 'skills',     label: t.nav.skills      },
    { id: 'projects',   label: t.nav.projects    },
    { id: 'experience', label: t.nav.experience  },
    { id: 'contact',    label: t.nav.contact     },
  ];

  const ar: React.CSSProperties = isRTL ? { fontFamily: 'Cairo, sans-serif' } : {};
  const navBg = scrolled ? 'rgba(244,243,255,0.92)' : 'rgba(244,243,255,0.55)';

  const linkBtnStyle: React.CSSProperties = {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: '0.875rem', fontWeight: 500,
    color: 'var(--text-muted)', textDecoration: 'none',
    transition: 'color 0.2s', padding: 0, ...ar,
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      background: navBg,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: scrolled ? '1px solid rgba(99,102,241,0.15)' : '1px solid transparent',
      transition: 'background 0.3s ease, border-color 0.3s ease',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 24px',
        height: 64, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        direction: isRTL ? 'rtl' : 'ltr',
      }}>

        {/* Logo */}
        <button onClick={() => smoothScroll('top')} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          fontFamily: isRTL ? 'Cairo, sans-serif' : 'Syne, sans-serif',
          fontWeight: 800, fontSize: '1.15rem',
          backgroundImage: 'var(--gradient)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          flexShrink: 0,
        }}>
          {locale === 'ar' ? 'علاء فياض' : 'ALAA FAYYAD'}
        </button>

        {/* Desktop links */}
        <div className="nav-links-desktop" style={{ alignItems: 'center', gap: 28 }}>
          {links.map(link => (
            <button key={link.id} onClick={() => smoothScroll(link.id)}
              style={{ ...linkBtnStyle }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="nav-actions-desktop" style={{
          alignItems: 'center', gap: 10,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        }}>
          <button onClick={toggleLocale} style={{
            padding: '5px 14px', borderRadius: 999,
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'monospace', transition: 'border-color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            {locale === 'en' ? 'عربي' : 'EN'}
          </button>

          <button onClick={() => smoothScroll('contact')} style={{
            padding: '8px 20px', borderRadius: 999,
            background: 'var(--gradient)', color: '#fff',
            fontSize: '0.875rem', fontWeight: 600, border: 'none',
            whiteSpace: 'nowrap', cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s', ...ar,
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(79,70,229,0.35)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {t.nav.hire}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu" style={{
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)',
          }}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          background: '#fff', borderTop: '1px solid var(--border)',
          padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 4,
          direction: isRTL ? 'rtl' : 'ltr',
        }}>
          {links.map(link => (
            <button key={link.id}
              onClick={() => { smoothScroll(link.id); setMenuOpen(false); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '1rem', fontWeight: 500, color: 'var(--text)',
                padding: '10px 0', borderBottom: '1px solid var(--border)',
                textAlign: isRTL ? 'right' : 'left',
                transition: 'color 0.2s', width: '100%', ...ar,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text)')}
            >
              {link.label}
            </button>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 16 }}>
            <button onClick={toggleLocale} style={{
              padding: '6px 16px', borderRadius: 999,
              border: '1px solid var(--border)', background: 'none',
              color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'monospace',
            }}>
              {locale === 'en' ? 'عربي' : 'EN'}
            </button>
            <button onClick={() => { smoothScroll('contact'); setMenuOpen(false); }} style={{
              padding: '8px 20px', borderRadius: 999,
              background: 'var(--gradient)', color: '#fff', border: 'none',
              fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', ...ar,
            }}>
              {t.nav.hire}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .nav-links-desktop   { display: none !important; }
        .nav-actions-desktop { display: none !important; }
        .nav-hamburger       { display: flex !important; }
        @media (min-width: 768px) {
          .nav-links-desktop   { display: flex !important; }
          .nav-actions-desktop { display: flex !important; }
          .nav-hamburger       { display: none !important; }
        }
      `}</style>
    </nav>
  );
}