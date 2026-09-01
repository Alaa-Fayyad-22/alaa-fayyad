import { useTranslation } from '../../../hooks/useTranslation';
import { logEvent } from '../../../lib/track';
import styles from '../workspace.module.css';
import { CodeBlock, Kw, Fn, Str, Cm } from '../Code';
import { yearsShipping, projectCount, skillCount } from '../meta';

/** about.tsx — code header (an `Author` object from the real name/role) then the
 *  rendered-output register: headline, bio, and a stat grid derived from real
 *  data in portfolio.ts. */
export default function AboutFile() {
  const { t } = useTranslation();

  return (
    <>
      <CodeBlock
        lines={[
          <Cm key="c">{`// src/about.tsx — ${t.workspace.aboutComment}`}</Cm>,
          <>
            <Kw>import</Kw> {'{ Beirut } '}
            <Kw>from</Kw> <Str>&apos;./lib/geo&apos;</Str>;
          </>,
          <>&nbsp;</>,
          <>
            <Kw>export const</Kw> <Fn>Author</Fn> = {'{'}
          </>,
          <>
            &nbsp;&nbsp;name: <Str>&apos;{t.hero.name}&apos;</Str>,
          </>,
          <>
            &nbsp;&nbsp;role: <Str>&apos;{t.hero.role1}&apos;</Str>,
          </>,
          <>
            &nbsp;&nbsp;base: <Fn>Beirut</Fn>(),
          </>,
          <>{'};'}</>,
        ]}
      />

      <div className={styles.headline}>
        <span className={styles.kw}>
          <span className={styles.cm}>/** {t.workspace.aboutRendered} */</span>
        </span>
        {t.about.title}
      </div>

      <p className={styles.proseText}>{t.about.bio1}</p>
      <p className={styles.proseText} style={{ marginTop: '0.75rem' }}>
        {t.about.bio2}
      </p>

      <div className={styles.statGrid}>
        <div className={styles.statBox}>
          <div className={styles.statN}>{yearsShipping}+</div>
          <div className={styles.statL}>{t.workspace.statYears}</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statN}>{projectCount}</div>
          <div className={styles.statL}>{t.workspace.statProjects}</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statN}>EN/AR</div>
          <div className={styles.statL}>{t.workspace.statBilingual}</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statN}>{skillCount}+</div>
          <div className={styles.statL}>{t.workspace.statTech}</div>
        </div>
      </div>

      <div className={styles.btnRow}>
        <a className={styles.btn} href="/Alaa_Fayyad_CV.pdf" target="_blank" rel="noopener noreferrer">
          {t.nav.resume}
        </a>
        <a
          className={`${styles.btn} ${styles.btnPrimary}`}
          href="/Alaa_Fayyad_CV.pdf"
          download
          onClick={() => logEvent('cta_click', { cta: 'download_cv' })}
        >
          {t.about.download_cv}
        </a>
      </div>
    </>
  );
}
