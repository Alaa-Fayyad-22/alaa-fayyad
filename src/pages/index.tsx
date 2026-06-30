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
import { Analytics } from "@vercel/analytics/next"

export default function Home() {
  const { t, isRTL, locale } = useTranslation();
  const [booted, setBooted] = useState(false);

  // Apply RTL direction and font to <html> and <body> reactively
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    document.body.style.fontFamily = isRTL ? 'Cairo, sans-serif' : 'Inter, sans-serif';
  }, [isRTL, locale]);

  return (
    <>
      <Head>
        <title>Alaa Fayyad | Full Stack Developer & UI/UX Designer</title>
        <meta name="description" content="Portfolio of Alaa Fayyad — Full Stack Developer and UI/UX Designer building modern, bilingual web apps with React, Next.js, and TypeScript." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Alaa Fayyad" />
        <link rel="canonical" href="https://alaafayyad.vercel.app" />
        <link rel="icon" href="/favicon.png" style={{ borderRadius: '100%' }} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Alaa Fayyad" />
        <meta property="og:url" content="https://alaafayyad.vercel.app" />
        <meta property="og:title" content="Alaa Fayyad | Full Stack Developer & UI/UX Designer" />
        <meta property="og:description" content="Full Stack Developer and UI/UX Designer building modern, bilingual web apps with React, Next.js, and TypeScript." />
        <meta property="og:image" content="https://alaafayyad.vercel.app/portfolio_screen.png" />
        <meta property="og:image:width" content="1360" />
        <meta property="og:image:height" content="642" />
        <meta property="og:image:alt" content="Alaa Fayyad — Full Stack Developer & UI/UX Designer portfolio" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Alaa Fayyad | Full Stack Developer & UI/UX Designer" />
        <meta name="twitter:description" content="Full Stack Developer and UI/UX Designer building modern, bilingual web apps with React, Next.js, and TypeScript." />
        <meta name="twitter:image" content="https://alaafayyad.vercel.app/portfolio_screen.png" />
        <meta name="twitter:image:alt" content="Alaa Fayyad — Full Stack Developer & UI/UX Designer portfolio" />
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
