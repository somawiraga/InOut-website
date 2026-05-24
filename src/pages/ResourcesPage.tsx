import { useState, useCallback, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PageHeader } from '../components/layout/PageHeader'
import { Footer } from '../components/layout/Footer'
import { BackToTop } from '../components/layout/BackToTop'
import { SearchBar } from '../components/ui/SearchBar'
import { useResources } from '../hooks/useResources'
import { companies } from '../data/companyImages'

const PAGE_SIZE = 20

export function ResourcesPage() {
  const resources = useResources()
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [openResource, setOpenResource] = useState<(typeof resources)[0] | null>(null)

  const allTags = Array.from(new Set(resources.flatMap((r) => r.tags ?? [])))

  const filtered = resources.filter((r) => {
    const matchesTag = activeTag ? (r.tags ?? []).includes(activeTag) : true
    const matchesSearch = searchQuery.trim()
      ? r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.description ?? '').toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesTag && matchesSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pagedResources = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleTag = useCallback(
    (tag: string) => {
      setActiveTag((prev) => (prev === tag ? null : tag))
      setPage(1)
    },
    [],
  )

  const closeModal = useCallback(() => setOpenResource(null), [])

  useEffect(() => {
    if (!openResource) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [openResource, closeModal])

  return (
    <>
      <PageHeader title="Resources" />
      <main>
        {/* Brochures / Partners */}
        <section className="section-pad">
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 className="section-title section-title--left" style={{ marginBottom: 32 }}>
              Brochures
            </h2>
            <div className="company-cards" style={{ justifyContent: 'center' }}>
              {companies.map((c) => (
                <div key={c.name} className="company-card">
                  <div className="cc-img">
                    <img src={c.logo} alt={c.name} />
                  </div>
                  <div className="cc-name">{c.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Documentation */}
        <section className="section-pad" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 className="section-title section-title--left" style={{ marginBottom: 20 }}>
            Documentation &amp; Guides
          </h2>

          {/* Filter chips + search bar */}
          <div
            className="filter-bar"
            style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}
          >
            <div className="filter-chips-wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, flex: 1 }}>
              {allTags.map((tag) => (
                <label key={tag} className={`filter-chip${activeTag === tag ? ' active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={activeTag === tag}
                    onChange={() => toggleTag(tag)}
                    style={{ display: 'none' }}
                  />
                  {tag}
                </label>
              ))}
            </div>
            <SearchBar
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(val) => { setSearchQuery(val); setPage(1) }}
              onSubmit={() => {}}
            />
          </div>

          {/* Resource list */}
          <div className="resource-list">
            {pagedResources.map((resource) => (
              <div key={resource.id} className="resource-item">
                <div>
                  <div className="res-title">{resource.title}</div>
                  {resource.date && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                      {resource.date}
                    </div>
                  )}
                  <div className="res-tags" style={{ marginTop: 6 }}>
                    {(resource.tags ?? []).map((t) => (
                      <span key={t} className="res-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="res-link" onClick={() => setOpenResource(resource)}>
                  Read →
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination" style={{ marginTop: 24 }}>
              <span className="pag-info">{filtered.length} documents</span>
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
        </section>
      </main>

      {/* Resource modal */}
      {openResource && (
        <div
          className="modal-overlay open"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          tabIndex={-1}
        >
          <div className="modal-box resource-modal-box">
            <button className="modal-close" onClick={closeModal} aria-label="Close">
              &times;
            </button>
            <h2 className="modal-title">{openResource.title}</h2>
            <div className="modal-content markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {openResource.content ?? ''}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <BackToTop />
    </>
  )
}
