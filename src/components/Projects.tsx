import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from '../hooks/useTranslation';
import { projects } from '../data/portfolio';
import { logEvent } from '../lib/track';
import { ExternalLink, Github, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Projects({ bare = false }: { bare?: boolean } = {}) {
  const { t, isRTL } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  // Whether the carousel can page further toward its start / end.
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.05 }
    );
    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Geometry-based edge detection — works the same in LTR and RTL without
  // touching scrollLeft (whose sign convention differs across browsers in RTL).
  const syncEdges = useCallback(() => {
    const el = scrollerRef.current;
    const kids = el?.children;
    if (!el || !kids || kids.length === 0) return;
    const cr = el.getBoundingClientRect();
    const first = kids[0].getBoundingClientRect();
    const last = kids[kids.length - 1].getBoundingClientRect();
    setEdges(
      isRTL
        ? { atStart: first.right <= cr.right + 1, atEnd: last.left >= cr.left - 1 }
        : { atStart: first.left >= cr.left - 1, atEnd: last.right <= cr.right + 1 },
    );
  }, [isRTL]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    syncEdges();
    el.addEventListener('scroll', syncEdges, { passive: true });
    window.addEventListener('resize', syncEdges);
    return () => {
      el.removeEventListener('scroll', syncEdges);
      window.removeEventListener('resize', syncEdges);
    };
  }, [syncEdges]);

  // Page the carousel in READING order: dir = +1 → next project(s), -1 →
  // previous, in whichever on-screen direction that is for the active locale.
  // One page is the visible width — 2 cards from 720px up, 1 below — and
  // scroll-snap re-aligns to a card afterwards. Reading-forward means a
  // positive scrollLeft delta in LTR and a negative one in RTL (Chrome's RTL
  // convention), which the `sign` term handles.
  const pageBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const sign = isRTL ? -1 : 1;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: sign * dir * el.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
  };

  const ar: React.CSSProperties = isRTL ? { fontFamily: 'var(--font-arabic), sans-serif' } : {};
  // Mirror directional glyphs (the "→" that trails link labels) in RTL.
  const flipX: React.CSSProperties = isRTL ? { transform: 'scaleX(-1)' } : {};

  return (
    <section id={bare ? undefined : 'projects'} ref={ref} dir={isRTL ? 'rtl' : 'ltr'}
      style={{ padding: bare ? '8px 0 40px' : '96px 0', background: 'transparent', color: 'var(--text)', position: 'relative', overflow: 'hidden' }}>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative' }}>

        <div className="proj-carousel">
          {/* Swipe on touch; these buttons page for pointer users (tablet+).
              DOM order is semantic (previous, then next). The `.proj-nav` flex
              container inherits `dir` from the section, so in RTL the browser
              mirrors their positions — previous sits on the right, next on the
              left — and each glyph is flipped to point the right way. */}
          <div className="proj-nav reveal">
            <button type="button"
              aria-label={isRTL ? 'المشاريع السابقة' : 'Previous projects'}
              disabled={edges.atStart}
              onClick={() => pageBy(-1)}>
              {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <button type="button"
              aria-label={isRTL ? 'المشاريع التالية' : 'Next projects'}
              disabled={edges.atEnd}
              onClick={() => pageBy(1)}>
              {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>

          <div className="proj-bento reveal" ref={scrollerRef}>
            {projects.map((p) => {
              const active = hovered === p.id;
              return (
                <article key={p.id}
                  className="glass proj-card"
                  style={{
                    transition: 'border-color 0.2s ease',
                    borderColor: active ? 'var(--border-strong)' : 'var(--border)',
                  }}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Media — fixed aspect ratio, cover fit, so every thumbnail
                      reads the same regardless of its source dimensions. */}
                  <div className="proj-media">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={isRTL ? p.imageAltAr : p.imageAlt}
                        fill
                        sizes="(max-width: 720px) 92vw, 560px"
                        // Next's optimizer refuses SVG by default, so serve it as-is.
                        unoptimized={p.image.endsWith('.svg')}
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '1rem',
                        color: 'var(--text-muted)', padding: '0 24px', textAlign: 'center' }}>
                        {isRTL ? p.titleAr : p.title}
                      </span>
                    )}

                    {/* hover overlay */}
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', gap: 12,
                      background: 'var(--overlay)',
                      opacity: active ? 1 : 0,
                      transition: 'opacity 0.2s', zIndex: 2,
                    }}>
                      <a href={p.live} target="_blank" rel="noopener noreferrer"
                        onClick={() => logEvent('cta_click', { cta: 'project_live', project: p.title })}
                        aria-label={`${isRTL ? p.titleAr : p.title} — ${t.projects.view_live}`}
                        style={{ width: 42, height: 42, borderRadius: '50%', background: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          textDecoration: 'none', color: '#111' }}>
                        <ExternalLink size={16} />
                      </a>
                      <a href={p.github} target="_blank" rel="noopener noreferrer"
                        onClick={() => logEvent('cta_click', { cta: 'project_github', project: p.title })}
                        aria-label={`${isRTL ? p.titleAr : p.title} — ${t.projects.view_code}`}
                        style={{ width: 42, height: 42, borderRadius: '50%', background: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          textDecoration: 'none', color: '#111' }}>
                        <Github size={16} />
                      </a>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="proj-body">
                    <h3 style={{ fontFamily: isRTL ? 'var(--font-arabic), sans-serif' : 'var(--font-mono), monospace',
                      fontWeight: 700, fontSize: '1.05rem',
                      marginBottom: 8, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                      {isRTL ? p.titleAr : p.title}
                    </h3>
                    <p className="proj-desc" style={{ fontSize: '0.88rem', lineHeight: 1.7,
                      color: 'var(--text-muted)', marginBottom: 14, ...ar }}>
                      {isRTL ? p.descriptionAr : p.description}
                    </p>
                    <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                      {p.tags.map(tag => (
                        <span key={tag} style={{ fontSize: '0.7rem', fontFamily: 'monospace',
                          padding: '3px 10px', borderRadius: 999,
                          background: 'var(--surface-2)', color: 'var(--primary)',
                          border: '1px solid var(--border)' }}>{tag}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 20 }}>
                      <a href={p.live} target="_blank" rel="noopener noreferrer"
                        onClick={() => logEvent('cta_click', { cta: 'project_live', project: p.title })}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82rem',
                          fontWeight: 600, color: 'var(--primary)', textDecoration: 'none', ...ar }}>
                        <ExternalLink size={13} /> {t.projects.view_live} <ArrowRight size={12} style={flipX} />
                      </a>
                      <a href={p.github} target="_blank" rel="noopener noreferrer"
                        onClick={() => logEvent('cta_click', { cta: 'project_github', project: p.title })}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82rem',
                          color: 'var(--text-muted)', textDecoration: 'none', ...ar }}>
                        <Github size={13} /> {t.projects.view_code}
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="reveal" style={{ marginTop: 48, textAlign: 'center' }}>
          <a href="https://github.com/Alaa-Fayyad-22" target="_blank" rel="noopener noreferrer"
            className="glass"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 'var(--radius-panel)', fontWeight: 600,
              color: 'var(--text)', textDecoration: 'none',
              transition: 'border-color 0.2s ease', ...ar }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
            {t.projects.view_all} <ArrowRight size={15} style={flipX} />
          </a>
        </div>
      </div>
    </section>
  );
}
