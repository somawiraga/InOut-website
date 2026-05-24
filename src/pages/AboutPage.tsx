import { PageHeader } from '../components/layout/PageHeader'
import { Footer } from '../components/layout/Footer'
import { BackToTop } from '../components/layout/BackToTop'
import { companies } from '../data/companyImages'
import cleanroomBg from '../assets/about/cleanroom-bg.png'
import reliableCertified from '../assets/about/reliable-certified.png'
import reliableCustomised from '../assets/about/reliable-customised.png'
import reliableEffective from '../assets/about/reliable-effective.png'
import reliableReadyToUse from '../assets/about/reliable-ready-to-use.png'
import certificationsAllV2 from '../assets/certifications/all v2.png'
import certISO14001 from '../assets/certifications/ISO 14001.png'
import certISO9001 from '../assets/certifications/ISO 9001.png'
import certReach from '../assets/certifications/Reach.png'
import certCE from '../assets/certifications/CE.png'

const reliableValues = [
  { label: 'Effective', img: reliableEffective },
  { label: 'Certified', img: reliableCertified },
  { label: 'Customised', img: reliableCustomised },
  { label: 'Ready-to-Use', img: reliableReadyToUse },
]

export function AboutPage() {
  return (
    <>
      <PageHeader title="About Us" />
      <main>
        {/* Cleanroom Banner — left-aligned to match HTML source */}
        <section
          className="cleanroom-section"
          style={{ padding: '40px 50px', justifyContent: 'flex-start' }}
        >
          <img className="bg" src={cleanroomBg} alt="" aria-hidden="true" />
          <div
            className="cleanroom-box"
            style={{ alignItems: 'flex-start', textAlign: 'left', maxWidth: 780 }}
          >
            <h2 style={{ textAlign: 'left' }}>Inout Enterprise</h2>
            <p style={{ textAlign: 'left' }}>
              Regional leader in industrial manufacturing supplies and solutions that make
              production lines operate more efficiently, reliably, safely and sustainably.
            </p>
            <p style={{ textAlign: 'left' }}>
              We have progressed leaps and bounds throughout the years and have established a
              strong distribution network with offices all across Asia, including a manufacturing
              facility for cleanroom products in China.
            </p>
            <p style={{ textAlign: 'left' }}>
              Our product range has since expanded and we now carry over 5,000 different products
              serving various industries. Many international brands have worked with us to
              penetrate local markets through our extensive distribution network.
            </p>
            <p style={{ textAlign: 'left' }}>
              To meet the growing demand for our products, we have established sales offices &amp;
              distribution partners in Mainland China, Malaysia, Thailand, Indonesia, The
              Philippines, Australia, Germany and the U.S.A.
            </p>
          </div>
        </section>

        {/* Reliable Values */}
        <section className="section-pad" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 className="section-title section-title--left" style={{ marginBottom: 12 }}>
            Reliable
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 16,
              color: 'var(--text-med)',
              maxWidth: 791,
              marginBottom: 30,
              lineHeight: 1.6,
            }}
          >
            Choosing INOUT means choosing a partner who understands your needs and can provide
            you with effective, customised, certified and ready-to-use solutions.
          </p>
          <div className="reliable-cards">
            {reliableValues.map(({ label, img }) => (
              <div key={label} className="reliable-card">
                <div className="rc-img">
                  <img src={img} alt={label} />
                </div>
                <div className="rc-label">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="section-pad" style={{ background: 'var(--white)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 className="section-title section-title--left" style={{ marginBottom: 24 }}>
              Certifications
            </h2>
            <img
              className="cert-desktop"
              src={certificationsAllV2}
              alt="InOut Enterprise certifications"
              style={{
                maxWidth: 640,
                height: 'auto',
                maxHeight: 160,
                objectFit: 'contain',
              }}
            />
            <div className="cert-mobile">
              <img src={certISO14001} alt="ISO 14001" />
              <img src={certISO9001} alt="ISO 9001" />
              <img src={certReach} alt="Reach" />
              <img src={certCE} alt="CE" />
            </div>
          </div>
        </section>

        {/* Partners / Companies */}
        <section className="section-pad" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 className="section-title section-title--left" style={{ marginBottom: 24 }}>
            Our Alliance Partners
          </h2>
          <div className="company-cards">
            {companies.map((c) => (
              <div key={c.name} className="company-card">
                <div className="cc-img">
                  <img src={c.logo} alt={c.name} />
                </div>
                <div className="cc-name">{c.name}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
