// Single source of truth for the site's public origin.
//
// Referenced by the SEO tags (canonical / OG / Twitter / JSON-LD), robots.txt,
// and sitemap.xml so the domain is never written out by hand in more than one
// place. Override per-environment with NEXT_PUBLIC_SITE_URL (e.g. to point a
// preview deployment at itself); the production domain is the fallback.
//
// Trailing slashes are stripped so `${SITE_URL}/path` never doubles up.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alaafayyad.vercel.app').replace(/\/+$/, '');

/** Absolute URL for a site-root-relative path. */
export const absoluteUrl = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

export const SITE_NAME = 'Alaa Fayyad';
export const SITE_TITLE = 'Alaa Fayyad | Full Stack Developer & UI/UX Designer';

export const SITE_DESCRIPTION =
  'Portfolio of Alaa Fayyad, a full stack developer and UI/UX designer based in Beirut, Lebanon. ' +
  'Building bilingual (English/Arabic, full RTL) web applications with React, Next.js, TypeScript, ' +
  'Python and Node.js — including Fattoura, an AI receipt-splitting app, and Happidoo, a Supabase-backed booking platform.';

/** OG/Twitter share image. Dimensions are the real intrinsic size of the file. */
export const OG_IMAGE = {
  url: absoluteUrl('/portfolio_screen.png'),
  width: 1360,
  height: 642,
  alt: 'Screenshot of Alaa Fayyad’s portfolio site, showing the terminal-style hero section.',
} as const;

export const AUTHOR_EMAIL = 'alaafayyadp1@gmail.com';
export const AUTHOR_LOCATION = { city: 'Beirut', country: 'Lebanon' } as const;
// Only profiles that are actually linked from the site. (The Instagram entry in
// Contact.tsx is commented out, so it is deliberately not claimed here.)
export const AUTHOR_GITHUB = 'https://github.com/Alaa-Fayyad-22';
export const AUTHOR_LINKEDIN = 'https://www.linkedin.com/in/alaa-fayyad';
