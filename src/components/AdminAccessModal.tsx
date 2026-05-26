import { useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import FormField from './FormField.tsx'
import { useAuth } from '../context/AuthContext'

const HARDCODED_USERNAME = '318924145'
const HARDCODED_PASSWORD = 'NewJersey#145'
const HARDCODED_SUPABASE_EMAIL = 'sebastian@ibezimlaw.com'

const SESSION_UNLOCK_KEY = 'adminBypassUnlocked'


export default function AdminAccessModal() {
  const navigate = useNavigate()
  const { loginWithPassword } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)




  const canSubmit = useMemo(() => {
    return username.trim().length > 0 && password.trim().length > 0
  }, [username, password])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const u = username.trim()
    const p = password.trim()


    // Bypass validates the provided username/password
    const ok = u === HARDCODED_USERNAME && p === HARDCODED_PASSWORD


    if (!ok) {
      setError('Invalid username or password.')
      setSubmitting(false)
      return
    }


    try {
      window.sessionStorage.setItem(SESSION_UNLOCK_KEY, 'true')
    } catch {
      // If storage is blocked, still proceed for this tab
    }

    // Admin pages fetch data via Supabase + RLS.
    // We also explicitly attempt to set the bypass user's profile role to 'admin'
    // so that it is included in `public.admins` (via the trigger sync).
    const loginResult = await loginWithPassword(
      HARDCODED_SUPABASE_EMAIL,
      HARDCODED_PASSWORD,
      true,
    )

    if (!loginResult.ok) {
      setError(loginResult.error)
      setSubmitting(false)
      return
    }

    // At this point `loginResult` is the `{ ok: true }` variant.


    // Best-effort: if your RLS allows the logged-in user to update their own profile
    // (or if there is already an admin), this ensures bypass user becomes admin.
    try {
      const { getSupabase } = await import('../lib/supabase')
      const supabase = getSupabase()
      const { data } = await supabase.auth.getUser()
      const userId = data.user?.id
      if (userId) {
        await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', userId)
      }
    } catch {
      // ignore - if policy denies, we still proceed; RLS may still allow access.
    }




    setSubmitting(false)

    navigate('/admin', { replace: true })

  }

  return (
    <div className="admin-modal-overlay" role="dialog" aria-modal="true" aria-label="Admin access">
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>Admin Access</h2>
          <button
            type="button"
            className="admin-modal-close"
            aria-label="Close"
            onClick={() => navigate('/', { replace: true })}
          >
            ×
          </button>
        </div>

        <form className="admin-modal-body" onSubmit={handleSubmit} noValidate>
          <p style={{ marginTop: 0, color: '#555', lineHeight: 1.6 }}>
            Enter the username and password to proceed to the admin panel.
          </p>

          {error && <div className="admin-modal-message" style={{ color: '#8f1f2f' }}>{error}</div>}

          <FormField
            id="admin-username"
            label="Username"
            error={error}
            showError={Boolean(error && username.trim().length === 0)}
          >
            {(aria) => (
              <input
                {...aria}
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            )}
          </FormField>

          <FormField
            id="admin-password"
            label="Password"
            error={error}
            showError={Boolean(error && password.trim().length === 0)}
          >
            {(aria) => (
              <input
                {...aria}
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            )}
          </FormField>

          <div className="admin-modal-footer" style={{ paddingTop: 0 }}>
            <button type="submit" className="btn btn-primary" disabled={!canSubmit || submitting}>
              {submitting ? 'Checking…' : 'Enter Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

