import { useEffect, useRef, useState } from 'react';

/**
 * One-shot scroll reveal. Returns a ref to attach and whether the element has
 * entered the viewport yet. Falls back to "shown" where IntersectionObserver
 * is missing so content is never stuck invisible.
 */
export function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, shown] as const;
}
