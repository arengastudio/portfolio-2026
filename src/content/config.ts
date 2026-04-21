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
    /** Path to the hero cover image (relative to /public). Replaces the colored placeholder. */
    coverImage: z.string().optional(),
    /**
     * Qualitative impact bullets shown in the TLDR section.
     * Short statements without percentages or specific figures.
     */
    bullets: z.array(z.string()).optional(),
    /** Label for the Figma/proto banner at the end of the case (e.g. 'Ver workbook'). */
    figmaBannerLabel: z.string().optional(),
    /**
     * URL for the Figma/proto banner.
     * Must be a valid https:// URL or the '#' placeholder.
     * Defaults to '#' in [slug].astro when not set.
     */
    figmaBannerUrl: z.union([z.literal('#'), z.string().url()]).optional(),
  }),
});

export const collections = { cases };
