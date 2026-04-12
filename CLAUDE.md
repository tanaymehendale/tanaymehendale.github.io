# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static personal portfolio website for Tanay Mehendale, hosted on GitHub Pages at `tanaymehendale.github.io`. It is a **pure HTML/CSS/JavaScript site** — no build step, no package manager, no framework.

## Development

**No build or install commands exist.** Open `index.html` directly in a browser, or serve the root directory with any static file server:

```bash
# Python (built-in)
python -m http.server 8080

# Node.js (if available)
npx serve .
```

There are no linting tools, test suites, or CI/CD pipelines configured.

## Architecture

### File Structure

- `index.html` — Single-page portfolio; all major sections live here
- `script.js` — All client-side logic (animations, theme, scroll, navigation)
- `assets/css/style.css` — All styles (~1600 lines), no external CSS framework
- `emailjs_config.js` — EmailJS credentials (loaded by index.html)
- `404.html` — Custom GitHub Pages 404 page
- `projects/*/index.html` — Individual project detail pages

### Single-Page Layout

`index.html` is divided into semantic sections (in order): `#lead`, `#about`, `#projects`, `#experience`, `#education`, `#skills`, `#contact`. The fixed navbar links scroll to these anchors.

### Theming System

CSS variables in `style.css` define two themes (`:root` for light, `[data-theme="dark"]` for dark). The toggle in `script.js` writes `data-theme="dark"` to `<html>` and persists the choice to `localStorage`.

### Project Detail Pages

Each `projects/<slug>/index.html` is a standalone page. They share the same navbar/footer structure as the main page and link back to `../../index.html`. Adding a new project requires: (1) creating the detail page, (2) adding a card in the `#projects` section of `index.html`.

### External Dependencies (CDN only)

- **Font Awesome** — icons via CDN, no local copy
- **EmailJS** — contact form (`emailjs_config.js` holds the service/template/public key)
- **LinkedIn Badge widget** — embedded in the `#about` section

### Skills Carousel

The skills section (`#skills`) uses a CSS `@keyframes` infinite-scroll animation on `.skills-slide`. Icons are SVG files in `assets/images/skills/`. The slide content is duplicated in HTML to create a seamless loop.

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

- **Anti-reference (critical)**: The current site IS the anti-reference — dark mode with purple accent, typing animation hero, icon grid skills carousel, same project card layout repeated. This is the monoculture to escape.
- **Direction**: Something that feels authored and inhabited. Could go light or dark — but must feel like a *choice*, not a default. Personality should leak through the design: subtle nods to systems thinking, speed (F1, streaming data), and wit.
- **Theme**: Either is acceptable, but if dark — it must feel distinct from GitHub-dark. If light — it must feel warmer and less corporate than Stripe-clean.
- **Motion**: One well-placed animation beats ten scattered ones. Use motion sparingly for surprise, not as ambient decoration.

### Design Principles

1. **Personality over polish** — every section should feel authored by a specific human, not generated from a template. Quirky details and authentic voice matter more than perfection.
2. **Asymmetry signals intention** — break the expected grid at least once per section. Symmetrical grids read as generated; deliberate asymmetry reads as designed.
3. **Depth on demand** — first pass is fast: clean headline, one key signal per section. Curiosity pulls visitors deeper. Nothing should be hidden, but nothing should shout.
4. **Content drives form** — Tanay's actual context (data/AI systems, streaming, EDM, F1, sci-fi) can subtly inform aesthetic choices — rhythm, speed, layering — without being literal or kitsch.
5. **No portfolio tropes** — specifically avoid: typing hero animations, icon-grid skills sections, identical project cards in a uniform grid, side-stripe card accents, gradient text, and glowing buttons. If a pattern appears on 10,000 other dev portfolios, reject it.
