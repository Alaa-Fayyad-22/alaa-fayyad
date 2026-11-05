import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '../../hooks/useTranslation';
import styles from './home.module.css';
import { cx } from '../workspace/cx';
import { useDocumentLocale } from './useDocumentLocale';
import LampCord from './LampCord';
import TopNav from './TopNav';

export const WORK_SLUGS = ['frontend', 'design', 'backend'] as const;
export type WorkSlug = (typeof WORK_SLUGS)[number];

/** A (for now) empty "room" behind one of the arches. */
export default function WorkPage({ slug }: { slug: WorkSlug }) {
  const { t, isRTL, locale } = useTranslation();
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
      <LampCord />
      <TopNav onHome={false} />
      <main className={cx(styles.wrap, styles.workIn)}>
        <Link href="/#work" className={styles.back}>
          <span className={styles.backArrow} aria-hidden="true">←</span>
          <span>{t.home.workPage.back}</span>
        </Link>
        <span className={cx(styles.mono, styles.routePath)}>/work/{slug}</span>
        <h1 className={styles.routeTitle}>{t.home.workPage[slug]}</h1>
        <p className={styles.routeEmpty}>{t.home.workPage.empty}</p>
      </main>
    </div>
  );
}
