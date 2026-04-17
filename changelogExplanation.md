# Code Change Log

_This file is auto-maintained by Claude Code. Each entry represents a batch of changes from a session._

---

## [2026-04-17 00:00] — Navbar redesign: liquid glass pill, scroll animation, logo/icon/contrast polish

### Changes

| File | What Changed | Why (Plain English) |
|------|-------------|---------------------|
| `src/_layouts/base.njk` | Replaced text monogram (`TM` + live dot) with two `<img>` logo elements (`nav-logo-default` / `nav-logo-black`) | The original portfolio logo PNG was requested instead of the generated text mark. Two images are used so CSS can swap between them based on theme without any JavaScript. |
| `src/_layouts/base.njk` | Replaced Font Awesome icon toggle button with inline SVG sun/moon icons | The old pill-switch toggle (`toggle-track` / `toggle-thumb`) gave no visual cue about the current theme. Sun = light mode, moon = dark mode is an immediately understood convention. Inline SVG avoids an extra network request and scales perfectly. |
| `src/_layouts/base.njk` | Added "View Resume" button to the desktop nav bar | Previously only accessible via a floating button; surfacing it inside the pill gives recruiters a direct path without hunting. |
| `src/_layouts/base.njk` | Replaced Font Awesome bottom-nav (mobile icon strip) with a full-screen overlay menu triggered by a hamburger button | The icon-strip bottom nav is a common portfolio trope and had poor accessibility. The full-screen overlay with numbered links is more distinctive and touch-friendly. |
| `assets/css/style.css` | Rewrote the entire header/nav section (~400 lines replaced) | The old nav was a simple always-visible pill with a basic glass effect. The new system has two distinct states: a floating pill at the top of the page that smoothly expands to a full-width bar when the user scrolls past the hero — signalling a mode-change from "landing" to "reading". |
| `assets/css/style.css` | Desktop pill: switched from `width: max-content` to `width: 100%; max-width: 840px` | `max-content` is a keyword value that CSS cannot animate between. Switching to a concrete `max-width` means the pill→full-width expansion can be CSS-transitioned smoothly instead of snapping. |
| `assets/css/style.css` | Added `border-radius`, `top`, `max-width`, `left`, `transform` to `header` transition list | These are the properties that change during the pill→bar animation. Without listing them explicitly in `transition`, the browser ignores them and the change is instant rather than eased. |
| `assets/css/style.css` | Added `header.past-hero` rule inside the desktop media query | When JS toggles this class (scroll past 65% of hero height), the pill expands: `max-width: 100%`, `border-radius: 0`, `top: 0`. The `left: 50%; transform: translateX(-50%)` stay constant — centering a 100%-wide element is the same as `left: 0`. |
| `assets/css/style.css` | Liquid glass background opacity: dark `0.58 → 0.32`, light `0.62 → 0.38` | At the original opacity the pill looked more like a solid dark box than glass. Reducing it lets the hero content bleed through, making the frosted-glass effect actually visible. |
| `assets/css/style.css` | Replaced `.toggle-track` / `.toggle-thumb` CSS with `.theme-icon` show/hide rules | The pill switch styles are now dead code since the HTML switched to SVG icons. The new rules show `.theme-icon-moon` in dark mode and `.theme-icon-sun` in light mode via `display: none/block`. |
| `assets/css/style.css` | Added `.nav-logo-black { display: none }` + `body:not(.dark-mode)` swap rules | Two logo images sit in the DOM at all times; CSS decides which is visible. Dark mode shows the green-outlined logo, light mode shows the black solid logo. No JavaScript needed — the toggle already flips `body.dark-mode`. |
| `assets/css/style.css` | Added desktop nav text color block (`body.dark-mode` / `body:not(.dark-mode)`) placed *after* the global overrides | Nav link contrast is now purely theme-driven: dark mode gets near-white text (`oklch(95%)`), light mode gets dark text (`oklch(28%)`). Placing these rules after the global `body:not(.dark-mode)` overrides ensures equal-specificity order wins correctly. |
| `assets/css/style.css` | Mobile nav: transparent at hero, frosted-glass on scroll via `.scrolled` class | On mobile the nav is always full-width. It starts transparent (so the hero image shows fully) and gains a blurred background only after the user begins scrolling — matching the behaviour of apps like iOS Safari. |
| `script.js` | Added `updateHeaderScroll()` with `past-hero` class toggle | On every scroll event, checks whether the user has passed 65% of the hero height. If yes, adds `past-hero` to `<header>` which triggers the CSS pill→bar animation. The 65% threshold gives a slight lag so the transition feels deliberate rather than reactive. |
| `script.js` | Removed IntersectionObserver-based `initNavContrast()` | Was added to dynamically adapt text colour based on which section was behind the nav. Simplified away after the decision to drive all nav colours purely from the theme (dark/light mode) rather than scroll context. |
| `script.js` | Replaced bottom-nav `more-menu` logic with full-screen overlay open/close handlers | The old dropup menu JS is gone with the old HTML. The new overlay open/close function handles hamburger click, ESC key, and tapping any overlay link — all with proper ARIA attribute management. |
| `script.js` | Cleaned up `updateLogo()` and Font Awesome icon-swap code from theme toggle | Logo swapping and icon classes are now handled entirely by CSS, so all that JS is dead code. Removing it keeps the toggle handler to the three lines it actually needs. |

### Decisions & Assumptions

- **`max-width: 840px` for the pill**: Chosen to approximate the content width of the full nav (logo + 6 links + resume button + toggle ≈ 740px). Slightly generous to avoid feeling cramped. A wider viewport sees the same 840px pill centered; the `max-width` animation to `100%` gives a smooth expansion.
- **Scroll threshold at 65% of hero height**: Earlier triggers (e.g. 40px) made the bar appear too quickly while the user was still reading the hero. 65% gives a natural "I've decided to scroll" moment before the nav commits to full-width.
- **Two logo `<img>` elements vs. CSS `filter: brightness(0)`**: The user explicitly provided a separate black logo file and requested it be used. Two images also avoids filter colour-shift artefacts on the green-tinted original.
- **IntersectionObserver added then removed in same session**: Initially implemented to adaptively pick text colour based on section background. Superseded by the simpler decision that theme (dark/light) fully determines nav text colour — no scroll context needed.
- **CSS-only logo and icon swaps**: Both the logo swap and the sun/moon toggle are driven by `body.dark-mode` class in CSS, not JS. This means they update instantly and synchronously with the theme change, with no risk of a flicker frame.

---
