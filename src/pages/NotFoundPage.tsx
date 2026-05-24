import { Link } from 'react-router-dom'
import { Topbar } from '../components/layout/Topbar'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

export function NotFoundPage() {
  return (
    <>
      <Topbar />
      <Navbar />
      <main
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          padding: '60px 20px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 80,
            fontWeight: 700,
            color: 'var(--yellow)',
            lineHeight: 1,
          }}
        >
          404
        </h1>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 400 }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-med)', maxWidth: 400 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary" style={{ marginTop: 8 }}>
          Back to Home
        </Link>
      </main>
      <Footer />
    </>
  )
}
