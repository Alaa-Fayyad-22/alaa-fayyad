import { useState, useEffect, useCallback } from 'react';
import en from '../messages/en.json';
import ar from '../messages/ar.json';

type Locale = 'en' | 'ar';
type Messages = typeof en;
const messages: Record<Locale, Messages> = { en, ar };

// Global state so all components share the same locale
let globalLocale: Locale = 'en';
const listeners = new Set<() => void>();

function notifyAll() {
  listeners.forEach(fn => fn());
}

export function useTranslation() {
  const [locale, setLocaleState] = useState<Locale>(globalLocale);

  useEffect(() => {
    // Read from localStorage on first mount
    try {
      const saved = localStorage.getItem('lang') as Locale | null;
      if (saved === 'ar' || saved === 'en') {
        globalLocale = saved;
        setLocaleState(saved);
        notifyAll();
      }
    } catch {}

    // Subscribe to global changes
    const update = () => setLocaleState(globalLocale);
    listeners.add(update);
    return () => { listeners.delete(update); };
  }, []);

  const toggleLocale = useCallback(() => {
    const next: Locale = globalLocale === 'en' ? 'ar' : 'en';
    globalLocale = next;
    try { localStorage.setItem('lang', next); } catch {}
    notifyAll();
  }, []);

  const t = messages[locale];
  const isRTL = locale === 'ar';

  return { t, locale, isRTL, toggleLocale };
}