import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import { useAuth } from '../context/AuthContext'
import { firm } from '../data/site'
import { hasErrors, validatePassword } from '../lib/formValidation'
import '../components/FormField.css'
import './AuthFlow.css'

export default function ResetPassword() {
  const navigate = useNavigate()
  const { passwordRecoveryPending, authLoading, completePasswordRecovery } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [touched, setTouched] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [banner, setBanner] = useState<{ text: string; variant: 'success' | 'notice' } | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!passwordRecoveryPending) {
      setBanner({
        variant: 'notice',
        text: 'This reset link is invalid or has expired. Request a new link from the Login menu.',
      })
    }
  }, [authLoading, passwordRecoveryPending])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched(true)
    setBanner(null)
    const next: Record<string, string> = {}
    const pw = validatePassword(password)
    if (!pw.valid) next.password = pw.message
    if (password !== confirmPassword) next.confirmPassword = 'Passwords do not match.'
    setErrors(next)
    if (hasErrors(next)) return

    setSubmitting(true)
    const result = await completePasswordRecovery(password)
    setSubmitting(false)
    if (!result.ok) {
      setBanner({ variant: 'notice', text: result.error })
      return
    }
    setBanner({ variant: 'success', text: 'Password updated. Redirecting to your profile…' })
    window.setTimeout(() => navigate('/profile', { replace: true }), 1200)
  }

  return (
    <section className="section auth-flow-page">
      <div className="container auth-flow-card luxe-panel">
        <p className="auth-flow-kicker">{firm.name}</p>
        <h1 className="auth-flow-title">Set a new password</h1>
        <p className="auth-flow-lead">
          Choose a strong password for your client account. This link can only be used once.
        </p>

        {banner ? <p className={`auth-flow-banner auth-flow-banner--${banner.variant}`}>{banner.text}</p> : null}

        {passwordRecoveryPending ? (
          <form className="auth-flow-form" onSubmit={(e) => void handleSubmit(e)} noValidate>
            <FormField id="reset-password" label="New password" error={errors.password} showError={touched}>
              {(a) => (
                <input
                  {...a}
                  type="password"
                  autoComplete="new-password"
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}
            </FormField>
            <FormField
              id="reset-confirm"
              label="Confirm password"
              error={errors.confirmPassword}
              showError={touched}
            >
              {(a) => (
                <input
                  {...a}
                  type="password"
                  autoComplete="new-password"
                  className="auth-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              )}
            </FormField>
            <button type="submit" className="btn btn-primary auth-flow-cta" disabled={submitting}>
              {submitting ? 'Saving…' : 'Update password'}
            </button>
          </form>
        ) : (
          <Link to="/" className="btn btn-primary auth-flow-cta">
            Back to home
          </Link>
        )}
      </div>
    </section>
  )
}
