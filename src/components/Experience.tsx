import { useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { experiences } from '../data/portfolio';

const MONO = "'JetBrains Mono', monospace";

const typeMeta: Record<string, { label: string; labelAr: string }> = {
  'full-time': { label: 'Full-time', labelAr: 'دوام كامل' },
  'freelance': { label: 'Freelance', labelAr: 'عمل حر' },
};

export default function Experience({ bare = false }: { bare?: boolean } = {}) {
  const { isRTL } = useTranslation();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.08 }
    );
    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const ar: React.CSSProperties = isRTL ? { fontFamily: 'Cairo, sans-serif' } : {};

  return (
    <section id={bare ? undefined : 'experience'} ref={ref} dir={isRTL ? 'rtl' : 'ltr'}
      style={{ padding: bare ? '8px 0 40px' : '96px 0', background: 'transparent',
        color: 'var(--text)', position: 'relative', overflow: 'hidden' }}>

      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--glow-soft), transparent 70%)',
          filter: 'blur(90px)', top: '12%', left: '-6%' }} />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          {/* Timeline rail */}
          <span aria-hidden="true" style={{ position: 'absolute', insetInlineStart: 5,
            top: 12, bottom: 12, width: 2, background: 'var(--border)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {experiences.map((exp, i) => {
              const badge = typeMeta[exp.type] ?? typeMeta['full-time'];
              return (
                <article key={i} className="reveal" style={{ position: 'relative',
                  display: 'flex', gap: 24, animationDelay: `${i * 0.08}s` }}>

                  {/* Timeline node */}
                  <span aria-hidden="true" style={{ width: 12, height: 12, borderRadius: '50%',
                    marginTop: 26, flexShrink: 0, zIndex: 1, background: 'var(--gradient)',
                    boxShadow: '0 0 0 4px var(--bg)' }} />

                  <div className="glass" style={{ flex: 1, padding: '24px 26px', borderRadius: 20,
                    transition: 'transform 0.2s ease, box-shadow 0.25s ease, border-color 0.2s ease' }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.transform = 'translateY(-4px)';
                      el.style.boxShadow = '0 14px 40px var(--glow)';
                      el.style.borderColor = 'var(--border-strong)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.transform = 'translateY(0)';
                      el.style.boxShadow = 'none';
                      el.style.borderColor = 'var(--border)';
                    }}
                  >
                    {/* Role + type */}
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap',
                      alignItems: 'center', marginBottom: 8 }}>
                      <h3 style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : MONO, fontWeight: 700,
                        fontSize: '1.15rem', color: 'var(--text)', letterSpacing: isRTL ? 0 : '-0.01em' }}>
                        {isRTL ? exp.roleAr : exp.role}
                      </h3>
                      <span style={{ fontFamily: MONO, fontSize: '0.66rem', letterSpacing: '0.1em',
                        textTransform: 'uppercase', padding: '3px 10px', borderRadius: 999,
                        color: 'var(--primary)', background: 'var(--surface-2)',
                        border: '1px solid var(--border)' }}>
                        {isRTL ? badge.labelAr : badge.label}
                      </span>
                    </div>

                    {/* Company + period */}
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap',
                      alignItems: 'center', marginBottom: 16 }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary)',
                        ...(isRTL ? { fontFamily: 'Cairo, sans-serif' } : {}) }}>
                        {isRTL ? exp.companyAr : exp.company}
                      </span>
                      <span aria-hidden="true" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>•</span>
                      <span style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : MONO,
                        fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {isRTL ? exp.periodAr : exp.period}
                      </span>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: '0.92rem', lineHeight: 1.8, color: 'var(--text-muted)',
                      marginBottom: exp.tech.length ? 18 : 0, ...ar }}>
                      {isRTL ? exp.descriptionAr : exp.description}
                    </p>

                    {/* Tech */}
                    {exp.tech.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {exp.tech.map(tech => (
                          <span key={tech} style={{ fontFamily: MONO, fontSize: '0.72rem',
                            padding: '4px 12px', borderRadius: 999, background: 'var(--surface-2)',
                            color: 'var(--primary)', border: '1px solid var(--border)' }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
