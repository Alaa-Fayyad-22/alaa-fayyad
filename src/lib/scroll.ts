/**
 * Smooth-scroll to a section id (or the top when id === 'top').
 * - Prefers the active Lenis instance (window.__lenis) so nav links glide with
 *   the same momentum as the page.
 * - Under prefers-reduced-motion, jumps instantly (no animation).
 * - Otherwise falls back to an eased rAF scroll.
 */
type LenisLike = { scrollTo: (target: number | HTMLElement, opts?: { offset?: number }) => void };

export function smoothScrollTo(id: string, offset = 80) {
  if (typeof window === 'undefined') return;

  const targetEl = id === 'top' ? null : document.getElementById(id);
  const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;

  if (lenis) {
    if (id === 'top') lenis.scrollTo(0, { offset: 0 });
    else if (targetEl) lenis.scrollTo(targetEl, { offset: -offset });
    return;
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const getScroll = () =>
    window.pageYOffset !== undefined
      ? window.pageYOffset
      : (document.documentElement || document.body).scrollTop;

  const currentScroll = getScroll();
  const target = id === 'top' ? 0 : (() => {
    if (!targetEl) return 0;
    return targetEl.getBoundingClientRect().top + currentScroll - offset;
  })();

  if (reduce) {
    window.scrollTo({ top: target, behavior: 'auto' });
    return;
  }

  const start = currentScroll;
  const distance = target - start;
  const duration = 1000;
  const startTime = performance.now();
  const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  function step(now: number) {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo({ top: start + distance * ease(progress), behavior: 'instant' } as ScrollToOptions);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
