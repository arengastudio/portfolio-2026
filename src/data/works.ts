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
}

export const works: WorkItem[] = [
  {
    number: '01',
    title: 'Librodepases',
    year: '2022 — 2025',
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
    year: '2024',
    tags: ['E-commerce', 'Digital', 'Identidad'],
    description: 'Identidad digital y design system para estudio de experiencias.',
    image: '/assets/cases/arenga/03.png',
  },
  {
    number: '06',
    title: 'Banndo',
    year: '2023',
    tags: ['App', 'Producto', 'Música'],
    description: 'Diseño de producto para plataforma de música y entretenimiento.',
    image: '/assets/cases/librodepases/cover.png',
  },
];
