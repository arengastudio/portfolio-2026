/**
 * works.ts
 * Shared project data for /archivo and the home archive preview.
 * Ordered: cases with full case studies first, then archive-only projects.
 */

export interface WorkItem {
  number: string;
  title: string;
  year: string;
  yearEn?: string;
  tags: string[];
  description: string;
  descriptionEn?: string;
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
    descriptionEn: 'AI platform for football scouting. Product Design Lead for 3 years.',
    image: '/assets/cases/librodepases/cover.png',
    href: '/work/librodepases',
  },
  {
    number: '02',
    title: 'SparkClub',
    year: '2025',
    tags: ['AI', 'Employee Engagement', 'MVP'],
    description: 'MVP de plataforma de engagement con IA. Prototipo para inversores en 6 semanas.',
    descriptionEn: 'Employee engagement MVP with AI. Investor-ready prototype in 6 weeks.',
    image: '/assets/cases/sparkclub/cover.png',
    href: '/work/sparkclub',
  },
  {
    number: '03',
    title: 'Garantear',
    year: '2025',
    tags: ['Fintech', 'End-to-end', 'Brand'],
    description: 'End-to-end design para plataforma de garantías de alquiler.',
    descriptionEn: 'End-to-end design for a rental guarantee fintech platform.',
    image: '/assets/cases/garantear/cover.jpg',
    href: '/work/garantear',
  },
  {
    number: '04',
    title: 'Arenga Studio',
    year: '2024 — Presente',
    yearEn: '2024 — Present',
    tags: ['Studio', 'Founder', 'End-to-end'],
    description: 'Co-fundé un estudio digital. 8 productos entregados en 18 meses.',
    descriptionEn: 'Co-founded a digital studio. 8 products shipped in 18 months.',
    image: '/assets/cases/arenga/cover.png',
    href: 'https://arengastudio.com',
    external: true,
  },
  {
    number: '05',
    title: 'EEVA Studios',
    year: '2025',
    tags: ['E-commerce', 'Redesign', 'Brand', 'Fashion', 'Web'],
    description: 'Rediseño completo de e-commerce para marca de ropa con estética futurista. Experiencia de compra, identidad visual y usabilidad.',
    descriptionEn: 'Full e-commerce redesign for a fashion brand with futurist aesthetics. Shopping experience, visual identity, and usability.',
    image: '/assets/archive/eeva01.png',
    href: 'https://www.figma.com/design/nZmhkavuxCzhlNcxBKXvM7/Portfolio-2026---Juan-Luna?node-id=1029-1851',
    external: true,
  },
  {
    number: '06',
    title: 'Banndo',
    year: '2024',
    tags: ['Product', 'Redesign', 'App Mobile', 'Web', 'SEO'],
    description: 'Rediseño de app de publicidad móvil en vehículos. UI, módulo de gestión de flota, estados documentales y sitio comercial con foco en SEO para marcas y conductores.',
    descriptionEn: 'Redesign of a mobile billboard advertising app. UI, fleet management module, document states, and commercial site focused on SEO for brands and drivers.',
    image: '/assets/archive/banndo.png',
    href: 'https://www.figma.com/design/nZmhkavuxCzhlNcxBKXvM7/Portfolio-2026---Juan-Luna?node-id=1029-1852',
    external: true,
  },
  {
    number: '07',
    title: 'SimplePass',
    year: '2024 — 2025',
    tags: ['Product', 'Redesign', 'Ticketing', 'App', 'SaaS'],
    description: 'Rediseño dual: plataforma de ticketing y creación de eventos para productores, más app de gestión de equipos para la noche del evento.',
    descriptionEn: 'Dual redesign: ticketing and event creation platform for producers, plus a team management app for event night.',
    image: '/assets/archive/simple.png',
    href: 'https://www.figma.com/design/nZmhkavuxCzhlNcxBKXvM7/Portfolio-2026---Juan-Luna?node-id=1029-1853',
    external: true,
  },
  {
    number: '08',
    title: 'Beachwalk',
    year: '2024',
    tags: ['Web', 'Redesign', 'Hospitality', 'Hotel'],
    description: 'Rediseño web completo para hotel en Miami. Restructuración de presentación de amenidades alineada al nuevo rebranding.',
    descriptionEn: 'Full web redesign for a hotel in Miami. Restructured amenities presentation aligned with the new rebranding.',
    image: '/assets/archive/beachwalk.png',
    href: 'https://www.figma.com/design/nZmhkavuxCzhlNcxBKXvM7/Portfolio-2026---Juan-Luna?node-id=1029-1854',
    external: true,
  },
  {
    number: '09',
    title: 'Ranch',
    year: '2025',
    tags: ['MVP', 'App', 'Product Design', 'Events'],
    description: 'MVP para app de creación y publicación de eventos cannábicos con compra de entradas para asistentes.',
    descriptionEn: 'MVP for a cannabis event creation and publishing app with ticket purchasing for attendees.',
    image: '/assets/archive/ranch.png',
    href: 'https://www.figma.com/design/nZmhkavuxCzhlNcxBKXvM7/Portfolio-2026---Juan-Luna?node-id=1029-1856',
    external: true,
  },
];
