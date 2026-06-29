import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

/**
 * Reads the theme that the no-flash inline script (in _document.tsx) already
 * applied to <html data-theme>, then lets the UI toggle + persist it.
 *
 * The inline script is the single source of truth on first paint, so this hook
 * never causes a flash of the wrong theme — it only syncs React state to the
 * attribute on mount and writes back on toggle.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const current = (document.documentElement.getAttribute('data-theme') as Theme) || 'dark';
    setTheme(current);
  }, []);

  const applyTheme = (next: Theme) => {
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* localStorage unavailable (private mode, etc.) — ignore */
    }
    setTheme(next);
  };

  const toggleTheme = () => applyTheme(theme === 'dark' ? 'light' : 'dark');

  return { theme, toggleTheme };
}
