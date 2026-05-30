import { useState, useEffect, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '../../lib/supabaseClient'
import { AdminLayout } from '../../components/admin/AdminLayout'
import productGroups from '../../data/product-groups.json'
import '../../styles/admin.css'

interface ImageRow {
  image_url: string
  sort_order: number
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function AdminProductFormPage() {
  const { category = '', subcategory = '', productId } = useParams<{
    category: string
    subcategory: string
    productId?: string
  }>()
  const navigate = useNavigate()
  const isEdit = Boolean(productId)

  const backPath = `/admin/products/${category}/${subcategory}`

  // Resolve display names from slugs
  const categoryName = productGroups.find(g => g.slug === category)?.name ?? category
  const subcategoryName = productGroups
    .find(g => g.slug === category)
    ?.subcategories.find(s => s.slug === subcategory)?.name ?? subcategory

  // Form state
  const [loadingProduct, setLoadingProduct] = useState(isEdit)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [productCategory, setProductCategory] = useState(categoryName)
  const [productSubcategory, setProductSubcategory] = useState(subcategoryName)
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [specifications, setSpecifications] = useState('')
  const [packaging, setPackaging] = useState('')
  const [detail, setDetail] = useState('')
  const [download, setDownload] = useState('')
  const [pdf, setPdf] = useState('')
  const [stock, setStock] = useState('')
  const [inStock, setInStock] = useState(true)
  const [images, setImages] = useState<ImageRow[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [saving, setSaving] = useState(false)

  // Load existing product when editing
  useEffect(() => {
    if (!isEdit || !productId) return

    supabase
      .from('products')
      .select('*, product_images(image_url, sort_order)')
      .eq('id', productId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          toast.error('Product not found')
          navigate(backPath)
          return
        }
        setName(data.name ?? '')
        setSlug(data.slug ?? '')
        setSlugManual(true)
        setProductCategory(data.category ?? categoryName)
        setProductSubcategory(data.subcategory ?? subcategoryName)
        setShortDescription(data.short_description ?? '')
        setDescription(data.description ?? '')
        setSpecifications(data.specifications ?? '')
        setPackaging(data.packaging ?? '')
        setDetail(data.detail ?? '')
        setDownload(data.download ?? '')
        setPdf(data.pdf ?? '')
        setStock(data.stock ?? '')
        setInStock(data.in_stock ?? true)
        const imgs = ((data.product_images as ImageRow[] | null) ?? [])
          .sort((a, b) => a.sort_order - b.sort_order)
        setImages(imgs)
        setLoadingProduct(false)
      })
  }, [productId])

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugManual) setSlug(slugify(name))
  }, [name, slugManual])

  const subcategories = productGroups.find(g => g.name === productCategory)?.subcategories ?? []

  useEffect(() => {
    const subs = productGroups.find(g => g.name === productCategory)?.subcategories ?? []
    if (!subs.find(s => s.name === productSubcategory)) {
      setProductSubcategory(subs[0]?.name ?? '')
    }
  }, [productCategory])

  function addImageUrl() {
    const url = newImageUrl.trim()
    if (!url) return
    setImages(prev => [...prev, { image_url: url, sort_order: prev.length }])
    setNewImageUrl('')
  }

  function removeImage(idx: number) {
    setImages(prev => prev.filter((_, i) => i !== idx).map((img, i) => ({ ...img, sort_order: i })))
  }

  function moveImage(idx: number, dir: -1 | 1) {
    setImages(prev => {
      const next = [...prev]
      const target = idx + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[idx], next[target]] = [next[target], next[idx]]
      return next.map((img, i) => ({ ...img, sort_order: i }))
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) { toast.error('Product name is required'); return }
    if (!slug.trim()) { toast.error('Slug is required'); return }

    setSaving(true)
    const id = isEdit ? productId! : slug

    const { error: upsertErr } = await supabase.from('products').upsert({
      id,
      slug,
      name,
      short_description: shortDescription,
      description,
      category: productCategory,
      subcategory: productSubcategory,
      specifications,
      pdf,
      packaging,
      detail,
      download,
      stock,
      in_stock: inStock,
    })

    if (upsertErr) {
      toast.error(upsertErr.message)
      setSaving(false)
      return
    }

    await supabase.from('product_images').delete().eq('product_id', id)

    if (images.length > 0) {
      const { error: imgErr } = await supabase.from('product_images').insert(
        images.map((img, i) => ({ product_id: id, image_url: img.image_url, sort_order: i }))
      )
      if (imgErr) {
        toast.error('Saved product but failed to sync images: ' + imgErr.message)
        setSaving(false)
        navigate(backPath)
        return
      }
    }

    toast.success(isEdit ? 'Product updated' : 'Product added')
    setSaving(false)
    navigate(backPath)
  }

  if (loadingProduct) {
    return (
      <AdminLayout>
        <div className="admin-empty" style={{ paddingTop: 80 }}>Loading product…</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <button className="admin-btn admin-btn-ghost admin-back-btn" onClick={() => navigate(backPath)}>
            ← Back
          </button>
          <div className="admin-page-title">{isEdit ? 'Edit Product' : 'Add Product'}</div>
          <div className="admin-page-subtitle">{categoryName} › {subcategoryName}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-form-grid">

          {/* ── Left column ── */}
          <div className="admin-form-col">

            <div className="admin-form-section">
              <div className="admin-modal-section-title">Basic Information</div>

              <div className="admin-field">
                <label className="admin-label">Name <span>*</span></label>
                <input
                  className="admin-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Product name"
                  required
                  autoFocus
                />
              </div>

              <div className="admin-field">
                <label className="admin-label">Slug <span>*</span></label>
                <input
                  className="admin-input"
                  value={slug}
                  onChange={e => { setSlug(e.target.value); setSlugManual(true) }}
                  placeholder="product-slug"
                  required
                />
              </div>

              <div className="admin-field">
                <label className="admin-label">Short Description</label>
                <input
                  className="admin-input"
                  value={shortDescription}
                  onChange={e => setShortDescription(e.target.value)}
                  placeholder="One-line summary shown in product cards"
                />
              </div>
            </div>

            <div className="admin-form-section">
              <div className="admin-modal-section-title">Content</div>

              <div className="admin-field">
                <label className="admin-label">Description</label>
                <textarea
                  className="admin-textarea"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Full product description — supports Markdown"
                  rows={6}
                />
              </div>

              <div className="admin-field">
                <label className="admin-label">Specifications</label>
                <textarea
                  className="admin-textarea"
                  value={specifications}
                  onChange={e => setSpecifications(e.target.value)}
                  placeholder="Technical specifications — supports Markdown"
                  rows={5}
                />
              </div>

              <div className="admin-field">
                <label className="admin-label">Detail</label>
                <textarea
                  className="admin-textarea"
                  value={detail}
                  onChange={e => setDetail(e.target.value)}
                  placeholder="Additional detail"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="admin-form-col">

            <div className="admin-form-section">
              <div className="admin-modal-section-title">Classification</div>

              <div className="admin-field">
                <label className="admin-label">Category</label>
                <select
                  className="admin-select"
                  value={productCategory}
                  onChange={e => setProductCategory(e.target.value)}
                >
                  {productGroups.map(g => (
                    <option key={g.id} value={g.name}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div className="admin-field">
                <label className="admin-label">Subcategory</label>
                <select
                  className="admin-select"
                  value={productSubcategory}
                  onChange={e => setProductSubcategory(e.target.value)}
                >
                  {subcategories.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="admin-field-row">
                <div>
                  <label className="admin-label">Stock</label>
                  <input
                    className="admin-input"
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                    placeholder="e.g. 100 units"
                  />
                </div>
                <div>
                  <label className="admin-label">Packaging</label>
                  <input
                    className="admin-input"
                    value={packaging}
                    onChange={e => setPackaging(e.target.value)}
                    placeholder="e.g. 100 pcs/box"
                  />
                </div>
              </div>

              <div className="admin-field">
                <div className="admin-checkbox-row">
                  <input
                    id="in-stock"
                    type="checkbox"
                    checked={inStock}
                    onChange={e => setInStock(e.target.checked)}
                  />
                  <label htmlFor="in-stock">In Stock</label>
                </div>
              </div>
            </div>

            <div className="admin-form-section">
              <div className="admin-modal-section-title">Links</div>

              <div className="admin-field">
                <label className="admin-label">PDF URL</label>
                <input
                  className="admin-input"
                  value={pdf}
                  onChange={e => setPdf(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="admin-field">
                <label className="admin-label">Download URL</label>
                <input
                  className="admin-input"
                  value={download}
                  onChange={e => setDownload(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="admin-form-section">
              <div className="admin-modal-section-title">Images</div>

              {images.length > 0 && (
                <div className="admin-image-list">
                  {images.map((img, i) => (
                    <div key={i} className="admin-image-row">
                      <div className="admin-image-order-btns">
                        <button
                          type="button"
                          className="admin-image-order-btn"
                          onClick={() => moveImage(i, -1)}
                          disabled={i === 0}
                          title="Move up"
                        >▲</button>
                        <button
                          type="button"
                          className="admin-image-order-btn"
                          onClick={() => moveImage(i, 1)}
                          disabled={i === images.length - 1}
                          title="Move down"
                        >▼</button>
                      </div>
                      <img
                        src={img.image_url}
                        alt=""
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                      <span className="admin-image-row-url">{img.image_url}</span>
                      <button
                        type="button"
                        className="admin-image-remove"
                        onClick={() => removeImage(i)}
                        title="Remove"
                      >×</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="admin-image-add-row">
                <input
                  className="admin-image-url-input"
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                  placeholder="Paste image URL and press Enter"
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImageUrl() } }}
                />
                <button type="button" className="admin-btn admin-btn-ghost" onClick={addImageUrl}>
                  Add
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Sticky footer */}
        <div className="admin-form-footer">
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Product'}
          </button>
          <button type="button" className="admin-btn admin-btn-ghost" onClick={() => navigate(backPath)}>
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}
