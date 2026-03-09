import { useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { ArrowDown, Github, Linkedin, Twitter, Mail } from 'lucide-react';

const ROLES = ['role1', 'role2', 'role3', 'role4', 'role5'] as const;

export default function Hero() {
  const { t, isRTL } = useTranslation();
  const [roleIdx, setRoleIdx]     = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting]   = useState(false);
  const [mouse, setMouse]         = useState({ x: 0, y: 0 });

  /* Typewriter */
  useEffect(() => {
    const role = t.hero[ROLES[roleIdx]];
    let id: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < role.length)
      id = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 80);
    else if (!deleting && displayed.length === role.length)
      id = setTimeout(() => setDeleting(true), 2000);
    else if (deleting && displayed.length > 0)
      id = setTimeout(() => setDisplayed(role.slice(0, displayed.length - 1)), 40);
    else { setDeleting(false); setRoleIdx(i => (i + 1) % ROLES.length); }
    return () => clearTimeout(id);
  }, [displayed, deleting, roleIdx, t.hero]);

  /* Parallax */
  useEffect(() => {
    const fn = (e: MouseEvent) =>
      setMouse({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 });
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  const ar: React.CSSProperties = isRTL ? { fontFamily: 'Cairo, sans-serif' } : {};
  const stats = [
    { value: t.hero.years,          label: t.hero.years_label },
    { value: t.hero.projects_count, label: t.hero.projects_label },
    { value: t.hero.clients,        label: t.hero.clients_label },
  ];

  return (
    <section
      style={{ position: 'relative', minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.25), transparent)',
          filter: 'blur(100px)', top: '-10%', left: '-10%',
          transform: `translate(${mouse.x * 30}px,${mouse.y * 30}px)`,
          transition: 'transform 0.4s ease',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.2), transparent)',
          filter: 'blur(90px)', bottom: '10%', right: '5%',
          transform: `translate(${mouse.x * -20}px,${mouse.y * -20}px)`,
          transition: 'transform 0.5s ease',
        }} />
        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 900, width: '100%',
        margin: '0 auto', padding: '100px 24px 80px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', gap: 0,
      }}>

        {/* 1 — Available badge */}
        <div className="hero-item" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 999, marginBottom: 28,
          background: 'rgba(52,211,153,0.1)',
          border: '1px solid rgba(52,211,153,0.3)',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%',
            background: '#34d399', display: 'block',
            boxShadow: '0 0 8px rgba(52,211,153,0.6)' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#34d399', ...ar }}>
            {t.hero.available}
          </span>
        </div>

        {/* 2 — Greeting */}
        <p className="hero-item" style={{ fontSize: '1.1rem', marginBottom: 6,
          color: 'var(--text-muted)', ...ar }}>
          {t.hero.greeting}
        </p>

        {/* 3 — Name */}
        <h1 className="hero-item gradient-text" style={{
          fontFamily: isRTL ? 'Cairo, sans-serif' : 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(2.8rem, 10vw, 7rem)',
          lineHeight: 1.05, marginBottom: 16,
        }}>
          {t.hero.name}
        </h1>

        {/* 4 — Typewriter */}
        <div className="hero-item" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 4, height: 44, marginBottom: 24,
        }}>
          <span style={{ fontSize: 'clamp(1rem,3vw,1.5rem)', fontWeight: 600,
            color: 'var(--text-muted)', ...ar }}>
            {displayed}
          </span>
          <span className="animate-blink" style={{
            display: 'inline-block', width: 2, height: 28,
            background: 'var(--primary)', borderRadius: 2, marginLeft: 2,
          }} />
        </div>

        {/* 5 — Description */}
        <p className="hero-item" style={{
          maxWidth: 620, fontSize: '1.05rem', lineHeight: 1.8,
          color: 'var(--text-muted)', marginBottom: 40, ...ar,
        }}>
          {t.hero.description}
        </p>

        {/* 6 — CTA buttons */}
        <div className="hero-item" style={{
          display: 'flex', flexWrap: 'wrap', gap: 14,
          justifyContent: 'center', marginBottom: 56,
        }}>
          {/* <a href="#projects" className="btn-primary" style={{ ...ar }}>
            {t.hero.cta_work}
          </a> */}
          <a href="#contact" className="btn-outline" style={{ ...ar }}>
            {t.hero.cta_contact}
          </a>
        </div>

        {/* 7 — Stats */}
        {/* <div className="hero-item" style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
          gap: '16px 48px', marginBottom: 48,
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div className="gradient-text" style={{
                fontFamily: isRTL ? 'Cairo, sans-serif' : 'Syne, sans-serif',
                fontWeight: 800, fontSize: 'clamp(2rem,5vw,2.8rem)', lineHeight: 1,
              }}>{s.value}</div>
              <div style={{ fontSize: '0.82rem', marginTop: 4,
                color: 'var(--text-muted)', ...ar }}>{s.label}</div>
            </div>
          ))}
        </div> */}

        {/* 8 — Socials */}
        <div className="hero-item" style={{
          display: 'flex', gap: 12, justifyContent: 'center',
        }}>
          {([
            { Icon: Github,   href: 'http://github.com/Alaa-Fayyad-22',       label: 'GitHub'   },
            { Icon: Linkedin, href: 'https://www.linkedin.com/in/alaa-fayyad',     label: 'LinkedIn' },
            // { Icon: Twitter,  href: 'https://twitter.com',      label: 'Twitter'  },
            { Icon: Mail,     href: 'mailto:alaafayyadp1@gmail.com', label: 'Email'    },
          ] as const).map(({ Icon, href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              aria-label={label}
              style={{
                width: 42, height: 42, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                transition: 'transform 0.2s, border-color 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.12)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)';
              }}
            >
              <Icon size={17} />
            </a>
          ))}
        </div>

        {/* Scroll arrow */}
        <div className="animate-float" style={{ marginTop: 40 }}>
          <ArrowDown size={20} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>
    </section>
  );
}