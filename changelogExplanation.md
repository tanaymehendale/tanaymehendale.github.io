# Code Change Log

_This file is auto-maintained by Claude Code. Each entry represents a batch of changes from a session._

---

## [2026-04-19 00:00] — Unified Experience + Education into a single journey section with year-strip nav and animated spine

### Changes

| File | What Changed | Why (Plain English) |
|------|-------------|---------------------|
| `src/index.njk` | Removed separate `#experience` and `#education` sections; replaced with a single `#journey` section containing 6 always-expanded chapters (HCLTech, TAMU Data Eng, TAMU TA, Texas A&M MS, LTIMindtree, SPIT B.Tech), a sticky year-strip nav, and a spine container | Two accordion lists felt like a spreadsheet — no sense of progression. A unified section lets the viewer read the whole career story top-to-bottom without clicking anything. |
| `src/_layouts/base.njk` | Desktop nav: replaced two links ("Work" `#experience`, "Education" `#education`) with a single "Journey" `#journey` link; same change in the mobile overlay (renumbered from 6 links to 5) | Merging sections into one meant two nav items became redundant. One link is cleaner and signals that work and school are told as a single story, not separate silos. |
| `assets/css/style.css` | Removed all `.exp-*`, `.edu-*`, `.timeline-item`, `.education-block`, `.details`, `.details-body` rules (~390 lines); added `.journey-*`, `.chapter-*`, `.strip-*` rules (~230 lines) | The old accordion CSS is dead code once the HTML changed. The new rules implement: a sticky year strip with an active underline indicator, an absolutely-positioned spine with an animated `::after` fill, node dots that spring in via `scale(0→1)` on viewport entry, and chapter layout using a two-column grid (dot column + content column). |
| `assets/css/style.css` | Updated the "hardening" section: removed `.exp-id`, `.edu-id`, `.exp-company`, `.edu-school`, `.exp-skills-line`, `.exp-entry .details-body li`, `.edu-entry .details-body li`, and the focus-visible collapsible rules; added `.chapter-id` and `.chapter-org` overflow rules inline within the component CSS | Keeping stale class references in the utility section would silently target nothing — confusing and dead weight. The new overflow and wrapping rules are colocated with the component styles. |
| `assets/css/style.css` | Added `@media (max-width: 600px)` fixes: `white-space: normal` on `.chapter-org`, `order: 3/4` on date and type so they share a row below the logo+name | "Sardar Patel Institute of Technology, University of Mumbai" with `white-space: nowrap` was visually clipped on 390px screens. Allowing wrap and using flex `order` to anchor date+badge below the name block keeps mobile readable without restructuring the DOM. |
| `script.js` | Removed `setupCollapsible()` function and its two call-sites for `#experience` and `#education`; added `setupJourney()` IIFE with three IntersectionObservers | The accordion JS is dead once content is always-expanded. The new function does: (1) animate the spine line in when the log container enters the viewport, (2) fade+slide each chapter in as it scrolls into view and sync the active year in the strip, (3) wire strip button clicks to `scrollIntoView`. |

### Decisions & Assumptions
- **Newest-first ordering**: User confirmed resume convention — HCLTech (2026) at top, SPIT B.Tech (2017) at bottom. This matches recruiter scanning habits even though it inverts the narrative arc.
- **TAMU TA and Data Engineer as separate chapters, not sub-entries**: The two roles have non-overlapping dates and very different content (ETL pipelines vs. teaching HCI). Merging them under one TAMU header would have buried the data engineering work inside the teaching role.
- **Year strip shows start-years only (2026, 2025, 2024, 2023, 2021, 2017)**: Using the year each role *began* rather than ended is the natural anchor — clicking "2023" should land you at the beginning of the Texas A&M MS chapter, not its graduation date.
- **`rootMargin: '-10% 0px -50% 0px'` on chapter IntersectionObserver**: Standard `threshold: 0.2` alone caused the strip to flip to the next year before the current chapter had fully cleared. The bottom margin of -50% ensures the strip only updates when a chapter occupies the upper half of the viewport — the "reading zone".
- **Spine `::after` fill animates to 100% instantly on trigger**: A per-chapter incremental fill would require calculating each chapter's position relative to the container. The simpler approach — fill the whole line once the log enters the viewport — gives the same sense of a drawing timeline without fragile position math.

---

## [2026-04-18 00:00] — Mobile navbar: liquid glass overlay + font consistency with desktop

### Changes

| File | What Changed | Why (Plain English) |
|------|-------------|---------------------|
| `assets/css/style.css` | Mobile `header.scrolled`: upgraded `backdrop-filter` from `blur(18px)` to `blur(42px) saturate(200%) brightness(108%)`; added full layered `box-shadow` (inset highlights + outer ambient); added `border`; enabled specular rim (`::before { opacity: 1 }`) | The mobile header was using a much weaker version of the glass effect than the desktop pill. The full desktop-grade filter parameters are now applied on mobile too, so both surfaces use the same frosted-glass quality when active. |
| `assets/css/style.css` | Mobile `header.scrolled` dark-mode background opacity: `0.32 → 0.72` | `0.32` opacity was designed for the desktop pill floating over a colourful hero image — enough contrast there because vivid content bleeds through the blur. On mobile scrolled past the hero, the content behind is dark text on a dark background, so `0.32` was effectively invisible. `0.72` gives the glass tint a visible floor over dark content. |
| `assets/css/style.css` | Mobile `header.scrolled` light-mode: added full desktop glass values (`oklch(100% 0 0 / 0.38)`, layered box-shadow, proper border) | Brought the light-mode mobile glass in line with the desktop light-mode variant — previously it was just a `border-bottom` on a near-opaque white background, with no depth or blur. |
| `assets/css/style.css` | `.nav-overlay`: changed from `background: oklch(7% 0.018 250)` (solid) to `oklch(7% 0.018 250 / 0.78)` + `backdrop-filter: blur(48px) saturate(180%) brightness(85%)` | The staggered overlay menu had a fully opaque black background — no glass effect at all. Making it semi-transparent and adding the blur means the page content shows through frosted, turning the entire overlay into a liquid glass surface rather than a plain dark sheet. |
| `assets/css/style.css` | Added `body:not(.dark-mode) .nav-overlay` with white-frosted glass values | Light-mode overlay was missing a variant entirely. Without this rule it would show the dark glass in light mode, looking jarring. |
| `assets/css/style.css` | `.overlay-label` font-family: `'Bricolage Grotesque'` → `'Hanken Grotesk', 'Segoe UI', sans-serif` | The overlay menu labels used a completely different display font from the desktop nav (`Hanken Grotesk`). Switching to `Hanken Grotesk` makes the menu typographically consistent with the desktop navigation while keeping the large display size and weight intact. |

### Decisions & Assumptions
- **`blur(48px)` for overlay vs `blur(42px)` for header bar**: The overlay covers the full screen so a slightly larger blur radius creates a stronger frosting effect that reads clearly as "glass layer" rather than just a background tint. The header bar uses the same value as the desktop pill for direct consistency.
- **`brightness(85%)` on overlay vs `brightness(108%)` on header**: The header glass lightens slightly to float above content; the overlay darkens slightly to recede, maintaining the visual hierarchy that the header is "above" the overlay.
- **Opacity floor at `0.72` for dark-mode header**: Chosen to match the perceived brightness of the original `0.92` opaque header while allowing enough see-through for the blur to register. Values below `~0.65` were invisible over dark content; values above `~0.82` lose the glass character.

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
