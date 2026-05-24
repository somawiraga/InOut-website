import { useParams, Link } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { Footer } from '../components/layout/Footer'
import { BackToTop } from '../components/layout/BackToTop'
import { useIndustry } from '../hooks/useIndustries'
import { useProductGroups } from '../hooks/useProductGroups'
import { categoryImages } from '../data/categoryImages'
import { industryImages } from '../data/industryImages'

const INDUSTRY_GROUP_SLUGS: Record<string, string[]> = {
  aerospace: [
    'cleanroom-supplies',
    'adhesives-sealants-lubricants',
    'gloves',
    'cleanroom-wipes',
    'ppe',
  ],
  hospitality: [
    'cleanroom-supplies',
    'chemicals',
    'cleanroom-face-masks',
    'gloves',
    'ppe',
  ],
  'medical-device': [
    'adhesives-sealants-lubricants',
    'chemicals',
    'cleanroom-face-masks',
    'gloves',
    'ppe',
  ],
  pharmaceutical: [
    'cleanroom-supplies',
    'chemicals',
    'cleanroom-wipes',
    'gloves',
    'ppe',
  ],
  semiconductor: [
    'cleanroom-supplies',
    'adhesives-sealants-lubricants',
    'cleanroom-face-masks',
    'cleanroom-wipes',
    'gloves',
  ],
}

export function IndustryPage() {
  const { slug } = useParams<{ slug: string }>()
  const industry = useIndustry(slug)
  const allGroups = useProductGroups()

  if (!industry) {
    return (
      <>
        <PageHeader
          title="Industry Not Found"
          crumbs={[{ label: 'Industries', to: '/industries' }, { label: 'Not Found' }]}
        />
        <main>
          <section className="section-pad">
            <p>The requested industry could not be found.</p>
            <Link to="/industries">← Back to Industries</Link>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  const groupSlugs = INDUSTRY_GROUP_SLUGS[industry.slug] ?? []
  const relevantGroups = groupSlugs
    .map((s) => allGroups.find((g) => g.slug === s))
    .filter(Boolean) as typeof allGroups

  return (
    <>
      <PageHeader
        title={industry.name}
        crumbs={[{ label: 'Industries', to: '/industries' }, { label: industry.name }]}
      />
      <main>
        {/* Industry image + description header */}
        <section className="section-pad" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="industry-header">
            {industryImages[industry.slug] && (
              <img
                src={industryImages[industry.slug]}
                alt={industry.name}
                style={{ width: 260, height: 180, objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }}
              />
            )}
            <p style={{ fontSize: 16, color: 'var(--text-med)', lineHeight: 1.7 }}>
              {industry.description}
            </p>
          </div>

          <h2
            className="section-title section-title--left"
            style={{ marginBottom: 24, fontSize: 24 }}
          >
            Product Categories
          </h2>

          <div className="carousel-track" style={{ flexWrap: 'wrap', gap: 20 }}>
            {relevantGroups.map((group) => {
              const img = categoryImages[group.slug]
              return (
                <Link
                  key={group.slug}
                  to={`/products/group/${group.slug}`}
                  state={{ from: 'industries', industrySlug: industry.slug, industryName: industry.name }}
                  className="prod-card-v"
                  style={{ width: 260, textDecoration: 'none' }}
                >
                  {img && (
                    <img
                      src={img}
                      alt={group.name}
                      style={{ width: '100%', height: 180, objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-label">{group.name}</div>
                </Link>
              )
            })}
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
