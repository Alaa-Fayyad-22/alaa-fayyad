import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Mail, MapPin, Send, CheckCircle, FileText, Clock, DollarSign, Briefcase, AlertCircle } from 'lucide-react';
import { FaGithub, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

type Tab = 'message' | 'quote';

export default function Contact() {
  const { t, isRTL } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<Tab>('message');
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [quote, setQuote] = useState({ name:'', email:'', projectType:'', budget:'', timeline:'', details:'' });
  const [status, setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const endpoint = tab === 'message' ? '/api/contact' : '/api/quote';
      const body = tab === 'message' ? form : quote;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Failed');

      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setForm({ name:'', email:'', subject:'', message:'' });
        setQuote({ name:'', email:'', projectType:'', budget:'', timeline:'', details:'' });
      }, 4000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const ar: React.CSSProperties = isRTL ? { fontFamily: 'Cairo, sans-serif' } : {};

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    border: '1px solid var(--border)', outline: 'none',
    background: 'var(--bg)', color: 'var(--text)',
    fontSize: '0.9rem', transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box', ...ar,
  };

  const projectTypes = isRTL
    ? ['موقع ويب','تطبيق موبايل','لوحة تحكم','متجر إلكتروني','تصميم UI/UX','أخرى']
    : ['Web App','Mobile App','Dashboard','E-commerce','UI/UX Design','Other'];

  const budgets = isRTL
    ? ['أقل من $500','$500 - $1,000','$1,000 - $3,000','$3,000 - $5,000','أكثر من $5,000']
    : ['Under $500','$500 - $1,000','$1,000 - $3,000','$3,000 - $5,000','$5,000+'];

  const timelines = isRTL
    ? ['أقل من أسبوعين','شهر','1-3 أشهر','3-6 أشهر','مرن']
    : ['Under 2 weeks','1 month','1-3 months','3-6 months','Flexible'];

  return (
    <section id="contact" ref={ref} dir={isRTL ? 'rtl' : 'ltr'}
      style={{ padding: '96px 0', background: 'var(--bg)', color: 'var(--text)', position: 'relative' }}>

      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.1), transparent)',
          filter: 'blur(100px)', top: 0, right: '20%' }} />
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', position: 'relative' }}>

        {/* Header */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--primary)', fontFamily: 'monospace' }}>
            {t.contact.label}
          </span>
        </div>
        <h2 className="reveal gradient-text" style={{
          textAlign: 'center', marginBottom: 12,
          fontFamily: isRTL ? 'Cairo, sans-serif' : 'Syne, sans-serif',
          fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,3rem)',
        }}>{t.contact.title}</h2>
        <p className="reveal" style={{ textAlign: 'center', marginBottom: 48,
          color: 'var(--text-muted)', ...ar }}>{t.contact.subtitle}</p>

        {/* Tab switcher */}
        <div className="reveal" style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', borderRadius: 14,
            background: 'var(--surface)', border: '1px solid var(--border)', padding: 4, gap: 4 }}>
            {([
              { key: 'message', icon: Mail,     label: isRTL ? 'رسالة' : 'Send Message' },
              { key: 'quote',   icon: FileText,  label: isRTL ? 'طلب عرض سعر' : 'Request a Quote' },
            ] as const).map(({ key, icon: Icon, label }) => (
              <button key={key} onClick={() => { setTab(key); setStatus('idle'); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 22px', borderRadius: 10, border: 'none',
                  cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
                  transition: 'all 0.2s', ...ar,
                  background: tab === key ? 'var(--gradient)' : 'transparent',
                  color: tab === key ? '#fff' : 'var(--text-muted)',
                }}>
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 48 }}>

          {/* Info column */}
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <h3 style={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'Syne, sans-serif',
              fontWeight: 700, fontSize: '1.3rem', color: 'var(--text)', ...ar }}>
              {t.contact.or_reach}
            </h3>

            {[
              { icon: Mail,   label: 'Email', value: 'alaafayyadp1@gmail.com', href: 'mailto:alaafayyadp1@gmail.com' },
              { icon: MapPin, label: t.contact.location_label, value: t.contact.location, href: '#' },
            ].map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href} style={{ display: 'flex', alignItems: 'center',
                gap: 14, textDecoration: 'none' }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color="var(--primary)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 2, ...ar }}>{label}</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text)', ...ar }}>{value}</div>
                </div>
              </a>
            ))}

            {tab === 'quote' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                {[
                  { icon: Clock,      text: isRTL ? 'رد خلال 24 ساعة' : 'Response within 24h' },
                  { icon: DollarSign, text: isRTL ? 'أسعار تنافسية' : 'Competitive pricing' },
                  { icon: Briefcase,  text: isRTL ? 'خبرة 3+ سنوات' : '3+ years experience' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: 'rgba(99,102,241,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={15} color="var(--primary)" />
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', ...ar }}>{text}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399',
                boxShadow: '0 0 8px rgba(52,211,153,0.5)', display: 'block', flexShrink: 0 }} />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', ...ar }}>
                {t.contact.response_time}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { Icon: FaWhatsapp, href: 'https://wa.me/9613748496', label: 'WhatsApp' },
                { Icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
                { Icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                { Icon: FaGithub, href: 'https://github.com', label: 'GitHub' },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  style={{ width: 42, height: 42, borderRadius: '50%',
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none', color: 'var(--text-muted)', transition: 'transform 0.2s, color 0.2s' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.1)';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--primary)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)';
                  }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Form column */}
          <div className="reveal">
            <form onSubmit={handleSubmit} style={{
              background: 'var(--surface)', borderRadius: 20,
              border: '1px solid var(--border)', padding: '32px',
              display: 'flex', flexDirection: 'column', gap: 18,
            }}>

              {tab === 'message' ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {[
                      { key:'name',  label: t.contact.name,  type:'text'  },
                      { key:'email', label: t.contact.email, type:'email' },
                    ].map(({ key, label, type }) => (
                      <div key={key}>
                        <label style={{ display:'block', fontSize:'0.75rem', marginBottom:6,
                          color:'var(--text-muted)', ...ar }}>{label}</label>
                        <input type={type} required placeholder={label}
                          value={form[key as keyof typeof form]}
                          onChange={e => setForm({ ...form, [key]: e.target.value })}
                          style={{ ...inputStyle, ...(key==='email' ? { direction:'ltr' } : {}) }}
                          onFocus={e => { e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.boxShadow='0 0 0 3px rgba(99,102,241,0.15)'; }}
                          onBlur={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='none'; }}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:'0.75rem', marginBottom:6,
                      color:'var(--text-muted)', ...ar }}>{t.contact.subject}</label>
                    <input type="text" required placeholder={t.contact.subject}
                      value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                      style={inputStyle}
                      onFocus={e => { e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.boxShadow='0 0 0 3px rgba(99,102,241,0.15)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='none'; }}
                    />
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:'0.75rem', marginBottom:6,
                      color:'var(--text-muted)', ...ar }}>{t.contact.message}</label>
                    <textarea required rows={5} placeholder={t.contact.message}
                      value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      style={{ ...inputStyle, resize:'none' }}
                      onFocus={e => { e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.boxShadow='0 0 0 3px rgba(99,102,241,0.15)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='none'; }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {[
                      { key:'name',  label: isRTL ? 'الاسم' : 'Your Name', type:'text' },
                      { key:'email', label: isRTL ? 'البريد الإلكتروني' : 'Email', type:'email' },
                    ].map(({ key, label, type }) => (
                      <div key={key}>
                        <label style={{ display:'block', fontSize:'0.75rem', marginBottom:6,
                          color:'var(--text-muted)', ...ar }}>{label}</label>
                        <input type={type} required placeholder={label}
                          value={quote[key as keyof typeof quote]}
                          onChange={e => setQuote({ ...quote, [key]: e.target.value })}
                          style={{ ...inputStyle, ...(key==='email' ? { direction:'ltr' } : {}) }}
                          onFocus={e => { e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.boxShadow='0 0 0 3px rgba(99,102,241,0.15)'; }}
                          onBlur={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='none'; }}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label style={{ display:'block', fontSize:'0.75rem', marginBottom:8, color:'var(--text-muted)', ...ar }}>
                      {isRTL ? 'نوع المشروع' : 'Project Type'}
                    </label>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                      {projectTypes.map(pt => (
                        <button key={pt} type="button" onClick={() => setQuote({ ...quote, projectType: pt })}
                          style={{
                            padding:'7px 14px', borderRadius:999, fontSize:'0.8rem',
                            fontWeight:500, cursor:'pointer', transition:'all 0.15s', ...ar,
                            background: quote.projectType===pt ? 'var(--gradient)' : 'var(--bg)',
                            color: quote.projectType===pt ? '#fff' : 'var(--text-muted)',
                            border: `1px solid ${quote.projectType===pt ? 'transparent' : 'var(--border)'}`,
                          }}>{pt}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display:'block', fontSize:'0.75rem', marginBottom:8, color:'var(--text-muted)', ...ar }}>
                      {isRTL ? 'الميزانية' : 'Budget Range'}
                    </label>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                      {budgets.map(b => (
                        <button key={b} type="button" onClick={() => setQuote({ ...quote, budget: b })}
                          style={{
                            padding:'7px 14px', borderRadius:999, fontSize:'0.8rem',
                            fontWeight:500, cursor:'pointer', transition:'all 0.15s',
                            background: quote.budget===b ? 'var(--gradient)' : 'var(--bg)',
                            color: quote.budget===b ? '#fff' : 'var(--text-muted)',
                            border: `1px solid ${quote.budget===b ? 'transparent' : 'var(--border)'}`,
                          }}>{b}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display:'block', fontSize:'0.75rem', marginBottom:8, color:'var(--text-muted)', ...ar }}>
                      {isRTL ? 'الجدول الزمني' : 'Timeline'}
                    </label>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                      {timelines.map(tl => (
                        <button key={tl} type="button" onClick={() => setQuote({ ...quote, timeline: tl })}
                          style={{
                            padding:'7px 14px', borderRadius:999, fontSize:'0.8rem',
                            fontWeight:500, cursor:'pointer', transition:'all 0.15s', ...ar,
                            background: quote.timeline===tl ? 'var(--gradient)' : 'var(--bg)',
                            color: quote.timeline===tl ? '#fff' : 'var(--text-muted)',
                            border: `1px solid ${quote.timeline===tl ? 'transparent' : 'var(--border)'}`,
                          }}>{tl}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display:'block', fontSize:'0.75rem', marginBottom:6, color:'var(--text-muted)', ...ar }}>
                      {isRTL ? 'تفاصيل المشروع' : 'Project Details'}
                    </label>
                    <textarea required rows={4}
                      placeholder={isRTL ? 'اشرح مشروعك بالتفصيل...' : 'Describe your project in detail...'}
                      value={quote.details} onChange={e => setQuote({ ...quote, details: e.target.value })}
                      style={{ ...inputStyle, resize:'none' }}
                      onFocus={e => { e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.boxShadow='0 0 0 3px rgba(99,102,241,0.15)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='none'; }}
                    />
                  </div>
                </>
              )}

              {/* Error message */}
              {status === 'error' && (
                <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 16px',
                  borderRadius:10, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)' }}>
                  <AlertCircle size={16} color="#ef4444" />
                  <span style={{ fontSize:'0.85rem', color:'#ef4444', ...ar }}>
                    {isRTL ? 'فشل الإرسال. حاول مجدداً.' : 'Failed to send. Please try again.'}
                  </span>
                </div>
              )}

              <button type="submit" disabled={status==='sending'||status==='success'}
                style={{
                  width:'100%', padding:'14px', borderRadius:12, border:'none',
                  cursor: status==='sending'||status==='success' ? 'not-allowed' : 'pointer',
                  background: status==='success' ? 'linear-gradient(135deg,#10b981,#059669)' : 'var(--gradient)',
                  color:'#fff', fontWeight:600, fontSize:'0.95rem',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  opacity: status==='sending' ? 0.8 : 1, transition:'all 0.2s', ...ar,
                }}>
                {status==='success'
                  ? <><CheckCircle size={17}/> {isRTL ? 'تم الإرسال!' : 'Sent Successfully!'}</>
                  : status==='sending'
                  ? <>{isRTL ? 'جاري الإرسال...' : 'Sending...'}</>
                  : tab==='quote'
                  ? <><FileText size={17}/> {isRTL ? 'طلب عرض السعر' : 'Request Quote'}</>
                  : <><Send size={17}/> {t.contact.send}</>
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}