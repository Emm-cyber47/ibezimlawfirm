import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSiteContent, upsertSiteContent } from '../../lib/adminSiteContent'
import { getSupabase } from '../../lib/supabase'
import { aboutPage, values } from '../../data/site'
import './admin.css'

async function uploadImage(file: File, folder: string): Promise<string | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const ext = file.name.split('.').pop()
  const fileName = `${folder}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from('about-images')
    .upload(fileName, file)

  if (error) {
    console.error('Upload failed:', error)
    return null
  }

  const { data: { publicUrl } } = supabase.storage
    .from('about-images')
    .getPublicUrl(fileName)

  return publicUrl
}

export default function EditAbout() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Hero
  const [heroImage, setHeroImage] = useState('')

  // About section content
  const [label, setLabel] = useState('')
  const [title, setTitle] = useState('')
  const [paragraph1, setParagraph1] = useState('')
  const [paragraph2, setParagraph2] = useState('')
  const [practiceAreasList, setPracticeAreasList] = useState('')

  // About gallery (4 images next to the text)
  const [galleryImage1, setGalleryImage1] = useState('')
  const [galleryImage2, setGalleryImage2] = useState('')
  const [galleryImage3, setGalleryImage3] = useState('')
  const [galleryImage4, setGalleryImage4] = useState('')

  // "Who we are" section
  const [whoLabel, setWhoLabel] = useState('')
  const [whoTitle, setWhoTitle] = useState('')
  const [whoParagraph1, setWhoParagraph1] = useState('')
  const [whoParagraph2, setWhoParagraph2] = useState('')

  // Story gallery (4 images)
  const [storyImage1, setStoryImage1] = useState('')
  const [storyImage2, setStoryImage2] = useState('')
  const [storyImage3, setStoryImage3] = useState('')
  const [storyImage4, setStoryImage4] = useState('')

  // Values
  const [value1Title, setValue1Title] = useState('')
  const [value1Text, setValue1Text] = useState('')
  const [value2Title, setValue2Title] = useState('')
  const [value2Text, setValue2Text] = useState('')
  const [value3Title, setValue3Title] = useState('')
  const [value3Text, setValue3Text] = useState('')

  useEffect(() => {
    async function load() {
      const data = await getSiteContent<any>('aboutContent')

      const d = data ?? {}
      setHeroImage(d.heroImage ?? '')

      const a = d.aboutPage ?? aboutPage
      setLabel(a.label ?? aboutPage.label)
      setTitle(a.title ?? aboutPage.title)
      setParagraph1((a.paragraphs ?? aboutPage.paragraphs)[0] ?? '')
      setParagraph2((a.paragraphs ?? aboutPage.paragraphs)[1] ?? '')
      setPracticeAreasList((a.featuredPracticeAreas ?? aboutPage.featuredPracticeAreas).join(', '))

      const gal = d.aboutGallery ?? []
      setGalleryImage1(gal[0] ?? '')
      setGalleryImage2(gal[1] ?? '')
      setGalleryImage3(gal[2] ?? '')
      setGalleryImage4(gal[3] ?? '')

      const w = d.whoWeAre ?? {}
      setWhoLabel(w.label ?? 'Who we are')
      setWhoTitle(w.title ?? 'Dedicated advocacy, personal attention')
      setWhoParagraph1((w.paragraphs ?? [])[0] ?? '')
      setWhoParagraph2((w.paragraphs ?? [])[1] ?? '')

      const sg = d.storyGallery ?? []
      setStoryImage1(sg[0] ?? '')
      setStoryImage2(sg[1] ?? '')
      setStoryImage3(sg[2] ?? '')
      setStoryImage4(sg[3] ?? '')

      const v = d.values ?? values
      setValue1Title((v[0] as any)?.title ?? values[0]?.title ?? '')
      setValue1Text((v[0] as any)?.text ?? values[0]?.text ?? '')
      setValue2Title((v[1] as any)?.title ?? values[1]?.title ?? '')
      setValue2Text((v[1] as any)?.text ?? values[1]?.text ?? '')
      setValue3Title((v[2] as any)?.title ?? values[2]?.title ?? '')
      setValue3Text((v[2] as any)?.text ?? values[2]?.text ?? '')

      setLoading(false)
    }
    load()
  }, [])

  async function handleImageUpload(
    setter: (v: string) => void,
    file: File | null,
    folder: string,
  ) {
    if (!file) return
    const url = await uploadImage(file, folder)
    if (url) setter(url)
    else alert('Failed to upload image.')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const result = await upsertSiteContent('aboutContent', {
      heroImage: heroImage || undefined,
      aboutPage: {
        label, title,
        paragraphs: [paragraph1, paragraph2].filter(Boolean),
        featuredPracticeAreas: practiceAreasList.split(',').map((s) => s.trim()).filter(Boolean),
      },
      aboutGallery: [galleryImage1, galleryImage2, galleryImage3, galleryImage4].filter(Boolean),
      whoWeAre: {
        label: whoLabel, title: whoTitle,
        paragraphs: [whoParagraph1, whoParagraph2].filter(Boolean),
      },
      storyGallery: [storyImage1, storyImage2, storyImage3, storyImage4].filter(Boolean),
      values: [
        { title: value1Title, text: value1Text, icon: 'integrity' },
        { title: value2Title, text: value2Text, icon: 'excellence' },
        { title: value3Title, text: value3Text, icon: 'client' },
      ].filter((v) => v.title || v.text),
    })

    setSaving(false)

    if (!result.ok) {
      alert(result.error)
      return
    }

    alert('About page content saved successfully!')
    navigate('/admin/edit-website')
  }

  if (loading) return <section className="section admin-body"><div className="container"><p>Loading...</p></div></section>

  const imgUpload = (label: string, value: string, setter: (v: string) => void, folder: string) => (
    <div className="form-group">
      <label>{label}</label>
      {value && (
        <div style={{ marginBottom: 8 }}>
          <img src={value} alt="" style={{ width: 160, height: 110, objectFit: 'cover', borderRadius: 8 }} />
        </div>
      )}
      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(setter, e.target.files?.[0] || null, folder)} />
      {value && (
        <button type="button" className="admin-table-btn admin-table-btn-delete" style={{ marginTop: 6 }} onClick={() => setter('')}>
          Remove
        </button>
      )}
    </div>
  )

  return (
    <>
      <section className="page-hero admin-hero">
        <div className="container">
          <h1 className="section-title">Edit About Us</h1>
          <p className="section-lead">Update hero, about section, gallery images, who we are, and values</p>
        </div>
      </section>

      <section className="section admin-body">
        <div className="container">
          <form onSubmit={handleSubmit} className="admin-form">
            <h2 className="admin-form-section-title">Hero Image</h2>
            {imgUpload('Hero Image', heroImage, setHeroImage, 'hero')}

            <h2 className="admin-form-section-title">About Section Content</h2>
            <div className="form-group">
              <label>Label</label>
              <input value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Paragraph 1</label>
              <textarea rows={4} value={paragraph1} onChange={(e) => setParagraph1(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Paragraph 2</label>
              <textarea rows={4} value={paragraph2} onChange={(e) => setParagraph2(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Featured Practice Areas (comma-separated)</label>
              <input value={practiceAreasList} onChange={(e) => setPracticeAreasList(e.target.value)} />
            </div>

            <h2 className="admin-form-section-title">About Gallery Images (4 images beside the text)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {imgUpload('Image 1', galleryImage1, setGalleryImage1, 'about-gallery')}
              {imgUpload('Image 2', galleryImage2, setGalleryImage2, 'about-gallery')}
              {imgUpload('Image 3', galleryImage3, setGalleryImage3, 'about-gallery')}
              {imgUpload('Image 4', galleryImage4, setGalleryImage4, 'about-gallery')}
            </div>

            <h2 className="admin-form-section-title">"Who We Are" Section</h2>
            <div className="form-group">
              <label>Label</label>
              <input value={whoLabel} onChange={(e) => setWhoLabel(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Title</label>
              <input value={whoTitle} onChange={(e) => setWhoTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Paragraph 1</label>
              <textarea rows={3} value={whoParagraph1} onChange={(e) => setWhoParagraph1(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Paragraph 2</label>
              <textarea rows={3} value={whoParagraph2} onChange={(e) => setWhoParagraph2(e.target.value)} />
            </div>

            <h2 className="admin-form-section-title">Story Gallery Images (4 images below "Who We Are")</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {imgUpload('Image 1', storyImage1, setStoryImage1, 'story-gallery')}
              {imgUpload('Image 2', storyImage2, setStoryImage2, 'story-gallery')}
              {imgUpload('Image 3', storyImage3, setStoryImage3, 'story-gallery')}
              {imgUpload('Image 4', storyImage4, setStoryImage4, 'story-gallery')}
            </div>

            <h2 className="admin-form-section-title">Our Values</h2>
            {[
              { title: value1Title, setTitle: setValue1Title, text: value1Text, setText: setValue1Text, num: 1 },
              { title: value2Title, setTitle: setValue2Title, text: value2Text, setText: setValue2Text, num: 2 },
              { title: value3Title, setTitle: setValue3Title, text: value3Text, setText: setValue3Text, num: 3 },
            ].map((v) => (
              <div key={v.num} style={{ marginBottom: 20, padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
                <p style={{ fontWeight: 600, marginBottom: 8 }}>Value {v.num}</p>
                <div className="form-group">
                  <label>Title</label>
                  <input value={v.title} onChange={(e) => v.setTitle(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Text</label>
                  <textarea rows={2} value={v.text} onChange={(e) => v.setText(e.target.value)} />
                </div>
              </div>
            ))}

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