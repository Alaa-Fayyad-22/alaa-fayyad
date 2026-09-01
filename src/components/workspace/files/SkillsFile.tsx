import { useTranslation } from '../../../hooks/useTranslation';
import { skillCategories } from '../../../data/portfolio';
import styles from '../workspace.module.css';
import { CodeBlock, Str, Type } from '../Code';

/** skills.json — a JSON-shaped code header, then each real skill category from
 *  portfolio.ts as a `"category": [ … ]` block of tags. */
export default function SkillsFile() {
  const { t } = useTranslation();
  const labels: Record<string, string> = {
    frontend: t.skills.frontend,
    backend: t.skills.backend,
    design: t.skills.design,
    databases: t.skills.databases,
    devops: t.skills.devops,
  };

  return (
    <>
      <CodeBlock
        lines={[
          <>{'{'}</>,
          <>
            &nbsp;&nbsp;<Type>&quot;file&quot;</Type>: <Str>&quot;skills.json&quot;</Str>,
          </>,
          <>
            &nbsp;&nbsp;<Type>&quot;description&quot;</Type>:{' '}
            <Str>&quot;{t.workspace.skillsComment}&quot;</Str>
          </>,
          <>{'}'}</>,
        ]}
      />

      <div className={styles.headline}>{t.workspace.skillsHeadline}</div>

      {skillCategories.map((cat) => (
        <div className={styles.skillBlock} key={cat.key}>
          <div className={styles.skillCat}>&quot;{labels[cat.key] ?? cat.key}&quot;: [</div>
          <div className={styles.skillItems}>
            {cat.skills.map((s) => (
              <span className={styles.skillItem} key={s.name}>
                {s.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
