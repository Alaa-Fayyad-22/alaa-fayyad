import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { projects } from '../data/portfolio';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';

const categories = ['all','web','mobile','design'] as const;
type Category = typeof categories[number];

const projectColors: Record<string, string> = {
  'from-violet-500 to-indigo-600':  'linear-gradient(135deg,#7c3aed,#4f46e5)',
  'from-blue-500 to-cyan-600':      'linear-gradient(135deg,#3b82f6,#0891b2)',
  'from-emerald-500 to-teal-600':   'linear-gradient(135deg,#10b981,#0d9488)',
  'from-orange-500 to-pink-600':    'linear-gradient(135deg,#f97316,#db2777)',
  'from-pink-500 to-rose-600':      'linear-gradient(135deg,#ec4899,#e11d48)',
  'from-amber-500 to-orange-600':   'linear-gradient(135deg,#f59e0b,#ea580c)',
};

export default function Projects() {
  const { t, isRTL } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<Category>('all');
  const [hovered, setHovered] = useState<number|null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.05 }
    );
    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const ar: React.CSSProperties = isRTL ? { fontFamily: 'Cairo, sans-serif' } : {};
  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);
  const labels: Record<Category,string> = {
    all: isRTL?'الكل':'All', web: isRTL?'تطبيقات ويب':'Web Apps',
    mobile: isRTL?'موبايل':'Mobile', design: isRTL?'تصميم':'Design',
  };

  return (
    <section id="projects" ref={ref} dir={isRTL ? 'rtl' : 'ltr'}
      style={{ padding:'96px 0', background:'var(--bg)', color:'var(--text)', position:'relative' }}>

      <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
        <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(99,102,241,0.1), transparent)',
          filter:'blur(100px)', bottom:'10%', left:'-5%' }} />
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', position:'relative' }}>

        <div className="reveal" style={{ textAlign:'center', marginBottom:8 }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: '1rem', fontWeight:1000, fontFamily: 'bold', letterSpacing: '0.05em',
            textTransform: 'uppercase', color: 'var(--primary)' }}>
            {t.projects.label}
          </span>
        </div>

        </div>
        <h2 className="reveal gradient-text" style={{
          textAlign:'center', marginBottom:12,
          fontFamily: isRTL ? 'Cairo, sans-serif' : 'Syne, sans-serif',
          fontWeight:800, fontSize:'clamp(1.8rem,4vw,3rem)',
        }}>{t.projects.title}</h2>
        <p className="reveal" style={{ textAlign:'center', marginBottom:40,
          color:'var(--text-muted)', ...ar }}>{t.projects.subtitle}</p>

        {/* Filters */}
        <div className="reveal" style={{ display:'flex', flexWrap:'wrap',
          justifyContent:'center', gap:10, marginBottom:48 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} style={{
              padding:'8px 22px', borderRadius:999, fontSize:'0.85rem',
              fontWeight:600, cursor:'pointer', transition:'all 0.2s', ...ar,
              background: filter===cat ? 'var(--gradient)' : 'var(--surface)',
              color: filter===cat ? '#fff' : 'var(--text-muted)',
              border: `1px solid ${filter===cat ? 'transparent' : 'var(--border)'}`,
            }}>{labels[cat]}</button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:20 }}>
          {filtered.map((p, i) => (
            <div key={p.id} className="reveal"
              style={{
                borderRadius:20, overflow:'hidden',
                background:'var(--surface)', border:'1px solid var(--border)',
                transition:'transform 0.25s, box-shadow 0.25s',
                animationDelay:`${i*0.07}s`,
                transform: hovered===p.id ? 'translateY(-6px)' : 'translateY(0)',
                boxShadow: hovered===p.id ? '0 16px 40px rgba(0,0,0,0.12)' : 'none',
              }}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Image */}
              <div style={{ height:180, position:'relative',
                background: projectColors[p.color] || 'linear-gradient(135deg,#6366f1,#a855f7)',
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:48, position:'relative', zIndex:1 }}>
                  {p.category==='web'?'🌐':p.category==='mobile'?'📱':'🎨'}
                </span>
                {/* hover overlay */}
                <div style={{
                  position:'absolute', inset:0, display:'flex',
                  alignItems:'center', justifyContent:'center', gap:12,
                  background:'rgba(0,0,0,0.55)',
                  opacity: hovered===p.id ? 1 : 0,
                  transition:'opacity 0.2s', zIndex:2,
                }}>
                  <a href={p.live} target="_blank" rel="noopener noreferrer"
                    style={{ width:40, height:40, borderRadius:'50%', background:'#fff',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      textDecoration:'none', color:'#111' }}>
                    <ExternalLink size={16}/>
                  </a>
                  <a href={p.github} target="_blank" rel="noopener noreferrer"
                    style={{ width:40, height:40, borderRadius:'50%', background:'#fff',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      textDecoration:'none', color:'#111' }}>
                    <Github size={16}/>
                  </a>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding:'20px 22px 22px' }}>
                <h3 style={{ fontFamily: isRTL?'Cairo, sans-serif':'Syne, sans-serif',
                  fontWeight:700, fontSize:'1.05rem', marginBottom:8, color:'var(--text)' }}>
                  {isRTL ? p.titleAr : p.title}
                </h3>
                <p style={{ fontSize:'0.85rem', lineHeight:1.7, color:'var(--text-muted)',
                  marginBottom:14, ...ar }}>
                  {isRTL ? p.descriptionAr : p.description}
                </p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
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
            </div>
          ))}
        </div>

        <div className="reveal" style={{ marginTop:48, textAlign:'center' }}>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"
            style={{ display:'inline-flex', alignItems:'center', gap:8,
              padding:'12px 28px', borderRadius:999, fontWeight:600,
              background:'var(--surface)', border:'1px solid var(--border)',
              color:'var(--text)', textDecoration:'none', transition:'transform 0.2s', ...ar }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.transform='scale(1.05)'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.transform='scale(1)'}>
            {t.projects.view_all} <ArrowRight size={15}/>
          </a>
        </div>
      </div>
    </section>
  );
}