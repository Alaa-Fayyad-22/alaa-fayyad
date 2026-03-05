import { useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { skillCategories } from '../data/portfolio';

const techIcons: Record<string, string> = {
  'React / Next.js': '⚛️', 'TypeScript': '🔷', 'Tailwind CSS': '🎨', 'React Native': '📱',
  'Framer Motion': '✨', 'Node.js / Express': '🟢', 'Python / FastAPI': '🐍', 'REST APIs': '🔗',
  'GraphQL': '◈', 'WebSockets': '⚡', 'Figma': '🎯', 'UI/UX Design': '🖌️',
  'Design Systems': '🏗️', 'Prototyping': '🔮', 'Adobe XD': '🎭', 'PostgreSQL': '🐘',
  'MongoDB': '🍃', 'Redis': '🔴', 'AWS / Vercel': '☁️', 'Docker': '🐳',
};

export default function Skills() {
  const { t, isRTL } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          // Animate skill bars
          e.target.querySelectorAll('.skill-bar-fill').forEach((bar) => {
            bar.classList.add('animated');
          });
        }
      });
    }, { threshold: 0.1 });

    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const categoryLabels: Record<string, string> = {
    frontend: t.skills.frontend,
    backend: t.skills.backend,
    design: t.skills.design,
    databases: t.skills.databases,
  };

  const categoryColors: Record<string, string> = {
    frontend: 'from-violet-500 to-indigo-600',
    backend: 'from-emerald-500 to-teal-600',
    design: 'from-pink-500 to-rose-600',
    databases: 'from-orange-500 to-amber-600',
  };

  return (
    <section id="skills" ref={ref} className="py-32 relative" dir={isRTL ? 'rtl' : 'ltr'}
      style={{ background: 'var(--bg-secondary)' }}>

      {/* bg decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full opacity-10 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)', top: '20%', right: '-5%' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="reveal text-center mb-4">
          <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
            {t.skills.label}
          </span>
        </div>
        <h2 className="reveal font-display font-bold text-4xl md:text-5xl text-center mb-4 gradient-text"
          style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Syne, sans-serif' }}>
          {t.skills.title}
        </h2>
        <p className="reveal text-center mb-16 max-w-xl mx-auto"
          style={{ color: 'var(--text-muted)', fontFamily: isRTL ? 'Cairo, sans-serif' : undefined }}>
          {t.skills.subtitle}
        </p>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((cat, ci) => (
            <div key={cat.key} className="reveal glass rounded-2xl p-6 border"
              style={{ borderColor: 'var(--border)', animationDelay: `${ci * 0.1}s` }}>

              {/* Category header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-2 h-6 rounded-full bg-gradient-to-b ${categoryColors[cat.key]}`} />
                <h3 className="font-display font-bold text-lg"
                  style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Syne, sans-serif' }}>
                  {categoryLabels[cat.key]}
                </h3>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                {cat.skills.map((skill, si) => (
                  <div key={si}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{techIcons[skill.name] || '⚙️'}</span>
                        <span className="text-sm font-medium"
                          style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : undefined }}>
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                        {skill.level}%
                      </span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-bar-fill"
                        style={{ width: `${skill.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tech logo cloud */}
        <div className="reveal mt-16 text-center">
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)',
            fontFamily: isRTL ? 'Cairo, sans-serif' : undefined }}>
            {isRTL ? 'أعمل أيضاً مع' : 'Also working with'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Git', 'Linux', 'Nginx', 'CI/CD', 'Tailwind', 'Prisma', 'Zustand', 'React Query', 'Zod', 'Jest'].map(tech => (
              <span key={tech} className="px-4 py-2 rounded-full text-sm glass border"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}