import { useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { Footer } from '../components/layout/Footer'
import { BackToTop } from '../components/layout/BackToTop'

export function EnquiryPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <PageHeader title="Enquiry Form" />
      <main>
        <section className="contact-section" style={{ minHeight: 'auto', padding: '50px 30px' }}>
          <div className="contact-inner" style={{ width: '100%', maxWidth: 930 }}>
            <div className="contact-heading">
              <h2>Submit a Product Enquiry</h2>
              <p>Tell us what you need and we'll get back to you within 1–2 business days.</p>
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
                  Enquiry Submitted!
                </h3>
                <p style={{ color: 'var(--text-med)' }}>
                  Thank you! We will contact you within 1–2 business days.
                </p>
                <button
                  className="btn-primary"
                  style={{ marginTop: 20 }}
                  onClick={() => setSubmitted(false)}
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Row 1: Name, Company, Job Title */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Name <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" placeholder="Type here" required />
                  </div>
                  <div className="form-group">
                    <label>Company</label>
                    <input type="text" placeholder="Type here" />
                  </div>
                  <div className="form-group">
                    <label>Job Title</label>
                    <input type="text" placeholder="Type here" />
                  </div>
                </div>
                {/* Row 2: Email, Phone, Country */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Email <span style={{ color: 'red' }}>*</span></label>
                    <input type="email" placeholder="Type here" required />
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
                {/* Comments */}
                <div className="form-group">
                  <label>Comments <span style={{ color: 'red' }}>*</span></label>
                  <textarea
                    placeholder="Type your enquiry here..."
                    style={{ height: 160 }}
                    required
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
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
