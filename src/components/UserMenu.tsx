import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { profileInitials } from '../lib/profileDisplay'
import './UserMenu.css'

type UserMenuProps = {
  menuOpen: boolean
  onNavigate: () => void
}

export default function UserMenu({ menuOpen, onNavigate }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const initials = profileInitials(user?.firstName ?? '', user?.lastName ?? '')

  const close = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!menuOpen) close()
  }, [menuOpen, close])

  useEffect(() => {
    function onDown(ev: MouseEvent) {
      if (!open) return
      if (wrapRef.current && !wrapRef.current.contains(ev.target as Node)) close()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open, close])

  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.key === 'Escape') close()
    }
    if (!open) return
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  function signOutAndClose() {
    logout()
    close()
    onNavigate()
    navigate('/')
  }

  function avatarHue(seed: string) {
    let h = 0
    for (let i = 0; i < seed.length; i += 1) h = seed.charCodeAt(i) + ((h << 5) - h)
    return Math.abs(h % 340) + 20
  }

  const hue = avatarHue(user ? `${user.firstName}|${user.lastName}|${user.email}` : 'guest')

  if (!user) return null

  return (
    <div ref={wrapRef} className={`user-menu-wrap${open ? ' user-menu-wrap--open' : ''}`}>
      <button
        type="button"
        ref={triggerRef}
        className="user-menu-trigger btn nav-cta btn-navy"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        style={
          {
            '--user-avatar-h': `${hue}deg`,
          } as CSSProperties
        }
      >
        <span className="user-menu-avatar" aria-hidden>
          {initials}
        </span>
        <span className="user-menu-trigger-text">
          {user.firstName} {user.lastName}
        </span>
        <svg className="user-menu-chevron" viewBox="0 0 12 12" aria-hidden>
          <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <ul className={`user-menu-dropdown ${open ? 'user-menu-dropdown--open' : ''}`} role="menu">
        <li role="none">
          <Link
            to="/profile"
            role="menuitem"
            className="user-menu-dropdown-link user-menu-dropdown-link--primary"
            onClick={() => {
              close()
              onNavigate()
            }}
          >
            My profile
          </Link>
        </li>
        <li role="none">
          <Link
            to="/documents"
            role="menuitem"
            className="user-menu-dropdown-link user-menu-dropdown-link--primary"
            onClick={() => {
              close()
              onNavigate()
            }}
          >
            My documents
          </Link>
        </li>
        <li role="none">
          <button type="button" role="menuitem" className="user-menu-dropdown-btn" onClick={signOutAndClose}>
            Sign out
          </button>
        </li>
      </ul>
    </div>
  )
}
