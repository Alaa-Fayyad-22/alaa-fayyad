import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Download, Code2, Palette, Zap, Package, View, Eye } from 'lucide-react';

/** Subtle count-up that runs once when scrolled into view (respects reduced motion). */
function CountUp({ end, duration = 1100 }: { end: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduce = typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setVal(end); return; }

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(eased * end));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(node);
    return () => io.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{val}</span>;
}

export default function About({ bare = false }: { bare?: boolean } = {}) {
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

  const ar: React.CSSProperties = isRTL ? { fontFamily: 'var(--font-arabic), sans-serif' } : {};

  const facts = [
    { icon: Code2,    title: t.about.fact1_title, desc: t.about.fact1_desc, color: '#3b82f6' },
    { icon: Palette,  title: t.about.fact2_title, desc: t.about.fact2_desc, color: '#a855f7' },
    { icon: Zap,      title: t.about.fact3_title, desc: t.about.fact3_desc, color: '#f59e0b' },
    { icon: Package,  title: t.about.fact4_title, desc: t.about.fact4_desc, color: '#10b981' },
  ];

  return (
    <section id={bare ? undefined : 'about'} ref={ref} dir={isRTL ? 'rtl' : 'ltr'}
      style={{ padding: bare ? '8px 0 40px' : '96px 0', background: 'transparent', color: 'var(--text)',
        position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--glow-soft), transparent 70%)',
          filter: 'blur(90px)', top: '6%', left: '-6%' }} />
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative' }}>

        {/* Bio + Avatar row (asymmetric) */}
        <div className="about-grid" style={{ display: 'grid',
          gap: 64, alignItems: 'center', marginBottom: 64 }}>

          {/* Stats panel (replaces the avatar circle) */}
          <div className="reveal" style={{ display: 'flex' }}>
            <div className="glass" style={{
              width: '100%', borderRadius: 24, padding: '40px 24px',
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              alignItems: 'center', gap: 4 }}>
              {[
                { value: 3,  plus: true,  label: isRTL ? 'سنوات خبرة' : 'years experience' },
                { value: 10, plus: true,  label: isRTL ? 'تقنية' : 'technologies' },
                { value: 2,  plus: false, label: isRTL ? 'تخصّصان' : 'disciplines',
                  sub: isRTL ? 'تطوير + تصميم' : 'dev + design' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '4px 8px',
                  borderInlineStart: i > 0 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ fontFamily: "var(--font-body), sans-serif", fontWeight: 800,
                    fontSize: 'clamp(1.9rem, 5vw, 2.9rem)', lineHeight: 1,
                    letterSpacing: '-0.03em', color: 'var(--text)',
                    display: 'inline-flex', alignItems: 'baseline' }}>
                    <CountUp end={s.value} />
                    {s.plus && <span style={{ color: 'var(--primary)' }}>+</span>}
                  </div>
                  <div style={{ marginTop: 12, fontSize: '0.8rem', fontWeight: 600,
                    color: 'var(--text-muted)', ...ar }}>
                    {s.label}
                  </div>
                  {s.sub && (
                    <div style={{ marginTop: 4, fontSize: '0.68rem',
                      color: 'var(--text-muted)', opacity: 0.72, ...ar }}>
                      {s.sub}
                    </div>
                  )}
                </div>
              ))}
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
            <div style={{ marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {/* View button */}
              <a href="/Alaa_Fayyad_CV.pdf" target="_blank" rel="noopener noreferrer"
                className="btn-outline" style={{ ...ar, width: 'fit-content' }}>
                <Eye size={16} />
                {isRTL ? 'عرض السيرة الذاتية' : 'View CV'}
              </a>
              {/* Download button */}
              <a href="/Alaa_Fayyad_CV.pdf" download className="btn-primary" style={{ ...ar, width: 'fit-content' }}>
                <Download size={16} />
                {t.about.download_cv}
              </a>
            </div>
          </div>
        </div>

        {/* Fact cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 16 }}>
          {facts.map(({ icon: Icon, title, desc, color }, i) => (
            <div key={i} className="reveal glass" style={{
              padding: '24px', borderRadius: 20,
              transition: 'transform 0.2s ease, box-shadow 0.25s ease, border-color 0.2s ease',
              animationDelay: `${i * 0.08}s`,
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
              <div style={{ width: 44, height: 44, borderRadius: 12, marginBottom: 14,
                background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={color} />
              </div>
              <h3 style={{ fontFamily: isRTL ? 'var(--font-arabic), sans-serif' : "var(--font-mono), monospace",
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