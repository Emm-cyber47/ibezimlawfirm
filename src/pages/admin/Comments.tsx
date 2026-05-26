import { useEffect, useState } from 'react'
import { listBlogComments, deleteBlogComment, type AdminBlogComment } from '../../lib/adminBlogComments'
import './admin.css'

export default function AdminComments() {
  const [comments, setComments] = useState<AdminBlogComment[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      const data = await listBlogComments()
      setComments(data)
      setLoading(false)
    }
    load()
  }, [])

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this comment?')) return
    setDeleting(id)
    const success = await deleteBlogComment(id)
    if (success) {
      setComments(comments.filter((c) => c.id !== id))
    }
    setDeleting(null)
  }

  const filtered = search
    ? comments.filter(
        (c) =>
          c.authorName.toLowerCase().includes(search.toLowerCase()) ||
          c.postSlug.toLowerCase().includes(search.toLowerCase()) ||
          c.message.toLowerCase().includes(search.toLowerCase()),
      )
    : comments

  return (
    <>
      <section className="page-hero admin-hero">
        <div className="container">
          <h1 className="section-title">Blog Comment Moderation</h1>
          <p className="section-lead">{comments.length} total comments</p>
        </div>
      </section>

      <section className="section admin-body">
        <div className="container">
          {loading ? (
            <p>Loading...</p>
          ) : comments.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-state-icon">💬</div>
              <p className="admin-empty-state-title">No comments</p>
              <p>Comments will appear here as clients post them.</p>
            </div>
          ) : (
            <>
              <div className="admin-search-bar">
                <input
                  className="admin-search-input"
                  type="text"
                  placeholder="Search by author, post, or comment text..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {filtered.length === 0 ? (
                <p>No comments match your search.</p>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Author</th>
                        <th>Post</th>
                        <th>Comment</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((c) => (
                        <tr key={c.id}>
                          <td>{c.authorName}</td>
                          <td className="admin-table-small">{c.postSlug}</td>
                          <td className="admin-table-message">{c.message.substring(0, 50)}...</td>
                          <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="admin-table-actions">
                              <button
                                className="admin-table-btn admin-table-btn-delete"
                                onClick={() => handleDelete(c.id)}
                                disabled={deleting === c.id}
                              >
                                {deleting === c.id ? 'Deleting...' : 'Delete'}
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