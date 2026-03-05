import { useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { experiences } from '../data/portfolio';

const typeColors: Record<string, { bg: string; text: string; label: string; labelAr: string }> = {
  'full-time': { bg: 'rgba(99,102,241,0.12)', text: '#818cf8', label: 'Full-time', labelAr: 'دوام كامل' },
  'freelance':  { bg: 'rgba(168,85,247,0.12)', text: '#c084fc', label: 'Freelance',  labelAr: 'عمل حر'    },
};

export default function Experience() {
  const { t, isRTL } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.08 }
    );
    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="experience"
      ref={ref}
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ padding: '96px 0', background: 'var(--bg-secondary)' }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>

        {/* ── Header ── */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'var(--primary)' }}>
            {t.experience.label}
          </span>
        </div>
        <h2
          className="reveal gradient-text"
          style={{
            textAlign: 'center',
            fontFamily: isRTL ? 'Cairo, sans-serif' : 'Syne, sans-serif',
            fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)',
            marginBottom: '12px',
          }}
        >
          {t.experience.title}
        </h2>
        <p
          className="reveal"
          style={{
            textAlign: 'center', color: 'var(--text-muted)',
            fontFamily: isRTL ? 'Cairo, sans-serif' : undefined,
            marginBottom: '64px', fontSize: '1rem',
          }}
        >
          {t.experience.subtitle}
        </p>

        {/* ── Timeline ── */}
        <div style={{ position: 'relative' }}>

          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            [isRTL ? 'right' : 'left']: '20px',
            top: '8px', bottom: '8px',
            width: '2px',
            background: 'linear-gradient(to bottom, var(--primary), var(--accent), transparent)',
            borderRadius: '2px',
          }} />

          {experiences.map((exp, i) => {
            const badge = typeColors[exp.type] ?? typeColors['full-time'];
            return (
              <div
                key={i}
                className="reveal"
                style={{
                  position: 'relative',
                  paddingInlineStart: '60px',
                  marginBottom: i < experiences.length - 1 ? '40px' : 0,
                  animationDelay: `${i * 0.15}s`,
                }}
              >
                {/* Dot */}
                <div style={{
                  position: 'absolute',
                  [isRTL ? 'right' : 'left']: '12px',
                  top: '22px',
                  width: '18px', height: '18px',
                  borderRadius: '50%',
                  background: 'var(--gradient)',
                  boxShadow: '0 0 0 4px var(--bg-secondary), 0 0 12px var(--glow)',
                  zIndex: 1,
                }} />

                {/* Card */}
                <div
                  className="glass"
                  style={{
                    borderRadius: '20px',
                    padding: '28px 32px',
                    border: '1px solid var(--border)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(99,102,241,0.15)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}
                >
                  {/* Top row: role + period */}
                  <div style={{
                    display: 'flex', alignItems: 'flex-start',
                    justifyContent: 'space-between', gap: '16px',
                    flexWrap: 'wrap', marginBottom: '6px',
                  }}>
                    <h3 style={{
                      fontFamily: isRTL ? 'Cairo, sans-serif' : 'Syne, sans-serif',
                      fontWeight: 700, fontSize: '1.15rem', color: 'var(--text)',
                    }}>
                      {isRTL ? exp.roleAr : exp.role}
                    </h3>
                    <span style={{
                      fontSize: '0.75rem', fontFamily: 'monospace',
                      padding: '4px 12px', borderRadius: '999px',
                      background: 'var(--surface-2)', color: 'var(--text-muted)',
                      whiteSpace: 'nowrap', flexShrink: 0,
                    }}>
                      {isRTL ? exp.periodAr : exp.period}
                    </span>
                  </div>

                  {/* Company + type badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary)',
                      fontFamily: isRTL ? 'Cairo, sans-serif' : undefined,
                    }}>
                      {isRTL ? exp.companyAr : exp.company}
                    </span>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px',
                      borderRadius: '999px', background: badge.bg, color: badge.text,
                      fontFamily: 'monospace',
                    }}>
                      {isRTL ? badge.labelAr : badge.label}
                    </span>
                  </div>

                  {/* Divider */}
                  <div style={{ height: '1px', background: 'var(--border)', marginBottom: '14px' }} />

                  {/* Description */}
                  <p style={{
                    fontSize: '0.9rem', lineHeight: '1.75',
                    color: 'var(--text-muted)',
                    fontFamily: isRTL ? 'Cairo, sans-serif' : undefined,
                    marginBottom: '18px',
                  }}>
                    {isRTL ? exp.descriptionAr : exp.description}
                  </p>

                  {/* Tech chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {exp.tech.map(tech => (
                      <span key={tech} style={{
                        fontSize: '0.72rem', fontFamily: 'monospace',
                        padding: '4px 12px', borderRadius: '999px',
                        background: 'rgba(99,102,241,0.1)',
                        color: 'var(--primary)',
                        border: '1px solid rgba(99,102,241,0.2)',
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}