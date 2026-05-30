import { useState, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { PageHeader } from '../components/layout/PageHeader'
import { Footer } from '../components/layout/Footer'
import { BackToTop } from '../components/layout/BackToTop'
import { useProductDetail } from '../hooks/useProductDetail'
import { useProducts, useProductsLoading } from '../hooks/useProducts'
import { useProductGroups } from '../hooks/useProductGroups'
import { useEnquiryModal } from '../contexts/EnquiryModalContext'
import type { Product } from '../types'

// ── Image Lightbox ────────────────────────────────────────────────────────────
function ImageLightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[]
  startIndex: number
  onClose: () => void
}) {
  const [idx, setIdx] = useState(startIndex)
  const [zoomed, setZoomed] = useState(false)

  function goPrev() {
    setIdx((i) => (i - 1 + images.length) % images.length)
    setZoomed(false)
  }
  function goNext() {
    setIdx((i) => (i + 1) % images.length)
    setZoomed(false)
  }

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-box" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        {images.length > 1 && (
          <button className="lightbox-nav lightbox-nav--prev" onClick={goPrev} aria-label="Previous image">
            ‹
          </button>
        )}
        <div
          className="lightbox-img-wrap"
          onClick={() => setZoomed((z) => !z)}
          style={{ cursor: zoomed ? 'zoom-out' : 'zoom-in' }}
        >
          <img
            src={images[idx]}
            alt={`Image ${idx + 1} of ${images.length}`}
            style={{ transform: zoomed ? 'scale(2)' : 'scale(1)', transition: 'transform 0.3s' }}
          />
        </div>
        {images.length > 1 && (
          <button className="lightbox-nav lightbox-nav--next" onClick={goNext} aria-label="Next image">
            ›
          </button>
        )}
      </div>
    </div>
  )
}

// ── Variant Lightbox ──────────────────────────────────────────────────────────
function VariantLightbox({ variant, onClose }: { variant: Product; onClose: () => void }) {
  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-box lightbox-box--variant" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 22, marginBottom: 16 }}>
          {variant.name}
        </h2>
        {variant.images?.[0] && (
          <img
            src={variant.images[0]}
            alt={variant.name}
            style={{ maxHeight: 200, objectFit: 'contain', marginBottom: 16, display: 'block' }}
          />
        )}
        {variant.specifications && (
          <p style={{ fontSize: 14, color: 'var(--text-med)', lineHeight: 1.7 }}>
            {variant.specifications}
          </p>
        )}
      </div>
    </div>
  )
}

