import { useTranslation } from '../hooks/useTranslation';
import { ArrowUp } from 'lucide-react';
import Legal from './site/Legal';

export default function Footer() {
  const { t, isRTL } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer style={{
  padding: '32px 0',
  borderTop: '1px solid var(--border)',
  background: 'transparent',
  position: 'relative',
}} dir={isRTL ? 'rtl' : 'ltr'}>
  <div style={{
    maxWidth: 1280, margin: '0 auto', padding: '0 24px',
    display: 'flex', flexWrap: 'wrap',
    alignItems: 'center', justifyContent: 'center', gap: 16,
  }}>
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      fontFamily: isRTL ? 'var(--font-arabic), sans-serif' : undefined,
    }}>
      <p style={{
        fontSize: '0.875rem', color: 'var(--text-muted)',
        textAlign: 'center', margin: 0,
      }}>
        {/* useGrouping:false — otherwise ar-EG renders 2026 as ٢٬٠٢٦ (a "2,026" thousands separator). */}
        © {isRTL ? year.toLocaleString('ar-EG', { useGrouping: false }) : year} {t.footer.built}. {t.footer.rights}
      </p>
      <Legal />
    </div>
    <button aria-label="arrowUp" onClick={() => {
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

      className="glass"
      style={{
        width: 40, height: 40, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.transform = 'scale(1.1)';
        el.style.borderColor = 'var(--primary)';
        el.style.boxShadow = '0 6px 22px var(--glow)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.transform = 'scale(1)';
        el.style.borderColor = 'var(--border)';
        el.style.boxShadow = 'none';
      }}>
      <ArrowUp size={16} color="var(--primary)" />
    </button>
  </div>
</footer>
  );
}