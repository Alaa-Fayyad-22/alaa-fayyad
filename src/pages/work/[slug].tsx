import Head from 'next/head';
import type { GetStaticPaths, GetStaticProps } from 'next';
import WorkPage, { WORK_SLUGS, type WorkSlug } from '../../components/home/WorkPage';
import { useTranslation } from '../../hooks/useTranslation';
import { SITE_URL, SITE_NAME } from '../../lib/site';

/**
 * /work/frontend, /work/design, /work/backend — the rooms behind the homepage
 * arches. Intentionally empty for now, so they stay out of the index. Any
 * other slug 404s (fallback: false).
 */
export default function Work({ slug }: { slug: WorkSlug }) {
  const { t } = useTranslation();
  const title = `${t.home.workPage[slug]} | ${SITE_NAME}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <meta name="theme-color" content="#161413" />
        <link rel="canonical" href={`${SITE_URL}/work/${slug}`} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <WorkPage slug={slug} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: WORK_SLUGS.map((slug) => ({ params: { slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ slug: WorkSlug }> = async ({ params }) => ({
  props: { slug: params?.slug as WorkSlug },
});
