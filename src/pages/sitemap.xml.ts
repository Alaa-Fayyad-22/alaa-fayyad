import type { GetServerSideProps } from 'next';
import { SITE_URL } from '../lib/site';

// Two real documents: `/` (the IDE-workspace homepage) and `/classic` (the
// preserved terminal design). Section fragments (#about, #projects, …) are not
// separate documents and must not be listed. Both locales are served from each
// URL, so they are declared as xhtml alternates rather than extra <url> entries.
function body(lastmod: string) {
  const page = (path: string, priority: string) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${path}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${SITE_URL}${path}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${path}" />
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${page('/', '1.0')}
${page('/classic', '0.7')}
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
