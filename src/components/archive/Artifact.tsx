/**
 * Artifact.tsx
 * Notas dispersas en el canvas. 4 variantes:
 *   postit     — fondo amarillo rotado
 *   darkQuote  — near-black + texto accent grande
 *   stat       — número grande display
 *   note       — informal, dashed border
 */
import type { CanvasArtifact } from '../../config/projects';
import styles from './Artifact.module.css';

interface Props {
  artifact: CanvasArtifact;
}

export default function Artifact({ artifact }: Props) {
  const baseStyle: Record<string, string> = {
    left: `${artifact.x - artifact.width / 2}px`,
    top: `${artifact.y - artifact.height / 2}px`,
    width: `${artifact.width}px`,
    height: `${artifact.height}px`,
  };

  if (artifact.variant === 'postit' && artifact.rotation) {
    baseStyle.transform = `rotate(${artifact.rotation}deg)`;
  }

  const variantClass = styles[artifact.variant] ?? '';

  if (artifact.variant === 'stat') {
    return (
      <div className={`${styles.artifact} ${variantClass}`} style={baseStyle}>
        <span className={styles.statBig}>{artifact.statBig}</span>
        <p className={styles.text}>{artifact.text}</p>
        <span className={styles.footer}>{artifact.footer}</span>
      </div>
    );
  }

  return (
    <div className={`${styles.artifact} ${variantClass}`} style={baseStyle}>
      <p className={styles.text}>{artifact.text}</p>
      <span className={styles.footer}>{artifact.footer}</span>
    </div>
  );
}
