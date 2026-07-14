import { useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { skillCategories } from '../data/portfolio';

const techIcons: Record<string, string> = {
  'React / Next.js':'','TypeScript':'','Tailwind CSS':'','React Native':'',
  'Framer Motion':'','Node.js / Express':'','Python / FastAPI':'','REST APIs':'',
  'GraphQL':'','WebSockets':'','Figma':'','UI/UX Design':'',
  'Design Systems':'','Prototyping':'','Adobe XD':'','PostgreSQL':'',
  'MongoDB':'','Redis':'','AWS / Vercel':'','Docker':'', 
  'C# / ASP.NET': '', 
  'JavaScript': '',
  'MySQL': '',
};

const catColors: Record<string, string> = {
  frontend:'#6366f1', backend:'#10b981', design:'#ec4899', databases:'#f59e0b', devops:'#06b6d4',
};

export default function Skills({ bare = false }: { bare?: boolean } = {}) {
  const { t, isRTL } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
    }, { threshold: 0.1 });
    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const ar: React.CSSProperties = isRTL ? { fontFamily: 'var(--font-arabic), sans-serif' } : {};
  const labels: Record<string,string> = {
    frontend: t.skills.frontend, backend: t.skills.backend,
    design: t.skills.design, databases: t.skills.databases, devops: t.skills.devops
  };

  return (
    <section id={bare ? undefined : 'skills'} ref={ref} dir={isRTL ? 'rtl' : 'ltr'}
      style={{ padding: bare ? '8px 0 40px' : '96px 0', background: 'transparent', color: 'var(--text)', position: 'relative', overflow: 'hidden' }}>

      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--glow-soft), transparent 70%)',
          filter: 'blur(80px)', top: '10%', right: '-5%' }} />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative' }}>


        <div className="skills-bento">
          {skillCategories.map((cat, ci) => (
            <div key={cat.key} className="reveal glass" style={{
              padding: '28px', borderRadius: 20,
              animationDelay: `${ci * 0.1}s`,
              transition: 'transform 0.2s ease, box-shadow 0.25s ease, border-color 0.2s ease',
            }}
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
              {/* Category header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{ width: 4, height: 22, borderRadius: 2, background: catColors[cat.key] }} />
                <h3 style={{ fontFamily: isRTL ? 'var(--font-arabic), sans-serif' : "var(--font-mono), monospace",
                  fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
                  {labels[cat.key]}
                </h3>
              </div>

              {/* Skills as tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {cat.skills.map((skill, si) => (
                  <div key={si} style={{
                    display: 'flex', alignItems: 'center',
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
                    <span style={{ fontSize: '0.9rem' }}>{techIcons[skill.name] }</span>
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
            {['Git', 'Supabase', 'CMS', 'API Integration', 'Data Automation', 'Web Scraping'].map(tech => (
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