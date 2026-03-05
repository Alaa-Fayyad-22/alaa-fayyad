import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"       // adds/removes class="dark" on <html>
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <Component {...pageProps} />
    </ThemeProvider>
  );
}