/**
 * ticker.ts
 * Configuración del ticker en vivo (Sistema Global 01).
 * Cambiá `active` a false si no hay proyectos en curso.
 * Cambiá los items según los proyectos activos. Sin imports — solo data.
 */

export interface TickerConfig {
  active: boolean;
  items: string[];
  activeCount?: number;
  lastUpdated: string;
}

export const tickerConfig: TickerConfig = {
  active: true,
  items: [
    'Oncoliq · Rediseño web',
    'Prode 2026 · Build activo',
    '+3 proyectos en código',
  ],
  activeCount: 3,
  lastUpdated: '14 may 2026',
};

/** Texto de estado mini para el sidebar (deriva del estado del ticker). */
export const tickerStatusLabel = tickerConfig.active
  ? 'En producción'
  : 'Entre proyectos';
