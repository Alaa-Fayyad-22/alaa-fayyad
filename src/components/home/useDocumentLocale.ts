import { useEffect } from 'react';

/** Mirror the active locale onto <html>, same as the other pages do. */
export function useDocumentLocale(isRTL: boolean, locale: string) {
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [isRTL, locale]);
}
