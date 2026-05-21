import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { firm } from '../data/site'
import './AuthFlow.css'

export default function AuthConfirmed() {
  const navigate = useNavigate()
  const { user, authLoading } = useAuth()
  const [status, setStatus] = useState<'working' | 'signed-in' | 'check-inbox'>('working')

  useEffect(() => {
    if (authLoading) return
    if (user) {
      setStatus('signed-in')
      const t = window.setTimeout(() => navigate('/profile', { replace: true }), 1500)
      return () => window.clearTimeout(t)
    }
    setStatus('check-inbox')
  }, [user, authLoading, navigate])

  return (
    <section className="section auth-flow-page">
      <div className="container auth-flow-card luxe-panel">
        <p className="auth-flow-kicker">{firm.name}</p>
        {status === 'working' && (
          <>
            <h1 className="auth-flow-title">Confirming your email…</h1>
            <p className="auth-flow-lead">Please wait while we verify your link.</p>
          </>
        )}
        {status === 'signed-in' && (
          <>
            <h1 className="auth-flow-title">Email confirmed</h1>
            <p className="auth-flow-lead">Your account is active. Opening your profile…</p>
          </>
        )}
        {status === 'check-inbox' && (
          <>
            <h1 className="auth-flow-title">Check your email</h1>
            <p className="auth-flow-lead">
              If you just signed up, open the confirmation link we sent. After confirming, sign in
              with your email and password.
            </p>
            <Link to="/" className="btn btn-primary auth-flow-cta">
              Back to home
            </Link>
          </>
        )}
      </div>
    </section>
  )
}
