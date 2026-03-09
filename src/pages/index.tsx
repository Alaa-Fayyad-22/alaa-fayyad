import Head from 'next/head';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import { useTranslation } from '../hooks/useTranslation';

export default function Home() {
  const { isRTL, locale } = useTranslation();

  // Apply RTL direction and font to <html> and <body> reactively
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    document.body.style.fontFamily = isRTL ? 'Cairo, sans-serif' : 'Outfit, sans-serif';
  }, [isRTL, locale]);

  return (
    <>
      <Head>
        <title>Alaa Fayyad | Full Stack Developer & UI/UX Designer</title>
        <meta name="description" content="Portfolio of Alaa Fayyad — Full Stack Developer and UI/UX Designer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <link rel="icon" href="/favicon.png" style={{ borderRadius: '100%' }} />
      </Head>

      <div>
        <CustomCursor />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          {/* <Projects /> */}
          <Experience />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}