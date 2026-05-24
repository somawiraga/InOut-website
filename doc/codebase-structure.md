# Codebase Structure Guide

## The Big Picture

This is a **React + TypeScript** website built with **Vite** (the build tool). Here's how everything fits together at a high level:

```
index.html          ← The single HTML file the browser loads
  └── main.tsx      ← Boots React, wraps the whole app in providers
        └── App.tsx ← Defines the router (which page shows at which URL)
              └── pages/*.tsx  ← One file per page (HomePage, AboutPage, etc.)
                    └── components/**/*.tsx  ← Reusable UI pieces used by pages
```

---

## Entry Points — Where It All Starts

### `index.html`
The only HTML file. It has a single `<div id="root">` where React mounts everything.

### `src/main.tsx` — The Boot File
This is the very first TypeScript file that runs. It does three things:

1. Finds the `#root` div in `index.html`
2. Wraps the entire app in **Providers** (global state systems — see Contexts below)
3. Renders `<App />`

```tsx
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>         // ← enables routing
    <ThemeProvider>       // ← dark/light mode
      <EnquiryModalProvider> // ← enquiry popup state
        <CartProvider>    // ← shopping cart (stub for now)
          <App />
        </CartProvider>
      </EnquiryModalProvider>
    </ThemeProvider>
  </BrowserRouter>
)
```

### `src/App.tsx` — The Router Hub
This is where every URL is mapped to a page component. It also holds two global behaviours that run on every page:
- **`ScrollToTop`** — scrolls to the top whenever you navigate to a new page
- **`GlobalStickyNav`** — shows the sticky navbar after scrolling past a threshold

---

## How the Router Works

This project uses **React Router** (`react-router-dom`). The concept is simple: instead of the browser loading a new HTML file when you click a link, React swaps out the page component instantly — no full page reload.

### Defining Routes (in `App.tsx`)

```tsx
<Routes>
  <Route path="/"                              element={<HomePage />} />
  <Route path="/about"                         element={<AboutPage />} />
  <Route path="/products"                      element={<ProductsPage />} />
  <Route path="/products/group/:groupSlug"     element={<ProductGroupPage />} />
  <Route path="/products/:productId"           element={<ProductDetailPage />} />
  <Route path="*"                              element={<NotFoundPage />} />
</Routes>
```

- **`path="/about"`** — matches the exact URL `/about`
- **`path="/products/group/:groupSlug"`** — the `:groupSlug` part is a **URL parameter** (a variable). If the URL is `/products/group/cleanroom-supplies`, then `groupSlug` = `"cleanroom-supplies"`. The page component reads this to know what to display.
- **`path="*"`** — the catch-all. Any URL that doesn't match anything above renders `NotFoundPage` (your 404 page).

### Navigating Between Pages

Instead of `<a href="/about">`, React Router uses its own components so the page doesn't reload:

| Component | Use case | Example |
|-----------|----------|---------|
| `<Link to="/about">` | Regular navigation link | Footer links, buttons |
| `<NavLink to="/products">` | Like Link, but adds an `active` CSS class when the URL matches | Navbar menu items |

### Reading URL Parameters in a Page

A page component reads the `:slug` variable like this:

```tsx
import { useParams } from 'react-router-dom'

export function IndustryPage() {
  const { slug } = useParams()  // e.g. "pharmaceutical"
  // now use `slug` to fetch/filter the right data
}
```

---

## The `src/` Folder — What Goes Where

```
src/
├── main.tsx              ← App boot (entry point)
├── App.tsx               ← Router + global behaviours
│
├── pages/                ← One file per page/screen
├── components/
│   ├── layout/           ← Chrome that wraps every page
│   └── ui/               ← Reusable UI widgets
│
├── contexts/             ← Global shared state
├── hooks/                ← Data fetching & reusable logic
├── data/                 ← Static JSON data + image maps
└── types/                ← TypeScript type definitions
```

---

## Pages (`src/pages/`)

Each file = one full page of the website. They are rendered by the router.

| File | URL | What it shows |
|------|-----|---------------|
| `HomePage.tsx` | `/` | Hero, product highlights, industries grid, contact form |
| `AboutPage.tsx` | `/about` | Company background |
| `ContactPage.tsx` | `/contact` | Contact details & form |
| `EnquiryPage.tsx` | `/enquiry` | Full-page enquiry form |
| `IndustriesPage.tsx` | `/industries` | Grid of all industries |
| `IndustryPage.tsx` | `/industries/:slug` | Single industry detail |
| `ProductsPage.tsx` | `/products` | All products listing |
| `ProductGroupPage.tsx` | `/products/group/:groupSlug` | Products in a group or subcategory |
| `ProductDetailPage.tsx` | `/products/:productId` | Single product detail |
| `ResourcesPage.tsx` | `/resources` | Downloads, articles, resources |
| `NotFoundPage.tsx` | `*` (any unknown URL) | 404 page |

> **Note:** `HomePage.tsx` is a special case — it manages its own `<Topbar>`, `<Navbar>`, and `<Footer>` directly, because the hero section needs the Navbar overlaid on top of the hero image. All other pages use `<PageHeader>` and the global layout components.

