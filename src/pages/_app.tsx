import type { AppProps } from 'next/app';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Force smooth scroll on html element directly — most reliable method
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return <Component {...pageProps} />;
}