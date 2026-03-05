import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Mail, MapPin, Github, Linkedin, Twitter, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const { t, isRTL } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
    }, { threshold: 0.1 });
    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate sending – integrate EmailJS or your own API here
    await new Promise(r => setTimeout(r, 1500));
    setStatus('success');
    setTimeout(() => { setStatus('idle'); setForm({ name: '', email: '', subject: '', message: '' }); }, 4000);
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-primary-400 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]`;
  const inputStyle = {
    background: 'var(--surface)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
    fontFamily: isRTL ? 'Cairo, sans-serif' : undefined,
  };

  return (
    <section id="contact" ref={ref} className="py-32 relative" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* bg decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full opacity-10 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)', top: '0', right: '20%' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="reveal text-center mb-4">
          <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
            {t.contact.label}
          </span>
        </div>
        <h2 className="reveal font-display font-bold text-4xl md:text-5xl text-center mb-4 gradient-text"
          style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Syne, sans-serif' }}>
          {t.contact.title}
        </h2>
        <p className="reveal text-center mb-16 max-w-xl mx-auto"
          style={{ color: 'var(--text-muted)', fontFamily: isRTL ? 'Cairo, sans-serif' : undefined }}>
          {t.contact.subtitle}
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          {/* Left: Info */}
          <div className="reveal space-y-6">
            <h3 className="font-display font-bold text-2xl"
              style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Syne, sans-serif' }}>
              {t.contact.or_reach}
            </h3>

            {[
              { icon: Mail, label: 'Email', value: 'hello@ahmed.dev', href: 'mailto:hello@ahmed.dev' },
              { icon: MapPin, label: t.contact.location_label, value: t.contact.location, href: '#' },
            ].map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href}
                className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl glass border flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ borderColor: 'var(--border)' }}>
                  <Icon size={20} style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: isRTL ? 'Cairo, sans-serif' : undefined }}>{label}</div>
                  <div className="font-medium" style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : undefined }}>{value}</div>
                </div>
              </a>
            ))}

            {/* Response time */}
            <div className="flex items-center gap-3 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
              <span className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: isRTL ? 'Cairo, sans-serif' : undefined }}>
                {t.contact.response_time}
              </span>
            </div>

            {/* Socials */}
            <div className="flex gap-3 pt-2">
              {[
                { icon: Github, href: 'https://github.com', label: 'GitHub' },
                { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className="w-11 h-11 rounded-full glass border flex items-center justify-center hover:scale-110 hover:border-primary-400 transition-all"
                  style={{ borderColor: 'var(--border)' }}>
                  <Icon size={18} style={{ color: 'var(--text-muted)' }} />
                </a>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="reveal">
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 border space-y-5"
              style={{ borderColor: 'var(--border)' }}>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: 'var(--text-muted)',
                    fontFamily: isRTL ? 'Cairo, sans-serif' : undefined }}>
                    {t.contact.name}
                  </label>
                  <input type="text" required value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder={t.contact.name}
                    className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: 'var(--text-muted)',
                    fontFamily: isRTL ? 'Cairo, sans-serif' : undefined }}>
                    {t.contact.email}
                  </label>
                  <input type="email" required value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder={t.contact.email}
                    className={inputClass} style={inputStyle} dir="ltr" />
                </div>
              </div>

              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-muted)',
                  fontFamily: isRTL ? 'Cairo, sans-serif' : undefined }}>
                  {t.contact.subject}
                </label>
                <input type="text" required value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  placeholder={t.contact.subject}
                  className={inputClass} style={inputStyle} />
              </div>

              <div>
                <label className="block text-xs mb-1.5" style={{ color: 'var(--text-muted)',
                  fontFamily: isRTL ? 'Cairo, sans-serif' : undefined }}>
                  {t.contact.message}
                </label>
                <textarea required rows={5} value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder={t.contact.message}
                  className={inputClass + ' resize-none'} style={inputStyle} />
              </div>

              <button type="submit" disabled={status === 'sending' || status === 'success'}
                className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-lg transition-all disabled:opacity-70 disabled:scale-100"
                style={{ background: status === 'success' ? 'linear-gradient(135deg,#10b981,#059669)' : 'var(--gradient)',
                  fontFamily: isRTL ? 'Cairo, sans-serif' : undefined }}>
                {status === 'success'
                  ? <><CheckCircle size={18} /> {t.contact.success}</>
                  : status === 'sending'
                  ? <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> {t.contact.sending}</>
                  : <><Send size={18} /> {t.contact.send}</>
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}