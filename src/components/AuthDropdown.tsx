import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormField from './FormField'
import { useAuth } from '../context/AuthContext'
import {
  hasErrors,
  validateAuthLogin,
  validateAuthSignup,
} from '../lib/formValidation'
import { firm } from '../data/site'
import './AuthDropdown.css'
import './FormField.css'

type Mode = 'login' | 'register'

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

export default function AuthDropdown({ menuOpen }: { menuOpen: boolean }) {
  const navigate = useNavigate()
  const { loginWithPassword, signUpPassword, loginWithGoogleDemo } = useAuth()
  const panelId = useId()
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('login')
  const [touched, setTouched] = useState(false)
  const [banner, setBanner] = useState<{ text: string; variant: 'success' | 'notice' } | null>(
    null,
  )

  const [login, setLogin] = useState({ email: '', password: '', remember: false })
  const [signup, setSignup] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    remember: true,
  })

  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({})
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({})

  const close = useCallback(() => {
    setOpen(false)
    setTouched(false)
    setBanner(null)
    setLoginErrors({})
    setSignupErrors({})
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    function onPointerDown(ev: MouseEvent) {
      if (!open) return
      const el = wrapRef.current
      if (el && !el.contains(ev.target as Node)) close()
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open, close])

  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.key === 'Escape') close()
    }
    if (!open) return
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  useEffect(() => {
    if (!menuOpen) setOpen(false)
  }, [menuOpen])

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 50)
    return () => window.clearTimeout(t)
  }, [open, mode])

  function handleGooglePlaceholder() {
    loginWithGoogleDemo(login.remember)
    close()
    navigate('/profile')
  }

  function submitLogin(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    const errors = validateAuthLogin(login)
    setLoginErrors(errors)
    if (hasErrors(errors)) return
    const result = loginWithPassword(login.email, login.password, login.remember)
    if (!result.ok) {
      setBanner({
        variant: 'notice',
        text: result.error,
      })
      return
    }
    close()
    navigate('/profile')
  }

  function submitSignup(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    const errors = validateAuthSignup({
      firstName: signup.firstName,
      lastName: signup.lastName,
      phone: signup.phone,
      email: signup.email,
      password: signup.password,
      confirmPassword: signup.confirmPassword,
    })
    setSignupErrors(errors)
    if (hasErrors(errors)) return
    const result = signUpPassword(
      {
        firstName: signup.firstName,
        lastName: signup.lastName,
        phone: signup.phone,
        email: signup.email,
        password: signup.password,
      },
      signup.remember,
    )
    if (!result.ok) {
      setBanner({
        variant: 'notice',
        text: result.error,
      })
      return
    }
    close()
    navigate('/profile')
  }

  return (
    <div className={`auth-dropdown-wrap${open ? ' auth-dropdown-wrap--open' : ''}`} ref={wrapRef}>
      <button
        type="button"
        ref={triggerRef}
        className="btn btn-primary nav-cta auth-dropdown-trigger"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={panelId}
        onClick={() => {
          setOpen((o) => !o)
          setBanner(null)
        }}
      >
        <span className="auth-dropdown-trigger-label">Login</span>
        <svg className="auth-dropdown-chevron" viewBox="0 0 12 12" aria-hidden>
          <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {open && (
        <>
          <div className="auth-dropdown-backdrop" aria-hidden tabIndex={-1} onMouseDown={close} />
          <div
            id={panelId}
            className="auth-dropdown-panel luxe-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${panelId}-title`}
          >
            <div className="auth-dropdown-shine" aria-hidden />

            <div className="auth-dropdown-header">
              <p className="auth-dropdown-kicker">{firm.name}</p>
              <h2 id={`${panelId}-title`} className="auth-dropdown-title">
                {mode === 'login' ? 'Welcome back' : 'Begin your consultation'}
              </h2>
              <p className="auth-dropdown-sub">
                {mode === 'login'
                  ? 'Secure access to client resources and messaging.'
                  : "Create your client profile — we'll reply with next steps promptly."}
              </p>
            </div>

            <button
              type="button"
              className="auth-oauth-google"
              onClick={handleGooglePlaceholder}
            >
              <GoogleIcon className="auth-oauth-google-icon" />
              Continue with Google
            </button>

            <div className="auth-divider" aria-hidden>
              <span>or email</span>
            </div>

            {banner ? (
              <p className={`auth-feedback auth-feedback--${banner.variant}`}>{banner.text}</p>
            ) : null}

            {mode === 'login' ? (
              <form className="auth-form" onSubmit={submitLogin} noValidate>
                <FormField id="auth-login-email" label="Email address" error={loginErrors.email} showError={touched}>
                  {(a) => (
                    <input
                      {...a}
                      ref={firstFieldRef}
                      type="email"
                      name="email"
                      autoComplete="email"
                      className="auth-input"
                      placeholder="you@company.com"
                      value={login.email}
                      onChange={(e) => setLogin((x) => ({ ...x, email: e.target.value }))}
                    />
                  )}
                </FormField>
                <FormField id="auth-login-password" label="Password" error={loginErrors.password} showError={touched}>
                  {(a) => (
                    <input
                      {...a}
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      className="auth-input"
                      placeholder="••••••••"
                      value={login.password}
                      onChange={(e) => setLogin((x) => ({ ...x, password: e.target.value }))}
                    />
                  )}
                </FormField>
                <div className="auth-row-options">
                  <label className="auth-check">
                    <input
                      type="checkbox"
                      checked={login.remember}
                      onChange={(e) => setLogin((x) => ({ ...x, remember: e.target.checked }))}
                    />
                    Remember this device
                  </label>
                  <button
                    type="button"
                    className="auth-linkish"
                    onClick={() =>
                      setBanner({
                        variant: 'notice',
                        text: 'Password reset: connect your auth service to send secure reset links by email.',
                      })
                    }
                  >
                    Forgot password?
                  </button>
                </div>
                <button type="submit" className="auth-submit">
                  Sign in
                </button>
              </form>
            ) : (
              <form className="auth-form" onSubmit={submitSignup} noValidate>
                <div className="auth-grid-2">
                  <FormField
                    id="auth-signup-first"
                    label="First name"
                    error={signupErrors.firstName}
                    showError={touched}
                  >
                    {(a) => (
                      <input
                        {...a}
                        ref={firstFieldRef}
                        type="text"
                        name="given-name"
                        autoComplete="given-name"
                        className="auth-input"
                        placeholder="First name"
                        value={signup.firstName}
                        onChange={(e) => setSignup((x) => ({ ...x, firstName: e.target.value }))}
                      />
                    )}
                  </FormField>
                  <FormField
                    id="auth-signup-last"
                    label="Last name"
                    error={signupErrors.lastName}
                    showError={touched}
                  >
                    {(a) => (
                      <input
                        {...a}
                        type="text"
                        name="family-name"
                        autoComplete="family-name"
                        className="auth-input"
                        placeholder="Last name"
                        value={signup.lastName}
                        onChange={(e) => setSignup((x) => ({ ...x, lastName: e.target.value }))}
                      />
                    )}
                  </FormField>
                </div>
                <FormField id="auth-signup-phone" label="Phone number" error={signupErrors.phone} showError={touched}>
                  {(a) => (
                    <input
                      {...a}
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      className="auth-input"
                      placeholder="+1 (555) 000-0000"
                      value={signup.phone}
                      onChange={(e) => setSignup((x) => ({ ...x, phone: e.target.value }))}
                    />
                  )}
                </FormField>
                <FormField id="auth-signup-email" label="Email address" error={signupErrors.email} showError={touched}>
                  {(a) => (
                    <input
                      {...a}
                      type="email"
                      name="email"
                      autoComplete="email"
                      className="auth-input"
                      placeholder="you@company.com"
                      value={signup.email}
                      onChange={(e) => setSignup((x) => ({ ...x, email: e.target.value }))}
                    />
                  )}
                </FormField>
                <FormField id="auth-signup-pass" label="Password" error={signupErrors.password} showError={touched}>
                  {(a) => (
                    <input
                      {...a}
                      type="password"
                      name="new-password"
                      autoComplete="new-password"
                      className="auth-input"
                      placeholder="At least 8 characters"
                      value={signup.password}
                      onChange={(e) => setSignup((x) => ({ ...x, password: e.target.value }))}
                    />
                  )}
                </FormField>
                <FormField
                  id="auth-signup-confirm"
                  label="Confirm password"
                  error={signupErrors.confirmPassword}
                  showError={touched}
                >
                  {(a) => (
                    <input
                      {...a}
                      type="password"
                      name="confirm-password"
                      autoComplete="new-password"
                      className="auth-input"
                      placeholder="Repeat password"
                      value={signup.confirmPassword}
                      onChange={(e) =>
                        setSignup((x) => ({ ...x, confirmPassword: e.target.value }))
                      }
                    />
                  )}
                </FormField>
                <div className="auth-row-options auth-row-options--signup">
                  <label className="auth-check auth-check--solo">
                    <input
                      type="checkbox"
                      checked={signup.remember}
                      onChange={(e) => setSignup((x) => ({ ...x, remember: e.target.checked }))}
                    />
                    Remember this device
                  </label>
                </div>
                <button type="submit" className="auth-submit">
                  Create account
                </button>
              </form>
            )}

            <p className="auth-switch-row">
              {mode === 'login' ? (
                <>
                  <span>New to the firm?</span>{' '}
                  <button
                    type="button"
                    className="auth-switch-btn"
                    onClick={() => {
                      setMode('register')
                      setTouched(false)
                      setBanner(null)
                      setLoginErrors({})
                      setSignupErrors({})
                    }}
                  >
                    Create account
                  </button>
                </>
              ) : (
                <>
                  <span>Already registered?</span>{' '}
                  <button
                    type="button"
                    className="auth-switch-btn"
                    onClick={() => {
                      setMode('login')
                      setTouched(false)
                      setBanner(null)
                      setLoginErrors({})
                      setSignupErrors({})
                    }}
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>

            <button type="button" className="auth-close-fab" aria-label="Close" onClick={close}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                <path fill="currentColor" d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
