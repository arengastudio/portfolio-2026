# KICKOFF.md

> Runbook to bootstrap the portfolio with Claude Code.
> Follow steps in order. Don't skip Step 0.

---

## Step 0 — Prerequisites

Before installing anything:

- [ ] **Anthropic plan with Claude Code access** — Claude Pro, Max, Teams, Enterprise, or Console (API). Free claude.ai plan does NOT include Claude Code.
- [ ] **Domain `juancruzluna.com` purchased** — recommend [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) (~$10/year, no upsells, free WHOIS privacy).
- [ ] **GitHub account** ready for new repo.
- [ ] **Node 20 LTS** installed (`node --version` should return `v20.x.x`). If not, use [nvm](https://github.com/nvm-sh/nvm) to install.
- [ ] **pnpm** installed: `npm install -g pnpm`
- [ ] **Git** configured with your name/email.

---

## Step 1 — Install Claude Code

**macOS / Linux (recommended):**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows (PowerShell):**

```powershell
irm https://claude.ai/install.ps1 | iex
```

Verify:

```bash
claude --version
```

Should print a version number. If "command not found", restart your terminal.

---

## Step 2 — Get the fonts

PP Formula and PP Neue Montreal are from [Pangram Pangram](https://pangrampangram.com). Their license is free for personal/non-commercial — perfect for a portfolio.

1. Go to [pangrampangram.com](https://pangrampangram.com)
2. Download **PP Formula** (all weights, woff2 format)
3. Download **PP Neue Montreal** (Regular and Medium, woff2)
4. Download [JetBrains Mono](https://www.jetbrains.com/lp/mono/) (Regular, Medium — woff2)

Save them somewhere accessible — Claude Code will move them into `public/fonts/` later.

---

## Step 3 — Create the repo

```bash
# Create a new directory and initialize git
mkdir portfolio-2026
cd portfolio-2026
git init

# Create repo on GitHub (via gh CLI or web UI)
# Then connect the remote:
git remote add origin git@github.com:juancruzluna/portfolio-2026.git
```

Drop the foundation files (this folder's contents) into the repo root, respecting the structure:

```
portfolio-2026/
├── CLAUDE.md
├── DESIGN.md
├── AGENTS.md
├── README.md
├── KICKOFF.md          ← this file
└── .voice/
    ├── voice-guidelines.md
    ├── phrase-bank.md
    └── case-study-template.md
```

First commit:

```bash
git add .
git commit -m "chore: initial foundation files (DESIGN, voice, agent context)"
git push -u origin main
```

---

## Step 4 — Install designer-skills in Claude Code

```bash
cd portfolio-2026
claude
```

You're now inside Claude Code. Add the designer-skills marketplace:

```
/plugin marketplace add Owl-Listener/designer-skills
```

Then install the plugins we'll actually use:

```
/plugin install designer-toolkit@designer-skills
/plugin install ux-strategy@designer-skills
/plugin install design-systems@designer-skills
/plugin install ui-design@designer-skills
/plugin install interaction-design@designer-skills
```

Verify install:

```
/plugin list
```

You should see all 5 plugins. If a command isn't found later, run `/plugin list` to confirm.

---

## Step 5 — First prompt (bootstrap)

Inside Claude Code, paste this prompt verbatim:

> **Read CLAUDE.md, AGENTS.md, and DESIGN.md fully before doing anything else.**
>
> Then bootstrap the Astro project following exactly the locked stack decisions in AGENTS.md. Specifically:
>
> 1. Run the `pnpm create astro` command with the flags specified
> 2. Install the dependencies listed in AGENTS.md (no extras)
> 3. Configure `astro.config.mjs` with React, MDX, Sitemap integrations, the i18n config (es default, /en/* prefix), and the Vercel adapter
> 4. Create the folder structure inside `src/` exactly as specified in CLAUDE.md
> 5. Create `src/styles/tokens.css` mirroring 1:1 every token from DESIGN.md (colors, spacing, typography, motion, easing)
> 6. Create `src/styles/fonts.css` with `@font-face` declarations for PP Formula, PP Neue Montreal, and JetBrains Mono — referencing files in `public/fonts/` (the actual font files will be added in the next step)
> 7. Create `src/styles/global.css` with sane resets, base typography (body uses `--text-base`, `--color-fg` on `--color-bg`), and a visible focus state using `--color-accent`
> 8. Create `content/config.ts` defining the Content Collections schema for cases (per AGENTS.md)
> 9. Create empty placeholder MDX files for: `content/home/es.mdx`, `content/home/en.mdx`, `content/about/es.mdx`, `content/about/en.mdx`. Each with only frontmatter — NO placeholder copy. Generic "Lorem ipsum"-flavored content is the failure mode.
>
> When done, STOP. Print:
> - The final folder tree
> - The contents of `astro.config.mjs`
> - The contents of `src/styles/tokens.css` (so I can verify the token mirror)
>
> Do NOT generate UI components yet. Do NOT add features not requested. Do NOT add Tailwind, Storybook, tests, or anything else. If something is ambiguous, ask before guessing.

**Success criteria for Step 5:**
- `pnpm dev` runs without errors and serves a blank page on `localhost:4321`
- Folder structure matches CLAUDE.md exactly
- `tokens.css` includes every token from DESIGN.md, no extras
- No banned dependencies installed
- No placeholder copy anywhere

---

## Step 6 — Add the fonts

Move the downloaded font files into `public/fonts/`:

```
public/fonts/
├── PPFormula-Regular.woff2
├── PPFormula-Medium.woff2
├── PPNeueMontreal-Regular.woff2
├── PPNeueMontreal-Medium.woff2
├── JetBrainsMono-Regular.woff2
└── JetBrainsMono-Medium.woff2
```

Then ask Claude Code:

> Verify `src/styles/fonts.css` references these exact font files. Add `font-display: swap` and `font-feature-settings` for tabular numbers on JetBrains Mono. Then commit.

---

## Step 7 — Build the design system primitives

Second prompt to Claude Code:

> Now build the base UI primitives in `src/components/ui/` per DESIGN.md:
>
> 1. `Container.astro` — implements the 8-column grid (1280px max, 32px gutters, 8vw outer margin desktop, 24px mobile)
> 2. `Type.astro` — accepts a `variant` prop matching every type token (`xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `display-sm`, `display-md`, `display-lg`) and an `as` prop for the HTML element
> 3. `Link.astro` — implements the link spec from DESIGN.md §4 (underline, accent on hover)
> 4. `Button.astro` — primary and secondary variants per DESIGN.md §4. Border-radius 0. No exceptions.
>
> Each component gets its own `.module.css` next to it. All values reference tokens from `tokens.css`. No hex codes inline. No Tailwind. Build only these 4 — don't add Card, Badge, Avatar, anything else. Stop and show me the rendered output of each on a temporary test page.

---

## Step 8 — Build the home page (Hero block first)

Third prompt:

> Build the Home page Hero block per the structure in CLAUDE.md and the home content brief Juan will paste below. Use the UI primitives from Step 7. Implement the 5 home blocks ONE AT A TIME, starting with Hero. Stop after Hero, show me the result, wait for review before continuing.
>
> [Then paste the home content brief from `.voice/case-study-template.md` adapted to home, OR ask Juan for the home copy if it's not yet in the repo]

---

## Subsequent steps (after foundation)

Once the foundation works:

1. **Manifesto block** (Home block 2)
2. **Case preview block** (Home block 3) — needs at least one case to preview
3. **Final CTA + Footer** (Home blocks 4-5)
4. **Pause home, build first case study page** (LDP) — but only after Juan writes the case content
5. **Lab, Stack, About** — in that order
6. **`/1985` Easter egg** + custom 404
7. **English version** — separate drafts, not translations
8. **Curate Figma WorkBook exports** for the deep-dive links

---

## Anti-patterns to watch for in Claude Code output

If Claude Code generates any of these, push back immediately:

- ❌ Tailwind classes in any component
- ❌ Hex codes inline (should always reference `var(--color-*)`)
- ❌ Lorem ipsum / placeholder copy
- ❌ Box shadows, gradients, glows (DESIGN.md §6 is clear)
- ❌ Rounded corners on buttons/cards
- ❌ Words from the banned list (`.voice/voice-guidelines.md`)
- ❌ Any of the locked-out dependencies (styled-components, state libs, fetch libs, etc.)
- ❌ Files placed in directories not specified in CLAUDE.md
- ❌ Components added that weren't requested

If you see any of these, the prompt to use is:

> Stop. You added X which violates [DESIGN.md §Y / CLAUDE.md hard rule Z]. Revert and try again following the spec.

---

## When to ask vs when to ship

Claude Code should ASK before:
- Adding any dependency not in AGENTS.md
- Changing a token in DESIGN.md
- Inventing copy
- Diverging from the case study template

Claude Code can SHIP without asking when:
- Implementing exactly what the prompt says
- Following an explicit pattern from existing files
- Fixing typos or obvious bugs
- Refactoring within a single file for clarity

---

## Domain & deploy

Once Steps 5-8 are working locally:

1. Push to GitHub `main`
2. In Vercel dashboard: Import the GitHub repo, accept defaults
3. Set custom domain: `juancruzluna.com` → Vercel
4. In Cloudflare: point DNS to Vercel (Vercel UI gives you the records)
5. Wait for SSL (~5 min)

After the first deploy, every push to `main` auto-deploys, every PR gets a preview URL.
