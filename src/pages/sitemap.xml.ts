import type { GetServerSideProps } from 'next';
import { SITE_URL } from '../lib/site';

// The site is a single page: the locale toggle and every section (#about,
// #projects, …) live on one URL, so one <url> entry is the honest sitemap.
// Fragment URLs are not separate documents and must not be listed.
//
// Both locales are served from that same URL, so they are declared as xhtml
// alternates rather than as extra <url> entries.
function body(lastmod: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${SITE_URL}/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/" />
    <xhtml:link rel="alternate" hreflang="ar" href="${SITE_URL}/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const lastmod = new Date().toISOString().split('T')[0];

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate');
  res.write(body(lastmod));
  res.end();
  return { props: {} };
};

// Never rendered — getServerSideProps writes the response directly.
export default function Sitemap() {
  return null;
}
