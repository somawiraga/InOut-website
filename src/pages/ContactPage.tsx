import { useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { Footer } from '../components/layout/Footer'
import { BackToTop } from '../components/layout/BackToTop'

interface Office {
  id: string
  label: string
  mapSrc: string
  mapsUrl: string
  address: string
}

const OFFICES: Office[] = [
  {
    id: 'sg',
    label: 'Singapore',
    mapSrc: 'https://maps.google.com/maps?q=1.4511,103.791095&z=17&output=embed',
    mapsUrl: 'https://maps.app.goo.gl/e5wZXSaTtQxmN6ph6',
    address: '28D Woodlands Industrial Park E5 Blk 1, #09-51\nHarvest@Woodlands\nSingapore 757322',
  },
  {
    id: 'ph',
    label: 'Philippines',
    mapSrc: 'https://maps.google.com/maps?q=14.326439,121.075417&z=17&output=embed',
    mapsUrl: 'https://maps.app.goo.gl/NP7oWZk3hh32TtZLA',
    address: 'Philippines Office',
  },
  {
    id: 'th',
    label: 'Thailand',
    mapSrc: 'https://maps.google.com/maps?q=14.2963199,100.6546142&z=18&output=embed',
    mapsUrl: 'https://maps.app.goo.gl/2Z29LREJ8Njznhx69',
    address: 'Thailand Office',
  },
  {
    id: 'my',
    label: 'Malaysia',
    mapSrc: 'https://maps.google.com/maps?q=5.326357,100.2833989&z=16&output=embed',
    mapsUrl: 'https://maps.app.goo.gl/BBYVRcR4SXb9p283A',
    address: "70-1-38, D'Piazza Mall\nJalan Mahsuri, Bandar Bayan Baru\n11950 Penang, Malaysia",
  },
]

export function ContactPage() {
  const [activeId, setActiveId] = useState('sg')
  const [submitted, setSubmitted] = useState(false)
  const activeOffice = OFFICES.find((o) => o.id === activeId)!

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <PageHeader title="Contact Us" />
      <main>
        {/* Map + address */}
        <section className="section-pad" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="contact-map-wrapper">
            {/* Desktop: tab buttons */}
            <div className="map-tabs">
              {OFFICES.map((o) => (
                <button
                  key={o.id}
                  className={`map-tab${activeId === o.id ? ' active' : ''}`}
                  onClick={() => setActiveId(o.id)}
                >
                  {o.label}
                </button>
              ))}
            </div>

            {/* Mobile: select dropdown */}
            <select
              className="map-select"
              value={activeId}
              onChange={(e) => setActiveId(e.target.value)}
            >
              {OFFICES.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>

            {/* Map iframe */}
            <div className="contact-map">
              <iframe
                src={activeOffice.mapSrc}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`InOut Enterprise ${activeOffice.label}`}
                style={{ width: '100%', height: 360, border: 0, borderRadius: 'var(--radius-md)' }}
              />
              <div className="map-address-card">
                <p className="map-address-text" style={{ whiteSpace: 'pre-line' }}>
                  {activeOffice.address}
                </p>
                <a
                  className="map-open-link"
                  href={activeOffice.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Google Maps ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact form */}
        <section className="contact-section" style={{ minHeight: 'auto', padding: '50px 30px' }}>
          <div className="contact-inner" style={{ width: '100%', maxWidth: 930 }}>
            <div className="contact-heading">
              <h2>Ask Us How We Can Optimise Your Productivity</h2>
              <p>Fill out the fields below and tell us your needs.</p>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: 30 }}>
                <div style={{ fontSize: 48 }}>✅</div>
                <h3
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: 24,
                    margin: '12px 0 8px',
                  }}
                >
                  Message Sent!
                </h3>
                <p style={{ color: 'var(--text-med)' }}>
                  Thank you for contacting us. We will respond within 1–2 business days.
                </p>
                <button
                  className="btn-primary"
                  style={{ marginTop: 20 }}
                  onClick={() => setSubmitted(false)}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" placeholder="Your name" required />
                  </div>
                  <div className="form-group">
                    <label>Company</label>
                    <input type="text" placeholder="Company name" />
                  </div>
                  <div className="form-group">
                    <label>Job Title</label>
                    <input type="text" placeholder="Type here" />
                  </div>
                </div>
                <div className="form-row" style={{ marginTop: 14 }}>
                  <div className="form-group">
                    <label>Email <span style={{ color: 'red' }}>*</span></label>
                    <input type="email" placeholder="email@company.com" required />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" placeholder="+65 xxxx xxxx" />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <select>
                      <option value="">Select country...</option>
                      <option>Singapore</option>
                      <option>Malaysia</option>
                      <option>Indonesia</option>
                      <option>Thailand</option>
                      <option>Vietnam</option>
                      <option>Philippines</option>
                      <option>China</option>
                      <option>India</option>
                      <option>Australia</option>
                      <option>United States</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-row" style={{ marginTop: 14, alignItems: 'flex-end' }}>
                  <div className="form-group">
                    <label>Product Interest</label>
                    <input type="text" placeholder="e.g. Gloves, ESD Equipment..." />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', height: 42 }}>
                      <input type="checkbox" style={{ accentColor: 'var(--yellow)', width: 16, height: 16 }} />
                      Need Custom Product
                    </label>
                  </div>
                  <div className="form-group" />
                </div>
                <div className="form-group" style={{ marginTop: 14 }}>
                  <label>How can we help you? <span style={{ color: 'red' }}>*</span></label>
                  <textarea placeholder="Tell us about your needs..." style={{ height: 120 }} required />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ fontSize: 15, height: 44, padding: '0 50px' }}
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
