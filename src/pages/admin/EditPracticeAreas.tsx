import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSiteContent, upsertSiteContent } from '../../lib/adminSiteContent'
import { getSupabase } from '../../lib/supabase'
import './admin.css'

type AreaEntry = {
  title: string
  description: string
  imageKey: string
  icon: string
}

async function uploadImage(file: File): Promise<string | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const ext = file.name.split('.').pop()
  const fileName = `practice-areas/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from('practice-area-images')
    .upload(fileName, file)

  if (error) {
    console.error('Image upload failed:', error)
    return null
  }

  const { data: { publicUrl } } = supabase.storage
    .from('practice-area-images')
    .getPublicUrl(fileName)

  return publicUrl
}

export default function EditPracticeAreas() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [areas, setAreas] = useState<AreaEntry[]>([])

  useEffect(() => {
    async function load() {
      const data = await getSiteContent<AreaEntry[]>('practiceAreas')
      // Start empty if nothing saved yet — user must add areas first
      setAreas(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  function updateArea(index: number, field: keyof AreaEntry, value: string) {
    setAreas((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  async function handleImageUpload(index: number, file: File | null) {
    if (!file) return
    const url = await uploadImage(file)
    if (url) {
      updateArea(index, 'imageKey', url)
    } else {
      alert('Failed to upload image.')
    }
  }

  function addArea() {
    setAreas((prev) => [...prev, { title: '', description: '', imageKey: '', icon: 'scale' }])
  }

  function removeArea(index: number) {
    setAreas((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const result = await upsertSiteContent('practiceAreas', areas)
    setSaving(false)

    if (!result.ok) {
      alert(result.error)
      return
    }

    alert('Practice areas saved successfully!')
    navigate('/admin/edit-website')
  }

  if (loading) return <section className="section admin-body"><div className="container"><p>Loading...</p></div></section>

  return (
    <>
      <section className="page-hero admin-hero">
        <div className="container">
          <h1 className="section-title">Edit Practice Areas</h1>
          <p className="section-lead">Add, edit, or remove practice areas</p>
        </div>
      </section>

      <section className="section admin-body">
        <div className="container">
          {areas.length === 0 && !loading && (
            <div className="admin-empty-state" style={{ marginBottom: 24 }}>
              <div className="admin-empty-state-icon">⚖️</div>
              <p className="admin-empty-state-title">No practice areas yet</p>
              <p>Click "+ Add Practice Area" below to create your first one.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-form">
            {areas.map((area, i) => (
              <div key={i} style={{ marginBottom: 24, padding: 20, background: '#f9f9f9', borderRadius: 8, border: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: 18 }}>Area {i + 1}</h3>
                  <button type="button" className="admin-table-btn admin-table-btn-delete" onClick={() => removeArea(i)}>
                    Remove
                  </button>
                </div>

                <div className="form-group">
                  <label>Title</label>
                  <input value={area.title} onChange={(e) => updateArea(i, 'title', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea rows={3} value={area.description} onChange={(e) => updateArea(i, 'description', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Image</label>
                  {area.imageKey && (
                    <div style={{ marginBottom: 8 }}>
                      <img
                        src={area.imageKey}
                        alt=""
                        style={{ width: 160, height: 120, objectFit: 'cover', borderRadius: 8 }}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(i, e.target.files?.[0] || null)}
                  />
                  {area.imageKey && (
                    <button
                      type="button"
                      className="admin-table-btn admin-table-btn-delete"
                      style={{ marginTop: 8 }}
                      onClick={() => updateArea(i, 'imageKey', '')}
                    >
                      Remove Image
                    </button>
                  )}
                </div>
                <div className="form-group">
                  <label>Icon</label>
                  <select value={area.icon} onChange={(e) => updateArea(i, 'icon', e.target.value)}>
                    <option value="scale">Scale</option>
                    <option value="document">Document</option>
                    <option value="people">People</option>
                    <option value="building">Building</option>
                    <option value="home">Home</option>
                  </select>
                </div>
              </div>
            ))}

            <button type="button" className="btn btn-navy" onClick={addArea} style={{ marginBottom: 24 }}>
              + Add Practice Area
            </button>

            {areas.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save All Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    </>
  )
}