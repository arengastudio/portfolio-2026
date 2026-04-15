# AGENTS.md

> Build instructions for any coding agent working on this repo.

## Stack (locked)

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Astro 5+** | Content-first, MPA |
| Interactivity | **React 18+** | Islands only, marked `client:visible` or `client:idle` |
| Smooth scroll | **Lenis** | One instance per page, exposed via React context |
| Motion | **GSAP 3** + ScrollTrigger + SplitText | Always wrap in `gsap.context()` |
| WebGL | **OGL** (preferred) or Three.js vanilla | Lightweight; degrade gracefully |
| Styling | **CSS Modules + CSS custom properties** | NO Tailwind |
| Content | **MDX + Astro Content Collections** | Type-safe schemas |
| i18n | **Astro built-in** (`@astrojs/i18n`) | ES default, `/en/*` |
| Image optimization | **Astro built-in** (sharp) | Use `<Image>`, never raw `<img>` |
| Icons | **Lucide React** | Selective use only — type > icons |
| Hosting | **Vercel** | + Vercel Analytics |
| CI/CD | **GitHub → Vercel** | Auto-deploy on `main`, PR previews |
| Node | **20 LTS** | |
| Package manager | **pnpm** | |

### Locked decisions (do not change without explicit ask)

- ❌ No Tailwind. CSS Modules + custom properties only.
- ❌ No styled-components, Emotion, vanilla-extract. Plain CSS.
- ❌ No client-side routing libraries. Astro pages handle routing.
- ❌ No state management libraries. React `useState`/`useReducer` for islands; everything else server-rendered.
- ❌ No fetch libraries. Native `fetch` if needed.
- ❌ No CMS. Content lives in `content/` as MDX.
- ❌ No comments, likes, social embeds, contact forms.

## Initial bootstrap

```bash
# Scaffold
pnpm create astro@latest portfolio-2026 -- --template minimal --typescript strict --no-install
cd portfolio-2026

# Core integrations
pnpm add @astrojs/react @astrojs/mdx @astrojs/sitemap @astrojs/vercel
pnpm add @vercel/analytics

# Motion + WebGL
pnpm add gsap @studio-freight/lenis ogl

# React peer deps
pnpm add react react-dom
pnpm add -D @types/react @types/react-dom

# Install
pnpm install
```

Then configure `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://juancruzluna.com',
  integrations: [react(), mdx(), sitemap()],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false }
  },
  output: 'static',
  adapter: vercel({ webAnalytics: { enabled: true } })
});
```

## Folder rules

- `src/components/ui/` — base components (`Button`, `Link`, `Container`, `Type`, `Grid`)
- `src/components/motion/` — scroll-driven and WebGL components (always React islands)
- `src/components/case/` — components specific to the case study template (`CaseHero`, `TLDR`, `KeyDecisions`, `Reflection`, etc.)
- `src/styles/tokens.css` — exposes every variable from `DESIGN.md` as CSS custom property
- `src/styles/fonts.css` — `@font-face` declarations for PP Formula, PP Neue Montreal, JetBrains Mono
- `src/styles/global.css` — resets, base typography, focus styles
- `content/` — never put UI components here, MDX only

## CSS Module conventions

- File naming: `Component.module.css` next to `Component.astro` or `Component.tsx`
- Class naming: `camelCase` (CSS Modules convention)
- Use `composes` for shared patterns
- Use `:global()` only for resets and `@font-face` declarations
- Always reference tokens: `color: var(--color-fg);` — never `color: #0A0A0A;`
- One module per component. No "utilities.module.css" dumping ground.

## Token pipeline

`DESIGN.md` is the source of truth. `src/styles/tokens.css` mirrors it 1:1.

When `DESIGN.md` changes, `tokens.css` MUST be updated in the same commit.

If you find yourself wanting to add a new token, ASK FIRST — the system is intentionally tight. Adding tokens silently inflates the design system over time.

## Content collections

Define schemas in `src/content/config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const cases = defineCollection({
  type: 'content',
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
  }),
});

export const collections = { cases };
```

## Performance budget

Hard targets — fail the build if missed:

- Lighthouse Performance: **≥ 95** on home and any case page
- LCP: **< 2.0s**
- CLS: **< 0.05**
- JS bundle per page: **< 60 KB** (gzipped, excluding islands)
- Self-hosted fonts only — no Google Fonts CDN calls
- Images: Astro's `<Image>` component, never raw `<img>`
- WebGL: lazy-load and pause when off-screen

## Motion conventions

- Always wrap GSAP animations in `gsap.context(() => {...}, scope)` and clean up on unmount
- Always check `prefers-reduced-motion` before initializing scroll-driven motion
- ScrollTrigger refresh on Astro view transitions (use the `astro:page-load` event)
- Lenis instance: one per page, exposed via React context to motion components
- All scroll-driven animations must have a static fallback for reduced-motion users

## Accessibility minimums

- **Color contrast:** AA minimum for body text; AAA preferred for cream/near-black combinations
- **Keyboard:** all interactive elements accessible, visible focus state (use accent color outline, never browser default)
- **Skip-to-content link** on every page
- **Semantic HTML always** — never div-soup
- **Alt text** on every image, including decorative (`alt=""`)
- **Reduced motion** support is mandatory, not optional
- **Language attribute** on `<html>` reflects current locale (`lang="es"` or `lang="en"`)

## Testing

- No unit testing framework configured (portfolio scope; not earned).
- Manual QA before deploy: keyboard nav, reduced-motion, mobile real device, dark mode N/A (single theme).
- Lighthouse CI on every PR via Vercel.

## Deploy / ops

- **Production branch:** `main`
- **Preview deploys:** every PR
- **Environment variables:** Vercel dashboard only, never committed
- **DNS:** managed via Cloudflare Registrar
- **SSL:** Vercel-managed, automatic
- **Domain:** `juancruzluna.com`

## Don't

- Don't add a CMS. Content is MDX in the repo.
- Don't add an admin panel.
- Don't add comments, likes, or social embeds.
- Don't add a contact form (the contact mechanism is a displayed email).
- Don't add tracking pixels beyond Vercel Analytics.
- Don't add cookie banners (privacy-first analytics, none needed).
- Don't add a service worker / PWA features (not earned at portfolio scope).
- Don't add E2E tests, Storybook, or Chromatic — overhead without payoff for this scope.

## When you don't know

Ask Juan. The default failure mode of an AI agent on this repo is shipping plausible-looking generic code. The right answer to ambiguity is a question, not a guess.
