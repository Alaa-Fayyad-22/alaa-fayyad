import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from '../hooks/useTranslation';
import { projects } from '../data/portfolio';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';

const projectColors: Record<string, string> = {
  'from-violet-500 to-indigo-600':  'linear-gradient(135deg,#7c3aed,#4f46e5)',
  'from-violet-500 to-purple-600':  'linear-gradient(135deg,#7c3aed,#9333ea)',
  'from-blue-500 to-cyan-600':      'linear-gradient(135deg,#3b82f6,#0891b2)',
  'from-blue-500 to-cyan-500':      'linear-gradient(135deg,#3b82f6,#06b6d4)',
  'from-emerald-500 to-teal-600':   'linear-gradient(135deg,#10b981,#0d9488)',
  'from-orange-500 to-pink-600':    'linear-gradient(135deg,#f97316,#db2777)',
  'from-pink-500 to-rose-600':      'linear-gradient(135deg,#ec4899,#e11d48)',
  'from-amber-500 to-orange-600':   'linear-gradient(135deg,#f59e0b,#ea580c)',
};

export default function Projects({ bare = false }: { bare?: boolean } = {}) {
  const { t, isRTL } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number|null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.05 }
    );
    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const ar: React.CSSProperties = isRTL ? { fontFamily: 'var(--font-arabic), sans-serif' } : {};

  return (
    <section id={bare ? undefined : 'projects'} ref={ref} dir={isRTL ? 'rtl' : 'ltr'}
      style={{ padding: bare ? '8px 0 40px' : '96px 0', background:'transparent', color:'var(--text)', position:'relative', overflow:'hidden' }}>

      <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
        <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%',
          background:'radial-gradient(circle, var(--glow-soft), transparent 70%)',
          filter:'blur(100px)', bottom:'10%', left:'-5%' }} />
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', position:'relative' }}>


        {/* Bento grid */}
        <div className="proj-bento">
          {projects.map((p, i) => {
            const isLarge = i === 0;
            const active = hovered === p.id;
            return (
              <article key={p.id}
                className={`reveal glass proj-card${isLarge ? ' proj-card--large' : ''}`}
                style={{
                  transition:'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
                  animationDelay:`${i*0.07}s`,
                  transform: active ? 'translateY(-6px)' : 'translateY(0)',
                  boxShadow: active ? '0 18px 44px var(--glow)' : 'none',
                  borderColor: active ? 'var(--border-strong)' : 'var(--border)',
                }}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Media */}
                <div className="proj-media"
                  style={{ background: projectColors[p.color] || 'linear-gradient(135deg,#818cf8,#a855f7)' }}>
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={isRTL ? p.imageAltAr : p.imageAlt}
                      fill
                      // Large tile spans the full grid width on desktop; the rest
                      // are half-width. Below 900px every card is full-width.
                      sizes={isLarge
                        ? '(max-width: 900px) 100vw, 1200px'
                        : '(max-width: 900px) 100vw, 600px'}
                      // Next's optimizer refuses SVG by default (dangerouslyAllowSVG),
                      // so the SVG cover is served as-is instead of 404ing.
                      unoptimized={p.image.endsWith('.svg')}
                      style={{ objectFit:'fill' }}
                    />
                  ) : (
                    <span style={{ fontSize:48 }}>
                      {p.category==='web'?'🌐':p.category==='mobile'?'📱':'🎨'}
                    </span>
                  )}

                  {/* hover overlay */}
                  <div style={{
                    position:'absolute', inset:0, display:'flex',
                    alignItems:'center', justifyContent:'center', gap:12,
                    background:'var(--overlay)',
                    opacity: active ? 1 : 0,
                    transition:'opacity 0.2s', zIndex:2,
                  }}>
                    <a href={p.live} target="_blank" rel="noopener noreferrer"
                      aria-label={`${isRTL ? p.titleAr : p.title} — ${t.projects.view_live}`}
                      style={{ width:42, height:42, borderRadius:'50%', background:'#fff',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        textDecoration:'none', color:'#111' }}>
                      <ExternalLink size={16}/>
                    </a>
                    <a href={p.github} target="_blank" rel="noopener noreferrer"
                      aria-label={`${isRTL ? p.titleAr : p.title} — ${t.projects.view_code}`}
                      style={{ width:42, height:42, borderRadius:'50%', background:'#fff',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        textDecoration:'none', color:'#111' }}>
                      <Github size={16}/>
                    </a>
                  </div>
                </div>

                {/* Body */}
                <div className="proj-body">
                  <h3 style={{ fontFamily: isRTL?'var(--font-arabic), sans-serif':"var(--font-mono), monospace",
                    fontWeight:700, fontSize: isLarge ? '1.3rem' : '1.05rem',
                    marginBottom:8, color:'var(--text)', letterSpacing:'-0.01em' }}>
                    {isRTL ? p.titleAr : p.title}
                  </h3>
                  <p className="proj-desc" style={{ fontSize:'0.88rem', lineHeight:1.7,
                    color:'var(--text-muted)', marginBottom:14, ...ar }}>
                    {isRTL ? p.descriptionAr : p.description}
                  </p>
                  <div style={{ marginTop:'auto', display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
                    {p.tags.map(tag => (
                      <span key={tag} style={{ fontSize:'0.7rem', fontFamily:'monospace',
                        padding:'3px 10px', borderRadius:999,
                        background:'var(--surface-2)', color:'var(--primary)',
                        border:'1px solid var(--border)' }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display:'flex', gap:20 }}>
                    <a href={p.live} target="_blank" rel="noopener noreferrer"
                      style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.82rem',
                        fontWeight:600, color:'var(--primary)', textDecoration:'none', ...ar }}>
                      <ExternalLink size={13}/> {t.projects.view_live} <ArrowRight size={12}/>
                    </a>
                    <a href={p.github} target="_blank" rel="noopener noreferrer"
                      style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.82rem',
                        color:'var(--text-muted)', textDecoration:'none', ...ar }}>
                      <Github size={13}/> {t.projects.view_code}
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="reveal" style={{ marginTop:48, textAlign:'center' }}>
          <a href="https://github.com/Alaa-Fayyad-22" target="_blank" rel="noopener noreferrer"
            className="glass"
            style={{ display:'inline-flex', alignItems:'center', gap:8,
              padding:'12px 28px', borderRadius:999, fontWeight:600,
              color:'var(--text)', textDecoration:'none',
              transition:'transform 0.2s ease, box-shadow 0.25s ease, border-color 0.2s ease', ...ar }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform='translateY(-2px)';
              el.style.boxShadow='0 8px 30px var(--glow)';
              el.style.borderColor='var(--border-strong)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform='translateY(0)';
              el.style.boxShadow='none';
              el.style.borderColor='var(--border)';
            }}>
            {t.projects.view_all} <ArrowRight size={15}/>
          </a>
        </div>
      </div>
    </section>
  );
}
