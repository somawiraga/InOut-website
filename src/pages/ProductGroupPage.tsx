import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { Footer } from '../components/layout/Footer'
import { BackToTop } from '../components/layout/BackToTop'
import { useProductGroups } from '../hooks/useProductGroups'
import { useProducts, useProductsLoading } from '../hooks/useProducts'
import { subcategoryImages } from '../data/subcategoryImages'
import { categoryImages } from '../data/categoryImages'
const PAGE_SIZE = 10

export function ProductGroupPage() {
  const { groupSlug, subSlug } = useParams<{ groupSlug: string; subSlug?: string }>()
  const groups = useProductGroups()
  const products = useProducts()
  const { loading, error } = useProductsLoading()
  const [page, setPage] = useState(1)
  const [prevSubSlug, setPrevSubSlug] = useState(subSlug)
  if (prevSubSlug !== subSlug) {
    setPrevSubSlug(subSlug)
    setPage(1)
  }

  const group = useMemo(() => groups.find((g) => g.slug === groupSlug), [groups, groupSlug])
  const subcategory = useMemo(
    () => (group && subSlug ? group.subcategories.find((s) => s.slug === subSlug) : null),
    [group, subSlug],
  )

  const crumbs = useMemo(() => {
    const c: Array<{ label: string; to?: string }> = [{ label: 'Products', to: '/products' }]
    if (group) {
      c.push({ label: group.name, to: subSlug ? `/products/group/${group.slug}` : undefined })
      if (subcategory) c.push({ label: subcategory.name })
    }
    return c
  }, [group, subSlug, subcategory])

  const filteredProducts = useMemo(() => {
    if (!group || !subSlug || !subcategory) return []
    const base = products.filter(
      (p) => p.category === group.name && p.subcategory === subcategory.name,
    )
    return base
  }, [group, subSlug, subcategory, products])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const pagedProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (loading) return <div className="section-pad">Loading products…</div>
  if (error) return <div className="section-pad">Failed to load products: {error}</div>

  if (!group) {
    return (
      <>
        <PageHeader title="Group Not Found" crumbs={[{ label: 'Products', to: '/products' }]} />
        <main className="section-pad">
          <p>Product group not found.</p>
        </main>
        <Footer />
        <BackToTop />
      </>
    )
  }

  const title = subcategory ? subcategory.name : group.name

  const groupImg = categoryImages[group.slug]

  return (
    <>
      <PageHeader title={title} crumbs={crumbs} />
      <main className="content-sidebar">
        {/* Main content — left, sidebar — right (matching HTML layout) */}
        <div className="content-main">
          {!subSlug ? (
            <>
              {/* Category image + description header */}
              {groupImg && (
                <div className="category-header">
                  <img
                    src={groupImg}
                    alt={group.name}
                    style={{ width: 280, height: 280, objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }}
                  />
                  <p style={{ color: 'var(--text-med)', fontSize: 15, lineHeight: 1.7 }}>
                    {group.description}
                  </p>
                </div>
              )}
              {!groupImg && (
                <p style={{ color: 'var(--text-med)', fontSize: 15, marginBottom: 20 }}>
                  {group.description}
                </p>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                {group.subcategories.map((sub) => {
                  const img = subcategoryImages[sub.slug] ?? subcategoryImages[sub.id]
                  return (
                    <Link
                      key={sub.slug}
                      to={`/products/group/${group.slug}/sub/${sub.slug}`}
                      className="prod-card-v"
                      style={{ width: 280, textDecoration: 'none' }}
                    >
                      {img && (
                        <img
                          src={img}
                          alt={sub.name}
                          loading="lazy"
                          style={{ width: '100%', height: 220, objectFit: 'cover' }}
                        />
                      )}
                      <div className="card-label">{sub.name}</div>
                    </Link>
                  )
                })}
              </div>
            </>
          ) : (
            <>
              {subcategory && (
                <p style={{ color: 'var(--text-med)', fontSize: 15, marginBottom: 16 }}>
                  {subcategory.description}
                </p>
              )}
              {filteredProducts.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No products found.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {pagedProducts.map((p) => (
                    <Link
                      key={p.slug}
                      to={`/products/${encodeURIComponent(p.slug)}`}
                      className="prod-card-h"
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="img-wrap">
                        <img
                          src={p.images?.[0] ?? ''}
                          alt={p.name}
                          loading="lazy"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      </div>
                      <div className="info">
                        <div>
                          <div className="prod-name">{p.name}</div>
                          <div style={{ fontSize: 13, color: 'var(--text-med)', marginTop: 6 }}>
                            {p.subcategory}
                          </div>
                          <p
                            style={{
                              fontSize: 13,
                              color: 'var(--text-light)',
                              marginTop: 10,
                              lineHeight: 1.5,
                            }}
                          >
                            {(p.shortDescription ?? '').substring(0, 120)}
                          </p>
                        </div>
                        <div className="card-actions">
                          <span className="btn-primary" style={{ fontSize: 13 }}>
                            View Details
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="pagination">
                  <span className="pag-info">{filteredProducts.length} products</span>
                  <button
                    className="pag-btn"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    aria-label="Previous page"
                  >
                    ‹
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      className={`pag-btn${n === page ? ' active' : ''}`}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    className="pag-btn"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    aria-label="Next page"
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar — right side (matching HTML layout) */}
        <aside className="sidebar">
          <div className="sidebar-title">Categories</div>
          <div className="sidebar-links">
            <Link
              to={`/products/group/${group.slug}`}
              style={{ fontWeight: !subSlug ? 700 : 400 }}
            >
              All {group.name}
            </Link>
            {group.subcategories.map((sub) => (
              <Link
                key={sub.slug}
                to={`/products/group/${group.slug}/sub/${sub.slug}`}
                style={{ fontWeight: subSlug === sub.slug ? 700 : 400 }}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </aside>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
