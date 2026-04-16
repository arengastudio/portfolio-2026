import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Loads MDX from root-level content/cases/ — files live outside src/ for easy editing.
// See CLAUDE.md for the full content directory structure.
const cases = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/cases' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    role: z.string(),
    timeframe: z.string(),
    outcome: z.string(),
    client: z.string(),
    team: z.string(),
    platforms: z.array(z.string()),
    tags: z.array(z.string()),
    locale: z.enum(['es', 'en']),
    publishedAt: z.date(),
    figmaDeepDive: z.string().url().optional(),
    /** Color key for the case hero visual block. Matches CaseEntry colorKey. */
    colorKey: z.enum(['accent', 'fg', 'dark']).default('accent'),
  }),
});

export const collections = { cases };
