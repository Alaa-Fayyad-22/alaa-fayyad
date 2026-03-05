import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { projects } from '../data/portfolio';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';

const categories = ['all', 'web', 'mobile', 'design'] as const;
type Category = typeof categories[number];

export default function Projects() {
  const { t, isRTL } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<Category>('all');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
    }, { threshold: 0.05 });
    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  const filterLabels: Record<Category, string> = {
    all: isRTL ? 'الكل' : 'All',
    web: isRTL ? 'تطبيقات ويب' : 'Web Apps',
    mobile: isRTL ? 'موبايل' : 'Mobile',
    design: isRTL ? 'تصميم' : 'Design',
  };

  return (
    <section id="projects" ref={ref} className="py-32 relative" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* bg glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full opacity-10 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)', bottom: '10%', left: '-5%' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="reveal text-center mb-4">
          <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
            {t.projects.label}
          </span>
        </div>
        <h2 className="reveal font-display font-bold text-4xl md:text-5xl text-center mb-4 gradient-text"
          style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Syne, sans-serif' }}>
          {t.projects.title}
        </h2>
        <p className="reveal text-center mb-10 max-w-xl mx-auto"
          style={{ color: 'var(--text-muted)', fontFamily: isRTL ? 'Cairo, sans-serif' : undefined }}>
          {t.projects.subtitle}
        </p>

        {/* Filters */}
        <div className="reveal flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveFilter(cat)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                fontFamily: isRTL ? 'Cairo, sans-serif' : undefined,
                background: activeFilter === cat ? 'var(--gradient)' : 'transparent',
                color: activeFilter === cat ? 'white' : 'var(--text-muted)',
                border: `1px solid ${activeFilter === cat ? 'transparent' : 'var(--border)'}`,
              }}>
              {filterLabels[cat]}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <div key={project.id}
              className="reveal glass rounded-2xl overflow-hidden border hover:scale-[1.02] transition-all duration-300 group"
              style={{ borderColor: 'var(--border)', animationDelay: `${i * 0.08}s` }}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}>

              {/* Project image / gradient placeholder */}
              <div className={`relative h-48 bg-gradient-to-br ${project.color} flex items-center justify-center overflow-hidden`}>
                <div className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, white 0%, transparent 60%)' }} />
                <span className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300">
                  {project.category === 'web' ? '🌐' : project.category === 'mobile' ? '📱' : '🎨'}
                </span>

                {/* Hover overlay */}
                <div className={`absolute inset-0 flex items-center justify-center gap-4 transition-all duration-300 ${
                  hoveredId === project.id ? 'opacity-100' : 'opacity-0'
                }`} style={{ background: 'rgba(0,0,0,0.6)' }}>
                  <a href={project.live} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                    <ExternalLink size={16} className="text-gray-900" />
                  </a>
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                    <Github size={16} className="text-gray-900" />
                  </a>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display font-bold text-xl mb-2"
                  style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Syne, sans-serif' }}>
                  {isRTL ? project.titleAr : project.title}
                </h3>
                <p className="text-sm leading-relaxed mb-4"
                  style={{ color: 'var(--text-muted)', fontFamily: isRTL ? 'Cairo, sans-serif' : undefined }}>
                  {isRTL ? project.descriptionAr : project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-mono"
                      style={{ background: 'var(--surface-2)', color: 'var(--primary)' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-4">
                  <a href={project.live} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium hover:opacity-100 transition-opacity group"
                    style={{ color: 'var(--primary)' }}>
                    <ExternalLink size={14} />
                    {t.projects.view_live}
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium transition-opacity"
                    style={{ color: 'var(--text-muted)' }}>
                    <Github size={14} />
                    {t.projects.view_code}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="reveal mt-12 text-center">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold glass border hover:scale-105 transition-all"
            style={{ borderColor: 'var(--border)', fontFamily: isRTL ? 'Cairo, sans-serif' : undefined }}>
            {t.projects.view_all}
            <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
          </a>
        </div>
      </div>
    </section>
  );
}