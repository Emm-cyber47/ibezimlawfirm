import { useEffect, useState } from 'react'
import { listAllUsers, getUserStats, updateUser, deleteUser, type AdminUser } from '../../lib/adminUsers'
import './admin.css'

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Record<string, { documentsCount: number; commentsCount: number }>>({})
  const [search, setSearch] = useState('')

  // Edit modal state
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [saving, setSaving] = useState(false)

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    const userData = await listAllUsers()
    setUsers(userData)

    const statsMap: Record<string, { documentsCount: number; commentsCount: number }> = {}
    for (const user of userData) {
      statsMap[user.id] = await getUserStats(user.id)
    }
    setStats(statsMap)
    setLoading(false)
  }

  function openEditModal(user: AdminUser) {
    setEditingUser(user)
    setEditFirstName(user.firstName)
    setEditLastName(user.lastName)
    setEditPhone(user.phone)
    setEditEmail(user.email)
  }

  function closeEditModal() {
    setEditingUser(null)
  }

  async function handleSaveEdit() {
    if (!editingUser) return
    setSaving(true)

    const success = await updateUser(editingUser.id, {
      firstName: editFirstName,
      lastName: editLastName,
      phone: editPhone,
      email: editEmail,
    })

    setSaving(false)

    if (!success) {
      alert('Failed to update user.')
      return
    }

    // Update local state
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id
          ? { ...u, firstName: editFirstName, lastName: editLastName, phone: editPhone, email: editEmail }
          : u,
      ),
    )

    closeEditModal()
    alert('User updated successfully.')
  }

  async function handleDelete(userId: string) {
    const ok = window.confirm('Are you sure you want to delete this user? This action cannot be undone.')
    if (!ok) return

    setDeletingId(userId)
    const success = await deleteUser(userId)
    setDeletingId(null)

    if (!success) {
      alert('Failed to delete user.')
      return
    }

    setUsers((prev) => prev.filter((u) => u.id !== userId))
  }

  const filtered = search
    ? users.filter(
        (u) =>
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
          (u.phone && u.phone.includes(search)),
      )
    : users

  return (
    <>
      <section className="page-hero admin-hero">
        <div className="container">
          <h1 className="section-title">User Management</h1>
          <p className="section-lead">{users.length} registered clients</p>
        </div>
      </section>

      <section className="section admin-body">
        <div className="container">
          {loading ? (
            <p>Loading...</p>
          ) : users.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-state-icon">👥</div>
              <p className="admin-empty-state-title">No registered users</p>
              <p>Users will appear here after they sign up.</p>
            </div>
          ) : (
            <>
              <div className="admin-search-bar">
                <input
                  className="admin-search-input"
                  type="text"
                  placeholder="Search by email, name, or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {filtered.length === 0 ? (
                <p>No users match your search.</p>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Documents</th>
                        <th>Comments</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((u) => (
                        <tr key={u.id}>
                          <td className="admin-table-small">{u.email}</td>
                          <td>
                            {u.firstName} {u.lastName}
                          </td>
                          <td className="admin-table-small">{u.phone || '—'}</td>
                          <td className="admin-table-center">{stats[u.id]?.documentsCount || 0}</td>
                          <td className="admin-table-center">{stats[u.id]?.commentsCount || 0}</td>
                          <td className="admin-table-small">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="admin-table-actions">
                              <button
                                className="admin-table-btn admin-table-btn-view"
                                onClick={() => openEditModal(u)}
                              >
                                Edit
                              </button>
                              <button
                                className="admin-table-btn admin-table-btn-delete"
                                onClick={() => handleDelete(u.id)}
                                disabled={deletingId === u.id}
                              >
                                {deletingId === u.id ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="admin-modal-overlay" onClick={closeEditModal}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Edit User</h2>
              <button className="admin-modal-close" onClick={closeEditModal}>&times;</button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label className="admin-label">First Name</label>
                <input
                  className="admin-input"
                  type="text"
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Last Name</label>
                <input
                  className="admin-input"
                  type="text"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Phone</label>
                <input
                  className="admin-input"
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Email</label>
                <input
                  className="admin-input"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-table-btn admin-table-btn-view" onClick={closeEditModal}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveEdit}
                disabled={saving}
                style={{ marginLeft: '0.5rem' }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}