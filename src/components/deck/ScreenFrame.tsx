import React, { useEffect, useRef } from 'react';
import SectionEyebrow from './SectionEyebrow';

type Props = {
  id: string;
  /** 1-based section index, rendered as the "01" eyebrow number. */
  num: number;
  title: string;
  subtitle?: string;
  isRTL: boolean;
  cinematic?: boolean;
  children: React.ReactNode;
};

/**
 * One stacked section in the scrolling page: anchor wrapper (nav + scroll-
 * margin) holding the "NN | Heading" header (large violet index number, a thin
 * vertical rule, then the heading on one row) + subtitle, then the section's
 * content-only (`bare`) body.
 *
 * `cinematic` (+ motion allowed) drives a GSAP/ScrollTrigger reveal scrubbed to
 * scroll progress over short ranges (no pin/snap/scroll-jack). Otherwise — and
 * always under reduced-motion — it falls back to a plain IntersectionObserver
 * reveal, and on any GSAP load failure the content simply shows.
 */
export default function ScreenFrame({ id, num, title, subtitle, isRTL, cinematic = false, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const ar: React.CSSProperties = isRTL ? { fontFamily: 'Cairo, sans-serif' } : {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const revealAll = () => el.querySelectorAll('.reveal').forEach(n => n.classList.add('revealed'));

    // Non-cinematic path: plain IntersectionObserver reveal.
    if (!cinematic) {
      const observer = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
        { threshold: 0.08 }
      );
      el.querySelectorAll('.reveal').forEach(n => observer.observe(n));
      return () => observer.disconnect();
    }

    // Cinematic path: GSAP scroll-driven reveal.
    let active = true;
    let ctx: { revert: () => void } | null = null;
    (async () => {
      try {
        const gsap = (await import('gsap')).gsap;
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);
        if (!active) return;

        // Clear CSS hidden state on containers; GSAP owns the actual reveal.
        revealAll();

        ctx = gsap.context(() => {
          const heads = el.querySelectorAll('.screen-eyebrow, .screen-title, .screen-sub');
          const rule = el.querySelector('.screen-eyebrow__rule');
          const cards = el.querySelectorAll('.reveal:not(.screen-head)');

          gsap.fromTo(heads, { autoAlpha: 0, y: 26 }, {
            autoAlpha: 1, y: 0, stagger: 0.05, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 58%', scrub: 0.5 },
          });
          if (rule) gsap.fromTo(rule, { scaleY: 0, transformOrigin: 'center top' }, {
            scaleY: 1, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 62%', scrub: 0.5 },
          });
          if (cards.length) gsap.fromTo(cards, { autoAlpha: 0, y: 34 }, {
            autoAlpha: 1, y: 0, stagger: 0.06, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 72%', end: 'top 42%', scrub: 0.5 },
          });
          // Gentle content parallax for continuity between sections.
          gsap.to(el, {
            y: -18, ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        }, el);
      } catch {
        revealAll();
      }
    })();

    return () => { active = false; ctx?.revert(); };
  }, [cinematic]);

  return (
    <section id={id} ref={ref} className="scroll-section" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="screen-inner">
        <header className="screen-head reveal">
          <div className="screen-heading-row">
            <SectionEyebrow num={num} />
            <h2 className="screen-title" style={isRTL ? { fontFamily: 'Cairo, sans-serif' } : undefined}>{title}</h2>
          </div>
          {subtitle && <p className="screen-sub" style={ar}>{subtitle}</p>}
        </header>
      </div>
      {children}
    </section>
  );
}
