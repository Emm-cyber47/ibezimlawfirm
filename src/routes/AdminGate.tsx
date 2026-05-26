import RequireAdmin from './RequireAdmin'

export default function AdminGate({
  children,
}: {
  children: React.ReactNode
}) {
  return <RequireAdmin>{children}</RequireAdmin>
}





