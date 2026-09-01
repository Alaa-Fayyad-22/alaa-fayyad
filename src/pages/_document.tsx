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
          /* SINGLE-ACCENT SYSTEM — one teal accent, one identity, both themes.
             Five source colours per theme (bg / text / muted / border / accent);
             every elevation / hover / disabled / focus state is a lightness step
             or an alpha of those five, and intermediate solid shades are derived
             with color-mix() in oklab, never a new hex. There is exactly ONE
             accent hue anywhere on the site — no second colour for success,
             error, prompts, or nav. Error states read as emphasised neutral text
             on a faint neutral panel. The terminal window dots are monochrome in
             both themes (see the override block near the end of this stylesheet).

             DARK — bg #101418 · text #E4E7EA (14.4:1) · muted #9AA3AA (7.2:1)
             · border #2C333A (1.45:1, dividers only) · accent #4FA8A0 (6.6:1).
             Accent fill takes a near-black label (#0B0E10 on #4FA8A0 = 6.9:1). */
          :root, [data-theme="dark"] {
            --bg: #101418;
            --surface: rgba(228, 231, 234, 0.05);
            --surface-2: rgba(228, 231, 234, 0.09);
            --surface-solid: color-mix(in oklab, #101418 88%, #2C333A);
            --border: #2C333A;
            --border-strong: color-mix(in oklab, #2C333A 55%, #9AA3AA); /* ~1.45:1 divider → ~3.3:1 for interactive edges */
            --text: #E4E7EA;
            --text-muted: #9AA3AA;
            --primary: #4FA8A0;
            --accent: #4FA8A0;
            --glow: rgba(79, 168, 160, 0.35);
            --gradient: var(--accent);
            --nav-bg: rgba(16, 20, 24, 0.55);
            --nav-bg-scrolled: rgba(16, 20, 24, 0.95);
            --card-shadow: rgba(0, 0, 0, 0.55);
            --overlay: rgba(0, 0, 0, 0.72);
            /* Label colour on an accent fill (buttons, active pills): near-black
               in dark (#0B0E10 on #4FA8A0 = 6.9:1; white on #4FA8A0 fails). */
            --on-gradient: #0B0E10;
            /* Error styling — neutral, no hue. Emphasised text + faint text tint. */
            --danger: #E4E7EA;
            --danger-bg: rgba(228, 231, 234, 0.10);
            --danger-border: rgba(228, 231, 234, 0.28);
            --panel-solid: color-mix(in oklab, #101418 88%, #2C333A);
            --ok: #4FA8A0;
            /* Terminal hero (dark window — a couple of lightness steps above the page) */
            --term-bg: color-mix(in oklab, #101418 82%, #2C333A);
            --term-bar: color-mix(in oklab, #101418 70%, #2C333A);
            --term-border: #2C333A;
            --term-bar-border: rgba(255, 255, 255, 0.06);
            --term-title: #9AA3AA;
            --term-text: #E4E7EA;
            --term-out: #9AA3AA;
            --term-green: #4FA8A0; /* the "$" prompt — the accent, not green */
            --term-accent: #4FA8A0;
            --term-err: #E4E7EA;   /* error line — neutral bright text, no red */
            color-scheme: dark;
          }

          /* LIGHT — bg #F7F9FA · text #14181C (16.9:1) · muted #5C6670 (5.5:1)
             · border #DCE1E4 (1.2:1, dividers only) · accent #2E7D76 (4.6:1).
             Accent fill takes a WHITE label (#fff on #2E7D76 = 4.9:1; near-black
             on #2E7D76 fails). */
          [data-theme="light"] {
            --bg: #F7F9FA;
            --surface: rgba(255, 255, 255, 0.72);
            --surface-2: rgba(20, 24, 28, 0.05);
            --surface-solid: #ffffff;
            --border: #DCE1E4;
            --border-strong: color-mix(in oklab, #5C6670 65%, #DCE1E4); /* ~1.2:1 divider → ~3.7:1 for interactive edges */
            --text: #14181C;
            --text-muted: #5C6670;
            --primary: #2E7D76;
            --accent: #2E7D76;
            --glow: rgba(46, 125, 118, 0.28);
            --gradient: var(--accent);
            --nav-bg: rgba(247, 249, 250, 0.62);
            --nav-bg-scrolled: rgba(247, 249, 250, 0.95);
            --card-shadow: rgba(20, 24, 28, 0.12);
            --overlay: rgba(20, 24, 28, 0.45);
            --on-gradient: #ffffff; /* white label on the accent fill in light */
            --danger: #14181C;
            --danger-bg: rgba(20, 24, 28, 0.05);
            --danger-border: rgba(20, 24, 28, 0.18);
            --panel-solid: #ffffff;
            --ok: #2E7D76;
            /* Terminal hero (white card on the near-white page, border-defined —
               kept at #fff so the accent "$" clears 4.5:1 on it). */
            --term-bg: #ffffff;
            --term-bar: color-mix(in oklab, #ffffff 90%, #14181C);
            --term-border: #DCE1E4;
            --term-bar-border: rgba(20, 24, 28, 0.08);
            --term-title: #5C6670;
            --term-text: #14181C;
            --term-out: #5C6670;
            --term-green: #2E7D76; /* the "$" prompt — the accent, not green */
            --term-accent: #2E7D76;
            --term-err: #14181C;   /* error line — neutral text, no red */
            color-scheme: light;
          }

          /* Radius scale — deliberate, not uniform:
             control = near-square (inputs, small icon buttons)
             panel   = cards, panels, modals, buttons, the terminal window
             full pill (999px) is reserved for tags/chips only; 50% for dots. */
          :root {
            --radius-control: 3px;
            --radius-panel: 8px;
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
          ::-webkit-scrollbar-thumb { background: var(--primary); border-radius: var(--radius-control); }

          /* Plain bordered surface. Was ".glass" (backdrop-blur + translucent) —
             the blur did nothing behind a static card, so it is now just an
             opaque panel with a border. The one intentional backdrop-blur left
             on the site is the scrolled nav bar (content moves under it). */
          .glass {
            background: var(--surface-solid);
            border: 1px solid var(--border);
          }

          /* ════════════════ BUTTONS ════════════════ */
          .btn-primary {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 12px 28px; border-radius: var(--radius-panel);
            background: var(--accent); color: var(--on-gradient);
            font-weight: 600; font-size: 0.95rem;
            border: none; cursor: pointer; text-decoration: none;
            transition: transform 0.15s ease, filter 0.15s ease;
          }
          .btn-primary:hover { transform: translateY(-1px); filter: brightness(1.06); }
          .btn-primary:focus-visible {
            outline: 2px solid var(--primary); outline-offset: 3px;
          }

          .btn-outline {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 12px 28px; border-radius: var(--radius-panel);
            background: transparent; color: var(--primary);
            font-weight: 600; font-size: 0.95rem;
            border: 1px solid var(--border-strong);
            cursor: pointer; text-decoration: none;
            transition: background 0.15s ease, border-color 0.15s ease;
          }
          .btn-outline:hover {
            background: var(--surface-2);
            border-color: var(--primary);
          }
          .btn-outline:focus-visible {
            outline: 2px solid var(--primary); outline-offset: 3px;
          }

          /* ════════════════ SCROLL REVEAL ════════════════ */
          /* Opacity only — no slide. A quick fade in as sections enter view. */
          .reveal { opacity: 0; transition: opacity 0.3s ease; }
          .reveal.revealed { opacity: 1; }

          @keyframes blink {
            0%, 100% { opacity: 1; }
            50%      { opacity: 0; }
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
            border-radius: var(--radius-panel);
            border: 1px solid var(--border);
            background: var(--panel-solid);
            box-shadow: 0 24px 70px var(--card-shadow);
          }
          @media (prefers-reduced-motion: reduce) {
            .modal-overlay { animation: none; }
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
            width: 34px; height: 34px; border-radius: var(--radius-control);
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
            border-radius: var(--radius-control); transition: color 0.18s ease;
            font-family: inherit;
          }
          .legal-link:hover { color: var(--primary); text-decoration: underline; text-underline-offset: 3px; }
          .legal-sep { color: var(--text-muted); opacity: 0.5; font-size: 0.8rem; }

          @media (max-width: 560px) {
            .modal-overlay { padding: 12px; }
            .modal-panel { max-height: 88vh; border-radius: var(--radius-panel); }
            .modal-head { padding: 16px 18px; }
            .modal-scroll { padding: 18px; }
          }

          @media (min-width: 1100px) {
            section[id] { scroll-margin-top: 40px; }
          }

          /* ════════════════ BENTO / LAYOUT GRIDS ════════════════ */
          .skills-bento {
            display: grid;
            grid-template-columns: 1fr;
            gap: 18px;
          }
          .about-grid, .contact-grid {
            grid-template-columns: 1fr;
          }

          /* Projects — a horizontal, swipeable scroll-snap carousel. One card
             per view on mobile; two per view (and per prev/next "page") from
             720px up, with the next card peeking to signal there's more.
             Cards are all the same size: equal flex basis, a fixed-aspect
             image box, and a line-clamped description so copy length can't
             drive card height. Only /classic renders this. */
          .proj-carousel { position: relative; }
          .proj-bento {
            display: flex;
            gap: 18px;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior-x: contain;
            scrollbar-width: none;               /* Firefox */
            padding-bottom: 6px;
          }
          .proj-bento::-webkit-scrollbar { display: none; }  /* WebKit */
          @media (prefers-reduced-motion: reduce) {
            .proj-bento { scroll-behavior: auto; }
          }
          .proj-card {
            flex: 0 0 100%;
            scroll-snap-align: start;
            display: flex;
            flex-direction: column;
            border-radius: var(--radius-panel);
            overflow: hidden;
          }
          .proj-media {
            position: relative;
            overflow: hidden;
            aspect-ratio: 16 / 10;
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
          /* Clamp every description to the same line count so all cards match
             height regardless of copy length. Full text stays in the DOM. */
          .proj-desc {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          /* Prev/next controls — pointer affordance from tablet up; touch users
             just swipe, so they're hidden on narrow viewports. */
          .proj-nav { display: none; }
          .proj-nav button {
            width: 38px; height: 38px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; color: var(--primary);
            background: var(--surface-solid); border: 1px solid var(--border);
            transition: border-color 0.15s ease, opacity 0.15s ease;
          }
          .proj-nav button:hover:not(:disabled) { border-color: var(--primary); }
          .proj-nav button:disabled { opacity: 0.35; cursor: default; }

          @media (min-width: 680px) {
            .skills-bento { grid-template-columns: repeat(2, 1fr); }
            .skills-bento > :nth-child(1) { grid-column: span 2; }
          }
          @media (min-width: 720px) {
            .proj-card { flex-basis: calc((100% - 18px) / 2); }
            .proj-nav {
              display: flex; gap: 8px; justify-content: flex-end;
              margin-bottom: 14px;
            }
          }
          @media (min-width: 860px) {
            .about-grid { grid-template-columns: 0.85fr 1.15fr; }
            .contact-grid { grid-template-columns: 0.8fr 1.2fr; }
          }
          @media (min-width: 1000px) {
            .skills-bento { grid-template-columns: repeat(3, 1fr); }
            .skills-bento > :nth-child(1) { grid-column: span 2; }
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
            letter-spacing: -0.02em; }
          .screen-eyebrow__rule { width: 2px; align-self: stretch; min-height: 1em;
            background: var(--primary); opacity: 0.85; }
          .screen-title { font-weight: 800; color: var(--text);
            font-size: clamp(1.9rem, 5vw, 3.2rem); line-height: 1.1; letter-spacing: -0.02em;
            min-width: 0; }
          .screen-sub { color: var(--text-muted); font-size: 1.02rem; line-height: 1.7; max-width: 620px; }

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
            background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-control); overflow: hidden; }
          .boot2__bar { height: 100%; width: 0; background: var(--accent);
            animation: bootBar 1.7s ease forwards; }
          .hd-blink { animation: blink 1s step-end infinite; }
          @keyframes bootBar { from { width: 0; } to { width: 100%; } }
          @keyframes bootFadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes bootFadeOut { from { opacity: 1; } to { opacity: 0; visibility: hidden; } }

          /* ════════════════ TERMINAL HERO ════════════════ */
          .term-hero { position: relative; min-height: 100vh; display: flex; flex-direction: column;
            align-items: center; justify-content: center; gap: 28px; padding: 90px 20px 40px; }
          .term-win { width: min(720px, 92vw); border-radius: var(--radius-panel); overflow: hidden;
            background: var(--term-bg); border: 1px solid var(--term-border);
            box-shadow: 0 24px 70px var(--card-shadow); }
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
            font-family: var(--font-mono), monospace; line-height: inherit;
            color: transparent; caret-color: transparent;
            /* Fixed at 16px (not "inherit", which tracks .term-body's
               clamp(0.82rem, 2vw, 1rem) and dips as low as ~13px on phones) —
               iOS Safari auto-zooms the whole page on focus for any input
               under 16px. .term-body's own clamp already tops out at exactly
               16px, so this is a no-op on desktop and only raises the floor
               on narrow viewports. The input is fully transparent (a
               keystroke-capture overlay for the visible .term-input-echo
               beside it), so this can't cause any visible size mismatch. */
            font-size: 16px; }
          .term-cue { background: none; border: none; cursor: pointer; color: var(--text-muted);
            display: flex; align-items: center; justify-content: center; }
          .term-cue:hover { color: var(--primary); }

          /* ════════════════ TERMINAL EASTER EGGS (/decode, /fix) ════════════════
             Rendered inside the shared <Modal>, so focus-trap / esc / scroll-lock
             / focus-restore all come from there. These classes only skin the
             content — same tokens, font, and timings as the terminal above. */
          .decode-panel, .fix-panel {
            font-family: var(--font-mono), monospace; color: var(--term-text);
            font-size: 0.92rem; line-height: 1.7; display: flex; flex-direction: column; gap: 14px;
          }
          .decode-hint, .fix-hint-line { color: var(--term-title); opacity: 0.85; font-size: 0.78rem; margin: 0; }
          .decode-progress {
            color: var(--term-title); opacity: 0.7; font-size: 0.76rem; margin: 0;
            letter-spacing: 0.04em; text-transform: uppercase;
          }

          .decode-solved, .fix-success {
            font-family: var(--font-mono), monospace; color: var(--term-green);
            background: color-mix(in oklab, var(--accent) 12%, transparent);
            border: 1px solid color-mix(in oklab, var(--accent) 35%, transparent);
            border-radius: var(--radius-panel); padding: 10px 14px; font-size: 0.86rem;
          }
          .decode-solved-date { color: var(--term-title); }

          .decode-complete { display: flex; flex-direction: column; gap: 16px; padding: 6px 2px 2px; }
          .decode-complete-text {
            font-family: var(--font-mono), monospace; color: var(--term-text);
            white-space: pre-wrap; word-break: break-word; margin: 0; line-height: 2;
          }
          .decode-complete-stat { color: var(--term-title); opacity: 0.8; font-size: 0.82rem; margin: 0; }

          .decode-riddle {
            font-family: var(--font-mono), monospace; color: var(--term-accent);
            white-space: pre-wrap; word-break: break-word; margin: 0;
            border-inline-start: 2px solid var(--term-border); padding-inline-start: 12px;
          }

          .decode-feed {
            border: 1px solid var(--term-border); border-radius: var(--radius-panel); padding: 10px 12px;
            max-height: 220px; overflow-y: auto; overscroll-behavior: contain;
            scrollbar-width: thin; scrollbar-color: var(--term-border) transparent;
            display: flex; flex-direction: column; gap: 8px; background: var(--term-bg);
          }
          .decode-feed::-webkit-scrollbar { width: 8px; }
          .decode-feed::-webkit-scrollbar-track { background: transparent; }
          .decode-feed::-webkit-scrollbar-thumb { background: var(--term-border); border-radius: 4px; }
          .decode-muted { color: var(--term-title); opacity: 0.85; margin: 0; font-size: 0.86rem; }
          .decode-theory { display: flex; gap: 8px; font-size: 0.86rem; white-space: pre-wrap; word-break: break-word; }
          .decode-theory-label { color: var(--term-accent); flex-shrink: 0; }
          .decode-theory-content { color: var(--term-out); }

          .decode-form { display: flex; gap: 8px; }
          .decode-input {
            flex: 1 1 auto; min-width: 0; background: var(--term-bg); color: var(--term-text);
            border: 1px solid var(--term-border); border-radius: var(--radius-control); padding: 8px 10px;
            font-family: var(--font-mono), monospace; font-size: 0.88rem; outline: none;
          }
          .decode-input:focus-visible { outline: 2px solid var(--term-accent); outline-offset: 1px; }
          /* 0.88rem (~14px) is under iOS Safari's 16px auto-zoom-on-focus
             threshold — bump to 16px on touch-width viewports only, keeping
             the smaller terminal-density look on desktop. */
          @media (max-width: 820px) {
            .decode-input { font-size: 16px; }
          }
          .decode-submit {
            font-family: var(--font-mono), monospace; font-size: 0.86rem; color: var(--term-accent);
            background: transparent; border: 1px solid var(--term-border); border-radius: var(--radius-control);
            padding: 8px 14px; cursor: pointer; transition: border-color 0.18s ease, background 0.18s ease;
          }
          .decode-submit:hover:not(:disabled), .decode-submit:focus-visible { border-color: var(--term-accent); background: var(--surface-2); outline: none; }
          .decode-submit:disabled { opacity: 0.5; cursor: not-allowed; }
          .decode-note { color: var(--term-title); font-size: 0.82rem; margin: 0; }
          .decode-close { color: var(--term-accent); opacity: 0.85; font-size: 0.82rem; margin: 0; }
          .decode-error { color: var(--term-err); font-size: 0.82rem; margin: 0; }
          .decode-continue { align-self: flex-start; margin-top: 4px; }

          .fix-meta { display: flex; align-items: center; gap: 10px; }
          .fix-tag {
            font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.04em;
            color: var(--term-accent); border: 1px solid var(--term-border); border-radius: 999px;
            padding: 2px 10px;
          }
          .fix-title { font-weight: 700; color: var(--term-text); }
          .fix-status { display: flex; align-items: center; justify-content: space-between; gap: 10px; font-size: 0.86rem; color: var(--term-out); }
          .fix-hint-btn {
            font-family: var(--font-mono), monospace; font-size: 0.8rem; color: var(--term-accent);
            background: transparent; border: 1px solid var(--term-border); border-radius: var(--radius-control);
            padding: 5px 12px; cursor: pointer; transition: border-color 0.18s ease, background 0.18s ease;
          }
          .fix-hint-btn:hover, .fix-hint-btn:focus-visible { border-color: var(--term-accent); background: var(--surface-2); outline: none; }
          .fix-hint-text { color: var(--term-title); font-size: 0.84rem; margin: 0; font-style: italic; }

          .fix-split { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; min-height: 280px; }
          .fix-code {
            width: 100%; height: 100%; min-height: 280px; resize: vertical;
            background: var(--term-bg); color: var(--term-text); border: 1px solid var(--term-border);
            border-radius: var(--radius-panel); padding: 12px; font-family: var(--font-mono), monospace;
            font-size: 0.8rem; line-height: 1.6; outline: none;
          }
          .fix-code:focus-visible { outline: 2px solid var(--term-accent); outline-offset: 1px; }
          .fix-preview {
            width: 100%; height: 100%; min-height: 280px; border: 1px solid var(--term-border);
            border-radius: var(--radius-panel); background: #fff;
          }
          @media (max-width: 700px) {
            .fix-split { grid-template-columns: 1fr; }
            .fix-code, .fix-preview { min-height: 220px; }
          }
          /* 0.8rem (~13px) is under iOS Safari's 16px auto-zoom-on-focus
             threshold — bump to 16px on touch-width viewports only, keeping
             the smaller editor-density look on desktop. */
          @media (max-width: 820px) {
            .fix-code { font-size: 16px; }
          }

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
          .snav__links { position: relative; display: flex; align-items: center; gap: 26px; --arrow-gap: 8px; }
          .snav__link { position: relative; background: none; border: none; cursor: pointer; padding: 0;
            font-size: 0.9rem; color: var(--text-muted); transition: color 0.2s ease; }
          .snav__link:hover, .snav__link:focus-visible { color: var(--primary); }
          .snav__link.is-active { color: var(--primary); }
          /* Scroll-spy indicator: a terminal-style ">" plus an underline, both
             gliding (CSS transition on left/width) to the active link. */
          .snav__arrow, .snav__underline { position: absolute; opacity: 0; pointer-events: none;
            transition: left 0.35s ease, width 0.35s ease, opacity 0.2s ease; }
          .snav__arrow.is-on, .snav__underline.is-on { opacity: 1; }
          .snav__arrow { top: 50%; font-family: var(--font-mono), monospace; font-size: 0.9rem;
            line-height: 1; color: var(--primary);
            transform: translate(calc(-100% - var(--arrow-gap)), -50%); }
          [dir="rtl"] .snav__arrow { transform: translate(var(--arrow-gap), -50%) scaleX(-1); }
          .snav__underline { bottom: -7px; height: 2px; background: var(--primary); }
          @media (prefers-reduced-motion: reduce) {
            .snav__arrow, .snav__underline { transition: opacity 0.2s ease; }
          }
          .snav__actions { display: flex; align-items: center; gap: 8px; }
          /* 44px min — WCAG/iOS touch-target floor. Visual icon size (size={17}
             in SiteNav) is unchanged; this only grows the surrounding hit area. */
          .snav__icon { width: 44px; height: 44px; border-radius: var(--radius-control); display: flex; align-items: center; justify-content: center;
            border: 1px solid var(--border); background: var(--surface); color: var(--primary); cursor: pointer;
            font-size: 0.72rem; font-weight: 700; transition: border-color 0.2s; }
          .snav__icon:hover { border-color: var(--primary); }
          .snav__icon--text { width: auto; padding: 0 14px; font-family: var(--font-mono), monospace; }
          .snav__burger { display: none; width: 44px; height: 44px; align-items: center; justify-content: center;
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
          /* Mirror the ">" marker in RTL, same as .snav__arrow above. */
          [dir="rtl"] .snav__drawer-link::before { transform: scaleX(-1); }
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

          /* Terminal window dots: monochrome in both themes. They are inert chrome
             (they don't close/minimise anything), so the row-of-three shape
             carries the "terminal window" cue without three extra hues competing
             with the single accent. One muted-grey value for all three. */
          .term-dot--r,
          .term-dot--y,
          .term-dot--g { background: var(--text-muted); }

          /* Fallback surface behind a project image (never seen once the image
             loads); no per-project colour in a one-accent system. */
          .proj-media { background: var(--surface-2); }
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
