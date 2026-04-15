# Case Study Template

> The 9-block structure for every case in `/work`.
> Optimized for: recruiter scans first 3 blocks, hiring manager reads to the end.

## The 9 blocks

### 1. Hero
- Project name
- Role + timeframe (e.g., "Product Design Lead · 2022 – Present")
- One-line outcome (the elevator pitch of the case)
- Visual: screen recording of the key flow > static mockup

### 2. TL;DR card
Scannable metadata in 10 seconds.
- Client / Company
- Role
- Team (size + composition)
- Timeframe
- Platforms (web, iOS, Android, etc.)
- Tags (3–5 keywords)
- 2–3 outcome bullets — with numbers if they exist

### 3. Context
2–3 paragraphs.
- The business
- The user
- The moment in time

NOT what the product does. The situation around the work.

### 4. The problem
Make it hurt. Concrete, with signal.
- A metric, a quote, or a screen-recording of the broken flow
- One paragraph max
- If you don't have a number, use a real quote from the team or a video

### 5. Approach
1–2 principles or frameworks that guided the work.
- *"We treated scouts as data analysts, not browsers."*
- *"Every decision had to survive the data team's roadmap."*

Show how you think before what you did.

### 6. Key decisions / Key initiatives ← THE MOST IMPORTANT BLOCK
3–5 decisions, each with:

- **What** you decided
- **Why** (the trade-off explicit)
- **What you discarded** or what obvious path you didn't take
- **Visual** that shows it (ideally with the discarded version too)

This block is what differentiates senior from mid. Nobody else shows trade-offs.

### 7. Solution
Final mockups organized by flow/module — never feature-dump.
- Group by user journey, not by screen type
- One zoom-in to a detail (interaction, component, animation)
- Rest in grid

### 8. Impact
- Quantitative if it exists (adoption, conversion, time, retention)
- Qualitative if not (team quotes, what got unlocked, follow-up features that built on the system)
- Continuity signal: *"this system today supports X new features without design intervention"*

### 9. Reflection + Deep dive link
- One honest paragraph: what you learned, what you'd do differently. **Big seniority signal.**
- Link to the Figma WorkBook ("Want to see the raw work? →"). The deep-dive is for people who want proof.

---

## Examples: YES vs NO

### Block 4 — The Problem

✅ **YES:**
> "Scouts spent an average of 12 minutes building a player shortlist. Of those who started, 60% abandoned before the third candidate. The product team had heard this in support tickets for over a year — but no one had measured it until we ran the audit in week 2 of my onboarding."

❌ **NO:**
> "We needed to improve usability across core flows and reduce friction in the scouting experience. Users were facing challenges that needed to be addressed."

**Why YES wins:** concrete metric, time-bound, names the discovery moment.
**Why NO loses:** zero specificity. Words a hundred designers wrote this week.

### Block 6 — Key Decisions

✅ **YES:**
> "We removed the 'save as draft' button from the shortlist creation flow. Counterintuitive — drafts feel safe — but data showed 70% of drafts were abandoned and never returned to. Removing the option forced a decision in the moment, which lifted completion from 40% to 71%. Trade-off accepted: users who weren't ready to commit dropped out earlier (which we wanted)."

❌ **NO:**
> "We iterated on the shortlist flow to make it more user-friendly and improve completion rates."

**Why YES wins:** specific decision, counterintuitive, with metric and explicit trade-off.
**Why NO loses:** any designer could write it about any project.

### Block 9 — Reflection

✅ **YES:**
> "I shipped the redesign in 8 weeks and we hit the metrics. What I'd do differently: I underweighted the agent persona — we built primarily for clubs and scouts, and agents (a smaller but vocal user segment) felt the redesign happened to them, not for them. Three months later we're still cleaning up that gap. The lesson isn't 'do more research'; it's 'name the personas you're consciously deprioritizing, and tell them so'."

❌ **NO:**
> "It was a great learning experience and I grew a lot as a designer."

**Why YES wins:** concrete miss, specific lesson, no false humility.
**Why NO loses:** tells the recruiter you didn't actually reflect.

---

## Variant adjustments per case type

| Case type | Variant |
|---|---|
| **Long-tenure design lead role** (e.g., LDP) | Block 6 becomes "Key Initiatives" — each initiative is a mini-case with its own decision + trade-off |
| **End-to-end with brand** (e.g., Garantear) | Insert a "Brand foundations" mini-block between blocks 5 and 6 |
| **MVP / fast project** (e.g., Spark Club) | Compress: Impact is qualitative, focus on "what we validated" |
| **Founder-story case** (e.g., Arenga) | Block 3 expands; tell the why-we-started arc before the what-we-did |

If a case breaks the template, refine the template — don't break the template silently.

## When NOT to write a case

A project earns a case study only if:

1. You can answer "what was the trade-off?" with a real example
2. You can show before/after or at least process artifacts
3. You can write Block 9 honestly without inventing growth

If any of those is "no" — leave it in `/lab` as an experiment, not in `/work` as a case.

## File structure per case

```
content/cases/[case-slug]/
├── es.mdx                     ← Spanish version (default)
├── en.mdx                     ← English version (separate draft, not translation)
├── meta.json                  ← TL;DR card data, tags, dates
└── assets/
    ├── hero.mp4               ← screen recording
    ├── decisions/             ← key decision visuals (kept + discarded)
    └── solutions/             ← final mockups
```
