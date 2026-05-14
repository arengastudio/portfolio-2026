/**
 * projects.ts
 * Datos del canvas /archivo (Página 2).
 *
 * Coordenadas en "espacio mundo" del canvas (px, sistema 2D libre).
 * El canvas se inicializa centrado sobre LDP.
 *
 * level: jerarquía visual.
 *   1 = principal (LDP), grande, legible sin scroll
 *   2 = secundario (SparkClub, Garantear), mediano
 *   3 = terciario (EEVA, Prode), chico, requiere pan
 *
 * patternTone: define la paleta del placeholder color + grain pattern.
 */

export type CanvasLevel = 1 | 2 | 3;
export type PlaceholderTone =
  | 'accent-dark'
  | 'green-dark'
  | 'blue-dark'
  | 'warm-dark'
  | 'near-black';

export interface CanvasProject {
  id: string;
  title: string;
  year: string;
  credit: string;
  hoverBlurb: string;
  href: string;
  level: CanvasLevel;
  /** Coordenadas mundo del centro de la tarjeta. */
  x: number;
  y: number;
  /** Tamaño en px del card. */
  width: number;
  height: number;
  tone: PlaceholderTone;
  /** Banner de proyecto activo (Prode). Si true: bg near-black, sin imagen, dot REC. */
  inProduction?: boolean;
  /** Ficha técnica para SidebarContextCase. */
  meta: {
    duration: string;
    role: string;
    status: 'Entregado' | 'En producción';
    teamSize: number;
  };
}

export type ArtifactVariant = 'postit' | 'darkQuote' | 'stat' | 'note';

export interface CanvasArtifact {
  id: string;
  variant: ArtifactVariant;
  text: string;
  footer: string;
  x: number;
  y: number;
  width: number;
  height: number;
  /** Rotación en grados (post-it). */
  rotation?: number;
  /** Para variante stat: el número grande destacado. */
  statBig?: string;
}

/* ─── Proyectos ──────────────────────────────────────────────── */

export const canvasProjects: CanvasProject[] = [
  {
    id: 'ldp',
    title: 'Librodepases',
    year: '2022–2025',
    credit: 'Librodepases · AI scouting · 2022–2025',
    hoverBlurb:
      'El desafío no era el algoritmo. Era convencer a scouts de 60 años de que la IA podía ayudarlos.',
    href: '/work/librodepases',
    level: 1,
    x: 1400,
    y: 800,
    width: 520,
    height: 340,
    tone: 'accent-dark',
    meta: {
      duration: '2022–2025',
      role: 'Product Design Lead',
      status: 'Entregado',
      teamSize: 12,
    },
  },
  {
    id: 'sparkclub',
    title: 'SparkClub',
    year: '2023',
    credit: 'SparkClub · Comunidad y eventos · 2023',
    hoverBlurb:
      'Una plataforma donde el producto era la experiencia, no la funcionalidad.',
    href: '/work/sparkclub',
    level: 2,
    x: 800,
    y: 950,
    width: 340,
    height: 320,
    tone: 'green-dark',
    meta: {
      duration: '6 semanas',
      role: 'Product Designer',
      status: 'Entregado',
      teamSize: 4,
    },
  },
  {
    id: 'garantear',
    title: 'Garantear',
    year: '2023',
    credit: 'Garantear · Fintech · 2023',
    hoverBlurb:
      'Diseñar confianza para un servicio que la gente no entiende todavía.',
    href: '/work/garantear',
    level: 2,
    x: 2050,
    y: 750,
    width: 280,
    height: 380,
    tone: 'blue-dark',
    meta: {
      duration: '2023',
      role: 'End-to-end Design',
      status: 'Entregado',
      teamSize: 5,
    },
  },
  {
    id: 'eeva',
    title: 'EEVA Studios',
    year: '2024',
    credit: 'EEVA Studios · Fashion ecommerce · 2024',
    hoverBlurb:
      'Cuando el producto físico es más fuerte que cualquier UI que puedas diseñar.',
    href: '/work/eeva-studios',
    level: 3,
    x: 750,
    y: 1400,
    width: 360,
    height: 240,
    tone: 'warm-dark',
    meta: {
      duration: '2024',
      role: 'End-to-end Design',
      status: 'Entregado',
      teamSize: 3,
    },
  },
  {
    id: 'prode',
    title: 'Prode 2026',
    year: '2026',
    credit: 'Prode 2026 · Arenga Studio',
    hoverBlurb: 'En producción ahora. Build activo.',
    href: '#',
    level: 3,
    x: 2100,
    y: 1500,
    width: 260,
    height: 260,
    tone: 'near-black',
    inProduction: true,
    meta: {
      duration: 'May 2026 — ahora',
      role: 'Product Designer · Founder',
      status: 'En producción',
      teamSize: 3,
    },
  },
];

/* ─── Artefactos ─────────────────────────────────────────────── */

export const canvasArtifacts: CanvasArtifact[] = [
  {
    id: 'art-01',
    variant: 'postit',
    text:
      'Primera versión del dashboard de LDP tenía 14 métricas visibles. Terminamos con 3. Los scouts no leen dashboards. Observan.',
    footer: 'LDP  /  Iteración 04  /  Nov 2023',
    x: 1100,
    y: 1300,
    width: 240,
    height: 240,
    rotation: -3,
  },
  {
    id: 'art-02',
    variant: 'darkQuote',
    text:
      '¿Qué hace un diseñador cuando el usuario y el cliente quieren cosas opuestas?',
    footer: 'Garantear  /  Brief inicial',
    x: 2400,
    y: 1100,
    width: 320,
    height: 220,
  },
  {
    id: 'art-03',
    variant: 'stat',
    text: 'versiones del onboarding antes de llegar a una que funcionaba.',
    footer: 'SparkClub  /  2023',
    statBig: '6',
    x: 1700,
    y: 1700,
    width: 280,
    height: 200,
  },
  {
    id: 'art-04',
    variant: 'note',
    text:
      'Aprendiendo que diseñar y commitear son más parecidos de lo que parecen.',
    footer: 'En curso  /  May 2026',
    x: 2350,
    y: 400,
    width: 260,
    height: 180,
  },
];

/* ─── Helpers para Sidebar ───────────────────────────────────── */

export const archiveStats = {
  projects: canvasProjects.length,
  artifacts: canvasArtifacts.length,
};

/** Último proyecto entregado (no en producción). */
export const lastDelivered = canvasProjects
  .filter((p) => !p.inProduction)
  .sort((a, b) => (a.year > b.year ? -1 : 1))[0];
