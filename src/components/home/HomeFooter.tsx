import Link from 'next/link';
import { useTranslation } from '../../hooks/useTranslation';
import { smoothScrollTo } from '../../lib/scroll';
import Legal from '../site/Legal';
import styles from './home.module.css';
import { cx } from '../workspace/cx';
import { useBeirutClock } from './useBeirutClock';

/**
 * Four-column footer. Privacy / Terms are the existing <Legal/> modals (their
 * text lives in messages/*.json), restyled through .legalSlot.
 */
export default function HomeFooter({ onHome = true }: { onHome?: boolean }) {
  const { t } = useTranslation();
  const { time } = useBeirutClock();
  const f = t.home.footer;
  const year = new Date().getFullYear();

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    if (!onHome) return;
    e.preventDefault();
    smoothScrollTo(id);
  };

  return (
    <footer className={styles.footer}>
      <div className={cx(styles.wrap, styles.fgrid)}>
        <div className={styles.fcol}>
          <span className={styles.fbrand}>{t.home.nav.brand}</span>
          <span>{f.bio}</span>
        </div>
        <nav className={styles.fcol} aria-label={f.ariaWork}>
          <span className={styles.fh}>{f.workHeading}</span>
          <Link href="/work/frontend">{t.home.workPage.frontend}</Link>
          <Link href="/work/design">{t.home.workPage.design}</Link>
          <Link href="/work/backend">{t.home.workPage.backend}</Link>
        </nav>
        <nav className={styles.fcol} aria-label={f.ariaNavigate}>
          <span className={styles.fh}>{f.navHeading}</span>
          <Link href="/#home" onClick={scrollTo('top')}>{f.home}</Link>
          <Link href="/#story" onClick={scrollTo('story')}>{f.story}</Link>
          <Link href="/classic">{f.terminal}</Link>
        </nav>
        <div className={styles.fcol}>
          <span className={styles.fh}>{f.statusHeading}</span>
          <span>{f.available}</span>
          <span>{f.remote}</span>
          <span>
            {f.city} · <b className={styles.mono} style={{ color: 'var(--text)' }}>{time}</b>
          </span>
        </div>
      </div>
      <div className={cx(styles.wrap, styles.fbottom)}>
        <span>© {year} {t.home.nav.brand}. {f.credit}</span>
        <div className={styles.fbottomNav}>
          <div className={styles.legalSlot}>
            <Legal />
          </div>
          <button type="button" className={styles.backTop} aria-label={f.backToTopAria} onClick={() => smoothScrollTo('top')}>
            {f.backToTop}
          </button>
        </div>
      </div>
    </footer>
  );
}
