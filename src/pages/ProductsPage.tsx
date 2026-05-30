import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { Footer } from '../components/layout/Footer'
import { BackToTop } from '../components/layout/BackToTop'
import { Pagination } from '../components/ui/Pagination'
import { useProductGroups } from '../hooks/useProductGroups'
import { useProducts, useProductsLoading } from '../hooks/useProducts'
import { categoryImages } from '../data/categoryImages'

const PAGE_SIZE = 20

export function ProductsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const q = searchParams.get('search') ?? ''
  const groups = useProductGroups()
  const products = useProducts()
  const { loading, error } = useProductsLoading()
  const [page, setPage] = useState(1)

  const searchResults = q
    ? products.filter((p) => {
        const term = q.toLowerCase()
        return (
          p.name.toLowerCase().includes(term) ||
          (p.shortDescription ?? '').toLowerCase().includes(term) ||
          (p.category ?? '').toLowerCase().includes(term) ||
          (p.subcategory ?? '').toLowerCase().includes(term)
        )
      })
    : []

  const totalPages = Math.max(1, Math.ceil(searchResults.length / PAGE_SIZE))
  const pagedResults = searchResults.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handlePageChange(newPage: number) {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) return <div className="section-pad">Loading products…</div>
  if (error) return <div className="section-pad">Failed to load products: {error}</div>

  return (
    <>
      <PageHeader title="All Products" />
      <main>
        {q ? (
          <section className="section-pad">
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 24, marginBottom: 16, fontWeight: 400 }}>
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for &ldquo;{q}&rdquo;
            </h2>
            {searchResults.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No products found. Try a different search term.</p>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {pagedResults.map((p) => (
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
                            {p.category} › {p.subcategory}
                          </div>
                          <p style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 10, lineHeight: 1.5 }}>
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
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 24, gap: 16 }}>
                  <span className="pag-info">{searchResults.length} products</span>
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
            <button
              className="btn-secondary"
              style={{ marginTop: 20 }}
              onClick={() => navigate('/products')}
            >
              ← Back to All Products
            </button>
          </section>
        ) : (
          <section className="section-pad">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
              {groups.map((group) => {
                const img = categoryImages[group.slug]
                return (
                  <Link
                    key={group.slug}
                    to={`/products/group/${group.slug}`}
                    className="prod-card-v"
                    style={{ width: 260, textDecoration: 'none' }}
                  >
                    {img && (
                      <img src={img} alt={group.name} loading="lazy" style={{ height: 200, objectFit: 'cover', width: '100%' }} />
                    )}
                    <div className="card-label" style={{ padding: 12, fontSize: 15 }}>
                      {group.name}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
