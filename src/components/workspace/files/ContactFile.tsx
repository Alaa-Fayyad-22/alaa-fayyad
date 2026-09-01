import { useState } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { logEvent } from '../../../lib/track';
import styles from '../workspace.module.css';
import { CodeBlock, Kw, Fn, Str, Cm } from '../Code';

type Mode = 'message' | 'quote';
type Status = 'idle' | 'sending' | 'success' | 'error';

/**
 * contact.ts — the real contact section, restyled to sit inside a file-pane.
 * Submits to the existing `/api/contact` and `/api/quote` routes with the same
 * body shapes and status state machine as `Contact.tsx` (BotID protection is
 * registered globally for those endpoints in instrumentation-client.ts, so it
 * still applies here). This is the sibling of `Contact.tsx` used by `/classic`.
 */
export default function ContactFile() {
  const { t, isRTL } = useTranslation();
  const [mode, setMode] = useState<Mode>('message');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [quote, setQuote] = useState({
    name: '', email: '', projectType: '', budget: '', timeline: '', details: '',
  });
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const endpoint = mode === 'message' ? '/api/contact' : '/api/quote';
      const body = mode === 'message' ? form : quote;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      logEvent('contact_submit', { form: mode });
      setTimeout(() => {
        setStatus('idle');
        setForm({ name: '', email: '', subject: '', message: '' });
        setQuote({ name: '', email: '', projectType: '', budget: '', timeline: '', details: '' });
      }, 4000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const L = {
    name: t.contact.name,
    email: t.contact.email,
    subject: t.contact.subject,
    message: t.contact.message,
    projectType: isRTL ? 'نوع المشروع' : 'Project type',
    budget: isRTL ? 'الميزانية' : 'Budget',
    timeline: isRTL ? 'الجدول الزمني' : 'Timeline',
    details: isRTL ? 'تفاصيل المشروع' : 'Project details',
  };

  const busy = status === 'sending' || status === 'success';

  return (
    <>
      <CodeBlock
        lines={[
          <>
            <Kw>async function</Kw> <Fn>sayHello</Fn>() {'{'}
          </>,
          <>
            &nbsp;&nbsp;<Cm>{`// ${t.workspace.contactComment}`}</Cm>
          </>,
          <>
            &nbsp;&nbsp;<Kw>return</Kw> <Fn>fetch</Fn>(<Str>&apos;/api/contact&apos;</Str>);
          </>,
          <>{'}'}</>,
        ]}
      />

      <div className={styles.headline}>{t.contact.title}</div>
      <p className={styles.proseText}>{t.contact.subtitle}</p>

      <div className={styles.segmented}>
        <button
          type="button"
          aria-pressed={mode === 'message'}
          className={`${styles.segBtn} ${mode === 'message' ? styles.segBtnOn : ''}`}
          onClick={() => { setMode('message'); setStatus('idle'); }}
        >
          {t.contact.send}
        </button>
        <button
          type="button"
          aria-pressed={mode === 'quote'}
          className={`${styles.segBtn} ${mode === 'quote' ? styles.segBtnOn : ''}`}
          onClick={() => { setMode('quote'); setStatus('idle'); }}
        >
          {isRTL ? 'طلب عرض سعر' : 'Request a quote'}
        </button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {mode === 'message' ? (
          <>
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label htmlFor="wm-name">{L.name}</label>
                <input id="wm-name" className={styles.input} required
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label htmlFor="wm-email">{L.email}</label>
                <input id="wm-email" type="email" className={styles.input} required style={{ direction: 'ltr' }}
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="wm-subject">{L.subject}</label>
              <input id="wm-subject" className={styles.input} required
                value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label htmlFor="wm-message">{L.message}</label>
              <textarea id="wm-message" className={styles.textarea} required
                value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
          </>
        ) : (
          <>
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label htmlFor="wq-name">{L.name}</label>
                <input id="wq-name" className={styles.input} required
                  value={quote.name} onChange={(e) => setQuote({ ...quote, name: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label htmlFor="wq-email">{L.email}</label>
                <input id="wq-email" type="email" className={styles.input} required style={{ direction: 'ltr' }}
                  value={quote.email} onChange={(e) => setQuote({ ...quote, email: e.target.value })} />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label htmlFor="wq-type">{L.projectType}</label>
                <input id="wq-type" className={styles.input}
                  value={quote.projectType} onChange={(e) => setQuote({ ...quote, projectType: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label htmlFor="wq-budget">{L.budget}</label>
                <input id="wq-budget" className={styles.input}
                  value={quote.budget} onChange={(e) => setQuote({ ...quote, budget: e.target.value })} />
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="wq-timeline">{L.timeline}</label>
              <input id="wq-timeline" className={styles.input}
                value={quote.timeline} onChange={(e) => setQuote({ ...quote, timeline: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label htmlFor="wq-details">{L.details}</label>
              <textarea id="wq-details" className={styles.textarea} required
                value={quote.details} onChange={(e) => setQuote({ ...quote, details: e.target.value })} />
            </div>
          </>
        )}

        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={busy}>
          {status === 'success'
            ? t.contact.success
            : status === 'sending'
              ? t.contact.sending
              : t.contact.send}
        </button>

        {status === 'error' && (
          <p className={`${styles.formStatus} ${styles.formStatusErr}`}>{t.contact.error}</p>
        )}
        {status === 'success' && (
          <p className={`${styles.formStatus} ${styles.formStatusOk}`}>{t.contact.success}</p>
        )}
      </form>

      <div className={styles.btnRow}>
        <a className={styles.btn} href="/Alaa_Fayyad_CV.pdf" target="_blank" rel="noopener noreferrer">
          {t.nav.resume}
        </a>
        <a className={styles.btn} href="mailto:alaafayyadp1@gmail.com">
          alaafayyadp1@gmail.com
        </a>
      </div>
    </>
  );
}
