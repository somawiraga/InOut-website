# System Design

**Version:** 1.0.0

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Architecture Overview](#2-architecture-overview)
3. [Data Architecture](#3-data-architecture)
4. [State Management](#4-state-management)
5. [Routing & URL Structure](#5-routing--url-structure)
6. [UIUX Design](#6-uiux-design)
7. [Design System](#7-design-system)
8. [Authentication](#8-authentication)
9. [Configuration & Environment](#9-configuration--environment)
10. [Key Dependencies](#10-key-dependencies)

---

## 1. Purpose

InOut is a **B2B product catalogue website** for an industrial goods company. It serves two distinct user types:

| User | Goal |
|---|---|
| **Visitor** | Browse products by category, subcategory, or industry; download datasheets; submit enquiries |
| **Admin** | Manage product data (create, edit, delete, reorder images) without developer involvement |

There is **no e-commerce checkout**. The conversion action is an enquiry — either a modal triggered from any page or a dedicated enquiry form page.

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────┐
│               Browser (React SPA)            │
│                                              │
│   Public site  /          Admin site /admin  │
│   (browsing)              (product mgmt)     │
└────────────────────┬────────────────────────┘
                     │ HTTPS
              ┌──────▼──────┐
              │   Supabase   │
              │  PostgreSQL  │
              │  Auth        │
              └─────────────┘
```

- **Single React SPA** — both the public site and admin are in the same Vite project, served from the same build output
- **No server-side rendering** — all routing is client-side via React Router v7
- **Supabase** — provides the database, storage, and admin authentication; the public site connects with the anon key (read-only by RLS policy)
- **Static hosting** — the built `dist/` folder can be served from any CDN or static host

---

## 3. Data Architecture

### Supabase tables

| Table | Purpose |
|---|---|
| `products` | One row per product; all text fields, category/subcategory classification, stock, PDF URL |
| `product_images` | Images stored separately; each row has `product_id`, `image_url`, `sort_order` |

Images are stored as external URLs (e.g. Supabase Storage public URLs or CDN links) — not as binary blobs in the DB.

### Why two tables for products + images

A product can have many images. Storing them as a JSON array in the `products` row is possible but makes reordering and individual deletion awkward from the admin. A separate `product_images` table keeps the image management clean and matches the 1-to-many relationship.

### Static JSON data

Non-product data lives in `src/data/` as JSON files and is bundled at build time:

| File | Contents |
|---|---|
| `product-groups.json` | Category and subcategory hierarchy (name, slug, description, icon) |
| `industries.json` | Industry names, slugs, descriptions, icons |
| `resources.json` | Articles and datasheets |

**Rationale:** These change rarely (a few times per year at most). Putting them in Supabase would add query overhead and admin complexity for no practical gain. They can be migrated to Supabase later if admin editing becomes needed.

### Product type (TypeScript)

```ts
// src/types/index.ts
interface Product {
  id: string
  slug: string
  name: string
  shortDescription: string
  description: string
  category: string        // matches ProductGroup.name
  subcategory: string     // matches Subcategory.name
  specifications: string
  pdf: string
  images: string[]        // assembled from product_images rows
  stock?: string
  inStock?: string | boolean
  packaging?: string
  detail?: string
  download?: string
}
```

---

## 4. State Management

All global state is managed via React Contexts. There are no third-party state libraries.

| Context | File | What it owns |
|---|---|---|
| `ProductsContext` | `src/contexts/ProductsContext.tsx` | All products fetched from Supabase; `loading` and `error` states |
| `EnquiryModalContext` | `src/contexts/EnquiryModalContext.tsx` | Modal open/close; the product being enquired about |
| `AdminAuthContext` | `src/contexts/AdminAuthContext.tsx` | Supabase session for admin; `signOut` function |
| `CartContext` | `src/contexts/CartContext.tsx` | Products added to the enquiry cart (bulk enquiry) |
| `ThemeContext` | `src/contexts/ThemeContext.tsx` | Light/dark mode; applies `data-theme` attribute to `<html>` |

### Data access pattern

Pages and components never import from `ProductsContext` directly. Instead they use the hooks in `src/hooks/useProducts.ts`:

```ts
useProducts()                          // all products
useProductsByGroup(groupName)          // filtered by category
useProductsBySubcategory(group, sub)   // filtered by category + subcategory
useProductBySlug(slug)                 // single product by slug
useProductsLoading()                   // { loading, error }
```

This decouples components from the context shape.

---

## 5. Routing & URL Structure

### Public routes (`/`)

```
/                                     Home
/about                                About
/contact                              Contact + map
/enquiry                              Standalone enquiry form
/industries                           Industries listing grid
/industries/:slug                     Single industry page
/products                             All products, searchable
/products/group/:groupSlug            Product group page
/products/group/:groupSlug/sub/:sub   Subcategory filtered view
/products/:productId                  Product detail (by slug)
/resources                            Resources (articles, datasheets)
```

### Admin routes (`/admin/*`)

```
/admin/login                                 Login page
/admin/products/:category/:subcategory       Product list
/admin/products/:category/:subcategory/new   Create product form
/admin/products/:category/:subcategory/edit/:id  Edit product form
/admin/products                              Redirects to first subcategory
/admin/*                                     Redirects to first subcategory
```

### Route split in App.tsx

`PublicRoutes` and `AdminRoutes` are separate function components. Admin routes are wrapped in `AdminAuthProvider`. The `AdminGuard` component redirects unauthenticated users to `/admin/login`.

---

## 6. UIUX Design

### Responsiveness

- Single CSS breakpoint at `768px` — everything ≥ 769px is desktop, ≤ 768px is mobile
- All mobile overrides live in one `@media (max-width: 768px)` block at the bottom of `src/index.css`
- No JavaScript breakpoint hooks, no Tailwind, no CSS modules
- See [desktop-to-mobile.md](desktop-to-mobile.md) for the complete mobile conversion reference

### Information Architecture

Products are organized in a two-level hierarchy: **Group → Subcategory**. Industries are a parallel entry point that links to filtered product views. The breadcrumb trail always reflects which entry point the user arrived from (Products path vs Industries path).

```
Home
├── Products
│   ├── Group (e.g. Cleanroom Consumables)
│   │   └── Subcategory (e.g. Gloves)
│   │       └── Product Detail
├── Industries
│   └── Industry (e.g. Semiconductor)
│       └── Product Detail  ← breadcrumb shows Industries path
```

### UX Features

| Feature | Implementation |
|---|---|
| Sticky navbar | Appears on scroll via `useScrollPosition`; threshold is 480px on Home, 80px elsewhere |
| Enquiry modal | `EnquiryModalContext` + `EnquiryModal` component; triggered from any page |
| Image lightbox | Click any product image to open; prev/next navigation; tap-to-zoom |
| Product carousel | `useCarousel` hook; arrow navigation on desktop, wraps to grid on mobile |
| Breadcrumb / Back button | Desktop shows breadcrumb trail; mobile shows circular back button (paired pattern) |
| Back-to-top button | `BackToTop` component; appears after scrolling 300px |
| Dark mode | `ThemeContext` toggles `data-theme="dark"` on `<html>`; CSS token overrides handle the rest |

---

## 7. Design System

**Token file:** `src/styles/tokens.css` — imported globally.

### Brand colors

| Token | Value | Usage |
|---|---|---|
| `--yellow` | `#ffd900` | Primary accent, CTA buttons, active nav underline |
| `--dark-bg` | `#26262e` | Navbar, footer, hero dark sections |
| `--blue` | `#175cd3` | Links, breadcrumb text |

### Typography

| Token | Value | Usage |
|---|---|---|
| `--font-head` | `'Exo 2', sans-serif` | Headings, nav, product names |
| `--font-body` | `'Inter', sans-serif` | Body text, labels, UI |

Both fonts loaded from Google Fonts in `tokens.css`.

### Spacing & Layout

| Token | Value |
|---|---|
| `--max-w` | `1440px` (max container width) |
| `--hero-height` | `560px` (desktop hero height) |

### Surface tokens

`--card-bg`, `--section-light`, `--section-gray`, `--white`, `--gray-100`

### Text tokens

`--text-dark`, `--text-med`, `--text-light`, `--text-muted`

### Dark mode

Override tokens inside `[data-theme='dark']` selector in `tokens.css`. Do not duplicate component CSS — only re-declare the tokens that change.

---

## 8. Authentication

Admin authentication is handled entirely by **Supabase Auth**.

- Login: email + password via `supabase.auth.signInWithPassword()`
- Session: persisted in `localStorage` by the Supabase client; restored on page load via `supabase.auth.getSession()`
- Guard: `AdminGuard` component in `App.tsx` checks `AdminAuthContext.session`; redirects to `/admin/login` if null
- Sign-out: calls `supabase.auth.signOut()` which clears the local session

The public site uses the **anon key** only. Supabase Row Level Security (RLS) should be configured to allow public `SELECT` on `products` and `product_images`, and restrict `INSERT`, `UPDATE`, `DELETE` to authenticated admin users.

---

## 9. Configuration & Environment

```bash
# .env (never commit)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Both variables are accessed in `src/lib/supabaseClient.ts` via `import.meta.env.*`.

### Build scripts

| Script | What it does |
|---|---|
| `npm run dev` | Runs `scripts/merge-products.ts` then starts Vite dev server |
| `npm run build` | Runs `scripts/merge-products.ts` then compiles TypeScript and bundles with Vite |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm test` | Vitest |

`scripts/merge-products.ts` is a legacy pre-build step that merged product JSON fragments into `src/data/products-merged.json`. It is retained for the static JSON fallback but live data now comes from Supabase.

---

## 10. Key Dependencies

| Package | Purpose |
|---|---|
| `react` + `react-dom` v19 | UI framework |
| `react-router-dom` v7 | Client-side routing |
| `@supabase/supabase-js` v2 | Database + auth client |
| `dompurify` | Sanitize HTML in product descriptions before `dangerouslySetInnerHTML` |
| `react-markdown` + `remark-gfm` | Render Markdown in resource content |
| `sonner` | Toast notification system |
| `vite` v8 | Build tool and dev server |
| `typescript` v6 | Type safety |
| `vitest` | Unit/integration tests |
