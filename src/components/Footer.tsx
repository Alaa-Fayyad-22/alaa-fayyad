import { useTranslation } from '../hooks/useTranslation';
import { Heart, ArrowUp } from 'lucide-react';

export default function Footer() {
  const { t, isRTL } = useTranslation();

  return (
    <footer style={{
  padding: '32px 0',
  borderTop: '1px solid var(--border)',
  background: 'var(--bg)',
}} dir={isRTL ? 'rtl' : 'ltr'}>
  <div style={{
    maxWidth: 1280, margin: '0 auto', padding: '0 24px',
    display: 'flex', flexWrap: 'wrap',
    alignItems: 'center', justifyContent: 'center', gap: 16,
  }}>
    <p style={{
      fontSize: '0.875rem', color: 'var(--text-muted)',
      display: 'flex', alignItems: 'center', gap: 6,
      fontFamily: isRTL ? 'Cairo, sans-serif' : undefined,
      textAlign: 'center',
    }}>
      {t.footer.built}
      · © {new Date().getFullYear()} · {t.footer.rights}
    </p>
    <button onClick={() => {
  const getScroll = () => window.pageYOffset !== undefined
    ? window.pageYOffset
    : (document.documentElement || document.body).scrollTop;
  const start = getScroll();
  const duration = 1000;
  const startTime = performance.now();
  const ease = (t: number) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
  const step = (now: number) => {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo({ top: start * (1 - ease(progress)), behavior: 'instant' } as any);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}}

      style={{
        width: 40, height: 40, borderRadius: '50%',
        background: 'var(--surface)', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--primary)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
      }}>
      <ArrowUp size={16} color="var(--primary)" />
    </button>
  </div>
</footer>
  );
}