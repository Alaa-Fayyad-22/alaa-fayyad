import { useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { skillCategories } from '../data/portfolio';

const techIcons: Record<string, string> = {
  'React / Next.js':'⚛️','TypeScript':'🔷','Tailwind CSS':'🎨','React Native':'📱',
  'Framer Motion':'✨','Node.js / Express':'🟢','Python / FastAPI':'🐍','REST APIs':'🔗',
  'GraphQL':'◈','WebSockets':'⚡','Figma':'🎯','UI/UX Design':'🖌️',
  'Design Systems':'🏗️','Prototyping':'🔮','Adobe XD':'🎭','PostgreSQL':'🐘',
  'MongoDB':'🍃','Redis':'🔴','AWS / Vercel':'☁️','Docker':'🐳',
};

const catColors: Record<string, string> = {
  frontend:'#6366f1', backend:'#10b981', design:'#ec4899', databases:'#f59e0b',
};

export default function Skills() {
  const { t, isRTL } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
    }, { threshold: 0.1 });
    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const ar: React.CSSProperties = isRTL ? { fontFamily: 'Cairo, sans-serif' } : {};
  const labels: Record<string,string> = {
    frontend: t.skills.frontend, backend: t.skills.backend,
    design: t.skills.design, databases: t.skills.databases,
  };

  return (
    <section id="skills" ref={ref} dir={isRTL ? 'rtl' : 'ltr'}
      style={{ padding: '96px 0', background: 'var(--bg-secondary)', color: 'var(--text)', position: 'relative' }}>

      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.12), transparent)',
          filter: 'blur(80px)', top: '10%', right: '-5%' }} />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative' }}>

        <div className="reveal" style={{ textAlign: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: '1rem', fontWeight:1000, fontFamily: 'bold', letterSpacing: '0.05em',
            textTransform: 'uppercase', color: 'var(--primary)' }}>
            {t.skills.label}
          </span>
        </div>

        <h2 className="reveal gradient-text" style={{
          textAlign: 'center', marginBottom: 12,
          fontFamily: isRTL ? 'Cairo, sans-serif' : 'Syne, sans-serif',
          fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,3rem)',
        }}>{t.skills.title}</h2>
        <p className="reveal" style={{ textAlign: 'center',
          color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto 56px', ...ar }}>{t.skills.subtitle}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 20 }}>
          {skillCategories.map((cat, ci) => (
            <div key={cat.key} className="reveal" style={{
              padding: '28px', borderRadius: 20,
              background: 'var(--surface)', border: '1px solid var(--border)',
              animationDelay: `${ci * 0.1}s`,
            }}>
              {/* Category header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{ width: 4, height: 22, borderRadius: 2, background: catColors[cat.key] }} />
                <h3 style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Syne, sans-serif',
                  fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
                  {labels[cat.key]}
                </h3>
              </div>

              {/* Skills as tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {cat.skills.map((skill, si) => (
                  <div key={si} style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '8px 14px', borderRadius: 999,
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    transition: 'transform 0.2s, border-color 0.2s',
                    cursor: 'default',
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                      (e.currentTarget as HTMLDivElement).style.borderColor = catColors[cat.key];
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                    }}
                  >
                    <span style={{ fontSize: '0.9rem' }}>{techIcons[skill.name] || '⚙️'}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 500,
                      color: 'var(--text)', ...ar }}>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Also working with */}
        <div className="reveal" style={{ marginTop: 56, textAlign: 'center' }}>
          <p style={{ fontSize: '1.02rem', marginBottom: 16, color: 'var(--text-muted)', ...ar }}>
            {isRTL ? 'أعمل أيضاً مع' : 'Also working with'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
            {['Git', 'Supabase', 'PostgreSQL', 'MySQL', 'phpMyAdmin', 'CMS', 'API Integration', 'Data Automation', 'Web Scraping'].map(tech => (
              <span key={tech} style={{
                padding: '6px 16px', borderRadius: 999, fontSize: '0.8rem',
                background: 'var(--surface)', border: '1px solid var(--border)',
                color: 'var(--text-muted)',
              }}>{tech}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}