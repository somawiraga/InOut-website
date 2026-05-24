# Desktop to Mobile View Conversion Skill

**Description:** A reference guide for converting any desktop page or component in the InOut React codebase to its correct mobile counterpart. Covers every established pattern — nav bar, breadcrumbs, sidebar, layout wrappers, grids, typography, touch targets, and component-specific rules — derived from the live implementation in `src/index.css` and related components.

**Version:** 1.0.0

---

## Table of Contents

1. [Core Principles](#1-core-principles)
2. [Breakpoint System](#2-breakpoint-system)
3. [Navigation Bar](#3-navigation-bar)
4. [Breadcrumbs & Back Button](#4-breadcrumbs--back-button)
5. [Sidebar](#5-sidebar)
6. [Layout Wrappers & Grids](#6-layout-wrappers--grids)
7. [Hero Section](#7-hero-section)
8. [Typography Scaling](#8-typography-scaling)
9. [Spacing & Padding](#9-spacing--padding)
10. [Touch Targets](#10-touch-targets)
11. [Component-Specific Rules](#11-component-specific-rules)
12. [Modals & Overlays](#12-modals--overlays)
13. [Overflow & Scroll Handling](#13-overflow--scroll-handling)
14. [Adding New Mobile Styles](#14-adding-new-mobile-styles)

---

## 1. Core Principles

- **CSS-only responsiveness.** All mobile behavior is driven by a single `@media (max-width: 768px)` block at the bottom of `src/index.css`. There are no JavaScript breakpoint hooks (`useMediaQuery`, `window.resize`, etc.).
- **One breakpoint.** Everything ≥ 769px is desktop. Everything ≤ 768px is mobile. There are no tablet-specific rules.
- **No separate mobile components.** Desktop and mobile share the same React components. Differences are expressed through CSS `display: none / flex`, `flex-direction`, `order`, and dimension changes.
- **State for UI toggles only.** React `useState` is used for the hamburger menu open/close. All other responsive layout changes are pure CSS.
- **No Tailwind.** The project uses vanilla CSS with custom design tokens defined in `src/tokens.css`.

---

## 2. Breakpoint System

```css
/* All mobile overrides live inside this single block */
@media (max-width: 768px) {
  /* ... */
}
```

**File location:** `src/index.css` — the media query block starts at line 1755 and runs to the end of the file.

**Tokens that change on mobile** (override these inside the media query, do not change the token itself):

| Token / Property | Desktop value | Mobile value |
|---|---|---|
| `--max-w` | 1440px | — (unchanged; container fills viewport) |
| `--hero-height` | 560px | `auto; min-height: 340px` |
| Navbar height | 90px | 60px |
| Section padding | `50px 30px` | `24px 16px` |
| Content-sidebar gap | 60px | 24px |

---

## 3. Navigation Bar

**Component:** [src/components/layout/Navbar.tsx](../src/components/layout/Navbar.tsx)
**CSS:** `src/index.css` lines 92–302 (desktop), 1782–1838 (mobile overrides)

### Desktop

- Full horizontal menu (`.nav-menu`) is visible.
- Desktop enquiry button (`.navbar-enquiry-btn`) is visible.
- Navbar height: **90px**.
- Logo width: 90px.
- Nav links display in a row with a yellow underline on hover.
- Dropdown menus appear on `:hover`.

### Mobile

- Horizontal menu and desktop enquiry button are hidden:

  ```css
  .nav-menu          { display: none; }
  .navbar-enquiry-btn { display: none; }
  ```

- Hamburger button (`.hamburger-btn`) becomes visible:

  ```css
  .hamburger-btn { display: flex; }
  ```

- Navbar height drops to **60px**; logo width drops to **65px**.
- Clicking the hamburger button toggles the React state `menuOpen`, which adds/removes `.mobile-menu--open` on the menu element.
- The mobile menu slides/fades in as a full-width vertical list beneath the navbar.
- Hamburger icon animates (bar → X) using `transform` and `opacity` transitions on its three `<span>` children.
- On the hero variant (`.navbar--hero`), the open mobile menu has a dark semi-transparent background.

### Checklist when adding a new nav item

- [ ] Add to the desktop `nav-menu` list.
- [ ] Add the same item to the mobile vertical menu list.
- [ ] Verify it inherits `.mobile-nav-link` styles (yellow active state, full-width tap area).

---

## 4. Breadcrumbs & Back Button

**Component:** [src/components/layout/Breadcrumb.tsx](../src/components/layout/Breadcrumb.tsx), [src/components/layout/PageHeader.tsx](../src/components/layout/PageHeader.tsx)
**CSS:** `src/index.css` lines 449–469 (desktop), 2172–2188 (mobile overrides)

### Desktop

- Horizontal breadcrumb trail is visible (`.breadcrumb`).
- Crumbs separated by `/`.
- Links styled in blue (`#175cd3`) with underline on hover.
- The `.page-back-btn` circular back button is **hidden** (`display: none`).

### Mobile

- **Breadcrumb is hidden entirely:**

  ```css
  .breadcrumb { display: none; }
  ```

- **Back button is shown:**

  ```css
  .page-back-btn { display: flex; }
  ```

- The back button is a **40 × 40px circle** with a semi-transparent background.
- It displays a `←` arrow symbol.
- Navigation logic in `PageHeader.tsx`: navigates to the parent breadcrumb URL if available, otherwise calls `navigate(-1)` (browser history back).
- The page title font size drops from its desktop size to **28px** on mobile.

### Rule

> Any page that has a `<Breadcrumb>` on desktop **must** also render a `<PageHeader>` that includes the back button. Do not add a breadcrumb without the back button counterpart — they are a paired pattern.

---

## 5. Sidebar

**CSS:** `src/index.css` lines 987–1048 (desktop), 1976–1991 (mobile overrides)

### Desktop

- Sidebar (`.sidebar`) sits to the **right** of main content inside `.content-sidebar`.
- Width: **280px**, gray background.
- `display: flex; flex-direction: row; gap: 60px`.
- Sidebar has `order: 2` visually (appears after content in the flex row).

### Mobile

- The `.content-sidebar` wrapper switches to a **vertical column**:

  ```css
  .content-sidebar {
    flex-direction: column;
    gap: 24px;
  }
  ```

- Content becomes `order: 1` (on top), sidebar becomes `order: 2` (below content):

  ```css
  .content-sidebar > :first-child { order: 1; }
  .sidebar { order: 2; width: 100%; }
  ```

- Sidebar expands to **100% width**.
- Sidebar link touch targets increase: `padding: 14px 0; font-size: 15px`.
- Sidebar search bar fills full width.

### Rule

> The sidebar always appears **below** the main content on mobile, never above it. If a page needs a sidebar, wrap content + sidebar in `.content-sidebar` — do not add custom flex containers.

---

## 6. Layout Wrappers & Grids

All side-by-side desktop layouts collapse to single-column vertical stacks on mobile. Use the existing wrapper classes rather than creating new ones.

### Flex Rows → Columns

| Wrapper class | Desktop | Mobile |
|---|---|---|
| `.content-sidebar` | `flex-direction: row; gap: 60px` | `flex-direction: column; gap: 24px` |
| `.form-row` | `flex-direction: row` | `flex-direction: column; align-items: stretch` |
| `.product-header-inner` | `flex-direction: row; gap: 40px` | `flex-direction: column; gap: 20px` |
| `.hero-content` | left-aligned, wide padding | centered, `padding: 20px 20px 40px` |

### CSS Grids → Fewer Columns

| Grid class | Desktop columns | Mobile columns |
|---|---|---|
| `.industries-grid` | `repeat(auto-fill, minmax(360px, 1fr))` | `1fr 1fr` (2 cols) |
| `.prod-highlights-grid` | `repeat(4, 1fr)` | `repeat(2, 1fr)` |
| `.resource-list` | `1fr 1fr` (2 cols) | `1fr` (1 col) |

### Rule for new layouts

1. Write the desktop layout first (flex row or multi-column grid).
2. Inside `@media (max-width: 768px)`, add `flex-direction: column` or reduce grid columns.
3. Never hardcode pixel widths that would overflow a 375px viewport — use `%`, `fr`, or `100%`.

---

## 7. Hero Section

**CSS:** `src/index.css` lines 411–419 (desktop), 1859–1880 (mobile overrides)

| Property | Desktop | Mobile |
|---|---|---|
| Height | `var(--hero-height)` = 560px | `auto; min-height: 340px` |
| Padding | `120px 80px 60px` | `20px 20px 40px` |
| Text alignment | left | center |
| Title font size | 36px | 22px |
| CTA buttons | inline-flex row | stacked column, full width |

---

## 8. Typography Scaling

All headline and label sizes shrink on mobile. Follow the established scale — do not invent new sizes.

| Element | Desktop | Mobile |
|---|---|---|
| Page title (`.page-title`) | 50px | 28px |
| Hero title | 36px | 22px |
| Section heading | 36px | 22px |
| Enquiry modal title | 22px | 18px |
| Body / sidebar links | — | 15px (touch-friendly) |

---

## 9. Spacing & Padding

| Context | Desktop | Mobile |
|---|---|---|
| `.section` padding | `50px 30px` | `24px 16px` |
| Navbar horizontal padding | `0 20px` | `0 16px` |
| Modal box padding | `36px 32px` | `24px 16px` |
| Content-sidebar gap | 60px | 24px |
| Product header gap | 40px | 20px |

**Rule:** When reducing padding on mobile, always reduce both axes — don't only reduce horizontal padding and leave large vertical gaps.

---

## 10. Touch Targets

All interactive elements must meet the **44 × 44px minimum** touch target size on mobile (iOS / Android HIG guideline).

| Element | Size |
|---|---|
| Back button (`.page-back-btn`) | 40 × 40px |
| Carousel previous/next buttons | 44 × 44px |
| Pagination buttons | 44 × 44px |
| Search submit buttons | 44px height |
| Primary buttons (`.btn-primary`) | 40px height (text may wrap) |

If you add a new interactive element, set an explicit `min-height: 44px` and `min-width: 44px` inside the mobile media query.

---

## 11. Component-Specific Rules

### Carousel (`.carousel`)

- Desktop: `.carousel-btn` prev/next arrows are visible; track translates with `transform: translateX(...)`.
- Mobile:
  - Carousel arrows hidden: `.carousel-btn { display: none; }`.
  - Track switches to wrapping: `flex-wrap: wrap; transform: none !important;`.
  - Cards are effectively a wrapped grid instead of a scrolling track.

### Certification Display (`.cert-desktop` / `.cert-mobile`)

- Desktop: `.cert-desktop` shows a combined composite image; `.cert-mobile` is hidden.
- Mobile: `.cert-desktop` hidden; `.cert-mobile` shows individual certification images stacked at 400 × 400px each.

### Contact Page Map (`.map-select`)

- Desktop: Tab-based location selection; `.map-select` dropdown hidden.
- Mobile: Tab UI hidden; `.map-select` full-width dropdown visible.

### Filter Chips (`.filter-chips-wrap` — Resources page)

- Desktop: Filter chips are visible alongside the search bar.
- Mobile: Filter chips hidden (`display: none`); only the full-width search bar is shown.

### Product Detail Gallery

- Desktop: Thumbnail strip is a horizontal row.
- Mobile: Thumbnail strip gains `overflow-x: auto` for horizontal scrolling within a fixed-height container.

---

## 12. Modals & Overlays

**Components:** [src/components/ui/EnquiryModal.tsx](../src/components/ui/EnquiryModal.tsx), [src/components/ui/ImageLightbox.tsx](../src/components/ui/ImageLightbox.tsx)

### z-index stack (highest wins)

| Layer | z-index |
|---|---|
| Image lightbox | 1000 |
| Modal overlay | 800 |
| Sticky navbar | 300 |
| Hamburger menu | within navbar (100) |

### EnquiryModal sizing

| Property | Desktop | Mobile |
|---|---|---|
| Max-width | 560px | viewport width − 32px padding |
| Box padding | `36px 32px` | `24px 16px` |
| Title font | 22px | 18px |
| Form rows | horizontal flex | `flex-direction: column` |

### Lightbox

- Same behavior on both desktop and mobile — full-viewport dark overlay (0.9 opacity), side prev/next buttons, tap-to-zoom (`transform: scale(2)`).
- No mobile-specific overrides needed for the lightbox itself.

---

## 13. Overflow & Scroll Handling

```css
/* Applied at the top of the mobile block */
body {
  overflow-x: hidden;
}
```

This prevents horizontal scrollbars caused by any element that accidentally overflows the viewport. It is always the first rule in the `@media (max-width: 768px)` block.

For intentional horizontal scrolling within a container (e.g. product thumbnail strip), add `overflow-x: auto` to that specific container rather than relying on the body scroll.

---

## 14. Adding New Mobile Styles

Follow this process every time a new desktop feature is built:

1. **Write desktop styles first** — all default (non-media-query) styles target desktop.
2. **Open the media query block** at the bottom of `src/index.css` (currently line 1755).
3. **Add mobile overrides in the same logical order** as the desktop styles so reviewers can diff them easily.
4. **Test at 375px viewport width** (iPhone SE) as the minimum supported width.
5. **Check these four things on every new page:**
   - [ ] Navbar hamburger opens and closes correctly.
   - [ ] Breadcrumb is hidden; back button is shown and navigates correctly.
   - [ ] Any sidebar is below the main content, full width.
   - [ ] No horizontal overflow (`overflow-x: hidden` is on `body`, but catch the root cause too).
6. **Do not add a second breakpoint** unless explicitly discussed and agreed upon — the entire project uses 768px as the single breakpoint.
