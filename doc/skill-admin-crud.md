# Add Admin CRUD for a New Entity

**Description:** Step-by-step guide for adding admin list, create, edit, and delete pages for a new entity. Follows the same pattern as the product admin pages (`AdminProductsPage`, `AdminProductFormPage`).

**Version:** 1.0.0

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Step 1 — Create the List Page](#2-step-1--create-the-list-page)
3. [Step 2 — Create the Form Page](#3-step-2--create-the-form-page)
4. [Step 3 — Register the Routes](#4-step-3--register-the-routes)
5. [Step 4 — Add Sidebar Navigation](#5-step-4--add-sidebar-navigation)
6. [Step 5 — Add CSS](#6-step-5--add-css)
7. [Full Checklist](#7-full-checklist)

---

## 1. Prerequisites

Before adding admin pages:
- The entity's Supabase table already exists with RLS policies (see [skill-supabase-data-layer.md](skill-supabase-data-layer.md))
- The TypeScript type is defined in `src/types/index.ts`

Admin pages fetch directly from Supabase — they do not go through the public-site Contexts/hooks. This is intentional: admin needs fresh data on every load, not the cached snapshot from the public context.

---

## 2. Step 1 — Create the List Page

Create `src/pages/admin/Admin[Entity]sPage.tsx`.

The list page shows all rows for the entity, with links to edit each one and a delete button.

```tsx
// src/pages/admin/AdminCertificationsPage.tsx
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '../../lib/supabaseClient'
import { AdminLayout } from '../../components/admin/AdminLayout'
import '../../styles/admin.css'

interface Row {
  id: string
  name: string
  slug: string
  issued_by: string | null
}

export function AdminCertificationsPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  async function load() {
    const { data, error } = await supabase
      .from('certifications')
      .select('id, name, slug, issued_by')
      .order('name')
    if (error) { toast.error(error.message); return }
    setRows(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"?`)) return
    const { error } = await supabase.from('certifications').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    toast.success(`Deleted "${name}"`)
    setRows(prev => prev.filter(r => r.id !== id))
  }

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div className="admin-page-title">Certifications</div>
        <Link to="/admin/certifications/new" className="admin-btn admin-btn-primary">
          + Add Certification
        </Link>
      </div>

      {loading ? (
        <div className="admin-empty">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="admin-empty">No certifications yet.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Issued By</th>
              <th>Slug</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.issued_by ?? '—'}</td>
                <td className="admin-table-muted">{row.slug}</td>
                <td className="admin-table-actions">
                  <button
                    className="admin-btn admin-btn-ghost"
                    onClick={() => navigate(`/admin/certifications/edit/${row.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="admin-btn admin-btn-danger"
                    onClick={() => handleDelete(row.id, row.name)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  )
}
```

---

## 3. Step 2 — Create the Form Page

Create `src/pages/admin/Admin[Entity]FormPage.tsx`.

The form page handles both create and edit. It knows it is in edit mode when the route contains an `id` param.

```tsx
// src/pages/admin/AdminCertificationFormPage.tsx
import { useState, useEffect, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '../../lib/supabaseClient'
import { AdminLayout } from '../../components/admin/AdminLayout'
import '../../styles/admin.css'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function AdminCertificationFormPage() {
  const { certificationId } = useParams<{ certificationId?: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(certificationId)
  const backPath = '/admin/certifications'

  // Form state — one useState per field
  const [loading, setLoading] = useState(isEdit)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [issuedBy, setIssuedBy] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [saving, setSaving] = useState(false)

  // Load existing row when editing
  useEffect(() => {
    if (!isEdit || !certificationId) return
    supabase
      .from('certifications')
      .select('*')
      .eq('id', certificationId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { toast.error('Not found'); navigate(backPath); return }
        setName(data.name ?? '')
        setSlug(data.slug ?? '')
        setSlugManual(true)
        setDescription(data.description ?? '')
        setImageUrl(data.image_url ?? '')
        setIssuedBy(data.issued_by ?? '')
        setValidUntil(data.valid_until ?? '')
        setLoading(false)
      })
  }, [certificationId])

  // Auto-generate slug from name (unless manually edited)
  useEffect(() => {
    if (!slugManual) setSlug(slugify(name))
  }, [name, slugManual])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) { toast.error('Name is required'); return }
    if (!slug.trim()) { toast.error('Slug is required'); return }
    setSaving(true)

    const id = isEdit ? certificationId! : slug
    const { error } = await supabase.from('certifications').upsert({
      id,
      slug,
      name,
      description,
      image_url: imageUrl,
      issued_by: issuedBy,
      valid_until: validUntil || null,
    })

    if (error) { toast.error(error.message); setSaving(false); return }
    toast.success(isEdit ? 'Updated' : 'Created')
    setSaving(false)
    navigate(backPath)
  }

  if (loading) return <AdminLayout><div className="admin-empty">Loading…</div></AdminLayout>

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <button className="admin-btn admin-btn-ghost" onClick={() => navigate(backPath)}>
            ← Back
          </button>
          <div className="admin-page-title">{isEdit ? 'Edit Certification' : 'Add Certification'}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <div className="admin-form-col">
            <div className="admin-form-section">
              <div className="admin-modal-section-title">Details</div>

              <div className="admin-field">
                <label className="admin-label">Name <span>*</span></label>
                <input className="admin-input" value={name}
                  onChange={e => setName(e.target.value)} required autoFocus />
              </div>

              <div className="admin-field">
                <label className="admin-label">Slug <span>*</span></label>
                <input className="admin-input" value={slug}
                  onChange={e => { setSlug(e.target.value); setSlugManual(true) }} required />
              </div>

              <div className="admin-field">
                <label className="admin-label">Description</label>
                <textarea className="admin-textarea" rows={4} value={description}
                  onChange={e => setDescription(e.target.value)} />
              </div>

              <div className="admin-field">
                <label className="admin-label">Issued By</label>
                <input className="admin-input" value={issuedBy}
                  onChange={e => setIssuedBy(e.target.value)} />
              </div>

              <div className="admin-field">
                <label className="admin-label">Valid Until</label>
                <input className="admin-input" type="date" value={validUntil}
                  onChange={e => setValidUntil(e.target.value)} />
              </div>

              <div className="admin-field">
                <label className="admin-label">Image URL</label>
                <input className="admin-input" value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-form-footer">
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create'}
          </button>
          <button type="button" className="admin-btn admin-btn-ghost" onClick={() => navigate(backPath)}>
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}
```

---

## 4. Step 3 — Register the Routes

Open `src/App.tsx`. Find `AdminRoutes()` and add routes for the new entity inside its `<Routes>` block.

```tsx
// src/App.tsx — inside AdminRoutes(), within <Routes>
import { AdminCertificationsPage } from './pages/admin/AdminCertificationsPage'
import { AdminCertificationFormPage } from './pages/admin/AdminCertificationFormPage'

// Inside <Routes> in AdminRoutes():
<Route
  path="certifications"
  element={<AdminGuard><AdminCertificationsPage /></AdminGuard>}
/>
<Route
  path="certifications/new"
  element={<AdminGuard><AdminCertificationFormPage /></AdminGuard>}
/>
<Route
  path="certifications/edit/:certificationId"
  element={<AdminGuard><AdminCertificationFormPage /></AdminGuard>}
/>
```

All admin routes must be wrapped in `<AdminGuard>`.

---

## 5. Step 4 — Add Sidebar Navigation

Open `src/components/admin/AdminLayout.tsx` and add a `<NavLink>` to the sidebar nav section.

```tsx
// src/components/admin/AdminLayout.tsx — inside the sidebar <nav>
<NavLink
  to="/admin/certifications"
  className={({ isActive }) => `admin-subcategory-link${isActive ? ' active' : ''}`}
>
  Certifications
</NavLink>
```

If your entity should appear as a top-level section rather than under an expandable category, add it outside the `productGroups.map(...)` block.

---

## 6. Step 5 — Add CSS

The admin CSS lives entirely in `src/styles/admin.css`. All the layout primitives you need already exist:

| Class | Purpose |
|---|---|
| `.admin-page-header` | Page title row with optional action button |
| `.admin-page-title` | H1-level page title |
| `.admin-table` | Full-width data table |
| `.admin-table-muted` | Muted/secondary table cell |
| `.admin-table-actions` | Right-aligned action buttons cell |
| `.admin-form-grid` | Two-column form layout |
| `.admin-form-col` | Single column inside form grid |
| `.admin-form-section` | Card-like section within a form column |
| `.admin-form-footer` | Sticky footer with Save/Cancel buttons |
| `.admin-field` | Field wrapper (label + input) |
| `.admin-label` | Form label |
| `.admin-input` | Text input |
| `.admin-textarea` | Textarea |
| `.admin-select` | Select dropdown |
| `.admin-btn` | Base button |
| `.admin-btn-primary` | Primary action button (yellow) |
| `.admin-btn-ghost` | Secondary/ghost button |
| `.admin-btn-danger` | Destructive action button (red) |
| `.admin-empty` | Empty state message |

Only add new CSS if none of the existing classes fit your needs.

---

## 7. Full Checklist

### List page
- [ ] Created `src/pages/admin/Admin[Entity]sPage.tsx`
- [ ] Fetches directly from Supabase (not from context)
- [ ] Shows loading state while fetching
- [ ] Shows empty state when there are no rows
- [ ] Each row has an Edit button (navigates to form page) and a Delete button
- [ ] Delete confirms before executing; shows success toast; removes row from local state
- [ ] "Add" button links to the new-item form route

### Form page
- [ ] Created `src/pages/admin/Admin[Entity]FormPage.tsx`
- [ ] Detects edit mode by checking for an ID param
- [ ] Loads existing data from Supabase when in edit mode
- [ ] Auto-generates slug from name; allows manual override
- [ ] Uses `supabase.from(...).upsert(...)` to create or update
- [ ] Shows error toast on Supabase error; navigates back on success
- [ ] Saving state disables the submit button to prevent double-submit
- [ ] Back button navigates to list page

### Routes
- [ ] List route added to `AdminRoutes()` in `App.tsx`
- [ ] New-item route added (path ends in `/new`)
- [ ] Edit route added (path ends in `/edit/:id`)
- [ ] All three routes wrapped in `<AdminGuard>`
- [ ] Imports added at top of `App.tsx`

### Sidebar
- [ ] `<NavLink>` added to `AdminLayout.tsx` with active class logic

### CSS
- [ ] No new CSS added unless existing admin classes don't cover the need
