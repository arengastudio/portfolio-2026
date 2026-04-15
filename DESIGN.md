# DESIGN.md

> Visual system for juancruzluna.com. Read before generating any UI. No exceptions.

## 1. Visual Theme & Atmosphere

**Brutalismo elegante editorial.**

Bold typography that earns its size. Controlled palette. Cinematic motion. Whitespace that means something. Anti-decorative — every element justifies its existence. The site reads like a magazine that knows it's a website, not a website pretending to be a magazine.

- **Mood density:** loose. Lots of breathing room around dramatic typographic moments.
- **Design philosophy:** function over polish. Pixels are cheap, decisions aren't.
- **Builder cred is part of the aesthetic.** The source code is part of the case. Clean CSS, semantic HTML, no soup.

## 2. Color Palette & Roles

| Token | Hex | Role |
|---|---|---|
| `--color-bg` | `#F5F2EC` | Background, surfaces, default canvas (warm cream) |
| `--color-fg` | `#0A0A0A` | Body text, primary UI, structural elements (near-black) |
| `--color-accent` | `#4B53F6` | Links, hover, accent words, callouts (Arenga blue-violet) |
| `--color-muted` | `rgba(10, 10, 10, 0.6)` | Secondary text, captions, meta |
| `--color-border` | `rgba(10, 10, 10, 0.12)` | Subtle dividers, hairlines |

Total = 5 functional colors. No gradients, no overlays except `muted` and `border`. No semantic states (success/warning/error) — none needed for portfolio scope.

**Accent rules (strict):**
- Use `--color-accent` ONLY for: links, hover states, single accent words inside body, headline color emphasis on a small portion of a phrase, mono email/contact text, focus rings.
- NEVER for body text longer than 3-4 words — vibrates aggressively against cream.
- Reserve for moments that earn it. Less is more. The accent's power comes from scarcity.

## 3. Typography Rules

**Font families:**
- **Display:** `PP Formula` (Pangram Pangram) — headlines, statements, hero, manifesto
- **Body:** `PP Neue Montreal` (Pangram Pangram) — paragraphs, UI, bajadas, metadata labels
- **Mono:** `JetBrains Mono` — code, meta info, emails, breadcrumbs, technical signal

All self-hosted as `woff2` in `public/fonts/`. License: Pangram Pangram free for personal use; JetBrains Mono OFL.

**Type scale:**

| Token | Size | Family | Weight | Line-height | Tracking | Use |
|---|---|---|---|---|---|---|
| `--text-xs` | 12px | Mono | 400 | 1.4 | 0 | meta, captions, breadcrumbs |
| `--text-sm` | 14px | Body | 400 | 1.5 | 0 | small body, footer, labels |
| `--text-base` | 17px | Body | 400 | 1.55 | 0 | body principal, case prose |
| `--text-lg` | 20px | Body | 400 | 1.5 | 0 | lead paragraphs, intros |
| `--text-xl` | 28px | Display | 500 | 1.2 | -0.01em | sub-section headers |
| `--text-2xl` | 40px | Display | 500 | 1.1 | -0.02em | section headers |
| `--text-3xl` | 64px | Display | 500 | 1.05 | -0.03em | page titles |
| `--text-display-sm` | 96px | Display | 500 | 0.95 | -0.04em | secondary display moments |
| `--text-display-md` | 144px | Display | 500 | 0.9 | -0.04em | primary display |
| `--text-display-lg` | `clamp(120px, 18vw, 260px)` | Display | 500 | 0.85 | -0.05em | "BUILD. BREAK. SHIP." energy |

**Type rules:**
- Display weights are `500` only. Brutalism doesn't need Black or ExtraBold — earns its weight through scale.
- Body uses `400` by default, `500` only for emphasis within paragraphs (sparingly).
- ALL CAPS reserved for display statements from the phrase bank. Never for body, navigation, or UI.
- Tight tracking on display (`-0.01` to `-0.05em`) — letters earn their proximity at scale.
- Italics: avoid. Use accent color or weight contrast for emphasis instead.
- Responsive display: use `clamp()` instead of breakpoint switches.

## 4. Component Stylings

### Links
- Default: underlined, 1px line, 0.2em offset.
- Color: inherit (no accent by default). Accent reserved for "see also", external, or CTA links.
- Hover: color shifts to `--color-accent`, underline thickness goes to 2px. Duration: `--duration-base`.

