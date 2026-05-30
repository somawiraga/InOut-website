# InOut Website — Documentation Index

This documentation is structured to serve two goals:
1. **Project duplication** — enough context to rebuild a similar product-catalogue + admin system from scratch.
2. **AI skill reuse** — reference files that an AI coding assistant can load when working on this codebase or a clone.

---

## Documents in this folder

| File | Purpose |
|---|---|
| [index.md](index.md) | This file — master outline and navigation |
| [system-design.md](system-design.md) | Architecture, data model, design system, IA |
| [development-process.md](development-process.md) | Phased build history and decisions |
| [desktop-to-mobile.md](desktop-to-mobile.md) | **AI skill** — converting any page to mobile |
| [skill-add-new-page.md](skill-add-new-page.md) | **AI skill** — adding a new public page end-to-end |
| [skill-supabase-data-layer.md](skill-supabase-data-layer.md) | **AI skill** — adding a new Supabase-backed data type |
| [skill-admin-crud.md](skill-admin-crud.md) | **AI skill** — adding admin CRUD for a new entity |
| [skill-design-system.md](skill-design-system.md) | **AI skill** — design tokens, CSS patterns, component conventions |

---

## 1. System Design → [system-design.md](system-design.md)

### 1.1 Purpose
- Product catalogue website for a B2B industrial goods company
- Allows potential customers to browse products by category/subcategory and industry
- Enquiry flow (modal + dedicated page) instead of e-commerce checkout
- Admin website for managing product data without a developer

### 1.2 Architecture
- **Public site**: React SPA (`/`) — product browsing, industries, resources, contact
- **Admin site**: React SPA (`/admin/*`) — protected CRUD for products
- **Backend**: Supabase (PostgreSQL + Storage + Auth)
- **Hosting**: Static build served via Vite; admin auth handled entirely by Supabase
- **No server-side rendering** — all routing is client-side

### 1.3 Data Architecture
- `products` table — core product fields (slug, name, descriptions, specs, category, subcategory…)
- `product_images` table — images stored separately, joined at query time
- Static JSON files for non-product data: `industries.json`, `product-groups.json`, `resources.json`
- Rationale for hybrid: industries and resources change rarely; only product data needed admin management

### 1.4 State Management
- `ProductsContext` — fetches all products from Supabase once on mount; consumed via `useProducts*` hooks
- `EnquiryModalContext` — global open/close state for the enquiry modal
- `AdminAuthContext` — wraps admin routes; gates entry with Supabase session check
- `CartContext` — lightweight enquiry cart (products added for bulk enquiry)
- `ThemeContext` — light/dark mode toggle

### 1.5 Routing & URL Structure
```
/                          Home
/about                     About
/contact                   Contact
/enquiry                   Enquiry form page
/industries                Industries listing
/industries/:slug          Single industry page
/products                  All products (searchable)
/products/group/:groupSlug          Product group
/products/group/:groupSlug/sub/:subSlug  Subcategory
/products/:productId       Product detail
/resources                 Resources (articles, datasheets)

/admin/login               Admin login
/admin/products/:cat/:sub  Admin product list
/admin/products/:cat/:sub/new        Create product
/admin/products/:cat/:sub/edit/:id   Edit product
```

### 1.6 UIUX Design
- **Responsiveness**: Single CSS breakpoint at 768px; all mobile overrides in one `@media` block at the bottom of `index.css`. No Tailwind, no JS breakpoint hooks. See [desktop-to-mobile.md](desktop-to-mobile.md).
- **Information Architecture**: Products organized by two-level hierarchy (group → subcategory); industries are a parallel entry point linking to filtered product views
- **UX Features**:
  - Sticky navbar that appears on scroll (threshold varies per page)
  - Enquiry modal accessible from any page via context
  - Image lightbox on product detail
  - Horizontal carousel for featured/related products
  - Breadcrumb (desktop) / back button (mobile) navigation pair
  - Back-to-top button
  - Dark mode support via CSS `[data-theme='dark']` overrides

### 1.7 Design System
- **Tokens file**: `src/styles/tokens.css` — CSS custom properties for brand colors, surfaces, typography, spacing, shadows, radii
- **Brand colors**: Yellow `#ffd900`, Dark `#26262e`, Blue `#175cd3`
- **Fonts**: Exo 2 (headings), Inter (body) — loaded from Google Fonts
- **Global styles**: `src/index.css` — component styles + mobile media query block
- **Admin styles**: `src/styles/admin.css` — isolated styles for admin UI

### 1.8 Configuration & Environment
- `.env` variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Build tool: Vite + TypeScript
- Pre-dev/pre-build script: `scripts/merge-products.ts` merges product JSON fragments into `products-merged.json` (legacy; live data now comes from Supabase)

---

## 2. Development Process → [development-process.md](development-process.md)

### Phase 1 — UIUX Design in Figma
- Defined information architecture and user flows
- Designed desktop and mobile layouts for all pages
- Established design system: color tokens, typography scale, component library

### Phase 2 — HTML Prototype
- Built static HTML/CSS implementation of all pages
- All product and content data hardcoded in HTML
- Validated responsive layout and visual design before adding React complexity

### Phase 3 — Conversion to React
- Scaffolded Vite + React + TypeScript project
- Extracted HTML into components and pages
- Introduced React Router for client-side navigation
- Moved hardcoded data into JSON files under `src/data/`
- Added React Contexts for global state (enquiry modal, products)

### Phase 4 — Mobile Responsiveness
- Audited every page at 375px viewport width
- Established the single-breakpoint CSS pattern (768px)
- Implemented hamburger nav, breadcrumb↔back-button swap, sidebar stacking
- See [desktop-to-mobile.md](desktop-to-mobile.md) for the full reference

### Phase 5 — Data Migration to Supabase
- Created `products` and `product_images` tables in Supabase
- Wrote `migrate.mjs` script to push JSON data to Supabase
- Replaced static JSON product reads with `ProductsContext` (Supabase queries)
- Industries, product-groups, and resources remain as static JSON (low change frequency)

### Phase 6 — Admin Page
- Added `/admin/*` routes under a separate layout (`AdminLayout`)
- Implemented Supabase Auth for admin login/logout
- Built `AdminProductsPage` (list view with delete) and `AdminProductFormPage` (create/edit)
- Product images managed via Supabase Storage; `product_images` rows created per upload

---

## 3. AI Skills

These are reference documents designed to be loaded by an AI assistant when performing specific development tasks. Each skill contains: the pattern to follow, the files involved, and a checklist.

### Existing

| Skill file | Trigger |
|---|---|
| [desktop-to-mobile.md](desktop-to-mobile.md) | Converting any page or component to mobile |

### Proposed

| Skill file | Trigger |
|---|---|
| [skill-add-new-page.md](skill-add-new-page.md) | Adding a new public-facing page |
| [skill-supabase-data-layer.md](skill-supabase-data-layer.md) | Adding a new Supabase-backed data type (table → types → context → hooks) |
| [skill-admin-crud.md](skill-admin-crud.md) | Adding admin list/create/edit/delete for a new entity |
| [skill-design-system.md](skill-design-system.md) | Using or extending the design token system and CSS patterns |
