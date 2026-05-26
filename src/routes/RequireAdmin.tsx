import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type RequireAdminProps = {
  children: React.ReactNode
}

export default function RequireAdmin({ children }: RequireAdminProps) {
  const { user, authLoading } = useAuth()

  if (authLoading) return null

  const role = (user as unknown as { role?: string } | null)?.role


  // Accept both 'admin' and 'Admin' just in case.
  if (!role || role.toLowerCase?.() !== 'admin') return <Navigate to="/" replace />


  return <>{children}</>



}