### Buttons (two variants only)

**Primary (CTA):**
- Border: 1.5px solid `--color-fg`
- Background: transparent
- Text: Display, 14px, weight 500, ALL CAPS allowed (statement-like)
- Tracking: 0.05em
- Padding: `--space-2` (16px) top/bottom, `--space-4` (32px) left/right
- Hover: bg fills with `--color-fg`, text flips to `--color-bg`. Duration: `--duration-base`.
- **Border-radius: 0** (brutalist, no exceptions on CTAs)

**Secondary:**
- No border, no background
- Underlined text, weight 500
- Same hover behavior as links

### Cards (case previews)
- No border, no shadow, no rounded corners
- Optional inverted variant: `--color-fg` background with `--color-bg` text
- Padding: `--space-5` (48px) on desktop, `--space-3` (24px) on mobile
- Hover: subtle scale or accent underline on title only — never card lift effects

### Navigation
- **Top-fixed only on home**, scrolls away after hero
- Inline on inner pages; scroll-aware (fades on scroll-down, returns on scroll-up)
- Items: Mono, 13px, tracking 0.05em, lowercase
- Active state: underline only (no background, no color shift)

### Inputs
- Not used in primary flows (anti-friction principle: contact = displayed email).
- If needed: underline-only, no border, no fill. Placeholder in `--color-muted`.

## 5. Layout Principles

**Grid:**
- 8 columns
- Max container width: 1280px
- Gutter: 32px
- Outer margin: 8vw on desktop, 24px on mobile

**Spacing scale (8px base, editorial jumps):**

| Token | Value |
|---|---|
| `--space-1` | 8px |
| `--space-2` | 16px |
| `--space-3` | 24px |
| `--space-4` | 32px |
| `--space-5` | 48px |
| `--space-6` | 64px |
| `--space-7` | 96px |
| `--space-8` | 128px |
| `--space-9` | 192px |
| `--space-10` | 256px |
| `--space-11` | 384px |

**Whitespace philosophy:**
Whitespace is a design element, not absence. Big type needs big air. Sections breathe at `--space-9` (192px) minimum on desktop. Between blocks within a section: `--space-6` to `--space-7`.

**Layout patterns:**
- **Hero blocks:** full viewport height (100vh). Display type left-aligned or off-center — never dead center.
- **Case study prose:** max-width 640–720px for readability; full-bleed for visuals.
- **Asymmetric layouts encouraged** in editorial sections (manifesto, key decisions, reflection).
- **Avoid 3-column equal grids.** They feel safe and corporate. Use 2+1 splits, full-bleed, or cascading layouts instead.

## 6. Depth & Elevation

**No shadows. No elevation. Ever.**

The brutalist editorial aesthetic is flat by definition. Hierarchy comes from:
- Type size and weight contrast
- Color contrast (fg on bg, accent for emphasis)
- Whitespace separation
- Border treatments (only when functional, never decorative)

Surfaces overlap visually only through scroll-driven motion (parallax, pinning, reveal) — never through shadow tricks.

## 7. Do's and Don'ts

### Do
- Use type as the primary visual element
- Reserve accent color for moments that matter
- Embrace asymmetry in editorial sections
- Use mono font for technical/structural information (emails, dates, version numbers, breadcrumbs)
- Let display statements take a full viewport when they earn it
- Write in Rioplatense Spanish with tech terms in English when natural
- Self-host all fonts (zero CDN font calls)
- Default to semantic HTML over div soup

### Don't
- ❌ Use shadows, gradients, glows, or blurs (except `prefers-reduced-motion` fallbacks)
- ❌ Use Tailwind utility classes — CSS Modules + custom properties only
- ❌ Use accent color (`#4B53F6`) for body text or paragraphs (vibrates against cream)
- ❌ Use rounded corners on brutalist elements (buttons, cards, tags)
- ❌ Use ALL CAPS outside display statements from the phrase bank
- ❌ Use these words anywhere: `apasionado`, `soluciones` (as generic), `user-centric`, `sinergia`, `innovador`, `disruptivo`, `journey`, `mindful`, `crafted with love`, `soy un eterno curioso`, `holistic`, `delightful` (when meaningless). Full list: `.voice/voice-guidelines.md`.
- ❌ Use stock-feeling layouts (3 equal columns, hero-left + image-right, generic feature grids)
- ❌ Use icons where typography can do the job
- ❌ Use loading spinners — content-first reveal, no spinner UI

