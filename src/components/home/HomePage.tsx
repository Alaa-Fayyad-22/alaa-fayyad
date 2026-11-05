import { useEffect, useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import styles from './home.module.css';
import { useDocumentLocale } from './useDocumentLocale';
import Loader from './Loader';
import LampCord from './LampCord';
import TopNav from './TopNav';
import Hero from './Hero';
import WorkArches from './WorkArches';
import Story from './Story';
import ContactSection from './ContactSection';
import HomeFooter from './HomeFooter';

/**
 * The redesigned homepage ("/"). The page is fully server-rendered; the loader
 * is an overlay that only appears after hydration, and `data-ready` (set on
 * mount) is what arms the scroll-reveal hiding in the stylesheet, so nothing
 * stays invisible if JS never runs.
 */
export default function HomePage() {
  const { isRTL, locale } = useTranslation();
  const [ready, setReady] = useState(false);

  useDocumentLocale(isRTL, locale);
  useEffect(() => setReady(true), []);

  return (
    <div
      className={styles.root}
      dir={isRTL ? 'rtl' : 'ltr'}
      data-lang={locale}
      data-ready={ready ? 'true' : undefined}
    >
      <Loader />
      <LampCord />
      <TopNav />
      <main>
        <Hero />
        <WorkArches />
        <Story />
        <ContactSection />
      </main>
      <HomeFooter />
    </div>
  );
}
