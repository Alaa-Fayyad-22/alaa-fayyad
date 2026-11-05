import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { logEvent } from '../../lib/track';
import styles from './home.module.css';
import { cx } from '../workspace/cx';
import { useReveal } from './useReveal';

type Mode = 'message' | 'quote';
type Status = 'idle' | 'sending' | 'success' | 'error';

const EMPTY_MESSAGE = { name: '', email: '', subject: '', message: '' };
const EMPTY_QUOTE = { name: '', email: '', projectType: '', budget: '', timeline: '', details: '' };

// Same destinations as the existing Contact.tsx / ContactFile.tsx.
const SOCIALS = [
  { label: 'WhatsApp', href: 'https://wa.me/9613748496' },
  { label: 'GitHub', href: 'https://github.com/Alaa-Fayyad-22' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alaa-fayyad' },
];

/**
 * Contact copy + the two-mode form. It posts to the existing /api/contact and
 * /api/quote routes with exactly the payloads the classic forms send (BotID
 * protects those routes globally, so plain fetch is all that is needed), and
 * keeps the same idle/sending/success/error state machine. Only anonymous
 * events are logged — never field contents.
 */
export default function ContactSection() {
  const { t } = useTranslation();
  const c = t.home.contact;
  const [mode, setMode] = useState<Mode>('message');
  const [form, setForm] = useState(EMPTY_MESSAGE);
  const [quote, setQuote] = useState(EMPTY_QUOTE);
  const [status, setStatus] = useState<Status>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copyRef, copyShown] = useReveal<HTMLDivElement>();
  const [formRef, formShown] = useReveal<HTMLFormElement>();

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  const switchMode = (next: Mode) => {
    if (next !== mode) logEvent('contact_tab_switch', { form: next });
    setMode(next);
    setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(mode === 'message' ? '/api/contact' : '/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'message' ? form : quote),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      // Anonymous: which form succeeded — never the name/email/message content.
      logEvent('contact_submit', { form: mode });
      resetTimer.current = setTimeout(() => {
        setStatus('idle');
        setForm(EMPTY_MESSAGE);
        setQuote(EMPTY_QUOTE);
      }, 4000);
    } catch {
      setStatus('error');
      resetTimer.current = setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const busy = status === 'sending' || status === 'success';
  const label =
    status === 'success' ? c.sent : status === 'sending' ? c.sending : mode === 'quote' ? c.sendQuote : c.sendMessage;

  const select = (id: string, text: string, value: string, options: string[], onChange: (v: string) => void) => (
    <label className={styles.field} htmlFor={id}>
      <span>{text}</span>
      <select id={id} name={id} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{c.choose}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <section id="contact">
      <div className={cx(styles.wrap, styles.contactGrid)}>
        <div ref={copyRef} className={cx(styles.copy, styles.rv, copyShown && styles.rvIn)}>
          <span className={cx(styles.eyebrow, styles.eyebrowLive)}>{c.eyebrow}</span>
          <h2 className={styles.contactTitle}>
            <span>{c.title1}</span>
            <br />
            <span className={styles.dim}>{c.title2}</span>
          </h2>
          <p>{c.copy}</p>
          <div className={styles.socials}>
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <form
          ref={formRef}
          className={cx(styles.form, styles.rv, formShown && styles.rvIn)}
          onSubmit={handleSubmit}
        >
          <div className={styles.tabs} role="tablist" aria-label={c.tabsAria}>
            <button type="button" role="tab" aria-selected={mode === 'message'} onClick={() => switchMode('message')}>
              {c.tabMessage}
            </button>
            <button type="button" role="tab" aria-selected={mode === 'quote'} onClick={() => switchMode('quote')}>
              {c.tabQuote}
            </button>
          </div>

          {mode === 'message' ? (
            <>
              <div className={styles.row2}>
                <label className={styles.field} htmlFor="home-name">
                  <span>{c.name}</span>
                  <input id="home-name" name="name" type="text" autoComplete="name" required
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </label>
                <label className={styles.field} htmlFor="home-email">
                  <span>{c.email}</span>
                  <input id="home-email" name="email" type="email" autoComplete="email" required style={{ direction: 'ltr' }}
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </label>
              </div>
              <label className={styles.field} htmlFor="home-subject">
                <span>{c.subject}</span>
                <input id="home-subject" name="subject" type="text" required
                  value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </label>
              <label className={styles.field} htmlFor="home-message">
                <span>{c.message}</span>
                <textarea id="home-message" name="message" rows={5} required
                  value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </label>
            </>
          ) : (
            <>
              <div className={styles.row2}>
                <label className={styles.field} htmlFor="home-q-name">
                  <span>{c.name}</span>
                  <input id="home-q-name" name="name" type="text" autoComplete="name" required
                    value={quote.name} onChange={(e) => setQuote({ ...quote, name: e.target.value })} />
                </label>
                <label className={styles.field} htmlFor="home-q-email">
                  <span>{c.email}</span>
                  <input id="home-q-email" name="email" type="email" autoComplete="email" required style={{ direction: 'ltr' }}
                    value={quote.email} onChange={(e) => setQuote({ ...quote, email: e.target.value })} />
                </label>
              </div>
              <div className={styles.row2}>
                {select('home-q-type', c.projectType, quote.projectType, c.projectTypes, (v) => setQuote({ ...quote, projectType: v }))}
                {select('home-q-budget', c.budget, quote.budget, c.budgets, (v) => setQuote({ ...quote, budget: v }))}
              </div>
              {select('home-q-timeline', c.timeline, quote.timeline, c.timelines, (v) => setQuote({ ...quote, timeline: v }))}
              <label className={styles.field} htmlFor="home-q-details">
                <span>{c.message}</span>
                <textarea id="home-q-details" name="details" rows={5} required
                  value={quote.details} onChange={(e) => setQuote({ ...quote, details: e.target.value })} />
              </label>
            </>
          )}

          <button type="submit" className={styles.send} disabled={busy}>
            <span>{label}</span>
            <span className={styles.sendArr} aria-hidden="true">→</span>
          </button>
          <span className={cx(styles.note, status === 'error' && styles.noteErr)} role="status">
            {status === 'error' ? c.error : ''}
          </span>
        </form>
      </div>
    </section>
  );
}
