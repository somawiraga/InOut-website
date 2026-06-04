# Development Process

**Version:** 1.0.0

This document captures the six phases of building the InOut website — from initial design to a live Supabase-backed system with an admin panel. Each phase includes what was done, the key decisions made, and lessons relevant to duplicating this system.

---

## Table of Contents

1. [Phase 1 — UIUX Design in Figma](#1-phase-1--uiux-design-in-figma)
2. [Phase 2 — HTML Prototype](#2-phase-2--html-prototype)
3. [Phase 3 — Conversion to React](#3-phase-3--conversion-to-react)
4. [Phase 4 — Mobile Responsiveness](#4-phase-4--mobile-responsiveness)
5. [Phase 5 — Data Migration to Supabase](#5-phase-5--data-migration-to-supabase)
6. [Phase 6 — Admin Page](#6-phase-6--admin-page)

---

## 1. Phase 1 — UIUX Design in Figma

### What was done

- Defined the information architecture: two-level product hierarchy (Group → Subcategory), parallel Industries entry point
- Mapped all user flows: browsing, product detail, enquiry submission, industry exploration
- Designed desktop layouts for all pages: Home, About, Contact, Industries, Products, Product Detail, Resources, Enquiry
- Designed mobile layouts for each page (separate Figma frames at 375px width)
- Established the design system: color tokens, typography scale, component library (buttons, cards, navbar, modal)

### Key decisions

- **Single conversion action (enquiry, not cart):** The business sells B2B in bulk. An enquiry modal is simpler and fits the sales process better than e-commerce.
- **Two-level product hierarchy:** Products have a group (e.g. Cleanroom Consumables) and a subcategory (e.g. Gloves). This maps directly to the URL structure and admin navigation.
- **Figma as the source of truth for visual design:** All CSS token values (colors, fonts, radii, shadows) were extracted from Figma before writing any code.

---

## 2. Phase 2 — HTML Prototype

### What was done

- Built a complete static HTML/CSS implementation of every page
- All product and content data hardcoded directly into HTML markup
- Validated responsive layout at 375px, 768px, and 1440px viewports before touching React
- All CSS classes and design tokens established in this phase — they carried over to React unchanged

### Key decisions

- **Prototype in plain HTML first, not React:** Separating layout concerns from React complexity meant the CSS and component structure were validated before any framework was introduced. The HTML prototype also served as a stakeholder sign-off artifact.
- **One CSS file (`index.css`) with one media query block at the bottom:** This pattern was established here and carried through. It avoids scoped styles fragmenting the responsive logic.
- **All desktop styles first, mobile overrides at the end:** Matches the single-breakpoint philosophy. See [desktop-to-mobile.md](desktop-to-mobile.md).

---

## 3. Phase 3 — Conversion to React

### What was done

- Scaffolded a new Vite + React + TypeScript project
- Converted HTML pages into React page components under `src/pages/`
- Extracted repeated patterns into reusable components under `src/components/layout/` and `src/components/ui/`
- Added React Router v7 for client-side navigation (all routes defined in `src/App.tsx`)
- Hardcoded HTML data moved into JSON files under `src/data/`
- Added React Contexts for global state: `EnquiryModalContext`, `ProductsContext`, `CartContext`, `ThemeContext`
- Added custom hooks in `src/hooks/` to abstract data access from components

### Component structure that emerged

```
src/
  components/
    layout/
      Layout.tsx          — public site wrapper (Topbar + Navbar + Outlet + Footer + BackToTop)
      PageHeader.tsx      — interior page header (Topbar + Navbar + breadcrumb + back button + title)
      Navbar.tsx          — responsive nav bar with hamburger
      Topbar.tsx          — thin top bar (contact info, theme toggle)
      Footer.tsx
      Breadcrumb.tsx
      BackToTop.tsx
    ui/
      EnquiryModal.tsx    — global enquiry modal
      ProductCardH.tsx    — horizontal product card (list views)
      ProductCardV.tsx    — vertical product card (grid views)
      SearchBar.tsx
      Pagination.tsx
      ImageLightbox.tsx
    admin/
      AdminLayout.tsx     — admin shell (sidebar nav + main content area)
```

### Key decisions

- **No home-page layout uses `<Layout />`:** Pages with a hero section (`HomePage`) or a custom header (`ProductDetailPage`, inner pages) compose their own layout using `<PageHeader>` directly. `<Layout>` (with `<Outlet>`) is only used by the router for pages that need the standard Topbar/Navbar at top.
- **Contexts over prop drilling:** The enquiry modal needs to be openable from product cards anywhere in the tree. A context is the right tool here.
- **Hooks as the component API for data:** Components call `useProducts()`, not `useContext(ProductsContext)`. This makes the context implementation swappable without touching every component.

---

## 4. Phase 4 — Mobile Responsiveness

### What was done

- Audited every page at 375px viewport width (iPhone SE — narrowest supported)
- Established the single-breakpoint convention: all overrides inside one `@media (max-width: 768px)` block at the bottom of `src/index.css`
- Implemented the hamburger menu in `Navbar.tsx` with React `useState` for open/close
- Added the breadcrumb ↔ back-button swap (breadcrumb hidden on mobile; circular back button shown)
- Collapsed all sidebar layouts from row to column; sidebar always appears below content on mobile
- Adjusted typography scale, section padding, and touch target sizes

### Key decisions

- **One breakpoint, forever:** The project has only one responsive breakpoint (768px). Adding a tablet breakpoint was considered and rejected — it adds maintenance surface without clear benefit for this content type.
- **CSS-only for everything except the hamburger:** The hamburger open/close is the only mobile behavior that needs JS state. Everything else (hiding the desktop nav, stacking columns, scaling text) is pure CSS.
- **`overflow-x: hidden` on body is mandatory:** Some flex children overflow at small widths. This is always the first rule in the mobile block.

See [desktop-to-mobile.md](desktop-to-mobile.md) for the complete reference.

---

## 5. Phase 5 — Data Migration to Supabase

### What was done

1. Created a Supabase project
2. Created two tables: `products` and `product_images`
3. Configured Supabase Auth (email/password) for admin users
4. Set up Row Level Security: anon key can `SELECT`; authenticated users can `INSERT`, `UPDATE`, `DELETE`
5. Wrote `migrate.mjs` — a Node script that reads `src/data/products-merged.json` and pushes all products and their images to Supabase
6. Replaced the static JSON product read with `ProductsContext` — a single `useEffect` that fetches all products + images from Supabase on mount, joining the two tables
7. Industries, product-groups, and resources were left as static JSON

### The fetch pattern in ProductsContext

```ts
// Fetch products and their images in two queries, then join in JS
const { data: productRows } = await supabase.from('products').select('*')
const { data: imageRows } = await supabase.from('product_images').select('*').order('sort_order')

const imagesByProduct = new Map<string, string[]>()
for (const img of imageRows) {
  if (!imagesByProduct.has(img.product_id)) imagesByProduct.set(img.product_id, [])
  imagesByProduct.get(img.product_id)!.push(img.image_url)
}

const products = productRows.map(row => mapRow(row, imagesByProduct))
```

Two separate queries (not a JOIN) keeps the Supabase query simple and avoids duplicated product rows when a product has multiple images.

### Key decisions

- **Fetch all products once, filter in JS:** The product catalogue is small enough (hundreds of items) that fetching everything on mount and filtering client-side is simpler and faster than per-page queries. `useMemo` in the hooks ensures filtering is efficient.
- **Keep industries/resources as static JSON:** These change rarely and don't need admin management yet. Migrating them to Supabase is straightforward when needed — add a table, create a context, and replace the JSON import.

---

## 6. Phase 6 — Admin Page

### What was done

1. Added admin routes under `/admin/*` in `App.tsx`
2. Built `AdminLayout` — a shell with a collapsible sidebar listing all product groups/subcategories, and a main content area
3. Built `AdminLoginPage` — email/password login form using `supabase.auth.signInWithPassword()`
4. Built `AdminProductsPage` — lists all products for the selected subcategory; delete button with confirmation toast
5. Built `AdminProductFormPage` — create and edit form with all product fields; auto-generates slug from name; manages image list (add URL, reorder, remove); saves via `supabase.from('products').upsert()` then deletes and re-inserts `product_images` rows
6. Added `AdminGuard` — redirects unauthenticated users to `/admin/login`

### The upsert + replace image pattern

On save:
1. `supabase.from('products').upsert({ id, slug, ... })` — creates or updates the product row
2. `supabase.from('product_images').delete().eq('product_id', id)` — removes all existing image rows
3. `supabase.from('product_images').insert([...])` — inserts the current image list with their sort orders

Delete-then-reinsert is simpler than diffing the old and new image lists, and image count is always small.

### Key decisions

- **Admin is part of the same React app, not a separate project:** Sharing types, Supabase client, and component infrastructure is more efficient. The `/admin/*` route prefix provides a clean namespace.
- **Slug is the product ID:** The product `id` in Supabase equals the slug. This means URLs and IDs are the same value, simplifying lookups and making migrated data URLs stable.
- **Product category/subcategory stored as names, not IDs:** Products store the human-readable name strings (`category: "Cleanroom Consumables"`), not foreign-key IDs. This avoids JOINs when reading products and keeps the data self-describing. The tradeoff is that renaming a category requires updating all product rows.
