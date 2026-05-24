import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { EnquiryModal } from './components/ui/EnquiryModal'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { EnquiryPage } from './pages/EnquiryPage'
import { IndustriesPage } from './pages/IndustriesPage'
import { IndustryPage } from './pages/IndustryPage'
import { ProductsPage } from './pages/ProductsPage'
import { ProductGroupPage } from './pages/ProductGroupPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { ResourcesPage } from './pages/ResourcesPage'
import { NotFoundPage } from './pages/NotFoundPage'

function ScrollToTop() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.key])
  return null
}

function GlobalStickyNav() {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const threshold = pathname === '/' ? 480 : 80
    const onScroll = () => setVisible(window.scrollY > threshold)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  return (
    <div className={`global-sticky-nav${visible ? ' global-sticky-nav--visible' : ''}`}>
      <Navbar />
    </div>
  )
}

export default function App() {
  return (
    <>
      <GlobalStickyNav />
      <ScrollToTop />
      <EnquiryModal />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/enquiry" element={<EnquiryPage />} />
        <Route path="/industries" element={<IndustriesPage />} />
        <Route path="/industries/:slug" element={<IndustryPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/group/:groupSlug" element={<ProductGroupPage />} />
        <Route path="/products/group/:groupSlug/sub/:subSlug" element={<ProductGroupPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
