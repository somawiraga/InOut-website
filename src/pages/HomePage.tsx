import { type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Topbar } from '../components/layout/Topbar'
import { Footer } from '../components/layout/Footer'
import { BackToTop } from '../components/layout/BackToTop'
import { useProductGroups } from '../hooks/useProductGroups'
import { categoryImages } from '../data/categoryImages'
import { industryImages } from '../data/industryImages'
import type { Industry } from '../types'
import industriesData from '../data/industries.json'
import heroBg from '../assets/home/hero-background.png'
import cleanroomBg from '../assets/home/cleanroom-bg.png'

const industries = industriesData as Industry[]

export function HomePage() {
  const groups = useProductGroups()

  function handleContactSubmit(e: FormEvent) {
    e.preventDefault()
    alert('Thank you! Your message has been submitted. We will respond within 1–2 business days.')
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <>
      <Topbar />

      {/* Hero */}
      <div
        className="hero"
        style={{ backgroundImage: `url(${heroBg})`, borderRadius: '30px 30px 0 0' }}
      >
        <Navbar variant="hero" />
        <div className="hero-content">
          <h1 className="hero-title">Leading Cleanroom Specialist</h1>
          <p className="hero-sub">
            Our product range has since expanded and we now carry over 200 different products
            serving various industries.
          </p>
          <div className="hero-btns" style={{ display: 'flex', gap: 16 }}>
            <Link to="/industries" className="btn-primary" style={{ fontSize: 15, padding: '0 28px' }}>
              Select Your Industry
            </Link>
            <Link
              to="/products"
              className="btn-secondary btn-secondary--light"
              style={{ fontSize: 15, padding: '0 28px' }}
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>

      <main>
      {/* Cleanroom Banner */}
      <section className="cleanroom-section">
        <img className="bg" src={cleanroomBg} alt="" aria-hidden="true" />
        <div className="cleanroom-box">
          <h2>Cleanroom Specialist</h2>
          <p>
            INOUT ENTERPRISE is a regional leader in industrial manufacturing supplies and
            solutions that make production lines operate more efficiently, reliably, safely and
            sustainably.
          </p>
          <Link to="/about" className="btn-primary">
            Learn More
          </Link>
        </div>
      </section>

      {/* Product Highlights Grid */}
      <section className="product-highlights">
        <h2 className="section-title">Product Highlights</h2>
        <div className="prod-highlights-grid">
          {groups.map((group) => {
            const img = categoryImages[group.slug]
            return (
              <Link
                key={group.slug}
                to={`/products/group/${group.slug}`}
                className="prod-card-v"
                style={{ textDecoration: 'none' }}
              >
                {img && (
                  <img
                    src={img}
                    alt={group.name}
                    style={{ width: '100%', height: 220, objectFit: 'cover' }}
                  />
                )}
                <div className="card-label">{group.name}</div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Industries Grid */}
      <section className="industries-section">
        <h2 className="section-title">Different Solution for Different Industries</h2>
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

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-inner">
          <div className="contact-heading">
            <h2>Ask Us How We Can Optimise Your Productivity</h2>
            <p>Fill out the fields below and tell us your needs.</p>
          </div>
          <form onSubmit={handleContactSubmit} style={{ width: '100%' }}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" placeholder="Type here" required />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input type="text" name="company" placeholder="Type here" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" placeholder="Type here" required />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 14 }}>
              <label>Message</label>
              <textarea name="message" placeholder="Type here" style={{ height: 90 }} />
            </div>
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
              <button
                type="submit"
                className="btn-primary"
                style={{ fontSize: 15, padding: '0 40px' }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>

      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
