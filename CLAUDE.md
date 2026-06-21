# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio for Tanay Mehendale, hosted on GitHub Pages. Built with **Eleventy (11ty)** static site generator and **Nunjucks** templating — source lives in `src/`, output is built to `_site/`.

## Development

```bash
npm run dev     # Eleventy dev server with live reload (http://localhost:8080)
npm run build   # Production build → _site/
```

Never edit files inside `_site/` directly — it is generated and overwritten on every build.

## Architecture

### Source vs Output

- **`src/`** — all editable source files (Nunjucks templates, data, pages)
- **`_site/`** — generated output; committed and served by GitHub Pages
- **`assets/`** — static assets (CSS, images, docs); passed through to `_site/` unchanged
- **`script.js`**, **`emailjs_config.js`**, **`mapbox_config.js`** — root-level JS, passed through unchanged
- **`assets/docs/`** — five resume PDF variants: `_AI`, `_SE`, `_DE`, `_DA`, `_PM`. Nav and hero both link to the `_AI` version.

### Data Layer

Two data files in `src/_data/`:

**`projects.js`** — single source of truth for all project cards and detail pages. Eleventy reads it at build time as `projects`. Adding a new project means adding an object here — Eleventy auto-generates the detail page at `/projects/<slug>/`.

Key fields: `slug`, `title`, `shortDesc`, `tags`, `featured`, `category`, `image`, `sections[]`, `links[]`, `isComingSoon`, `isAcademicRestricted`.

**`journey.js`** — drives the interactive journey map section. Each entry is a stop on the globe tour with fields: `id`, `label`, `org`, `role`, `dateRange`, `type` (`home`/`work`/`education`), `coordinates` (lng/lat), `location`, `logo`, `chapter`, `quote`, `skills[]`, `bullets[]`, `transitionType` (`road`/`flight`/`null`).

### Template Hierarchy

```
src/_layouts/base.njk         ← master shell (head, nav, mobile overlay, footer, floating buttons)
  └── src/_layouts/project.njk    ← project detail page layout
src/index.njk                 ← landing page (uses base.njk layout)
src/404.njk                   ← custom 404 page
src/projects/index.njk        ← all-projects listing with client-side category filter
src/projects/project-page.njk ← Eleventy pagination to generate one page per project
```

### Eleventy Filters (`.eleventy.js`)

Three custom Nunjucks filters:
- `twoDigit` — zero-pads numbers (e.g., `1 | twoDigit` → `"01"`)
- `categoryLabel` — maps slug to display name (`"ai-ml"` → `"AI & Machine Learning"`)
- `featuredOnly` — filters projects array to `featured: true` items

### Theming System

CSS variables defined in `assets/css/style.css`. Light theme at `:root`, dark at `body.dark-mode`. `script.js` toggles the `dark-mode` class on `<body>` and persists to `localStorage`. Colors use `oklch()` for perceptual uniformity.

### Landing Page Sections (in order)

`#lead` → `#about` → `#projects` → `#journey` → `#skills` → `#certifications` → `#contact`

- **`#projects`**: Featured hero card (left 60%) + secondary stack (right 40%) driven by `projects | featuredOnly`
- **`#journey`**: Two parallel implementations, CSS-toggled by viewport:
  - **Desktop** (`.journey-map-desktop`): Mapbox GL JS globe tour driven by `journey.js`. Requires `mapbox_config.js` (contains the Mapbox public token). Has start gate, chapter overlay, info card, cinematic controls (pause/speed/mute), ambient audio (`assets/audio/journey.mp3`), and arc animations between stops.
  - **Mobile** (`.journey-timeline-mobile`): Static HTML timeline with sticky year-strip navigator, animated spine, and chapter cards with IntersectionObserver fade-in. Hard-coded in `index.njk` (not data-driven from `journey.js`).
- **`#skills`**: 6 "mixer channels" layout. Each channel has a CSS `--peak-w` variable (0–100%) controlling the visual weight bar, plus tagged skill lists (`sk-core`, `sk-mid`, `sk-low`).

### JS Responsibilities

**`script.js`** (root-level, minimal):
- Theme toggle: toggles `dark-mode` class on `<body>`, persists to `localStorage`
- Back-to-top smooth scroll
- Floating buttons hidden on mobile

**Inline `<script>` blocks in `src/_layouts/base.njk` and `src/index.njk`**:
- Header morphing: transparent → frosted-glass pill → full-width strip (scroll thresholds)
- Active nav link highlighting via IntersectionObserver on sections
- Mobile menu: full-screen overlay toggled by hamburger, closed by ESC or link click
- Mobile journey spine animation: fills spine gradient over 1.4s on IntersectionObserver entry
- Desktop journey map: full Mapbox GL JS tour logic — fly-to animations, arc lines, info card updates, pause/speed/mute controls, distance counter, chapter overlays

---

## Design Context

### Users

Two overlapping audiences:

1. **Tech recruiters & hiring managers** — scanning many portfolios quickly, often on a laptop, in a professional context. They need to be stopped in their tracks within 5 seconds and trust the person within 30.
2. **Engineers & technical collaborators** — willing to spend 5 minutes reading, will notice details, will judge depth. They can tell if something was copy-pasted from a template.

Both audiences need to come away with the same feeling: *"This person is distinctly themselves."*

### Brand Personality

Three words: **playful, precise, human**

- Tanay builds data systems and AI pipelines — technical depth is real, but so is the person who listens to EDM, follows F1, and reads sci-fi
- The portfolio should feel like a person wrote it, not a resume-filler filled it out
- Emotional goal: curiosity + a little delight. Visitors should discover small things they didn't expect.

### Aesthetic Direction

**No obvious aesthetic reference — original, distinctive, designed specifically for this person.**

- **Anti-reference (critical)**: dark mode with purple accent, typing animation hero, icon grid skills carousel, same project card layout repeated. This is the monoculture to escape.
- **Direction**: Something that feels authored and inhabited. Could go light or dark — but must feel like a *choice*, not a default. Personality should leak through the design: subtle nods to systems thinking, speed (F1, streaming data), and wit.
- **Theme**: Either is acceptable, but if dark — it must feel distinct from GitHub-dark. If light — it must feel warmer and less corporate than Stripe-clean.
- **Motion**: One well-placed animation beats ten scattered ones. Use motion sparingly for surprise, not as ambient decoration.

### Design Principles

1. **Personality over polish** — every section should feel authored by a specific human, not generated from a template. Quirky details and authentic voice matter more than perfection.
2. **Asymmetry signals intention** — break the expected grid at least once per section. Symmetrical grids read as generated; deliberate asymmetry reads as designed.
3. **Depth on demand** — first pass is fast: clean headline, one key signal per section. Curiosity pulls visitors deeper. Nothing should be hidden, but nothing should shout.
4. **Content drives form** — Tanay's actual context (data/AI systems, streaming, EDM, F1, sci-fi) can subtly inform aesthetic choices — rhythm, speed, layering — without being literal or kitsch.
5. **No portfolio tropes** — specifically avoid: typing hero animations, icon-grid skills sections, identical project cards in a uniform grid, side-stripe card accents, gradient text, and glowing buttons. If a pattern appears on 10,000 other dev portfolios, reject it.
