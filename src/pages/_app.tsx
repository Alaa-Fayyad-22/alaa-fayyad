import type { AppProps } from 'next/app';
import { Inter, JetBrains_Mono, Cairo } from 'next/font/google';

// Fonts are self-hosted: next/font downloads and serves them from our own origin
// at build time, so a visitor's browser never talks to fonts.googleapis.com or
// fonts.gstatic.com (and Google never sees their IP). The generated family names
// are hashed, so nothing may reference 'Inter' / 'Cairo' / 'JetBrains Mono' by
// name — everything goes through the CSS variables published on :root below.
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-body',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-mono',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-arabic',
});

export default function App({ Component, pageProps }: AppProps) {
  // Smooth scrolling is owned entirely by Lenis (see SmoothScroll.tsx). We
  // deliberately do NOT set a native `scroll-behavior: smooth` here — that would
  // fight Lenis's per-frame scrolling and make momentum scrolls janky.
  return (
    <>
      <style jsx global>{`
        :root {
          --font-body: ${inter.style.fontFamily};
          --font-mono: ${jetbrainsMono.style.fontFamily};
          --font-arabic: ${cairo.style.fontFamily};
        }
      `}</style>
      <div className={`${inter.variable} ${jetbrainsMono.variable} ${cairo.variable}`}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
