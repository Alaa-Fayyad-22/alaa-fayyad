import { Html, Head, Main, NextScript } from "next/document";

// Runs before first paint — sets data-theme from localStorage / OS preference so
// there is never a flash of the wrong theme. Defaults to dark.
const NO_FLASH_SCRIPT = `
(function () {
  try {
    var t = localStorage.getItem('theme');
    if (t !== 'light' && t !== 'dark') {
      t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.style.colorScheme = t;
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function Document() {
  return (
    <Html lang="en" data-theme="dark">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />

        {/* Fonts are self-hosted from our own origin via next/font in _app.tsx —
            no request to Google, so no visitor IP leaves the site for a font. */}

        <style dangerouslySetInnerHTML={{ __html: `
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          img, video { max-width: 100%; display: block; }
          input, button, textarea, select { font: inherit; }

          * {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }

          html {
            /* No native scroll-behavior here on purpose: Lenis is the single
               smooth-scroll owner. A native smooth scroll-behavior stacks a
               second easing curve on top of Lenis per-frame scrolling, which
               causes laggy/janky momentum on long jumps. */
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          /* ════════════════ DESIGN TOKENS ════════════════ */
          :root, [data-theme="dark"] {
            --bg: #0a0a0f;
            --bg-secondary: #0d0c16;
            --surface: rgba(168, 85, 247, 0.06);
            --surface-2: rgba(168, 85, 247, 0.11);
            --surface-solid: #12101c;
            --border: rgba(168, 85, 247, 0.20);
            --border-strong: rgba(168, 85, 247, 0.45);
            --text: #ECECF4;
            --text-muted: #9a98b8;
            --primary: #a855f7;
            --accent: #818cf8;
            --glow: rgba(168, 85, 247, 0.45);
            --glow-soft: rgba(168, 85, 247, 0.18);
            --gradient: linear-gradient(135deg, #818cf8, #a855f7, #c084fc);
            --grid-line: rgba(168, 85, 247, 0.11);
            --nav-bg: rgba(10, 10, 15, 0.55);
            --nav-bg-scrolled: rgba(10, 10, 15, 0.95);
            --card-shadow: rgba(0, 0, 0, 0.55);
            --overlay: rgba(5, 4, 12, 0.72);
            /* OS / HUD */
            --hud: rgba(168, 85, 247, 0.85);
            --hud-dim: rgba(168, 85, 247, 0.28);
            --panel-bg: rgba(16, 14, 26, 0.62);
            --panel-solid: #100e1a;
            --scanline: rgba(180, 160, 255, 0.05);
            --ok: #34d399;
            /* Terminal hero (dark window — distinct, lighter than the page) */
            --term-bg: #14121d;
            --term-bar: #1c1a28;
            --term-border: rgba(168, 85, 247, 0.35);
            --term-bar-border: rgba(255, 255, 255, 0.07);
            --term-title: #6b6b8a;
            --term-text: #e6e6f0;
            --term-out: #c9c9da;
            --term-green: #4ade80;
            --term-accent: #c4b5fd;
            --term-err: #ff7b72;
            color-scheme: dark;
          }

          [data-theme="light"] {
            --bg: #eceef7;
            --bg-secondary: #e1e3f1;
            --surface: rgba(255, 255, 255, 0.74);
            --surface-2: rgba(124, 58, 237, 0.09);
            --surface-solid: #ffffff;
            --border: rgba(124, 58, 237, 0.30);
            --border-strong: rgba(124, 58, 237, 0.55);
            --text: #141229;
            --text-muted: #4f4d6e;
            --primary: #7c3aed;
            --accent: #6d28d9;
            --glow: rgba(124, 58, 237, 0.30);
            --glow-soft: rgba(124, 58, 237, 0.14);
            --gradient: linear-gradient(135deg, #6366f1, #7c3aed, #a855f7);
            --grid-line: rgba(124, 58, 237, 0.16);
            --nav-bg: rgba(255, 255, 255, 0.62);
            --nav-bg-scrolled: rgba(255, 255, 255, 0.95);
            --card-shadow: rgba(80, 60, 140, 0.20);
            --overlay: rgba(20, 18, 42, 0.55);
            /* OS / HUD — daylight console: prominent violet chrome */
            --hud: rgba(124, 58, 237, 0.88);
            --hud-dim: rgba(124, 58, 237, 0.40);
            --panel-bg: rgba(255, 255, 255, 0.80);
            --panel-solid: #ffffff;
            --scanline: rgba(124, 58, 237, 0.07);
            --ok: #0ea371;
            /* Terminal hero (light surface, dark text — stays readable) */
            --term-bg: #f6f5fc;
            --term-bar: #e9e7f5;
            --term-border: rgba(124, 58, 237, 0.30);
            --term-bar-border: rgba(20, 18, 42, 0.08);
            --term-title: #6a6790;
            --term-text: #2a2740;
            --term-out: #4a4766;
            --term-green: #15803d;
            --term-accent: #6d28d9;
            --term-err: #c0362c;
            color-scheme: light;
          }

          html { background-color: var(--bg); }

          body {
            font-family: var(--font-body), sans-serif;
            background-color: transparent;
            color: var(--text);
            overflow-x: clip;
            -webkit-overflow-scrolling: touch;
          }

          /* Theme switch is instant (snappy) — no global per-element transition,
             which previously animated every element on toggle and caused lag. */

          /* No stray light/UA outline on mouse focus; violet ring for keyboard. */
          * { -webkit-tap-highlight-color: transparent; }
          *:focus { outline: none; }
          *:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }

          /* Lenis smooth-scroll */
          html.lenis, html.lenis body { height: auto; }
          .lenis.lenis-smooth { scroll-behavior: auto !important; }
          .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
          .lenis.lenis-stopped { overflow: hidden; }
          .lenis.lenis-smooth iframe { pointer-events: none; }

          ::-webkit-scrollbar { width: 7px; }
          ::-webkit-scrollbar-track { background: var(--bg); }
          ::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 4px; }

          /* ════════════════ FONTS ════════════════ */
          .font-display { font-family: var(--font-mono), monospace; }
          .font-mono    { font-family: var(--font-mono), monospace; }
          .font-arabic  { font-family: var(--font-arabic), sans-serif; }

          /* ════════════════ BACKGROUND GRID ════════════════ */
          .grid-bg {
            position: fixed;
            inset: 0;
            z-index: -1;
            pointer-events: none;
            background-image: radial-gradient(circle, var(--grid-line) 1px, transparent 1px);
            background-size: 38px 38px;
            -webkit-mask-image: radial-gradient(ellipse 90% 70% at 50% 0%, #000 0%, transparent 72%);
            mask-image: radial-gradient(ellipse 90% 70% at 50% 0%, #000 0%, transparent 72%);
            animation: gridDrift 40s linear infinite;
          }
          @keyframes gridDrift {
            from { background-position: 0 0; }
            to   { background-position: 38px 38px; }
          }

          /* ════════════════ GRADIENT / GLOW ════════════════ */
          .gradient-text {
            background: var(--gradient);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradient 6s ease infinite;
          }
          .glow      { box-shadow: 0 0 30px var(--glow), 0 0 60px var(--glow-soft); }
          .glow-text { text-shadow: 0 0 22px var(--glow); }

          .glass {
            background: var(--surface);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--border);
          }

          /* Gradient-outlined surface (mask trick) */
          .gradient-border {
            position: relative;
            border: 1px solid transparent;
            background:
              linear-gradient(var(--surface-solid), var(--surface-solid)) padding-box,
              var(--gradient) border-box;
          }

          /* ════════════════ BUTTONS ════════════════ */
          .btn-primary {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 12px 28px; border-radius: 999px;
            background: var(--gradient); color: #fff;
            font-weight: 600; font-size: 0.95rem;
            border: none; cursor: pointer; text-decoration: none;
            box-shadow: 0 0 0 transparent;
            transition: transform 0.2s ease, box-shadow 0.25s ease;
          }
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px var(--glow);
          }
          .btn-primary:focus-visible {
            outline: 2px solid var(--primary); outline-offset: 3px;
          }

          .btn-outline {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 12px 28px; border-radius: 999px;
            background: var(--surface); color: var(--primary);
            font-weight: 600; font-size: 0.95rem;
            border: 1px solid var(--border-strong);
            cursor: pointer; text-decoration: none;
            backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
            transition: transform 0.2s ease, box-shadow 0.25s ease, background 0.2s ease;
          }
          .btn-outline:hover {
            transform: translateY(-2px);
            background: var(--surface-2);
            box-shadow: 0 8px 30px var(--glow);
          }
          .btn-outline:focus-visible {
            outline: 2px solid var(--primary); outline-offset: 3px;
          }

          /* ════════════════ SCROLL REVEAL ════════════════ */
          .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.7s ease, transform 0.7s ease;
            will-change: opacity, transform;
          }
          .reveal.revealed { opacity: 1; transform: translateY(0); }

          /* Hero staggered entrance */
          .hero-item {
            opacity: 0;
            transform: translateY(32px);
            animation: heroSlideUp 0.7s ease forwards;
          }
          .hero-item:nth-child(1) { animation-delay: 0s; }
          .hero-item:nth-child(2) { animation-delay: 0.12s; }
          .hero-item:nth-child(3) { animation-delay: 0.22s; }
          .hero-item:nth-child(4) { animation-delay: 0.34s; }
          .hero-item:nth-child(5) { animation-delay: 0.44s; }
          .hero-item:nth-child(6) { animation-delay: 0.54s; }
          .hero-item:nth-child(7) { animation-delay: 0.66s; }
          @keyframes heroSlideUp { to { opacity: 1; transform: translateY(0); } }

          /* ════════════════ NAV / MISC HELPERS ════════════════ */
          .skill-bar { height: 6px; border-radius: 3px; background: var(--border); overflow: clip; }
          .skill-bar-fill {
            height: 100%; border-radius: 3px; background: var(--gradient);
            transform-origin: left; transform: scaleX(0);
            transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
          }
          [dir="rtl"] .skill-bar-fill { transform-origin: right; }
          .skill-bar-fill.animated { transform: scaleX(1); }

          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50%      { background-position: 100% 50%; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-18px); }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50%      { opacity: 0; }
          }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-blink { animation: blink 1s step-end infinite; }
          @media (prefers-reduced-motion: reduce) {
            .animate-float { animation: none; }
          }

          section[id] { scroll-margin-top: 72px; }

          [dir="rtl"] .ltr-only { display: none; }
          [dir="ltr"] .rtl-only { display: none; }

          /* ════════════════ MODAL (privacy / terms) ════════════════ */
          .modal-overlay {
            position: fixed; inset: 0; z-index: 1000;
            display: flex; align-items: center; justify-content: center;
            padding: 24px;
            background: var(--overlay);
            backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
            animation: fadeIn 0.18s ease both;
          }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

          /* The panel is a pure CLIP container: it owns the radius and never
             scrolls, so the inner scrollbar can't spill past the rounded corner
             onto the backdrop. Only .modal-scroll below scrolls. */
          .modal-panel {
            display: flex; flex-direction: column;
            width: min(720px, 100%); max-height: min(85vh, 760px);
            overflow: hidden;
            border-radius: 16px;
            border: 1px solid var(--border);
            background: var(--panel-solid);
            box-shadow: 0 24px 70px var(--card-shadow), 0 0 0 1px var(--glow-soft);
            animation: modalIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) both;
          }
          @keyframes modalIn {
            from { opacity: 0; transform: translateY(12px) scale(0.98); }
            to   { opacity: 1; transform: none; }
          }
          @media (prefers-reduced-motion: reduce) {
            .modal-overlay, .modal-panel { animation: none; }
          }

          /* Fixed header — stays put while the body scrolls under it. */
          .modal-head {
            flex: 0 0 auto;
            display: flex; align-items: center; justify-content: space-between; gap: 16px;
            padding: 20px 24px;
            border-bottom: 1px solid var(--border);
            background: var(--surface);
          }
          .modal-title {
            margin: 0; font-size: 1.15rem; font-weight: 600;
            color: var(--text); font-family: var(--font-mono), monospace;
          }
          [dir="rtl"] .modal-title { font-family: var(--font-arabic), sans-serif; }
          .modal-x {
            flex: 0 0 auto;
            display: inline-flex; align-items: center; justify-content: center;
            width: 34px; height: 34px; border-radius: 9px;
            background: var(--bg); color: var(--text-muted);
            border: 1px solid var(--border); cursor: pointer;
            transition: color 0.18s ease, border-color 0.18s ease, background 0.18s ease;
          }
          .modal-x:hover { color: var(--text); border-color: var(--primary); background: var(--surface-2); }
          .modal-x:focus-visible, .modal-scroll:focus-visible, .legal-link:focus-visible {
            outline: 2px solid var(--primary); outline-offset: 2px;
          }

          /* The only scrolling region. min-height:0 lets it shrink inside the
             flex column instead of pushing the panel taller. */
          .modal-scroll {
            flex: 1 1 auto; min-height: 0;
            overflow-y: auto; overscroll-behavior: contain;
            padding: 24px;
            scrollbar-width: thin; scrollbar-color: var(--border-strong) transparent;
          }
          /* Own scrollbar styling — overrides the site's global 7px rule so the
             track sits flush inside the panel edge. */
          .modal-scroll::-webkit-scrollbar { width: 10px; }
          .modal-scroll::-webkit-scrollbar-track { background: transparent; }
          .modal-scroll::-webkit-scrollbar-thumb {
            background: var(--border-strong); border-radius: 999px;
            border: 3px solid transparent; background-clip: content-box;
          }
          .modal-scroll::-webkit-scrollbar-thumb:hover { background: var(--primary); background-clip: content-box; }

          /* ── legal document body ── */
          .legal-updated {
            margin: 0 0 18px; font-size: 0.78rem; letter-spacing: 0.04em;
            text-transform: uppercase; color: var(--text-muted);
            font-family: var(--font-mono), monospace;
          }
          [dir="rtl"] .legal-updated { text-transform: none; letter-spacing: normal; font-family: var(--font-arabic), sans-serif; }
          .legal-intro { margin: 0 0 8px; color: var(--text); line-height: 1.75; }
          .legal-section { margin-top: 26px; }
          .legal-h {
            margin: 0 0 10px; font-size: 0.97rem; font-weight: 600; color: var(--primary);
            font-family: var(--font-mono), monospace;
          }
          [dir="rtl"] .legal-h { font-family: var(--font-arabic), sans-serif; }
          .legal-p { margin: 0 0 10px; color: var(--text-muted); line-height: 1.8; font-size: 0.92rem; }
          .legal-ul { margin: 10px 0 0; padding-inline-start: 20px; display: flex; flex-direction: column; gap: 8px; }
          .legal-ul li { color: var(--text-muted); line-height: 1.75; font-size: 0.92rem; }
          .legal-ul li::marker { color: var(--primary); }
          [dir="rtl"] .legal-intro, [dir="rtl"] .legal-p, [dir="rtl"] .legal-ul li {
            font-family: var(--font-arabic), sans-serif;
          }

          /* ── footer legal links ── */
          .legal-links { display: flex; align-items: center; justify-content: center; gap: 10px; }
          .legal-link {
            background: none; border: none; padding: 2px 4px; cursor: pointer;
            font-size: 0.8rem; color: var(--text-muted);
            border-radius: 4px; transition: color 0.18s ease;
            font-family: inherit;
          }
          .legal-link:hover { color: var(--primary); text-decoration: underline; text-underline-offset: 3px; }
          .legal-sep { color: var(--text-muted); opacity: 0.5; font-size: 0.8rem; }

          @media (max-width: 560px) {
            .modal-overlay { padding: 12px; }
            .modal-panel { max-height: 88vh; border-radius: 14px; }
            .modal-head { padding: 16px 18px; }
            .modal-scroll { padding: 18px; }
          }

          /* ════════════════ CONTENT SHELL OFFSET ════════════════ */
          .page-shell { padding-top: 34px; padding-bottom: 32px; }
          @media (min-width: 1100px) {
            .page-shell { padding-inline-start: 256px; }
            section[id] { scroll-margin-top: 40px; }
          }

          /* ════════════════ BENTO / LAYOUT GRIDS ════════════════ */
          .proj-bento, .skills-bento {
            display: grid;
            grid-template-columns: 1fr;
            gap: 18px;
          }
          .about-grid, .contact-grid {
            grid-template-columns: 1fr;
          }
          .proj-card {
            display: flex;
            flex-direction: column;
            height: 100%;
            border-radius: 22px;
            overflow: hidden;
          }
          .proj-media {
            position: relative;
            overflow: hidden;
            flex: 1 1 auto;
            min-height: 190px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .proj-body {
            padding: 20px 22px 22px;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
          }
          @media (min-width: 680px) {
            .skills-bento { grid-template-columns: repeat(2, 1fr); }
            .skills-bento > :nth-child(1) { grid-column: span 2; }
          }
          @media (min-width: 720px) {
            .proj-bento { grid-template-columns: repeat(2, 1fr); }
            .proj-card--large { grid-column: span 2; }
          }
          @media (min-width: 860px) {
            .about-grid { grid-template-columns: 0.85fr 1.15fr; }
            .contact-grid { grid-template-columns: 0.8fr 1.2fr; }
          }
          @media (min-width: 1000px) {
            .skills-bento { grid-template-columns: repeat(3, 1fr); }
            .skills-bento > :nth-child(1) { grid-column: span 2; }
            .proj-bento { grid-template-columns: repeat(3, 1fr); grid-auto-rows: minmax(248px, 1fr); }
            .proj-card--large { grid-column: span 2; grid-row: span 2; }
            .proj-card--large .proj-media { min-height: 300px; }
            /* Smaller tiles: clamp the long description visually; full text stays
               in the DOM for assistive tech. */
            .proj-card:not(.proj-card--large) .proj-desc {
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          }

          /* Stacked scrolling sections */
          .scroll-section { position: relative; scroll-margin-top: 92px; }
          .screen-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
          .screen-head { padding: 48px 0 6px; }
          /* Section header: large index number + thin vertical rule + heading,
             one vertically-centred row ("01 | About"). All violet/text tokens,
             so it reads in both light and dark themes. */
          .screen-heading-row { display: flex; align-items: center;
            gap: clamp(14px, 2.4vw, 22px); margin-bottom: 12px; }
          .screen-eyebrow { display: inline-flex; align-items: center; flex-shrink: 0;
            gap: clamp(12px, 2vw, 18px); direction: ltr; align-self: stretch; }
          .screen-eyebrow__num { font-family: var(--font-mono), monospace; font-weight: 800;
            font-size: clamp(1.9rem, 5vw, 3.2rem); line-height: 1; color: var(--primary);
            letter-spacing: -0.02em; text-shadow: 0 0 24px var(--glow-soft); }
          .screen-eyebrow__rule { width: 2px; align-self: stretch; min-height: 1em;
            background: var(--primary); border-radius: 1px; opacity: 0.85; }
          .screen-title { font-weight: 800; color: var(--text);
            font-size: clamp(1.9rem, 5vw, 3.2rem); line-height: 1.1; letter-spacing: -0.02em;
            min-width: 0; }
          .screen-sub { color: var(--text-muted); font-size: 1.02rem; line-height: 1.7; max-width: 620px; }
          .screen-body { margin-top: 14px; }

          /* Visually-hidden (screen-reader only) */
          .hd-sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
            overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

          /* ════════════════ BOOT OVERLAY (theme-aware dev/shell) ════════════════ */
          .boot2 { position: fixed; inset: 0; z-index: 10000;
            background: var(--bg); color: var(--text);
            display: flex; align-items: center; justify-content: center;
            padding: clamp(20px, 6vw, 80px);
            font-family: var(--font-mono), 'Courier New', monospace;
            animation: bootFadeIn 0.2s ease; }
          .boot2--out { animation: bootFadeOut 0.45s ease forwards; }
          .boot2__win { width: min(620px, 92vw); }
          .boot2__log { margin: 0; font-size: clamp(0.74rem, 1.8vw, 0.95rem); line-height: 1.95; white-space: pre-wrap; }
          .boot2__prompt { color: var(--ok); }
          .boot2__ok { color: var(--ok); }
          .boot2__caret { color: var(--primary); }
          .boot2__barwrap { margin-top: 20px; width: min(360px, 70vw); height: 6px;
            background: var(--surface); border: 1px solid var(--border); border-radius: 3px; overflow: hidden; }
          .boot2__bar { height: 100%; width: 0; background: var(--gradient);
            box-shadow: 0 0 12px var(--glow); animation: bootBar 1.7s ease forwards; }
          .hd-blink { animation: blink 1s step-end infinite; }
          @keyframes bootBar { from { width: 0; } to { width: 100%; } }
          @keyframes bootFadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes bootFadeOut { from { opacity: 1; } to { opacity: 0; visibility: hidden; } }

          /* ════════════════ TERMINAL HERO ════════════════ */
          .term-hero { position: relative; min-height: 100vh; display: flex; flex-direction: column;
            align-items: center; justify-content: center; gap: 28px; padding: 90px 20px 40px; }
          .term-win { width: min(720px, 92vw); border-radius: 12px; overflow: hidden;
            background: var(--term-bg); border: 1px solid var(--term-border);
            box-shadow: 0 24px 70px var(--card-shadow), 0 0 38px var(--glow-soft); }
          .term-bar { display: flex; align-items: center; gap: 8px; padding: 11px 14px;
            background: var(--term-bar); border-bottom: 1px solid var(--term-bar-border); position: relative; }
          .term-dot { width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0; }
          .term-title { position: absolute; left: 0; right: 0; text-align: center;
            font-family: var(--font-mono), monospace; font-size: 0.74rem; color: var(--term-title); pointer-events: none; }
          /* Constant height: content scrolls INSIDE (auto-scrolls to newest) — the
             window never grows. Wheel only scrolls here while the terminal is
             focused (data-lenis-prevent); otherwise Lenis scrolls the page
             smoothly over it. overscroll-behavior stops scroll-chaining jank. */
          .term-body { padding: 22px clamp(16px, 3vw, 28px) 26px; cursor: text;
            height: clamp(300px, 46vh, 440px); overflow-y: auto; overscroll-behavior: contain;
            scrollbar-width: thin; scrollbar-color: var(--term-border) transparent;
            font-family: var(--font-mono), monospace; font-size: clamp(0.82rem, 2vw, 1rem);
            line-height: 1.85; color: var(--term-text); }
          .term-body::-webkit-scrollbar { width: 8px; }
          .term-body::-webkit-scrollbar-track { background: transparent; }
          .term-body::-webkit-scrollbar-thumb { background: var(--term-border); border-radius: 4px; }
          .term-body::-webkit-scrollbar-thumb:hover { background: var(--term-accent); }
          /* Mobile: compact hero + smaller terminal. svh fits the visible screen
             and stays stable when the keyboard opens (vh/dvh would jump/grow). */
          @media (max-width: 760px) {
            .term-hero { min-height: 100svh; padding: 76px 16px 26px; gap: 16px; }
            .term-body { height: clamp(230px, 42svh, 330px); }
          }
          .term-line { white-space: pre-wrap; word-break: break-word;
            animation: termLineIn 0.14s ease both; }
          @keyframes termLineIn { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: none; } }
          @media (prefers-reduced-motion: reduce) { .term-line { animation: none; } }
          .term-prompt { color: var(--term-green); }
          .term-cmd { color: var(--term-text); }
          .term-out { color: var(--term-out); }
          .term-acc { color: var(--term-accent); }
          .term-muted { color: var(--term-title); }
          .term-err { color: var(--term-err); }
          .term-name { color: var(--term-accent); font-size: clamp(1.4rem, 5vw, 2.4rem); font-weight: 800;
            letter-spacing: -0.02em; margin: 2px 0 6px; line-height: 1.15; }
          .term-status { color: var(--term-green); }
          .term-caret { display: inline-block; width: 9px; height: 1.05em; vertical-align: text-bottom;
            background: var(--term-accent); margin-left: 2px; animation: blink 1s step-end infinite; }
          .term-hint { color: var(--term-title); opacity: 0.85; }
          .term-link { color: var(--term-accent); text-decoration: none;
            border-bottom: 1px solid transparent; transition: border-color 0.18s ease; }
          .term-link:hover, .term-link:focus-visible { border-bottom-color: var(--term-accent); outline: none; }
          .term-inputrow { display: flex; align-items: center; gap: 7px; }
          /* Block-caret input: a transparent real <input> overlays a visible text
             mirror, so the caret is a blinking block (▌) instead of the thin one. */
          .term-inputfield { position: relative; flex: 1 1 auto; min-width: 0; margin: 0; cursor: text;
            display: inline-flex; flex-wrap: wrap; align-items: center; }
          .term-input-echo { white-space: pre-wrap; word-break: break-word; color: var(--term-text); }
          .term-input-ph { color: var(--term-title); opacity: 0.75; margin-inline-start: 6px; }
          .term-input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; padding: 0;
            background: transparent; border: none; outline: none;
            font-family: var(--font-mono), monospace; font-size: inherit; line-height: inherit;
            color: transparent; caret-color: transparent; }
          .term-cue { background: none; border: none; cursor: pointer; color: var(--text-muted);
            display: flex; align-items: center; justify-content: center; }
          .term-cue:hover { color: var(--primary); }

          /* ════════════════ CLEAN NAV ════════════════ */
          .snav { position: fixed; top: 0; left: 0; right: 0; z-index: 100;
            transition: background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease; border-bottom: 1px solid transparent; }
          .snav.is-scrolled { background: var(--nav-bg-scrolled);
            backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-bottom: 1px solid var(--border); }
          .snav__inner { max-width: 1200px; margin: 0 auto; height: 64px; padding: 0 24px;
            display: flex; align-items: center; justify-content: space-between; gap: 16px; }
          .snav__logo { display: inline-flex; align-items: center; background: none; border: none;
            cursor: pointer; padding: 0; font-family: var(--font-mono), monospace;
            font-weight: 700; font-size: 1.05rem; color: var(--text); letter-spacing: -0.01em; }
          /* Decorative terminal caret after the name (echoes the "$ whoami" hero) */
          .snav__caret { display: inline-block; width: 0.55em; height: 1.05em;
            vertical-align: text-bottom; margin-inline-start: 4px; border-radius: 1px;
            background: var(--primary); animation: blink 1s step-end infinite; }
          @media (prefers-reduced-motion: reduce) { .snav__caret { animation: none; } }
          .snav__links { position: relative; display: flex; align-items: center; gap: 26px;
            --arrow-gap: 8px; }
          /* Terminal-style hover: a violet ">" slides in from the left (no reflow) */
          .snav__link { position: relative; background: none; border: none; cursor: pointer; padding: 0;
            font-size: 0.9rem; color: var(--text-muted); transition: color 0.35s ease; }
          .snav__link::before { content: '>'; position: absolute; inset-inline-start: -11px; top: 0;
            font-family: var(--font-mono), monospace; color: var(--primary);
            opacity: 0; transform: translateX(-3px);
            transition: opacity 0.2s ease, transform 0.2s ease; }
          .snav__link:hover, .snav__link:focus-visible { color: var(--primary); }
          .snav__link:hover::before, .snav__link:focus-visible::before { opacity: 1; transform: translateX(0); }
          /* Scroll-spy active link: violet text only — the traveling shared
             arrow + underline (below) mark it, so no per-link markers here. */
          .snav__link.is-active { color: var(--primary); }
          /* Active link's own hover ">" is suppressed; the shared arrow owns it. */
          .snav__link.is-active::before,
          .snav__link.is-active:hover::before { opacity: 0; }
          /* Shared traveling indicator (desktop). left/width are set inline from
             the measured active link; the CSS transition makes them glide. The
             constant transform sets the snug gap (LTR) / mirror (RTL). */
          /* The position transition lives on the base element UNCONDITIONALLY,
             so every left/width change glides. First-frame placement is made
             instant via an inline transition:none from JS (see SiteNav), which
             is removed one frame later — that avoids the slide-in-from-0 without
             ever leaving left/width un-transitioned on real moves. */
          .snav__arrow, .snav__underline { position: absolute; opacity: 0; pointer-events: none;
            transition: left 0.45s cubic-bezier(.6,.1,.2,1), width 0.45s cubic-bezier(.6,.1,.2,1), opacity 0.25s ease; }
          .snav__arrow.is-on, .snav__underline.is-on { opacity: 1; }
          .snav__arrow { top: 50%; font-family: var(--font-mono), monospace; font-size: 0.9rem;
            line-height: 1; color: var(--primary);
            transform: translate(calc(-100% - var(--arrow-gap)), -50%); }
          [dir="rtl"] .snav__arrow { transform: translate(var(--arrow-gap), -50%) scaleX(-1); }
          .snav__underline { bottom: -7px; height: 2px; border-radius: 2px; background: var(--primary); }
          @media (prefers-reduced-motion: reduce) {
            .snav__link::before { transition: opacity 0.2s ease; transform: none; }
            .snav__arrow, .snav__underline { transition: opacity 0.25s ease; }
          }
          .snav__actions { display: flex; align-items: center; gap: 8px; }
          .snav__icon { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center;
            border: 1px solid var(--border); background: var(--surface); color: var(--primary); cursor: pointer;
            font-size: 0.72rem; font-weight: 700; transition: border-color 0.2s, box-shadow 0.2s; }
          .snav__icon:hover { border-color: var(--primary); }
          .snav__icon--text { width: auto; padding: 0 11px; font-family: var(--font-mono), monospace; }
          .snav__burger { display: none; width: 36px; height: 36px; align-items: center; justify-content: center;
            border: none; background: none; color: var(--text); cursor: pointer; }
          /* Three bars that morph into an X when .is-open (transform/opacity only) */
          .snav__burger-box { position: relative; width: 22px; height: 16px; }
          .snav__burger-bar { position: absolute; left: 0; right: 0; height: 2px; border-radius: 2px;
            background: var(--text);
            transition: transform 0.28s ease, opacity 0.18s ease, top 0.28s ease; }
          .snav__burger-bar:nth-child(1) { top: 0; }
          .snav__burger-bar:nth-child(2) { top: 7px; }
          .snav__burger-bar:nth-child(3) { top: 14px; }
          .snav__burger.is-open .snav__burger-bar:nth-child(1) { top: 7px; transform: rotate(45deg); }
          .snav__burger.is-open .snav__burger-bar:nth-child(2) { opacity: 0; }
          .snav__burger.is-open .snav__burger-bar:nth-child(3) { top: 7px; transform: rotate(-45deg); }
          /* Always mounted so it animates BOTH ways; closed state is hidden +
             slid up. visibility is delayed on close so it fully fades out first.
             absolute (top:100%) overlay so the closed drawer can't inflate the
             nav's height — otherwise the scrolled background paints over its
             reserved space and the bar appears to grow when scrolling. */
          .snav__drawer { position: absolute; top: 100%; left: 0; right: 0; z-index: 99;
            display: flex; flex-direction: column; gap: 2px; padding: 10px 24px 18px;
            background: var(--nav-bg-scrolled); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
            border-bottom: 1px solid var(--border);
            transform: translateY(-12px); opacity: 0; visibility: hidden; pointer-events: none;
            transition: opacity 0.27s ease, transform 0.27s ease, visibility 0s linear 0.27s; }
          .snav__drawer.is-open { transform: translateY(0); opacity: 1; visibility: visible; pointer-events: auto;
            transition: opacity 0.27s ease, transform 0.27s ease; }
          .snav__drawer-link { position: relative; background: none; border: none; cursor: pointer; text-align: start;
            padding: 11px 0; font-size: 1rem; color: var(--text); border-bottom: 1px solid var(--border);
            opacity: 0; transform: translateY(-6px);
            transition: color 0.2s, opacity 0.25s ease, transform 0.25s ease; }
          .snav__drawer-link::before { content: '>'; position: absolute; inset-inline-start: -14px;
            font-family: var(--font-mono), monospace; color: var(--primary);
            opacity: 0; transition: opacity 0.2s ease; }
          .snav__drawer-link:hover, .snav__drawer-link:focus-visible { color: var(--primary); }
          .snav__drawer-link:hover::before, .snav__drawer-link:focus-visible::before { opacity: 1; }
          .snav__drawer-link.is-active { color: var(--primary); }
          .snav__drawer-link.is-active::before { opacity: 1; }
          /* Open: items reveal with a subtle stagger; close fades them out together */
          .snav__drawer.is-open .snav__drawer-link,
          .snav__drawer.is-open .snav__drawer-toggle { opacity: 1; transform: translateY(0); }
          .snav__drawer.is-open .snav__drawer-link:nth-child(1) { transition-delay: 0.05s; }
          .snav__drawer.is-open .snav__drawer-link:nth-child(2) { transition-delay: 0.09s; }
          .snav__drawer.is-open .snav__drawer-link:nth-child(3) { transition-delay: 0.13s; }
          .snav__drawer.is-open .snav__drawer-link:nth-child(4) { transition-delay: 0.17s; }
          .snav__drawer.is-open .snav__drawer-link:nth-child(5) { transition-delay: 0.21s; }
          .snav__drawer.is-open .snav__drawer-toggle { transition-delay: 0.24s; }
          /* Theme + language toggles inside the mobile drawer */
          .snav__drawer-toggles { display: flex; flex-direction: column; gap: 2px;
            margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border); }
          .snav__drawer-toggle { display: flex; align-items: center; gap: 12px; width: 100%;
            background: none; border: none; cursor: pointer; text-align: start;
            padding: 13px 0; font-size: 1rem; color: var(--text);
            opacity: 0; transform: translateY(-6px);
            transition: color 0.2s, opacity 0.25s ease, transform 0.25s ease; }
          .snav__drawer-toggle:hover, .snav__drawer-toggle:focus-visible { color: var(--primary); }
          .snav__drawer-toggle svg { color: var(--primary); flex-shrink: 0; }
          @media (prefers-reduced-motion: reduce) {
            .snav__drawer { transition: opacity 0.001s linear, visibility 0s; }
            .snav__drawer-link, .snav__drawer-toggle, .snav__burger-bar {
              transition-duration: 0.001s; transition-delay: 0s; }
          }
          @media (max-width: 760px) {
            .snav__links { display: none; }
            .snav__burger { display: flex; }
            .snav__bar-only { display: none; }
          }
          @media (min-width: 761px) {
            .snav__drawer { display: none; }
          }
        `}}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
