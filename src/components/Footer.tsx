import { useTranslation } from '../hooks/useTranslation';
import { Heart, ArrowUp } from 'lucide-react';

export default function Footer() {
  const { t, isRTL } = useTranslation();

  return (
    <footer className="py-8 border-t" style={{ borderColor: 'var(--border)' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm flex items-center gap-1.5" style={{ color: 'var(--text-muted)',
          fontFamily: isRTL ? 'Cairo, sans-serif' : undefined }}>
          {t.footer.built}
          <Heart size={13} className="text-red-400 fill-red-400 inline mx-0.5" />
          · © {new Date().getFullYear()} · {t.footer.rights}
        </p>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 rounded-full glass border flex items-center justify-center hover:scale-110 hover:border-primary-400 transition-all"
          style={{ borderColor: 'var(--border)' }}>
          <ArrowUp size={16} style={{ color: 'var(--primary)' }} />
        </button>
      </div>
    </footer>
  );
}