// ── ISO Classification Table ──────────────────────────────────────────────────
function ISOTable() {
  return (
    <div className="iso-table">
      <div className="iso-row">
        <div className="iso-cell header">FED</div>
        <div className="iso-cell">1</div>
        <div className="iso-cell">10</div>
        <div className="iso-cell">100</div>
        <div className="iso-cell highlight">1K</div>
        <div className="iso-cell highlight">10K</div>
        <div className="iso-cell highlight">100K</div>
      </div>
      <div className="iso-row">
        <div className="iso-cell header">ISO</div>
        <div className="iso-cell">3</div>
        <div className="iso-cell">4</div>
        <div className="iso-cell">5</div>
        <div className="iso-cell highlight">6</div>
        <div className="iso-cell highlight">7</div>
        <div className="iso-cell highlight">8</div>
      </div>
      <div className="iso-row">
        <div className="iso-cell header">GMP</div>
        <div className="iso-cell wide">A/B</div>
        <div className="iso-cell highlight">C</div>
        <div className="iso-cell highlight">D</div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function ProductDetailPage() {
  const { loading, error } = useProductsLoading()
  const product = useProductDetail()
  const products = useProducts()
  const groups = useProductGroups()
  const location = useLocation()
  const { openModal } = useEnquiryModal()
  const [activeImage, setActiveImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [variantOpen, setVariantOpen] = useState<Product | null>(null)

  type LocationState = { from?: string; industrySlug?: string; industryName?: string } | null
  const locState = location.state as LocationState

  const crumbs = useMemo(() => {
    if (!product) return [{ label: 'Products', to: '/products' }]
    const group = groups.find((g) => g.name === product.category)
    const subcat = group?.subcategories.find((s) => s.name === product.subcategory)
    const list: Array<{ label: string; to?: string }> = []

    if (locState?.from === 'industries' && locState.industrySlug) {
      list.push({ label: 'Industries', to: '/industries' })
      list.push({
        label: locState.industryName ?? locState.industrySlug,
        to: `/industries/${locState.industrySlug}`,
      })
    } else {
      list.push({ label: 'Products', to: '/products' })
    }
    if (group) list.push({ label: group.name, to: `/products/group/${group.slug}` })
    if (subcat && group)
      list.push({ label: subcat.name, to: `/products/group/${group.slug}/sub/${subcat.slug}` })
    list.push({ label: product.name })
    return list
  }, [product, groups, locState])

  const variants = useMemo(() => {
    if (!product) return []
    return products.filter(
      (p) =>
        p.category === product.category &&
        p.subcategory === product.subcategory &&
        p.id !== product.id,
    )
  }, [product, products])

  if (loading) return <div className="section-pad">Loading product…</div>
  if (error) return <div className="section-pad">Failed to load product: {error}</div>

  if (!product) {
    return (
      <>
        <PageHeader title="Product Not Found" crumbs={[{ label: 'Products', to: '/products' }]} />
        <main className="section-pad">
          <p>This product could not be found.</p>
          <Link to="/products">← Back to Products</Link>
        </main>
        <Footer />
        <BackToTop />
      </>
    )
  }

  const images = product.images?.length ? product.images : []
  const group = groups.find((g) => g.name === product.category)

  return (
    <>
      <PageHeader title={product.name} crumbs={crumbs} />

      {/* Product header: gallery + info */}
      <div className="product-header-inner">
        {/* Gallery */}
        <div className="product-gallery">
          <div
            className="gallery-main"
            onClick={() => images.length > 0 && setLightboxOpen(true)}
            style={{ cursor: images.length > 0 ? 'zoom-in' : 'default' }}
          >
            {images[activeImage] ? (
              <img src={images[activeImage]} alt={product.name} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'var(--section-gray)' }} />
            )}
          </div>
          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((src, i) => (
                <div
                  key={i}
                  className={`gallery-thumb${i === activeImage ? ' active' : ''}`}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={src} alt={`${product.name} thumbnail ${i + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="product-info">
          <div>
            {product.shortDescription && (
              <p
                className="product-desc"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.shortDescription) }}
              />
            )}
            {product.specifications && (
              <div
                className="product-specs"
                style={{ marginTop: 16 }}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.specifications) }}
              />
            )}
            {product.detail && (
              <div style={{ marginTop: 12, fontSize: 14, color: 'var(--text-med)', lineHeight: 1.6 }}>
                <strong>Details:</strong>
                <div style={{ marginTop: 4, whiteSpace: 'pre-wrap' }}>{product.detail}</div>
              </div>
            )}
            {product.packaging && (
              <div style={{ marginTop: 8, fontSize: 14, color: 'var(--text-med)' }}>
                <strong>Packaging:</strong> {product.packaging}
              </div>
            )}
            <div style={{ marginTop: 16 }}>
              <ISOTable />
            </div>
          </div>
          <div className="product-actions">
            <button
              className="btn-primary"
              style={{ height: 44, fontSize: 15 }}
              onClick={() => openModal({ id: product.id, name: product.name })}
            >
              Enquiry
            </button>
            {product.pdf ? (
              <a
                href={product.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ height: 44, fontSize: 15 }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ width: 18, height: 18 }}
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Datasheet
              </a>
            ) : (
              <button
                className="btn-secondary"
                style={{ height: 44, fontSize: 15, opacity: 0.4, cursor: 'not-allowed' }}
                disabled
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ width: 18, height: 18 }}
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Datasheet
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="content-sidebar">
        <div className="content-main">
          {/* Variants table */}
          {variants.length > 0 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 400, marginBottom: 16 }}>
                Product Variants
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {variants.map((v) => (
                  <div
                    key={v.id}
                    className="variant-row"
                    onClick={() => setVariantOpen(v)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                      {v.images?.[0] && (
                        <img
                          src={v.images[0]}
                          alt={v.name}
                          style={{ width: 60, height: 60, objectFit: 'contain', flexShrink: 0 }}
                        />
                      )}
                      <div>
                        <div style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 500 }}>
                          {v.name}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-med)', marginTop: 2 }}>
                          {v.subcategory}
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn-primary"
                      style={{ height: 36, fontSize: 13, flexShrink: 0 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        openModal({ id: v.id, name: v.name })
                      }}
                    >
                      Enquiry
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar: other groups */}
        <aside className="sidebar">
          <div className="sidebar-title">Other Product Groups</div>
          <div className="sidebar-links">
            {groups
              .filter((g) => g.slug !== group?.slug)
              .map((g) => (
                <Link key={g.slug} to={`/products/group/${g.slug}`}>
                  {g.name}
                </Link>
              ))}
          </div>
        </aside>
      </div>

      {/* Lightboxes */}
      {lightboxOpen && images.length > 0 && (
        <ImageLightbox
          images={images}
          startIndex={activeImage}
          onClose={() => setLightboxOpen(false)}
        />
      )}
      {variantOpen && <VariantLightbox variant={variantOpen} onClose={() => setVariantOpen(null)} />}

      <Footer />
      <BackToTop />
    </>
  )
}
