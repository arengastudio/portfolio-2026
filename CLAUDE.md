# CLAUDE.md

> Project context for Claude Code. Read this first, every session.

## What this is

Personal portfolio for **Juan Cruz Luna** — Product Designer & Builder. Buenos Aires.

- **Primary audience:** recruiters (#1), design studios (#2), freelance clients (#3)
- **Primary objective:** get interviews. Every design and content decision serves that.
- **Live URL:** [juancruzluna.com](https://juancruzluna.com)
- **Repo:** public on GitHub (the source code is part of the case)

The portfolio is being built as part of the positioning itself — *"designer who builds"* is the claim, the source code is the proof.

## Repo structure

```
portfolio-2026/
├── CLAUDE.md                    ← this file
├── DESIGN.md                    ← visual system. Read before any UI.
├── AGENTS.md                    ← build instructions. Read before any code.
├── README.md
├── .voice/
│   ├── voice-guidelines.md      ← read before writing any copy
│   ├── phrase-bank.md           ← 9 reusable display statements
│   └── case-study-template.md   ← 9-block template for /work cases
├── content/                     ← MDX. Edit here, not in src/.
│   ├── home/{es,en}.mdx
│   ├── about/{es,en}.mdx
│   ├── cases/
│   │   ├── librodepases/        ← pilot case
│   │   ├── arenga/
│   │   └── _template.mdx
│   ├── lab/, stack/, contact/
│   └── easter-eggs/1985.mdx
├── src/
│   ├── pages/                   ← Astro routes
│   ├── components/{ui,motion,case}/
│   ├── layouts/
│   ├── styles/
│   │   ├── tokens.css           ← generated from DESIGN.md
│   │   ├── fonts.css            ← @font-face declarations
│   │   └── global.css
│   └── lib/
└── public/
    ├── assets/                  ← final case mockups, video
    ├── fonts/                   ← self-hosted PP Formula, Neue Montreal, JBM (woff2)
    └── deep-dive/               ← Figma WorkBook exports per case
```

## Hard rules (non-negotiable)

1. **Always read `DESIGN.md` before generating UI.** No exceptions.
2. **Always read `.voice/voice-guidelines.md` before writing copy.** No exceptions.
3. **Never use banned words.** See voice-guidelines.md for the full list.
4. **Never use Tailwind classes.** This project uses CSS Modules + custom properties.
5. **Never use shadows, gradients, or glows.** Brutalist editorial = flat.
6. **Never invent placeholder copy.** If real content is missing, ASK before drafting fake copy. Generic "Lorem ipsum"-flavored content is the failure mode we're avoiding.
7. **Never break the case study template silently.** If a case doesn't fit, propose a variant — don't reorganize without asking.
8. **Default to ES** (Rioplatense). Mirror to EN as a separate draft, not a translation.
9. **Never add features that weren't requested.** No AI chatbots, no CMS, no contact forms (the contact mechanism is a displayed email).
10. **Self-host all fonts.** No Google Fonts CDN, no Adobe Fonts.

## Workflow / command map

When working on this repo, prefer these commands from `designer-skills` (installed via Claude Code plugin marketplace — see `KICKOFF.md`):

| Task | Command |
|---|---|
| Write a new case study | `/designer-toolkit:write-case-study` (then customize against `.voice/case-study-template.md`) |
| Document a design decision | `/designer-toolkit:write-rationale` |
| Frame a problem statement | `/ux-strategy:frame-problem` |
| Define / extract design tokens | `/design-systems:tokenize` |
| Audit an existing screen | `/ui-design:responsive-audit` |
| Design a new interaction | `/interaction-design:design-interaction` |
| Plan motion sequence | `/interaction-design:design-interaction` + reference DESIGN.md §9 |

## Stack quick reference

See `AGENTS.md` for full technical details.

- **Astro 5+** with React islands
- **GSAP + ScrollTrigger + SplitText** for cinematic motion
- **Lenis** for smooth scroll
- **OGL** for WebGL (or Three.js vanilla as fallback)
- **CSS Modules + custom properties** for styling (no Tailwind)
- **MDX + Astro Content Collections** for content
- **Astro i18n** (ES default, `/en/*` for English)
- **Vercel** hosting + analytics
- **GitHub** auto-deploy on `main`

## Sitemap

**Public sections (6):**
- `/` — Home
- `/work` — Work index
- `/work/[slug]` — Case studies (Arenga, Librodepases, +1 TBD)
- `/about` — Bio + story
- `/lab` — Experiments and micro-interactions
- `/stack` — Tools and setup
- `/contact` — Email-only

**Hidden pages (2):**
- `/1985` — Easter egg with retro theme
- `/404` — Custom error page

**No blog.** Decided. Don't add one.

## What "good" looks like

A change is good if:
- It improves the chances of a recruiter starting a conversation
- It honors the visual system in `DESIGN.md`
- It respects the voice in `.voice/voice-guidelines.md`
- The code is something Juan would be proud to show in `view source`

A change is bad if:
- It looks like a generic AI-generated portfolio
- It uses any banned word
- It uses utility classes, shadows, or rounded corners on brutalist elements
- It adds a feature nobody asked for
- It treats Juan's work as content to be summarized rather than narrated

## When in doubt

**Ask Juan.** Don't guess on copy or major design decisions. Generic placeholder content is worse than no content.

If Juan is not available, leave a clear `// TODO(juan):` comment in code or `<!-- TODO: -->` in MDX, with a specific question — never a vague "fill in later".
