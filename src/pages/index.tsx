import Head from 'next/head';
import { useEffect, useState } from 'react';
import SiteNav from '../components/site/SiteNav';
import BootOverlay from '../components/site/BootOverlay';
import TerminalHero from '../components/site/TerminalHero';
import SmoothScroll from '../components/SmoothScroll';
import ScreenFrame from '../components/deck/ScreenFrame';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { useTranslation } from '../hooks/useTranslation';
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, OG_IMAGE } from '../lib/site';
import { buildJsonLd } from '../lib/jsonLd';
import { Analytics } from "@vercel/analytics/next"

export default function Home() {
  const { t, isRTL, locale } = useTranslation();
  const [booted, setBooted] = useState(false);

  // Apply RTL direction and font to <html> and <body> reactively
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    document.body.style.fontFamily = isRTL ? 'var(--font-arabic), sans-serif' : 'var(--font-body), sans-serif';
  }, [isRTL, locale]);

  return (
    <>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content={SITE_NAME} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={SITE_URL} />
        <link rel="icon" href="/favicon.png" style={{ borderRadius: '100%' }} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        {/* The locale is toggled client-side on one URL, so the active locale is
            reported and the other is offered as an alternate on that same URL. */}
        <meta property="og:locale" content={isRTL ? 'ar_AR' : 'en_US'} />
        <meta property="og:locale:alternate" content={isRTL ? 'en_US' : 'ar_AR'} />
        <meta property="og:image" content={OG_IMAGE.url} />
        <meta property="og:image:width" content={String(OG_IMAGE.width)} />
        <meta property="og:image:height" content={String(OG_IMAGE.height)} />
        <meta property="og:image:alt" content={OG_IMAGE.alt} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SITE_TITLE} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE.url} />
        <meta name="twitter:image:alt" content={OG_IMAGE.alt} />

        {/* Structured data — built from the real project/skill data. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
        />
      </Head>

      {!booted && <BootOverlay onDone={() => setBooted(true)} />}

      <SmoothScroll />
      <SiteNav />

      <main>
        <TerminalHero start={booted} />

        <ScreenFrame id="about" num={1}
          title={t.about.title} isRTL={isRTL}>
          <About bare />
        </ScreenFrame>

        <ScreenFrame id="skills" num={2}
          title={t.skills.title} subtitle={t.skills.subtitle} isRTL={isRTL}>
          <Skills bare />
        </ScreenFrame>

        <ScreenFrame id="projects" num={3}
          title={t.projects.title} subtitle={t.projects.subtitle} isRTL={isRTL}>
          <Projects bare />
        </ScreenFrame>

        <ScreenFrame id="experience" num={4}
          title={t.experience.title} subtitle={t.experience.subtitle} isRTL={isRTL}>
          <Experience bare />
        </ScreenFrame>

        <ScreenFrame id="contact" num={5}
          title={t.contact.title} subtitle={t.contact.subtitle} isRTL={isRTL}>
          <Contact bare />
        </ScreenFrame>
      </main>

      <Footer />

      <Analytics/>
    </>
  );
}
