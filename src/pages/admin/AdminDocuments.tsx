import { useEffect, useState } from 'react'
import {
  listAllClientDocuments,
  updateDocumentStatus,
  downloadClientDocument,
  deleteClientDocument,
  type AdminClientDocument,
} from '../../lib/adminClientDocuments'
import { formatFileSize } from '../../lib/clientDocuments'
import './admin.css'

export default function AdminDocuments() {
  const [documents, setDocuments] = useState<AdminClientDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      const data = await listAllClientDocuments()
      setDocuments(data)
      setLoading(false)
    }
    load()
  }, [])

  async function handleStatusChange(id: string, newStatus: string) {
    setUpdating(id)
    const success = await updateDocumentStatus(id, newStatus)
    if (success) {
      setDocuments(
        documents.map((d) => (d.id === id ? { ...d, status: newStatus } : d)),
      )
    }
    setUpdating(null)
  }

  async function handleDelete(id: string) {
    const ok = window.confirm('Are you sure you want to delete this document?')
    if (!ok) return

    setDeletingId(id)
    const success = await deleteClientDocument(id)
    setDeletingId(null)

    if (!success) {
      alert('Failed to delete document.')
      return
    }

    setDocuments((prev) => prev.filter((d) => d.id !== id))
  }

  const filtered = search
    ? documents.filter(
        (d) =>
          d.userEmail.toLowerCase().includes(search.toLowerCase()) ||
          d.fileName.toLowerCase().includes(search.toLowerCase()) ||
          (d.note && d.note.toLowerCase().includes(search.toLowerCase())),
      )
    : documents

  return (
    <>
      <section className="page-hero admin-hero">
        <div className="container">
          <h1 className="section-title">Client Document Submissions</h1>
          <p className="section-lead">{documents.length} files uploaded</p>
        </div>
      </section>

      <section className="section admin-body">
        <div className="container">
          {loading ? (
            <p>Loading...</p>
          ) : documents.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-state-icon">📄</div>
              <p className="admin-empty-state-title">No documents submitted</p>
              <p>Client-uploaded documents will appear here.</p>
            </div>
          ) : (
            <>
              <div className="admin-search-bar">
                <input
                  className="admin-search-input"
                  type="text"
                  placeholder="Search by email, file name, or note..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {filtered.length === 0 ? (
                <p>No documents match your search.</p>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Client Email</th>
                        <th>File Name</th>
                        <th>Size</th>
                        <th>Note</th>
                        <th>Uploaded</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((d) => (
                        <tr key={d.id}>
                          <td className="admin-table-small">{d.userEmail}</td>
                          <td className="admin-table-small">{d.fileName}</td>
                          <td className="admin-table-small">{formatFileSize(d.size)}</td>
                          <td className="admin-table-message">{d.note || '—'}</td>
                          <td className="admin-table-small">{new Date(d.uploadedAt).toLocaleDateString()}</td>
                          <td>
                            <select
                              className="admin-status-select"
                              value={d.status}
                              onChange={(e) => handleStatusChange(d.id, e.target.value)}
                              disabled={updating === d.id}
                            >
                              <option value="submitted">Submitted</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>
                          <td>
                            <div className="admin-table-actions">
                              {d.storagePath ? (
                                <button
                                  type="button"
                                  className="admin-table-btn admin-table-btn-view"
                                  onClick={async () => {
                                    try {
                                      await downloadClientDocument(d.storagePath!, d.fileName)
                                    } catch (err) {
                                      console.error('Download failed', err)
                                      alert('Download failed')
                                    }
                                  }}
                                >
                                  Download
                                </button>
                              ) : (
                                <span className="admin-table-small">—</span>
                              )}
                              <button
                                className="admin-table-btn admin-table-btn-delete"
                                onClick={() => handleDelete(d.id)}
                                disabled={deletingId === d.id}
                              >
                                {deletingId === d.id ? 'Deleting...' : 'Delete'}
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
    </>
  )
}