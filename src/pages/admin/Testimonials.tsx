import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  deleteTestimonial,
  listAllTestimonials,
} from '../../lib/adminTestimonials'
import type { Testimonial } from '../../types/testimonials'
import '../pages.css'
import './admin.css'

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  async function load() {
    setLoading(true)
    const data = await listAllTestimonials()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    void load()
  }, [])

  async function handleDelete(id: string) {
    const ok = window.confirm('Delete this testimonial?')
    if (!ok) return

    const result = await deleteTestimonial(id)
    if (!result.ok) {
      alert(result.error)
      return
    }

    await load()
  }

  const filtered = search
    ? items.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.matter.toLowerCase().includes(search.toLowerCase()) ||
          t.location.toLowerCase().includes(search.toLowerCase()),
      )
    : items

  return (
    <>
      <section className="page-hero admin-hero">
        <div className="container">
          <h1 className="section-title">Testimonials</h1>
          <p className="section-lead">Manage client testimonials</p>
        </div>
      </section>

      <section className="section admin-body">
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
            }}
          >
            <h2>All Testimonials</h2>
            <Link to="/admin/testimonials/new" className="btn btn-primary">
              + New Testimonial
            </Link>
          </div>

          {loading ? (
            <p>Loading testimonials...</p>
          ) : items.length === 0 ? (
            <p>No testimonials yet.</p>
          ) : (
            <>
              <div className="admin-search-bar">
                <input
                  className="admin-search-input"
                  type="text"
                  placeholder="Search by name, matter, or location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {filtered.length === 0 ? (
                <p>No testimonials match your search.</p>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Matter</th>
                        <th>Location</th>
                        <th>Rating</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((t) => (
                        <tr key={t.id}>
                          <td>{t.name}</td>
                          <td className="admin-table-small">{t.matter}</td>
                          <td className="admin-table-small">{t.location}</td>
                          <td className="admin-table-small">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                              <Link to={`/admin/testimonials/${t.id}`} className="btn btn-navy">
                                Edit
                              </Link>
                              <button className="btn btn-primary" onClick={() => void handleDelete(t.id)}>
                                Delete
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