import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import inoutLogo from '../../assets/icons/inout-logo.png'
import { SearchBar } from '../ui/SearchBar'

export type NavbarVariant = 'default' | 'hero' | 'page-header'

interface NavbarProps {
  variant?: NavbarVariant
}

const navItems = [
  { label: 'Product',    to: '/products' },
  { label: 'Industries', to: '/industries' },
  { label: 'Resources',  to: '/resources' },
  { label: 'About Us',   to: '/about' },
  { label: 'Contact Us', to: '/contact' },
]

export function Navbar({ variant = 'default' }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const navClass = [
    'navbar',
    variant === 'hero' ? 'navbar--hero' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <nav className={navClass}>
      <div className="navbar-main-row">
        <div className="navbar-left">
          <Link to="/" className="logo-link" onClick={() => setMenuOpen(false)}>
            <img src={inoutLogo} alt="InOut" />
          </Link>
          <ul className="nav-menu">
            {navItems.map((item) => (
              <li key={item.to} className="nav-item">
                <NavLink
                  to={item.to}
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                >
                  <span>{item.label}</span>
                  <span className="nav-underline" />
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-right">
          <SearchBar placeholder="Search products…" />
          <Link to="/enquiry" className="btn-primary navbar-enquiry-btn">
            Enquiry
          </Link>
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={menuOpen ? 'ham-x ham-x--1' : ''} />
            <span className={menuOpen ? 'ham-x ham-x--2' : ''} />
            <span className={menuOpen ? 'ham-x ham-x--3' : ''} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div className={`mobile-menu${menuOpen ? ' mobile-menu--open' : ''}`}>
        <ul className="mobile-nav-list">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <Link
          to="/enquiry"
          className="btn-primary mobile-enquiry-btn"
          onClick={() => setMenuOpen(false)}
        >
          Enquiry
        </Link>
      </div>
    </nav>
  )
}
