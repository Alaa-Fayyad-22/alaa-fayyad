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

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700;800&family=Cairo:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

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
            scroll-behavior: smooth !important;
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
            --nav-bg-scrolled: rgba(10, 10, 15, 0.85);
            --card-shadow: rgba(0, 0, 0, 0.55);
            --overlay: rgba(5, 4, 12, 0.72);
            /* OS / HUD */
            --hud: rgba(168, 85, 247, 0.85);
            --hud-dim: rgba(168, 85, 247, 0.28);
            --panel-bg: rgba(16, 14, 26, 0.62);
            --panel-solid: #100e1a;
            --scanline: rgba(180, 160, 255, 0.05);
            --ok: #34d399;
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
            --nav-bg-scrolled: rgba(255, 255, 255, 0.88);
            --card-shadow: rgba(80, 60, 140, 0.20);
            --overlay: rgba(20, 18, 42, 0.55);
            /* OS / HUD — daylight console: prominent violet chrome */
            --hud: rgba(124, 58, 237, 0.88);
            --hud-dim: rgba(124, 58, 237, 0.40);
            --panel-bg: rgba(255, 255, 255, 0.80);
            --panel-solid: #ffffff;
            --scanline: rgba(124, 58, 237, 0.07);
            --ok: #0ea371;
            color-scheme: light;
          }

          html { background-color: var(--bg); }

          body {
            font-family: 'Inter', sans-serif;
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
          .font-display { font-family: 'JetBrains Mono', monospace; }
          .font-mono    { font-family: 'JetBrains Mono', monospace; }
          .font-arabic  { font-family: 'Cairo', sans-serif; }

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

          section[id] { scroll-margin-top: 72px; }

          [dir="rtl"] .ltr-only { display: none; }
          [dir="ltr"] .rtl-only { display: none; }

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
          .screen-eyebrow__num { font-family: 'JetBrains Mono', monospace; font-weight: 800;
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
            font-family: 'JetBrains Mono', 'Courier New', monospace;
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
            background: #0c0c14; border: 1px solid rgba(168,85,247,0.22);
            box-shadow: 0 30px 80px rgba(0,0,0,0.45); }
          .term-bar { display: flex; align-items: center; gap: 8px; padding: 11px 14px;
            background: #16161f; border-bottom: 1px solid rgba(255,255,255,0.06); position: relative; }
          .term-dot { width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0; }
          .term-title { position: absolute; left: 0; right: 0; text-align: center;
            font-family: 'JetBrains Mono', monospace; font-size: 0.74rem; color: #6b6b8a; pointer-events: none; }
          .term-body { padding: 22px clamp(16px, 3vw, 28px) 26px; min-height: 230px;
            font-family: 'JetBrains Mono', monospace; font-size: clamp(0.82rem, 2vw, 1rem);
            line-height: 1.85; color: #e6e6f0; }
          .term-line { white-space: pre-wrap; word-break: break-word; }
          .term-prompt { color: #4ade80; }
          .term-cmd { color: #e6e6f0; }
          .term-out { color: #c9c9da; }
          .term-name { color: #c4b5fd; font-size: clamp(1.4rem, 5vw, 2.4rem); font-weight: 800;
            letter-spacing: -0.02em; margin: 2px 0 6px; line-height: 1.15; }
          .term-status { color: #4ade80; }
          .term-caret { display: inline-block; width: 9px; height: 1.05em; vertical-align: text-bottom;
            background: #c4b5fd; margin-left: 2px; animation: blink 1s step-end infinite; }
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
          .snav__logo { background: none; border: none; cursor: pointer; padding: 0;
            font-weight: 700; font-size: 1.05rem; color: var(--text); letter-spacing: -0.01em; }
          .snav__links { display: flex; align-items: center; gap: 26px; }
          .snav__link { background: none; border: none; cursor: pointer; padding: 0;
            font-size: 0.9rem; color: var(--text-muted); transition: color 0.2s; }
          .snav__link:hover { color: var(--primary); }
          .snav__actions { display: flex; align-items: center; gap: 8px; }
          .snav__icon { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center;
            border: 1px solid var(--border); background: var(--surface); color: var(--primary); cursor: pointer;
            font-size: 0.72rem; font-weight: 700; transition: border-color 0.2s, box-shadow 0.2s; }
          .snav__icon:hover { border-color: var(--primary); }
          .snav__icon--text { width: auto; padding: 0 11px; font-family: 'JetBrains Mono', monospace; }
          .snav__burger { display: none; width: 36px; height: 36px; align-items: center; justify-content: center;
            border: none; background: none; color: var(--text); cursor: pointer; }
          .snav__drawer { display: flex; flex-direction: column; gap: 2px; padding: 10px 24px 18px;
            background: var(--nav-bg-scrolled); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
            border-bottom: 1px solid var(--border); }
          .snav__drawer-link { background: none; border: none; cursor: pointer; text-align: start;
            padding: 11px 0; font-size: 1rem; color: var(--text); border-bottom: 1px solid var(--border); }
          @media (max-width: 760px) {
            .snav__links { display: none; }
            .snav__burger { display: flex; }
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
