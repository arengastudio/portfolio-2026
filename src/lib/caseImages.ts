import type { ImageMetadata } from 'astro';

const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/cases/**/*.{png,jpg,jpeg}',
  { eager: true }
);

const images = new Map<string, ImageMetadata>(
  Object.entries(modules).map(([path, module]) => [
    path.replace('../assets', '/assets'),
    module.default,
  ])
);

export function resolveCaseImage(src?: string): ImageMetadata | undefined {
  return src ? images.get(src) : undefined;
}
