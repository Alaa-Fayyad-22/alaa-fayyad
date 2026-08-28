import { useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { skillCategories } from '../data/portfolio';

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

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative' }}>

        <div className="skills-bento">
          {skillCategories.map(cat => (
            <div key={cat.key} className="reveal glass" style={{
              padding: '28px', borderRadius: 'var(--radius-panel)',
              transition: 'border-color 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              {/* Category header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{ width: 4, height: 22, borderRadius: 2, background: 'var(--accent)' }} />
                <h3 style={{ fontFamily: isRTL ? 'var(--font-arabic), sans-serif' : "var(--font-mono), monospace",
                  fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
                  {labels[cat.key]}
                </h3>
              </div>

              {/* Skills as tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {cat.skills.map((skill, si) => (
                  <span key={si} style={{
                    padding: '8px 14px', borderRadius: 999,
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    fontSize: '0.82rem', fontWeight: 500, color: 'var(--text)',
                    cursor: 'default', ...ar,
                  }}>{skill.name}</span>
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
