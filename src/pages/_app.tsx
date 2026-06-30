import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  // Smooth scrolling is owned entirely by Lenis (see SmoothScroll.tsx). We
  // deliberately do NOT set a native `scroll-behavior: smooth` here — that would
  // fight Lenis's per-frame scrolling and make momentum scrolls janky.
  return <Component {...pageProps} />;
}