## 8. Responsive Behavior

**Breakpoints:**
- Mobile: `< 768px`
- Tablet: `768–1024px`
- Desktop: `> 1024px`

**Touch targets:** minimum 44px hit area for any interactive element on mobile.

**Display type on mobile:**
- `--text-display-lg` clamps down to ~80px on small screens via `clamp()`
- Maintain dramatic relative scale even when absolute size shrinks
- Manifesto principles stack vertically; numbers (01/02/03) shift to inline labels

**Grid collapse:**
- 8 cols on desktop → 4 cols on tablet → single column on mobile
- Outer margin reduces to 24px on mobile
- Spacing scale reduces by ~30% on mobile (manual override per section, not automatic)

**Motion on mobile:**
- WebGL: keep but reduce particle counts / scene complexity
- Scroll-driven: keep but simplify (no parallax-on-parallax, no nested pins)
- Lenis smooth scroll: enabled (works fine via touch)

**Reduced motion (`prefers-reduced-motion: reduce`):**
- Disable Lenis (use native scroll)
- Replace scroll-driven animations with simple opacity fade-in
- Disable WebGL background animations (static fallback poster image)
- Remove all hover-driven transforms (keep color shifts)

## 9. Motion Principles

**Easing curves:**

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Default for most transitions |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Big section transitions |
| `--ease-spring` | GSAP `back.out(1.4)` | Delight moments (sparingly) |

**Durations:**

| Token | Value | Use |
|---|---|---|
| `--duration-fast` | 150ms | Hover states, micro-interactions |
| `--duration-base` | 300ms | Most state changes |
| `--duration-slow` | 600ms | Section reveals |
| `--duration-cinematic` | 1200ms | Hero entrance, scene transitions |

**Scroll-driven principles:**
- Pin sections that deserve attention (manifesto, case study heroes)
- Parallax reserved for hero and section dividers — never on body content
- Reveal-on-scroll for case study blocks (one block at a time, ease-out)
- Velocity-driven effects on display type (Lenis velocity → letter-spacing or skew on scroll)

**WebGL principles:**
- Used sparingly: hero background, name distortion on hover, Easter egg `/1985`
- Always degrade gracefully (`@supports` checks, static poster fallback)
- Never block content render — WebGL is decoration, not structure
- Pause when off-screen (Intersection Observer)

## 10. Agent Prompt Guide

### Quick reference
- BG: `#F5F2EC` cream
- FG: `#0A0A0A` near-black
- Accent: `#4B53F6` blue-violet (use sparingly)
- Display: PP Formula, weight 500
- Body: PP Neue Montreal, weight 400 (500 for emphasis)
- Mono: JetBrains Mono
- Grid: 8 cols, 1280px max, 32px gutters
- Spacing: 8px base, indexed 1–11
- Border-radius: `0` (no rounded corners on brutalist elements)
- Shadows: none, ever

### Ready-to-use prompts

> "Build a hero section using DESIGN.md. Display type at `--text-display-lg`, fg on bg, full viewport, asymmetric padding. PP Formula via @font-face from `public/fonts/`."

> "Create a case study Hero block: project name in `--text-3xl`, role+timeframe in mono `--text-xs`, one-line outcome in `--text-lg`. Visual placeholder for screen recording. CSS Modules."

> "Add a scroll-driven reveal: section pins for 100vh, type fades in word-by-word using GSAP ScrollTrigger + SplitText. Respect prefers-reduced-motion."

> "Build the manifesto block: 3 principles, asymmetric layout, big numbers (01/02/03) as inline marks, statements in `--text-display-sm`. No card wrapping."

### Anti-pattern check (before generating UI, verify)
- [ ] No Tailwind classes (use CSS Modules)
- [ ] No shadows / gradients / glows
- [ ] No accent color in body paragraphs
- [ ] No rounded corners on buttons or brutalist elements
- [ ] No banned words (see `.voice/voice-guidelines.md`)
- [ ] No 3-equal-column generic grids
- [ ] Type is the hero of the layout
- [ ] Self-hosted fonts referenced, not Google CDN
- [ ] `prefers-reduced-motion` handled
