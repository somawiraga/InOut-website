import { useEffect, useState } from 'react'
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

interface ProductRow {
  id: string
  slug: string
  name: string
  short_description: string
  description: string
  category: string
  subcategory: string
  specifications: string
  pdf: string
  packaging: string
  detail: string
  download: string
  stock: string
  in_stock: boolean
  images: ImageRow[]
}

export function AdminProductsPage() {
  const { category = '', subcategory = '' } = useParams<{ category: string; subcategory: string }>()
  const navigate = useNavigate()
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const categoryName = productGroups.find(g => g.slug === category)?.name ?? category
  const subcategoryName = productGroups
    .find(g => g.slug === category)
    ?.subcategories.find(s => s.slug === subcategory)?.name ?? subcategory

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(image_url, sort_order)')
      .eq('category', categoryName)
      .eq('subcategory', subcategoryName)
      .order('name')

    if (error) {
      toast.error('Failed to load products: ' + error.message)
      setLoading(false)
      return
    }

    const rows = (data ?? []).map((p: Record<string, unknown>) => ({
      ...p,
      images: ((p.product_images as ImageRow[] | null) ?? [])
        .sort((a, b) => a.sort_order - b.sort_order),
    })) as ProductRow[]

    setProducts(rows)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [category, subcategory])

  async function handleDelete(product: ProductRow) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return

    setDeletingId(product.id)

    // Delete images first (FK constraint)
    await supabase.from('product_images').delete().eq('product_id', product.id)

    const { error } = await supabase.from('products').delete().eq('id', product.id)

    if (error) {
      toast.error('Delete failed: ' + error.message)
    } else {
      toast.success(`"${product.name}" deleted`)
      load()
    }

    setDeletingId(null)
  }

  function handleEdit(product: ProductRow) {
    navigate(`/admin/products/${category}/${subcategory}/edit/${product.id}`)
  }

  function handleAdd() {
    navigate(`/admin/products/${category}/${subcategory}/new`)
  }

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">{subcategoryName}</div>
          <div className="admin-page-subtitle">{categoryName} · {products.length} product{products.length !== 1 ? 's' : ''}</div>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleAdd}>
          + Add Product
        </button>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-empty">Loading…</div>
        ) : products.length === 0 ? (
          <div className="admin-empty">No products in this subcategory yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 72 }}>Image</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Stock</th>
                <th>Availability</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => {
                const thumb = p.images[0]?.image_url ?? null
                const isDeleting = deletingId === p.id

                return (
                  <tr key={p.id}>
                    <td>
                      {thumb
                        ? <img className="admin-table-thumb" src={thumb} alt={p.name} />
                        : <div className="admin-table-no-thumb">No img</div>
                      }
                    </td>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td style={{ color: 'var(--text-light)', fontSize: 12 }}>{p.slug}</td>
                    <td>{p.stock || '—'}</td>
                    <td>
                      <span className={`admin-badge ${p.in_stock ? 'admin-badge-green' : 'admin-badge-gray'}`}>
                        {p.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          className="admin-btn admin-btn-ghost"
                          style={{ padding: '5px 12px', fontSize: 12.5 }}
                          onClick={() => handleEdit(p)}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-btn admin-btn-danger"
                          style={{ padding: '5px 12px', fontSize: 12.5 }}
                          onClick={() => handleDelete(p)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? '…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

    </AdminLayout>
  )
}
