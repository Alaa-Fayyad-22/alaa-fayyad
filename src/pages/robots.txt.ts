import type { GetServerSideProps } from 'next';
import { SITE_URL, absoluteUrl } from '../lib/site';

// Served as a route rather than a static /public file so the domain comes from
// the single SITE_URL source of truth (and follows NEXT_PUBLIC_SITE_URL on
// previews) instead of being hardcoded a second time.
function body() {
  return [
    'User-agent: *',
    'Allow: /',
    // The form endpoints are POST-only and have nothing to index.
    'Disallow: /api/',
    '',
    `Sitemap: ${absoluteUrl('/sitemap.xml')}`,
    `Host: ${SITE_URL}`,
    '',
  ].join('\n');
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate');
  res.write(body());
  res.end();
  return { props: {} };
};

// Never rendered — getServerSideProps writes the response directly.
export default function Robots() {
  return null;
}
