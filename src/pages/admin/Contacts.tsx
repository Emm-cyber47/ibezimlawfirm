import { useEffect, useState } from 'react'
import { listContactSubmissions, deleteContactSubmission, type ContactSubmission } from '../../lib/adminContactSubmissions'
import './admin.css'

export default function AdminContacts() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      const data = await listContactSubmissions()
      setSubmissions(data)
      setLoading(false)
    }
    load()
  }, [])

  function openModal(s: ContactSubmission) {
    setSelectedSubmission(s)
  }

  function closeModal() {
    setSelectedSubmission(null)
  }

  async function handleDelete(id: string) {
    const ok = window.confirm('Are you sure you want to delete this submission?')
    if (!ok) return

    setDeletingId(id)
    const success = await deleteContactSubmission(id)
    setDeletingId(null)

    if (!success) {
      alert('Failed to delete submission.')
      return
    }

    setSubmissions((prev) => prev.filter((s) => s.id !== id))
  }

  const filtered = search
    ? submissions.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase()) ||
          (s.matter && s.matter.toLowerCase().includes(search.toLowerCase())),
      )
    : submissions

  return (
    <>
      <section className="page-hero admin-hero">
        <div className="container">
          <h1 className="section-title">Contact Form Submissions</h1>
          <p className="section-lead">{submissions.length} total inquiries</p>
        </div>
      </section>

      <section className="section admin-body">
        <div className="container">
          {loading ? (
            <p>Loading...</p>
          ) : submissions.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-state-icon">📭</div>
              <p className="admin-empty-state-title">No submissions yet</p>
              <p>Contact form submissions will appear here.</p>
            </div>
          ) : (
            <>
              <div className="admin-search-bar">
                <input
                  className="admin-search-input"
                  type="text"
                  placeholder="Search by name, email, or matter..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {filtered.length === 0 ? (
                <p>No submissions match your search.</p>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Matter</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((s) => (
                        <tr key={s.id}>
                          <td>{s.name}</td>
                          <td>{s.email}</td>
                          <td>{s.matter || '—'}</td>
                          <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="admin-table-actions">
                              <button
                                className="admin-table-btn admin-table-btn-view"
                                onClick={() => openModal(s)}
                              >
                                View
                              </button>
                              <button
                                className="admin-table-btn admin-table-btn-delete"
                                onClick={() => handleDelete(s.id)}
                                disabled={deletingId === s.id}
                              >
                                {deletingId === s.id ? 'Deleting...' : 'Delete'}
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

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Contact Details</h2>
              <button className="admin-modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-modal-field">
                <span className="admin-modal-label">Name</span>
                <span className="admin-modal-value">{selectedSubmission.name}</span>
              </div>
              <div className="admin-modal-field">
                <span className="admin-modal-label">Email</span>
                <span className="admin-modal-value">{selectedSubmission.email}</span>
              </div>
              <div className="admin-modal-field">
                <span className="admin-modal-label">Phone</span>
                <span className="admin-modal-value">{selectedSubmission.phone || '—'}</span>
              </div>
              <div className="admin-modal-field">
                <span className="admin-modal-label">Matter</span>
                <span className="admin-modal-value">{selectedSubmission.matter || '—'}</span>
              </div>
              <div className="admin-modal-field">
                <span className="admin-modal-label">Date</span>
                <span className="admin-modal-value">{new Date(selectedSubmission.createdAt).toLocaleString()}</span>
              </div>
              <div className="admin-modal-field admin-modal-field-message">
                <span className="admin-modal-label">Message</span>
                <p className="admin-modal-message">{selectedSubmission.message}</p>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-table-btn admin-table-btn-view" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}