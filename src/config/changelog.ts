/**
 * changelog.ts
 * Eventos visibles del archivo, usados por VisitorRecognition (Sistema Global 02).
 * Solo items posteriores a la última visita del usuario se muestran.
 *
 * Formato fecha: ISO YYYY-MM-DD (para comparación timestamp).
 */

export interface ChangelogEntry {
  date: string;
  text: string;
}

export const changelog: ChangelogEntry[] = [
  { date: '2026-05-12', text: 'Nuevo artefacto en el archivo' },
  { date: '2026-05-10', text: 'Oncoliq entró en producción' },
  { date: '2026-05-08', text: 'Rediseño del archivo · canvas navegable' },
];
