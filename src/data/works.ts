/**
 * works.ts
 * Shared project data for /archivo and the home archive preview.
 * Ordered: cases with full case studies first, then archive-only projects.
 */

export interface WorkItem {
  number: string;
  title: string;
  year: string;
  tags: string[];
  description: string;
  image: string;
  href?: string;
  external?: boolean;
}

export const works: WorkItem[] = [
  {
    number: '01',
    title: 'Librodepases',
    year: '2022 — 2026',
    tags: ['AI', 'Sports', 'SaaS', 'Design System'],
    description: 'Plataforma AI para scouting de fútbol. Product Design Lead durante 3 años.',
    image: '/assets/cases/librodepases/cover.png',
    href: '/work/librodepases',
  },
  {
    number: '02',
    title: 'SparkClub',
    year: '2025',
    tags: ['AI', 'Employee Engagement', 'MVP'],
    description: 'MVP de plataforma de engagement con IA. Prototipo para inversores en 6 semanas.',
    image: '/assets/cases/sparkclub/cover.png',
    href: '/work/sparkclub',
  },
  {
    number: '03',
    title: 'Garantear',
    year: '2025',
    tags: ['Fintech', 'End-to-end', 'Brand'],
    description: 'End-to-end design para plataforma de garantías de alquiler.',
    image: '/assets/cases/garantear/cover.jpg',
    href: '/work/garantear',
  },
  {
    number: '04',
    title: 'Arenga Studio',
    year: '2024 — Presente',
    tags: ['Studio', 'Fundador', 'End-to-end'],
    description: 'Co-fundé un estudio digital. 8 productos entregados en 18 meses.',
    image: '/assets/cases/arenga/cover.png',
    href: '/work/arenga',
  },
  {
    number: '05',
    title: 'EEVA Studios',
    year: '2025',
    tags: ['Brand', 'Design System', 'Web'],
    description: 'Identidad digital y sistema de booking para estudio de fotografía y video.',
    image: '/assets/archive/eeva01.png',
    href: 'https://www.figma.com/design/nZmhkavuxCzhlNcxBKXvM7/Portfolio-2026---Juan-Luna?node-id=1029-1851',
    external: true,
  },
  {
    number: '06',
    title: 'Banndo',
    year: '2024 — 2025',
    tags: ['App', 'Producto', 'Música'],
    description: 'Diseño de producto para plataforma de música y entretenimiento.',
    image: '/assets/archive/banndo.png',
    href: 'https://www.figma.com/design/nZmhkavuxCzhlNcxBKXvM7/Portfolio-2026---Juan-Luna?node-id=1029-1852',
    external: true,
  },
  {
    number: '07',
    title: 'SimplePass',
    year: '2024 — 2025',
    tags: ['SaaS', 'Product Design', 'Accesibilidad'],
    description: 'Rediseño de plataforma de gestión de accesos y membresías.',
    image: '/assets/archive/simple.png',
    href: 'https://www.figma.com/design/nZmhkavuxCzhlNcxBKXvM7/Portfolio-2026---Juan-Luna?node-id=1029-1853',
    external: true,
  },
  {
    number: '08',
    title: 'Beachwalk',
    year: '2024',
    tags: ['Brand', 'Web', 'Hospitality'],
    description: 'Identidad y sitio web para complejo de playa.',
    image: '/assets/archive/beachwalk.png',
    href: 'https://www.figma.com/design/nZmhkavuxCzhlNcxBKXvM7/Portfolio-2026---Juan-Luna?node-id=1029-1854',
    external: true,
  },
  {
    number: '09',
    title: 'Ranch',
    year: '2025',
    tags: ['Brand', 'Web', 'Food & Beverage'],
    description: 'Identidad y presencia digital para marca gastronómica.',
    image: '/assets/archive/ranch.png',
    href: 'https://www.figma.com/design/nZmhkavuxCzhlNcxBKXvM7/Portfolio-2026---Juan-Luna?node-id=1029-1856',
    external: true,
  },
];
