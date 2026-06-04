# Design System Reference

**Description:** Reference guide for using and extending the InOut design system. Covers CSS tokens, typography, color usage, layout patterns, dark mode, and component conventions. Use this before writing any new CSS.

**Version:** 1.0.0

---

## Table of Contents

1. [Token File Location](#1-token-file-location)
2. [Color Tokens](#2-color-tokens)
3. [Typography Tokens](#3-typography-tokens)
4. [Spacing & Layout Tokens](#4-spacing--layout-tokens)
5. [Border & Shadow Tokens](#5-border--shadow-tokens)
6. [Using Tokens in CSS](#6-using-tokens-in-css)
7. [Dark Mode](#7-dark-mode)
8. [Button Patterns](#8-button-patterns)
9. [Section & Container Patterns](#9-section--container-patterns)
10. [Card Patterns](#10-card-patterns)
11. [Adding New Tokens](#11-adding-new-tokens)
12. [Rules](#12-rules)

---

## 1. Token File Location

All design tokens are CSS custom properties defined in:

```
src/styles/tokens.css
```

This file is imported globally — all tokens are available everywhere without any additional import.

The main `index.css` file also imports `tokens.css` at the top. You never need to import `tokens.css` directly in a component.

---

## 2. Color Tokens

### Brand

| Token | Value | When to use |
|---|---|---|
| `--yellow` | `#ffd900` | CTA buttons (`.btn-primary`), active nav underline, highlights |
| `--dark-bg` | `#26262e` | Navbar background, footer background, hero dark sections |
| `--blue` | `#175cd3` | Links, breadcrumb text, interactive text elements |

### Surfaces

| Token | Value | When to use |
|---|---|---|
| `--white` | `#ffffff` | Page backgrounds, modal backgrounds, card backgrounds in light mode |
| `--card-bg` | `#f7faff` | Product cards, list items that need a subtle lift |
| `--section-light` | `#f5f7fa` | Alternating section backgrounds (light variant) |
| `--section-gray` | `#edf2f7` | Alternating section backgrounds (gray variant) |
| `--gray-100` | `#f7f7f7` | Subtle backgrounds, input backgrounds |

### Text

| Token | Value | When to use |
|---|---|---|
| `--text-dark` | `#1a1a1a` | Primary text, headings |
| `--text-med` | `#4d4d4d` | Secondary text, body copy |
| `--text-light` | `#767676` | Supporting text, captions |
| `--text-muted` | `#8c8c8c` | Placeholder text, disabled states |
| `--error` | `#c0392b` | Validation error messages |

### Borders

| Token | Value | When to use |
|---|---|---|
| `--border` | `#e0e0eb` | Card borders, input borders, dividers |
| `--border-light` | `#cccccc` | Lighter variant for subtle separators |

---

## 3. Typography Tokens

| Token | Value | Usage |
|---|---|---|
| `--font-head` | `'Exo 2', sans-serif` | All headings (`h1`–`h4`), navbar links, product names, section titles |
| `--font-body` | `'Inter', sans-serif` | Body text, labels, inputs, descriptions |

### Established type scale

| Element | Desktop size | Mobile size |
|---|---|---|
| Page title (`.page-header-title`) | 50px | 28px |
| Hero title | 36px | 22px |
| Section heading | 36px | 22px |
| Card title | 18–20px | — |
| Body copy | 15–16px | — |
| Small / caption | 13–14px | — |

Always use these sizes. Do not introduce arbitrary font sizes.

---

## 4. Spacing & Layout Tokens

| Token | Value |
|---|---|
| `--max-w` | `1440px` — maximum width of the page container |
| `--hero-height` | `560px` — desktop hero section height |

### Section padding scale

| Context | Desktop | Mobile |
|---|---|---|
| `.section` | `50px 30px` | `24px 16px` |
| Navbar horizontal | `0 20px` | `0 16px` |
| Modal box | `36px 32px` | `24px 16px` |

---

## 5. Border & Shadow Tokens

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `6px` | Small elements: tags, badges, input fields |
| `--radius-md` | `10px` | Cards, dropdowns |
| `--radius-lg` | `16px` | Large cards, modals |
| `--radius-xl` | `20px` | Hero images, featured cards |
| `--shadow-card` | `4px 4px 8px rgba(204,204,204,0.5)` | Card hover shadow |

---

## 6. Using Tokens in CSS

**Always use a token instead of a hardcoded value** when a token exists for that property.

```css
/* Correct */
.my-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-dark);
  font-family: var(--font-body);
}

/* Wrong — hardcoded values that duplicate tokens */
.my-card {
  background: #f7faff;
  border: 1px solid #e0e0eb;
  border-radius: 10px;
  color: #1a1a1a;
  font-family: 'Inter', sans-serif;
}
```

For values that don't have a token (e.g. a one-off pixel dimension), hardcoding is acceptable.

---

## 7. Dark Mode

Dark mode is controlled by adding `data-theme="dark"` to the `<html>` element. This is toggled by `ThemeContext`.

Token overrides for dark mode are defined in `tokens.css` under `[data-theme='dark']`:

```css
[data-theme='dark'] {
  --section-light: #2a2a35;
  --section-gray: #1e1e26;
  --text-dark: #ffffff;
  --text-med: #cccccc;
  --text-light: #a3a3a3;
  --border: #4d4d59;
  --card-bg: #22222b;
}
```

### Rules for dark mode

- [ ] **Only override tokens.** Do not add component-specific `[data-theme='dark']` rules unless a component has a hardcoded color that cannot be tokenized.
- [ ] **Test every new section in both modes.** Toggle dark mode after writing new CSS. The most common issue is a section with a hardcoded `background` color that doesn't update.
- [ ] **White text on `--dark-bg` does not need a dark mode override** — `--dark-bg` is the same in both modes.

---

## 8. Button Patterns

Two primary button classes:

```css
/* Yellow CTA button */
.btn-primary {
  background: var(--yellow);
  color: var(--text-dark);
  font-family: var(--font-head);
  /* height, padding, border-radius defined in index.css */
}

/* Bordered secondary button */
.btn-secondary {
  background: transparent;
  border: 1.5px solid var(--border);
  color: var(--text-dark);
}
```

**Usage rules:**
- [ ] Use `.btn-primary` for the single most important action on a page
- [ ] Use `.btn-secondary` for secondary actions alongside a primary (e.g. "Datasheet" next to "Enquiry")
- [ ] On mobile, ensure buttons have at least `height: 44px` (touch target minimum)
- [ ] Do not create new button variants without a clear need — extend `.btn-primary` or `.btn-secondary` with a modifier class

---

## 9. Section & Container Patterns

### Standard content section

```html
<div class="section">
  <div class="container">
    <!-- content -->
  </div>
</div>
```

- `.section` provides vertical padding (`50px 30px` desktop, `24px 16px` mobile)
- `.container` limits width to `--max-w` and centers horizontally

### Alternating section backgrounds

Use `--section-light` and `--section-gray` for alternating page sections. Never hardcode background colors for sections.

```css
.my-section--alt {
  background: var(--section-light);
}
```

### Content + Sidebar

```html
<div class="content-sidebar">
  <div class="content-main"><!-- main content --></div>
  <aside class="sidebar"><!-- sidebar --></aside>
</div>
```

This collapses to a single column on mobile automatically. See [desktop-to-mobile.md](desktop-to-mobile.md) §5 for the sidebar rules.

---

## 10. Card Patterns

### Product card (vertical)

Use the `<ProductCardV>` component. Renders a product image, name, short description, and enquiry button.

### Product card (horizontal)

Use the `<ProductCardH>` component. Used in list views where the image is beside the text.

### Custom cards

If you need a card that isn't a product card, use these CSS properties:

```css
.my-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: 20px;
}
```

---

## 11. Adding New Tokens

If a value is used three or more times and represents a design decision (not a coincidence), add it as a token in `tokens.css`.

**Process:**
1. Open `src/styles/tokens.css`
2. Add the token under the appropriate group (`/* Brand */`, `/* Surface */`, etc.)
3. Name it with `--` prefix and kebab-case
4. Replace all usages in `index.css` with `var(--new-token)`
5. If the token should change in dark mode, add an override in the `[data-theme='dark']` block

---

## 12. Rules

- [ ] **Use tokens, not hardcoded values**, for any property that has a token
- [ ] **No Tailwind.** Do not add Tailwind classes or the Tailwind package
- [ ] **No inline styles** for design-system properties (color, font, spacing). Inline styles are acceptable only for dynamic values calculated in JS (e.g. `transform: translateX(${offset}px)`)
- [ ] **Desktop styles first.** Write default styles for desktop. Add mobile overrides in the `@media (max-width: 768px)` block. Never write mobile-first CSS in this codebase
- [ ] **One breakpoint.** Do not add a second breakpoint. All responsive overrides use `@media (max-width: 768px)`
- [ ] **Test dark mode** after any CSS change involving background colors or text colors
