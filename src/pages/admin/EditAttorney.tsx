import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSiteContent, upsertSiteContent } from '../../lib/adminSiteContent'
import { getSupabase } from '../../lib/supabase'
import { attorney } from '../../data/site'
import './admin.css'

async function uploadPhoto(file: File): Promise<string | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const ext = file.name.split('.').pop()
  const fileName = `attorney/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from('attorney-images')
    .upload(fileName, file)

  if (error) {
    console.error('Photo upload failed:', error)
    return null
  }

  const { data: { publicUrl } } = supabase.storage
    .from('attorney-images')
    .getPublicUrl(fileName)

  return publicUrl
}

export default function EditAttorney() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [photoKey, setPhotoKey] = useState('')
  const [bio1, setBio1] = useState('')
  const [bio2, setBio2] = useState('')
  const [bio3, setBio3] = useState('')
  const [education1, setEducation1] = useState('')
  const [education2, setEducation2] = useState('')
  const [admission1, setAdmission1] = useState('')
  const [admission2, setAdmission2] = useState('')
  const [admission3, setAdmission3] = useState('')
  const [highlightsList, setHighlightsList] = useState('')

  useEffect(() => {
    async function load() {
      const attorneyData = await getSiteContent<typeof attorney>('attorney')

      const a = attorneyData ?? (attorney as any)
      setName(a.name ?? attorney.name)
      setTitle(a.title ?? attorney.title)
      setSubtitle(a.subtitle ?? attorney.subtitle)
      setPhotoKey(a.photoKey ?? '')
      setBio1(a.bio?.[0] ?? '')
      setBio2(a.bio?.[1] ?? '')
      setBio3(a.bio?.[2] ?? '')
      setEducation1(a.education?.[0] ?? '')
      setEducation2(a.education?.[1] ?? '')
      setAdmission1(a.admissions?.[0] ?? '')
      setAdmission2(a.admissions?.[1] ?? '')
      setAdmission3(a.admissions?.[2] ?? '')
      setHighlightsList(a.highlights?.join('\n') ?? '')

      setLoading(false)
    }
    load()
  }, [])

  async function handleImageUpload(file: File | null) {
    if (!file) return
    const url = await uploadPhoto(file)
    if (url) {
      setPhotoKey(url)
    } else {
      alert('Failed to upload photo.')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const result = await upsertSiteContent('attorney', {
      name, title, subtitle,
      photoKey: photoKey || undefined,
      bio: [bio1, bio2, bio3].filter(Boolean),
      education: [education1, education2].filter(Boolean),
      admissions: [admission1, admission2, admission3].filter(Boolean),
      highlights: highlightsList.split('\n').map((s) => s.trim()).filter(Boolean),
    })

    setSaving(false)

    if (!result.ok) {
      alert(result.error)
      return
    }

    alert('Attorney details saved successfully!')
    navigate('/admin/edit-website')
  }

  if (loading) return <section className="section admin-body"><div className="container"><p>Loading...</p></div></section>

  return (
    <>
      <section className="page-hero admin-hero">
        <div className="container">
          <h1 className="section-title">Edit Attorney Details</h1>
          <p className="section-lead">Update attorney bio, education, admissions, highlights, and photo</p>
        </div>
      </section>

      <section className="section admin-body">
        <div className="container">
          <form onSubmit={handleSubmit} className="admin-form">
            <h2 className="admin-form-section-title">Attorney Info</h2>

            <div className="form-group">
              <label>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Subtitle</label>
              <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Photo</label>
              {photoKey && (
                <div style={{ marginBottom: 8 }}>
                  <img
                    src={photoKey}
                    alt="Attorney"
                    style={{ width: 160, height: 200, objectFit: 'cover', borderRadius: 8 }}
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
              />
              {photoKey && (
                <button
                  type="button"
                  className="admin-table-btn admin-table-btn-delete"
                  style={{ marginTop: 8 }}
                  onClick={() => setPhotoKey('')}
                >
                  Remove Photo
                </button>
              )}
            </div>

            <h2 className="admin-form-section-title">Biography (3 paragraphs)</h2>
            <div className="form-group">
              <label>Paragraph 1</label>
              <textarea rows={4} value={bio1} onChange={(e) => setBio1(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Paragraph 2</label>
              <textarea rows={4} value={bio2} onChange={(e) => setBio2(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Paragraph 3</label>
              <textarea rows={4} value={bio3} onChange={(e) => setBio3(e.target.value)} />
            </div>

            <h2 className="admin-form-section-title">Education</h2>
            <div className="form-group">
              <label>Education 1</label>
              <input value={education1} onChange={(e) => setEducation1(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Education 2</label>
              <input value={education2} onChange={(e) => setEducation2(e.target.value)} />
            </div>

            <h2 className="admin-form-section-title">Bar Admissions</h2>
            <div className="form-group">
              <label>Admission 1</label>
              <input value={admission1} onChange={(e) => setAdmission1(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Admission 2</label>
              <input value={admission2} onChange={(e) => setAdmission2(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Admission 3</label>
              <input value={admission3} onChange={(e) => setAdmission3(e.target.value)} />
            </div>

            <h2 className="admin-form-section-title">Highlights (one per line)</h2>
            <div className="form-group">
              <textarea rows={4} value={highlightsList} onChange={(e) => setHighlightsList(e.target.value)} placeholder="25+ years of experience&#10;Personal injury & civil litigation&#10;Immigration & naturalization" />
            </div>

            <div style={{ marginTop: 32 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}