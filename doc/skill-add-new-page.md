# Add a New Public Page

**Description:** Step-by-step guide for adding a new public-facing page to the InOut React codebase. Covers the page file, routing, layout choice, breadcrumbs, and mobile styles.

**Version:** 1.0.0

---

## Table of Contents

1. [Two Layout Patterns](#1-two-layout-patterns)
2. [Step 1 — Create the Page File](#2-step-1--create-the-page-file)
3. [Step 2 — Register the Route](#3-step-2--register-the-route)
4. [Step 3 — Choose and Apply the Layout](#4-step-3--choose-and-apply-the-layout)
5. [Step 4 — Add Breadcrumbs](#5-step-4--add-breadcrumbs)
6. [Step 5 — Add Desktop CSS](#6-step-5--add-desktop-css)
7. [Step 6 — Add Mobile CSS](#7-step-6--add-mobile-css)
8. [Full Checklist](#8-full-checklist)

---

## 1. Two Layout Patterns

Every page uses one of two layout patterns. Choose before you write anything else.

### Pattern A — `<Layout>` wrapper (Home page, top-level pages with no inner header)

`Layout` is used as a React Router parent route. It renders `<Topbar>`, `<Navbar>`, `<Outlet>`, `<Footer>`, and `<BackToTop>`. The page component itself contains only content — no nav or footer imports.

Use this when: the page has a **hero section** or does not need a visible page title in a header band.

Current pages using this pattern: `HomePage`, `AboutPage`.

### Pattern B — `<PageHeader>` (interior pages with a title band and breadcrumbs)

The page component renders `<PageHeader title="..." crumbs={[...]} />` at the top, then its own content sections, then `<Footer />` and `<BackToTop />` at the bottom.

`PageHeader` internally renders `Topbar`, `Navbar`, the breadcrumb trail (desktop), and the back button (mobile).

Use this when: the page is an **inner page** that needs a visible title, breadcrumb trail, and back button.

Current pages using this pattern: `ProductsPage`, `ProductDetailPage`, `IndustryPage`, `ResourcesPage`, `ContactPage`, etc.

---

## 2. Step 1 — Create the Page File

Create a new file at `src/pages/MyNewPage.tsx`.

**Minimal template (Pattern B — most common):**

```tsx
import { PageHeader } from '../components/layout/PageHeader'
import { Footer } from '../components/layout/Footer'
import { BackToTop } from '../components/layout/BackToTop'

export function MyNewPage() {
  return (
    <>
      <PageHeader
        title="My New Page"
        crumbs={[{ label: 'My New Page' }]}
      />

      <div className="section">
        <div className="container">
          {/* page content here */}
        </div>
      </div>

      <Footer />
      <BackToTop />
    </>
  )
}
```

**Minimal template (Pattern A — hero page):**

```tsx
// No imports of Navbar/Footer — Layout provides them via <Outlet>
export function MyNewPage() {
  return (
    <>
      <div className="hero">
        {/* hero content */}
      </div>
      <div className="section">
        {/* page content */}
      </div>
    </>
  )
}
```

---

## 3. Step 2 — Register the Route

Open `src/App.tsx`. Find the `<Routes>` block inside `PublicRoutes()` and add your route:

```tsx
// src/App.tsx — inside PublicRoutes()
<Route path="/my-new-page" element={<MyNewPage />} />
```

Also add the import at the top of the file:

```tsx
import { MyNewPage } from './pages/MyNewPage'
```

For Pattern A pages, check whether the route should be nested under `<Layout>`. Look at how `HomePage` is wired in the existing routes.

---

## 4. Step 3 — Choose and Apply the Layout

### Pattern B checklist

- [ ] `<PageHeader title="..." crumbs={[...]} />` is the first element rendered
- [ ] `<Footer />` is the last element before `<BackToTop />`
- [ ] `<BackToTop />` is the very last element

### Pattern A checklist

- [ ] The page component exports only content markup (no Topbar, Navbar, Footer)
- [ ] The route is nested under `<Layout>` in App.tsx so `<Outlet>` renders the page inside the chrome

---

## 5. Step 4 — Add Breadcrumbs

`PageHeader` accepts a `crumbs` prop — an array of `{ label, to? }` objects. The last crumb should have no `to` (it is the current page, rendered as plain text). All previous crumbs should have a `to` path so they render as links.

**Single-level page (one parent):**

```tsx
crumbs={[
  { label: 'My New Page' }
]}
// Renders: Home / My New Page
```

**Nested page (two parents):**

```tsx
crumbs={[
  { label: 'Products', to: '/products' },
  { label: 'Gloves', to: '/products/group/cleanroom/sub/gloves' },
  { label: 'Product Name' },
]}
// Renders: Home / Products / Gloves / Product Name
```

> **Rule:** Any page that has a breadcrumb on desktop **must** render a back button on mobile — this is automatic because `PageHeader` renders both. Never add a custom breadcrumb outside of `PageHeader`.

---

## 6. Step 5 — Add Desktop CSS

Add new classes to `src/index.css` **above** the `@media (max-width: 768px)` block. Default styles always target desktop.

Prefer existing utility classes before inventing new ones:

| Need | Class to use |
|---|---|
| Full-width content section with padding | `.section` |
| Max-width centered container | `.container` |
| Content + right sidebar | `.content-sidebar` |
| Two-column form row | `.form-row` |
| Product card grid | `.products-grid` |

Only write a new class if none of the existing ones fit.

---

## 7. Step 6 — Add Mobile CSS

Open `src/index.css` and scroll to the `@media (max-width: 768px)` block at the bottom (currently around line 1755). Add overrides for your new classes **inside** that block.

**Minimum required checks for every new page:**

```css
@media (max-width: 768px) {
  /* If your page has a custom flex row, collapse it */
  .my-two-col-layout {
    flex-direction: column;
    gap: 16px;
  }

  /* If your page has a grid, reduce columns */
  .my-grid {
    grid-template-columns: 1fr;
  }

  /* If your page has custom padding, reduce it */
  .my-section {
    padding: 24px 16px;
  }
}
```

See [desktop-to-mobile.md](desktop-to-mobile.md) for the full typography scale, spacing rules, and touch target requirements.

---

## 8. Full Checklist

### File & routing
- [ ] Created `src/pages/MyNewPage.tsx`
- [ ] Imported and added a `<Route>` in `src/App.tsx` inside `PublicRoutes()`

### Layout
- [ ] Chose Pattern A or Pattern B
- [ ] Pattern B: `<PageHeader>` is first; `<Footer>` and `<BackToTop>` are last
- [ ] Pattern A: route is nested under `<Layout>` in App.tsx

### Breadcrumbs
- [ ] `crumbs` prop passed to `<PageHeader>` with correct parent links
- [ ] Last crumb has no `to` (current page)

### Desktop CSS
- [ ] New classes added above the `@media` block
- [ ] No hardcoded pixel widths that would overflow at 375px

### Mobile CSS
- [ ] Overrides added inside `@media (max-width: 768px)` at the bottom of `index.css`
- [ ] Flex rows collapse to columns
- [ ] Grid columns reduced
- [ ] Padding reduced on both axes

### Manual test
- [ ] Navbar hamburger opens and closes
- [ ] Breadcrumb is hidden; back button is shown and navigates correctly
- [ ] No horizontal overflow at 375px viewport width
- [ ] All interactive elements have at least 44px touch target height
