import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
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
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminProductsPage } from './pages/admin/AdminProductsPage'
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage'
import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext'
import productGroups from './data/product-groups.json'

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

// Redirects unauthenticated visitors to /admin/login
function AdminGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAdminAuth()
  if (loading) return null
  if (!session) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}

// Default admin redirect: first category → first subcategory
const firstGroup = productGroups[0]
const firstSub = firstGroup?.subcategories[0]
const adminDefaultPath = firstGroup && firstSub
  ? `/admin/products/${firstGroup.slug}/${firstSub.slug}`
  : '/admin/login'

function AdminRoutes() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<AdminLoginPage />} />
        <Route
          path="products/:category/:subcategory"
          element={<AdminGuard><AdminProductsPage /></AdminGuard>}
        />
        <Route
          path="products/:category/:subcategory/new"
          element={<AdminGuard><AdminProductFormPage /></AdminGuard>}
        />
        <Route
          path="products/:category/:subcategory/edit/:productId"
          element={<AdminGuard><AdminProductFormPage /></AdminGuard>}
        />
        <Route path="products" element={<Navigate to={adminDefaultPath} replace />} />
        <Route path="*" element={<Navigate to={adminDefaultPath} replace />} />
      </Routes>
    </AdminAuthProvider>
  )
}

function PublicRoutes() {
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

export default function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </>
  )
}
