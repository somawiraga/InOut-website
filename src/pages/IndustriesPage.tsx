import { Link } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { Footer } from '../components/layout/Footer'
import { BackToTop } from '../components/layout/BackToTop'
import { useIndustries } from '../hooks/useIndustries'
import { industryImages } from '../data/industryImages'

export function IndustriesPage() {
  const industries = useIndustries()

  return (
    <>
      <PageHeader title="Industries" />
      <main>
        <section className="section-pad" style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 0 }}>
          <p style={{ fontSize: 16, color: 'var(--text-med)', lineHeight: 1.7 }}>
            In today's ever-evolving business landscape, having the right expertise on your side
            is more important than ever. As an Industry Specialist, we offer a unique blend of
            in-depth knowledge, experience, and insight that helps businesses like yours navigate
            complex challenges and seize new opportunities with confidence.
          </p>
        </section>
        <section className="industries-section" style={{ paddingTop: 50 }}>
          <div className="industries-grid">
            {industries.map((ind) => {
              const img = industryImages[ind.slug]
              return (
                <Link
                  key={ind.slug}
                  to={`/industries/${ind.slug}`}
                  className="industry-card"
                  style={{ textDecoration: 'none' }}
                >
                  {img && <img className="ind-bg" src={img} alt={ind.name} loading="lazy" />}
                  <div className="ind-overlay" />
                  <span className="ind-label">{ind.name}</span>
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
