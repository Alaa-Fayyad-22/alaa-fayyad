import Head from 'next/head';
import HomePage from '../components/home/HomePage';
import { useTranslation } from '../hooks/useTranslation';
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, OG_IMAGE } from '../lib/site';
import { buildJsonLd } from '../lib/jsonLd';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

/**
 * Homepage — the redesign (components/home). The IDE-workspace design that used
 * to live here is now at `/vs`; the terminal-style design is still `/classic`.
 */
// Runs in <head>, before first paint. If the loader should not play (already
// seen this session, or reduced motion) it flags <html>, and the stylesheet
// hides the server-rendered loader from that flag, so it never flashes.
const LOADER_GATE = `(function(){try{var d=document.documentElement,s=false;try{s=!!sessionStorage.getItem('home-loaded')}catch(e){}if(s||matchMedia('(prefers-reduced-motion: reduce)').matches)d.setAttribute('data-home-loaded','')}catch(e){}})();`;
// No JS = the loader could never finish, so hide it.
const LOADER_NOSCRIPT = '<style>[data-home-loader]{display:none!important}</style>';

export default function Home() {
  const { isRTL } = useTranslation();

  return (
    <>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content={SITE_NAME} />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#161413" />
        <script dangerouslySetInnerHTML={{ __html: LOADER_GATE }} />
        <noscript dangerouslySetInnerHTML={{ __html: LOADER_NOSCRIPT }} />
        <link rel="canonical" href={SITE_URL} />
        <link rel="icon" href="/favicon.png" style={{ borderRadius: '100%' }} />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />

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

        {/* Structured data — built from the real project/skill data. `<` is
            escaped so a `</script>` substring in any field can't break out. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()).replace(/</g, '\\u003c') }}
        />
      </Head>

      <HomePage />

      <Analytics/>
      <SpeedInsights/>
    </>
  );
}
