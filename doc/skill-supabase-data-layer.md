# Add a New Supabase-Backed Data Type

**Description:** Step-by-step guide for adding a new data type to the InOut codebase — from creating the Supabase table through to TypeScript types, a React Context, and custom hooks that components can call. Follows the same pattern as `ProductsContext`.

**Version:** 1.0.0

---

## Table of Contents

1. [When to Use This Pattern](#1-when-to-use-this-pattern)
2. [Step 1 — Create the Supabase Table](#2-step-1--create-the-supabase-table)
3. [Step 2 — Add the TypeScript Type](#3-step-2--add-the-typescript-type)
4. [Step 3 — Create the Context](#4-step-3--create-the-context)
5. [Step 4 — Register the Provider](#5-step-4--register-the-provider)
6. [Step 5 — Create Hooks](#6-step-5--create-hooks)
7. [Step 6 — Use in Components](#7-step-6--use-in-components)
8. [Full Checklist](#8-full-checklist)

---

## 1. When to Use This Pattern

Use this pattern when:
- The data changes frequently enough to need admin management (not just a yearly edit)
- The data needs to be available across many pages/components
- There are more than a handful of rows

For data that changes rarely and is read in only one place, a static JSON file under `src/data/` is simpler. See `industries.json` and `resources.json` as examples.

---

## 2. Step 1 — Create the Supabase Table

Create the table in the Supabase dashboard (Table Editor) or via SQL in the SQL editor.

**Example: adding a `certifications` table**

```sql
create table certifications (
  id          text primary key,
  name        text not null,
  slug        text not null unique,
  description text,
  image_url   text,
  issued_by   text,
  valid_until date,
  created_at  timestamptz default now()
);

-- Allow public read; restrict writes to authenticated users
alter table certifications enable row level security;

create policy "public read"
  on certifications for select
  using (true);

create policy "admin write"
  on certifications for all
  using (auth.role() = 'authenticated');
```

> **Rule:** Always enable RLS and create at minimum a public `SELECT` policy and an `authenticated`-only write policy. Never leave a table with RLS disabled in production.

---

## 3. Step 2 — Add the TypeScript Type

Open `src/types/index.ts` and add the interface. Field names should use camelCase (matching the JS convention), even though the DB uses snake_case.

```ts
// src/types/index.ts
export interface Certification {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string
  issuedBy: string
  validUntil: string | null
}
```

---

## 4. Step 3 — Create the Context

Create a new file at `src/contexts/CertificationsContext.tsx`. Model it directly on `ProductsContext`.

```tsx
// src/contexts/CertificationsContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Certification } from '../types'

interface CertificationsState {
  certifications: Certification[]
  loading: boolean
  error: string | null
}

const CertificationsContext = createContext<CertificationsState>({
  certifications: [],
  loading: true,
  error: null,
})

function mapRow(row: Record<string, unknown>): Certification {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: (row.description ?? '') as string,
    imageUrl: (row.image_url ?? '') as string,
    issuedBy: (row.issued_by ?? '') as string,
    validUntil: row.valid_until as string | null,
  }
}

export function CertificationsProvider({ children }: { children: ReactNode }) {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('certifications')
      .select('*')
      .order('name')
      .then(({ data, error: err }) => {
        if (err) {
          setError(err.message)
        } else {
          setCertifications((data ?? []).map(mapRow))
        }
        setLoading(false)
      })
  }, [])

  return (
    <CertificationsContext.Provider value={{ certifications, loading, error }}>
      {children}
    </CertificationsContext.Provider>
  )
}

export function useCertificationsContext() {
  return useContext(CertificationsContext)
}
```

**If your entity has a related images table** (like `product_images`), fetch both tables in the `useEffect` and join them in JS before calling `mapRow`. See `ProductsContext` for the exact pattern.

---

## 5. Step 4 — Register the Provider

Open `src/main.tsx` and wrap the app with the new provider. Add it inside the existing provider tree.

```tsx
// src/main.tsx
import { CertificationsProvider } from './contexts/CertificationsContext'

// Add alongside existing providers:
<CertificationsProvider>
  <App />
</CertificationsProvider>
```

**Provider order:** Providers that don't depend on each other can be in any order. If your new provider needs data from another context, place it inside that context's provider.

---

## 6. Step 5 — Create Hooks

Create a new file at `src/hooks/useCertifications.ts`. Components should never import from the context file directly — always go through these hooks.

```ts
// src/hooks/useCertifications.ts
import { useMemo } from 'react'
import { useCertificationsContext } from '../contexts/CertificationsContext'

export function useCertifications() {
  return useCertificationsContext().certifications
}

export function useCertificationsLoading() {
  const { loading, error } = useCertificationsContext()
  return { loading, error }
}

export function useCertificationBySlug(slug: string | undefined) {
  const certifications = useCertifications()
  return useMemo(
    () => (slug ? (certifications.find((c) => c.slug === slug) ?? null) : null),
    [certifications, slug],
  )
}
```

Add only the hooks that are actually needed now. Don't add speculative hooks.

---

## 7. Step 6 — Use in Components

```tsx
import { useCertifications, useCertificationsLoading } from '../hooks/useCertifications'

function CertificationsPage() {
  const certifications = useCertifications()
  const { loading, error } = useCertificationsLoading()

  if (loading) return <div className="section">Loading…</div>
  if (error) return <div className="section">Error: {error}</div>

  return (
    <div className="section">
      {certifications.map(cert => (
        <div key={cert.id}>{cert.name}</div>
      ))}
    </div>
  )
}
```

---

## 8. Full Checklist

### Supabase
- [ ] Table created with correct columns and data types
- [ ] RLS enabled
- [ ] Public `SELECT` policy created
- [ ] Authenticated write policy created

### TypeScript
- [ ] Interface added to `src/types/index.ts`
- [ ] All snake_case DB columns mapped to camelCase interface fields
- [ ] Nullable columns typed as `string | null` (not just `string`)

### Context
- [ ] Created `src/contexts/[Entity]Context.tsx`
- [ ] `mapRow` function converts DB row to TypeScript type
- [ ] `useEffect` fetches from Supabase and calls `setLoading(false)` in both success and error paths
- [ ] Context exported; Provider exported; raw context hook (`use[Entity]Context`) exported

### Provider registration
- [ ] Provider added to `src/main.tsx` wrapping `<App />`

### Hooks
- [ ] Created `src/hooks/use[Entity].ts`
- [ ] At minimum: a hook returning all items and a hook returning `{ loading, error }`
- [ ] `useMemo` used in any filtering hook to avoid recalculating on every render

### Usage
- [ ] Components import from hooks file, not from the context file directly
- [ ] Loading and error states handled in every component that uses the data
