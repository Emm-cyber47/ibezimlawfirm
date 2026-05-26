import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createTestimonial,
  getTestimonialById,
  updateTestimonial,
} from '../../lib/adminTestimonials'
import type {
  CreateTestimonialPayload,
  UpdateTestimonialPayload,
} from '../../types/testimonials'
import './admin.css'

function clampRating(n: number) {
  if (Number.isNaN(n)) return 1
  return Math.max(1, Math.min(5, Math.round(n)))
}

export default function TestimonialEditor() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const isEditing = useMemo(() => Boolean(id) && id !== 'new', [id])

  const [loading, setLoading] = useState(false)

  const [quote, setQuote] = useState('')
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [matter, setMatter] = useState('')
  const [rating, setRating] = useState(5)

  useEffect(() => {
    async function load() {
      if (!isEditing || !id) return

      const t = await getTestimonialById(id)
      if (!t) return

      setQuote(t.quote)
      setName(t.name)
      setLocation(t.location)
      setMatter(t.matter)
      setRating(t.rating)
    }
    void load()
  }, [isEditing, id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const payload: CreateTestimonialPayload = {
      quote: quote.trim(),
      name: name.trim(),
      location: location.trim(),
      matter: matter.trim(),
      rating: clampRating(rating),
    }

    const result = isEditing
      ? await updateTestimonial(id!, payload as UpdateTestimonialPayload)
      : await createTestimonial(payload)

    setLoading(false)

    if (!result.ok) {
      alert(result.error)
      return
    }

    navigate('/admin/testimonials')
  }

  return (
    <>
      <section className="page-hero admin-hero">
        <div className="container">
          <h1 className="section-title">{isEditing ? 'Edit Testimonial' : 'Create Testimonial'}</h1>
          <p className="section-lead">Keep client feedback fresh and accurate</p>
        </div>
      </section>

      <section className="section admin-body">
        <div className="container">
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Client Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Matter</label>
              <input value={matter} onChange={(e) => setMatter(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Rating (1-5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label>Quote</label>
              <textarea
                rows={10}
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                required
                placeholder="Client quote text"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Update Testimonial' : 'Create Testimonial'}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}

