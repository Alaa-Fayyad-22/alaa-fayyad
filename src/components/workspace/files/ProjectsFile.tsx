import { useTranslation } from '../../../hooks/useTranslation';
import { projects } from '../../../data/portfolio';
import { logEvent } from '../../../lib/track';
import styles from '../workspace.module.css';
import { CodeBlock, Kw, Fn, Cm } from '../Code';

/** projects/index.tsx — code header then every real project from portfolio.ts
 *  as a card. The file-pane scrolls, so the list is never truncated. */
export default function ProjectsFile() {
  const { t, isRTL } = useTranslation();

  return (
    <>
      <CodeBlock
        lines={[
          <>
            <Kw>export const</Kw> <Fn>projects</Fn> = [
          </>,
          <>
            &nbsp;&nbsp;<Cm>{`// ${t.workspace.projectsComment}`}</Cm>
          </>,
          <>];</>,
        ]}
      />

      <div className={styles.headline}>{t.projects.title}</div>

      {projects.map((p, i) => (
        <div className={styles.projCard} key={p.id}>
          <div className={styles.projName}>
            {String(i + 1).padStart(2, '0')} · {isRTL ? p.titleAr : p.title}
          </div>
          <div className={styles.projDesc}>{isRTL ? p.descriptionAr : p.description}</div>
          <div className={styles.projMeta}>
            <span className={styles.projLive}>● {t.workspace.projectLive}</span>
            {p.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
            <a
              href={p.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => logEvent('cta_click', { cta: 'project_live', project: p.title })}
            >
              {t.projects.view_live}
            </a>
            <a
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => logEvent('cta_click', { cta: 'project_github', project: p.title })}
            >
              {t.projects.view_code}
            </a>
          </div>
        </div>
      ))}
    </>
  );
}
