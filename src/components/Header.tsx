import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { firm, navLinks } from '../data/site'
import logoImg from '../ibezimlogo.png'
import { useAuth } from '../context/AuthContext'
import AuthDropdown from './AuthDropdown'
import UserMenu from './UserMenu'
import './Header.css'

function isAboutActive(pathname: string) {
  return pathname === '/about' || pathname === '/attorney'
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [aboutMobileOpen, setAboutMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const { user } = useAuth()
  const menuToggleRef = useRef<HTMLButtonElement>(null)
  const navRef = useRef<HTMLElement>(null)

  const [isMobileNav, setIsMobileNav] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false,
  )

  function closeAboutDropdown() {
    setAboutOpen(false)
    setAboutMobileOpen(false)
  }

  function returnFocusToMenuToggle() {
    menuToggleRef.current?.focus({ preventScroll: true })
  }

  function closeMenu() {
    if (isMobileNav) {
      returnFocusToMenuToggle()
    }
    setMenuOpen(false)
    closeAboutDropdown()
  }

  function toggleMenu() {
    setMenuOpen((open) => {
      if (open) {
        returnFocusToMenuToggle()
        return false
      }
      return true
    })
  }

  useEffect(() => {
    setMenuOpen(false)
    closeAboutDropdown()
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const onChange = () => setIsMobileNav(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  /* Fallback if focus remains inside nav after it becomes inert */
  useEffect(() => {
    if (!isMobileNav || menuOpen) return
    const nav = navRef.current
    if (nav?.contains(document.activeElement)) {
      returnFocusToMenuToggle()
    }
  }, [menuOpen, isMobileNav])

  return (
    <header className={`header${menuOpen ? ' header--menu-open' : ''}`}>
      {menuOpen && (
        <button
          type="button"
          className="nav-scrim"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}

      <div className="container header-inner">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src={logoImg} alt="" className="logo-image" width={44} height={52} />
          <span className="logo-text">
            <strong>{firm.name}</strong>
            <small>{firm.tagline}</small>
          </span>
        </Link>

        <button
          ref={menuToggleRef}
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          ref={navRef}
          className={`nav ${menuOpen ? 'nav--open' : ''}`}
          id="site-navigation"
          inert={isMobileNav && !menuOpen ? true : undefined}
          aria-label="Main navigation"
        >
          <div className="nav-mobile-toolbar">
            <span className="nav-mobile-title">Menu</span>
            <button type="button" className="nav-mobile-close" onClick={closeMenu} aria-label="Close menu">
              ×
            </button>
          </div>

          <div className="nav-mobile-scroll">
          <ul className="nav-list">
            {navLinks.map((item) => {
              if ('children' in item && item.children) {
                return (
                  <li
                    key={item.path}
                    className={`nav-item nav-item--dropdown ${aboutOpen ? 'nav-item--open' : ''}`}
                    onMouseEnter={() => setAboutOpen(true)}
                    onMouseLeave={() => setAboutOpen(false)}
                  >
                    <button
                      type="button"
                      className={`nav-link nav-link--trigger ${
                        isAboutActive(pathname) ? 'nav-link--active' : ''
                      }`}
                      aria-expanded={aboutOpen || aboutMobileOpen}
                      aria-haspopup="true"
                      onClick={() => setAboutMobileOpen((open) => !open)}
                    >
                      {item.label}
                      <svg className="nav-chevron" viewBox="0 0 12 12" aria-hidden>
                        <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </button>
                    <ul
                      className={`nav-dropdown ${aboutOpen || aboutMobileOpen ? 'nav-dropdown--open' : ''}`}
                    >
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <NavLink
                            to={child.path}
                            end={child.path === '/about'}
                            className={({ isActive }) =>
                              `nav-dropdown-link ${isActive ? 'nav-dropdown-link--active' : ''}`
                            }
                            onClick={() => {
                              closeAboutDropdown()
                              closeMenu()
                            }}
                          >
                            {child.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                )
              }

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      isActive ? 'nav-link nav-link--active' : 'nav-link'
                    }
                    onClick={closeMenu}
                  >
                    {item.label}
                  </NavLink>
                </li>
              )
            })}
          </ul>
          <div className="nav-mobile-auth">
            {user ? <UserMenu menuOpen={menuOpen} onNavigate={closeMenu} /> : <AuthDropdown menuOpen={menuOpen} />}
            <Link to="/contact" className="btn btn-primary nav-cta" onClick={closeMenu}>
              Contact us
            </Link>
          </div>
          </div>
        </nav>

        <div className="header-actions">
          {user ? (
            <UserMenu menuOpen={menuOpen} onNavigate={closeMenu} />
          ) : (
            <AuthDropdown menuOpen={menuOpen} />
          )}
          <Link to="/contact" className="btn btn-primary nav-cta" onClick={closeMenu}>
            Contact us
          </Link>
        </div>
      </div>
    </header>
  )
}