---

## Layout Components (`src/components/layout/`)

These are the "chrome" — the pieces that frame every page.

| File | Role |
|------|------|
| `Layout.tsx` | Shell wrapper: Topbar + Navbar + `<Outlet>` + Footer + BackToTop |
| `Navbar.tsx` | Main navigation bar. Accepts a `variant` prop (`"default"` or `"hero"`) to change its style when overlaid on the homepage hero image. Also handles the mobile hamburger menu. |
| `Topbar.tsx` | Thin strip above the navbar (phone number, email, social links) |
| `Footer.tsx` | Site footer |
| `PageHeader.tsx` | The banner with title + breadcrumb used at the top of interior pages |
| `Breadcrumb.tsx` | The "Home > Products > ..." trail inside `PageHeader` |
| `BackToTop.tsx` | The floating "scroll back to top" button |

> **`Layout.tsx` and `<Outlet />`:** React Router uses `<Outlet />` as a placeholder. If you nest routes under a layout route, the child page renders where `<Outlet />` sits. This allows the layout shell (navbar, footer) to stay mounted while only the middle content swaps.

---

## UI Components (`src/components/ui/`)

Self-contained, reusable widgets that pages and layout components import.

| File | What it does |
|------|--------------|
| `ProductCardH.tsx` | Horizontal product card (image left, text right) |
| `ProductCardV.tsx` | Vertical product card (image on top) |
| `SearchBar.tsx` | The product search input in the navbar |
| `Pagination.tsx` | Page 1 / 2 / 3 … controls for product listings |
| `EnquiryModal.tsx` | The popup modal for product enquiry. Reads state from `EnquiryModalContext`. |
| `ImageLightbox.tsx` | Full-screen image viewer (used on product detail page) |
| `ISOTable.tsx` | Table displaying ISO certification data |

---

## Contexts (`src/contexts/`)

Contexts are React's way of sharing state across many components without passing props all the way down manually. Think of them as "global variables" that any component can read or write.

| File | What it stores | How to use it |
|------|---------------|---------------|
| `ThemeContext.tsx` | Current theme (`"light"` or `"dark"`) + `toggleTheme()` | `const { theme, toggleTheme } = useTheme()` |
| `EnquiryModalContext.tsx` | Whether the enquiry modal is open + which product triggered it | `const { openModal } = useEnquiryModal()` — call `openModal(product)` from any product card |
| `CartContext.tsx` | Cart items list (**stub — not implemented yet**, pending design approval) | `const { items, addItem } = useCart()` |

Each context has three parts:
1. The context object itself (created with `createContext`)
2. A **Provider** component that wraps children and supplies the value (set up in `main.tsx`)
3. A **custom hook** (e.g. `useTheme()`) that components call to access the value

---

## Hooks (`src/hooks/`)

Custom hooks are functions that start with `use`. They package up reusable logic — mainly data fetching and filtering — so pages don't repeat the same code.

| File | What it returns |
|------|----------------|
| `useProducts.ts` | All products, or filtered by group/subcategory/slug |
| `useProductDetail.ts` | A single product by ID or slug |
| `useProductGroups.ts` | All product groups (categories) |
| `useIndustries.ts` | All industries |
| `useResources.ts` | All resources (downloads, articles) |
| `useCarousel.ts` | Logic for an image carousel (current index, next/prev) |
| `useScrollPosition.ts` | Current scroll Y position, updated on scroll |

Example — how a page uses a hook:

```tsx
// Inside ProductsPage.tsx
const products = useProducts()           // returns the full array
const groups   = useProductGroups()      // returns category list
```

---

## Data (`src/data/`)

Static data files. The product/industry data comes from JSON files; the image maps are TypeScript objects that associate a slug to an imported image asset.

| File | Contents |
|------|----------|
| `products-merged.json` | All product records (generated by `scripts/merge-products.ts`) |
| `industries.json` | All industry records |
| `categoryImages.ts` | Maps `groupSlug → image` for product category cards |
| `industryImages.ts` | Maps `industrySlug → image` for industry cards |
| `subcategoryImages.ts` | Maps `subcategorySlug → image` |
| `companyImages.ts` | Company/about page images |
| `industryCategories.ts` | Which product groups belong to which industry |
| `industryIcons.ts` | Icon assets per industry |
| `industryProductGroups.ts` | Product groups filtered by industry |

---

## Types (`src/types/index.ts`)

TypeScript interfaces that define the shape of data objects used across the app. Any file that works with products, industries, or resources imports from here.

```
Product         — id, slug, name, description, images, specs, etc.
ProductGroup    — id, slug, name, icon, subcategories[]
Subcategory     — id, slug, name, image, description
Industry        — id, slug, name, description, icon
Resource        — id, type, title, tags, url, content
```

---

## Data Flow Summary

```
JSON file (src/data/)
    ↓ imported by
Hook (src/hooks/)          ← encapsulates filtering logic
    ↓ called by
Page (src/pages/)          ← renders the full screen
    ↓ renders
UI Components (src/components/ui/)   ← individual cards, modals, etc.
    ↓ reads global state from
Contexts (src/contexts/)   ← theme, modal open/close, cart
```
