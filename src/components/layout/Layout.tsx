import { Outlet } from 'react-router-dom'
import { Topbar } from './Topbar'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { BackToTop } from './BackToTop'

export function Layout() {
  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
