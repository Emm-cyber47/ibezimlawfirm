import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <p>Loading your account…</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/" replace />

  return <>{children}</>
}
