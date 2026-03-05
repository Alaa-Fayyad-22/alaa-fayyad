import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&family=Cairo:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
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
          }

          :root {
            --bg: #f8f8fc;
            --bg-secondary: #f0f0f8;
            --surface: #ffffff;
            --surface-2: #f5f4ff;
            --border: rgba(99, 102, 241, 0.15);
            --text: #0f0e1a;
            --text-muted: #6b6b8a;
            --primary: #6366f1;
            --accent: #a855f7;
            --glow: rgba(99, 102, 241, 0.3);
            --gradient: linear-gradient(135deg, #6366f1, #a855f7);
          }

          * { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--bg);
            color: var(--text);
            transition: background-color 0.3s ease, color 0.3s ease;
            overflow-x: clip;
          }

          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: var(--bg); }
          ::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 3px; }

          .gradient-text {
            background: var(--gradient);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradient 4s ease infinite;
          }

          .glass {
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--border);
          }

          .glow {
            box-shadow: 0 0 30px var(--glow), 0 0 60px rgba(99,102,241,0.1);
          }

          .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.7s ease, transform 0.7s ease;
          }
          .reveal.revealed {
            opacity: 1;
            transform: translateY(0);
          }

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

          @keyframes heroSlideUp {
            to { opacity: 1; transform: translateY(0); }
          }

          .nav-desktop { display: none; }
          @media (min-width: 768px) {
            .nav-desktop { display: flex !important; }
            .nav-mobile-btn { display: none !important; }
          }
          .nav-mobile-btn { display: flex; }

          .skill-bar {
            height: 6px;
            border-radius: 3px;
            background: var(--border);
            overflow: clip;
          }
          .skill-bar-fill {
            height: 100%;
            border-radius: 3px;
            background: var(--gradient);
            transform-origin: left;
            transform: scaleX(0);
            transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
          }
          [dir="rtl"] .skill-bar-fill { transform-origin: right; }
          .skill-bar-fill.animated { transform: scaleX(1); }

          .cursor-dot {
            width: 8px; height: 8px;
            background: var(--primary);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
          }
          .cursor-ring {
            width: 30px; height: 30px;
            border: 1px solid var(--primary);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9998;
            transition: all 0.15s ease;
            opacity: 0.6;
          }

          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-18px); }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }

          section[id] { scroll-margin-top: 72px; }

          [dir="rtl"] .ltr-only { display: none; }
          [dir="ltr"] .rtl-only { display: none; }

          .btn-primary {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 28px;
            border-radius: 999px;
            background: var(--gradient);
            color: #ffffff;
            font-weight: 600;
            font-size: 0.95rem;
            border: none;
            cursor: pointer;
            text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px var(--glow);
          }

          .btn-outline {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 28px;
            border-radius: 999px;
            background: transparent;
            color: var(--primary);
            font-weight: 600;
            font-size: 0.95rem;
            border: 1.5px solid var(--primary);
            cursor: pointer;
            text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
          }
          .btn-outline:hover {
            transform: translateY(-2px);
            background: rgba(99,102,241,0.08);
            box-shadow: 0 8px 25px var(--glow);
          }

          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-blink { animation: blink 1s step-end infinite; }
        `}} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}