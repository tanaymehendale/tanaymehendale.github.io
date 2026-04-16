# tanaymehendale.github.io

Personal portfolio website for Tanay Mehendale, live at [tanaymehendale.github.io](https://tanaymehendale.github.io).

A static site — no build step, no package manager, no framework.

## Development

Open `index.html` directly in a browser, or serve with any static file server:

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

## File Structure

```
├── index.html              # Single-page portfolio (all sections)
├── script.js               # Client-side logic (animations, theme, scroll, nav)
├── emailjs_config.js       # EmailJS credentials
├── 404.html                # Custom GitHub Pages 404 page
├── assets/
│   ├── css/style.css       # All styles (~1600 lines), no external CSS framework
│   └── images/skills/      # SVG icons for the skills carousel
└── projects/
    └── <slug>/index.html   # Individual project detail pages
```

## Architecture Notes

- **Sections** (in order): `#lead`, `#about`, `#projects`, `#experience`, `#education`, `#skills`, `#contact`
- **Theming**: CSS variables define light (`:root`) and dark (`[data-theme="dark"]`) themes; toggled via `script.js` and persisted to `localStorage`
- **Skills carousel**: CSS `@keyframes` infinite-scroll on `.skills-slide`; content is duplicated in HTML for a seamless loop
- **Project pages**: each `projects/<slug>/index.html` is standalone and links back to `../../index.html`

## External Dependencies (CDN only)

- [Font Awesome](https://fontawesome.com) — icons
- [EmailJS](https://www.emailjs.com) — contact form
- LinkedIn Badge widget — embedded in `#about`
