/**
 * ProjectCard.tsx
 * Tarjeta del canvas /archivo. Posicionada en world coords.
 *
 * Spec:
 *  - Reposo: placeholder color + nombre + año + credit
 *  - Hover (desktop): oscurece + process line + "Ver case →"
 *  - Variant "inProduction" (Prode): near-black, sin imagen, dot REC pulse, sin link
 */
import type { CanvasProject } from '../../config/projects';
import styles from './ProjectCard.module.css';

interface Props {
  project: CanvasProject;
}

export default function ProjectCard({ project }: Props) {
  const style: Record<string, string> = {
    left: `${project.x - project.width / 2}px`,
    top: `${project.y - project.height / 2}px`,
    width: `${project.width}px`,
    height: `${project.height}px`,
  };

  if (project.inProduction) {
    return (
      <div
        className={`${styles.card} ${styles.cardProduction}`}
        style={style}
        data-tone={project.tone}
        aria-label={`${project.title} — en producción`}
      >
        <h3 className={styles.prodTitle}>{project.title}</h3>
        <span className={styles.prodSub}>
          <span className={styles.recDot} aria-hidden="true"></span>
          En producción
        </span>
      </div>
    );
  }

  return (
    <a
      className={styles.card}
      style={style}
      data-tone={project.tone}
      href={project.href}
      aria-label={`${project.title} — ${project.year}`}
    >
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.titleBlock}>
        <div className={styles.titleRow}>
          <span className={styles.title}>{project.title}</span>
          <span className={styles.year}>{project.year}</span>
        </div>
        <span className={styles.credit}>{project.credit}</span>
      </div>
      <div className={styles.hoverContent}>
        <p className={styles.processLine}>{project.hoverBlurb}</p>
        <span className={styles.hoverCta}>Ver case →</span>
      </div>
    </a>
  );
}
