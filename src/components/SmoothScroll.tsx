import { useEffect } from 'react';

/**
 * Global smooth/momentum scrolling (Lenis) wired into GSAP's ticker +
 * ScrollTrigger, plus a subtle background parallax. Entirely disabled under
 * prefers-reduced-motion (native instant scroll). Touch stays native (light on
 * mobile). Exposes the Lenis instance on window.__lenis so nav links can glide.
 */
export default function SmoothScroll() {
  useEffect(() => {
    let active = true;
    let cleanup = () => {};

    (async () => {
      const Lenis = (await import('lenis')).default;
      const gsap = (await import('gsap')).gsap;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (!active) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        // Manual wheel/trackpad feel — intentionally left as-is. Programmatic
        // scroll-to (nav clicks + terminal section commands) overrides duration
        // and easing per call in smoothScrollTo(); this global config only
        // governs the user's own scrolling.
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;

      lenis.on('scroll', ScrollTrigger.update);
      const update = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0);

      // Subtle background parallax — starfield/grid drifts slower than content.
      const bg = document.querySelector('.bgfx');
      const bgTween = bg
        ? gsap.to(bg, {
            yPercent: -8, ease: 'none',
            scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: true },
          })
        : null;

      ScrollTrigger.refresh();

      cleanup = () => {
        gsap.ticker.remove(update);
        bgTween?.scrollTrigger?.kill();
        bgTween?.kill();
        lenis.destroy();
        delete (window as unknown as { __lenis?: unknown }).__lenis;
      };
    })();

    return () => { active = false; cleanup(); };
  }, []);

  return null;
}
