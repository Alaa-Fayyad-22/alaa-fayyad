import { useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Download, Code2, Palette, Zap, Package } from 'lucide-react';

export default function About() {
  const { t, isRTL } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const ar: React.CSSProperties = isRTL ? { fontFamily: 'Cairo, sans-serif' } : {};

  const facts = [
    { icon: Code2,    title: t.about.fact1_title, desc: t.about.fact1_desc, color: '#3b82f6' },
    { icon: Palette,  title: t.about.fact2_title, desc: t.about.fact2_desc, color: '#a855f7' },
    { icon: Zap,      title: t.about.fact3_title, desc: t.about.fact3_desc, color: '#f59e0b' },
    { icon: Package,  title: t.about.fact4_title, desc: t.about.fact4_desc, color: '#10b981' },
  ];

  return (
    <section id="about" ref={ref} dir={isRTL ? 'rtl' : 'ltr'}
      style={{ padding: '96px 0', background: 'var(--bg)', color: 'var(--text)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* Label */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: '1rem', fontWeight:1000, fontFamily: 'bold', letterSpacing: '0.05em',
            textTransform: 'uppercase', color: 'var(--primary)' }}>
            {t.about.label}
          </span>
        </div>

        {/* Title */}
        <h2 className="reveal gradient-text" style={{
          textAlign: 'center', marginBottom: 64,
          fontFamily: isRTL ? 'Cairo, sans-serif' : 'Syne, sans-serif',
          fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,3rem)',
        }}>
          {t.about.title}
        </h2>

        {/* Bio + Avatar row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))',
          gap: 64, alignItems: 'center', marginBottom: 64 }}>

          {/* Avatar */}
          <div className="reveal" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div className="animate-float" style={{
                width: 260, height: 260, borderRadius: '50%', padding: 3,
                background: 'var(--gradient)',
              }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%',
                  background: 'var(--surface-2)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>
                  👨‍💻
                </div>
              </div>
              {/* Badge: years */}
              <div style={{ position: 'absolute', bottom: -8, right: -8, padding: '8px 14px',
                borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)',
                textAlign: 'center' }}>
                <div className="gradient-text" style={{ fontFamily: 'Syne, sans-serif',
                  fontWeight: 800, fontSize: '1.4rem' }}>3+</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', ...ar }}>
                  {isRTL ? 'سنوات' : 'Years'}
                </div>
              </div>
              {/* Badge: projects */}
              <div style={{ position: 'absolute', top: -8, left: -8, padding: '8px 14px',
                borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)',
                textAlign: 'center' }}>
                <div className="gradient-text" style={{ fontFamily: 'Syne, sans-serif',
                  fontWeight: 800, fontSize: '1.4rem' }}>25+</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', ...ar }}>
                  {isRTL ? 'مشروع' : 'Projects'}
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[t.about.bio1, t.about.bio2, t.about.bio3].map((bio, i) => (
              <p key={i} style={{ fontSize: '1rem', lineHeight: 1.85,
                color: i === 0 ? 'var(--text)' : 'var(--text-muted)', ...ar }}>
                {bio}
              </p>
            ))}
            <div style={{ marginTop: 8 }}>
              <a href="/cv.pdf" download className="btn-primary" style={{ ...ar, width: 'fit-content' }}>
                <Download size={16} />
                {t.about.download_cv}
              </a>
            </div>
          </div>
        </div>

        {/* Fact cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 16 }}>
          {facts.map(({ icon: Icon, title, desc, color }, i) => (
            <div key={i} className="reveal" style={{
              padding: '24px', borderRadius: 20,
              background: 'var(--surface)', border: '1px solid var(--border)',
              transition: 'transform 0.2s',
              animationDelay: `${i * 0.08}s`,
            }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, marginBottom: 14,
                background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={color} />
              </div>
              <h3 style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Syne, sans-serif',
                fontWeight: 700, fontSize: '1rem', marginBottom: 6, color: 'var(--text)' }}>
                {title}
              </h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--text-muted)', ...ar }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}