/**
 * Smooth-scroll to a section id (or the top when id === 'top').
 * - Prefers the active Lenis instance (window.__lenis) so nav links glide with
 *   the same momentum as the page.
 * - Under prefers-reduced-motion, jumps instantly (no animation).
 * - Otherwise falls back to an eased rAF scroll.
 */
type ScrollToOpts = { offset?: number; duration?: number; easing?: (t: number) => number };
type LenisLike = { scrollTo: (target: number | HTMLElement, opts?: ScrollToOpts) => void };

// easeInOutCubic — programmatic scroll starts slow, accelerates through the
// middle, and settles gently at the target. Applied ONLY to nav-click / terminal
// scroll-to below; the user's manual wheel scrolling keeps the global Lenis feel.
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const PROGRAMMATIC_DURATION = 1.2;

export function smoothScrollTo(id: string, offset = 80) {
  if (typeof window === 'undefined') return;

  const targetEl = id === 'top' ? null : document.getElementById(id);
  const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;

  if (lenis) {
    const opts = { duration: PROGRAMMATIC_DURATION, easing: easeInOutCubic };
    if (id === 'top') lenis.scrollTo(0, { offset: 0, ...opts });
    else if (targetEl) lenis.scrollTo(targetEl, { offset: -offset, ...opts });
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
  const duration = 1200;
  const startTime = performance.now();
  // easeInOutCubic — matches the Lenis easing: slow start, faster middle,
  // gentle settle. (Fallback path: reduced-motion is handled above; this runs
  // only when Lenis isn't active yet.)
  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function step(now: number) {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo({ top: start + distance * ease(progress), behavior: 'instant' } as ScrollToOptions);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
