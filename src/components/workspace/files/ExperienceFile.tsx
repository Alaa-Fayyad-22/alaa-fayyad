import { useTranslation } from '../../../hooks/useTranslation';
import { experiences } from '../../../data/portfolio';
import styles from '../workspace.module.css';
import { CodeBlock, Cm } from '../Code';
import { pseudoHash } from '../meta';

/** experience.log — a `git log`-style header, then each real role from
 *  portfolio.ts as a commit line. Hashes are decorative, deterministic
 *  stand-ins (see meta.pseudoHash); roles, companies and periods are real. */
export default function ExperienceFile() {
  const { t, isRTL } = useTranslation();

  return (
    <>
      <CodeBlock
        lines={[<Cm key="g">$ git log --oneline --graph</Cm>]}
      />

      <div className={styles.headline}>{t.workspace.experienceHeadline}</div>

      {experiences.map((exp, i) => (
        <div className={styles.commit} key={i}>
          <span className={styles.commitHash}>{pseudoHash(exp.role + exp.company)}</span>
          <div>
            <div className={styles.commitMsg}>{isRTL ? exp.roleAr : exp.role}</div>
            <div className={styles.commitMeta}>
              {(isRTL ? exp.companyAr : exp.company)} · {(isRTL ? exp.periodAr : exp.period)}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
