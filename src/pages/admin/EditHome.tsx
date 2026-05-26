import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSiteContent, upsertSiteContent } from '../../lib/adminSiteContent'
import { getSupabase } from '../../lib/supabase'
import { firm, heroHeadlines, heroTrustPillars, homeAboutSection, whyChooseUs, values } from '../../data/site'
import './admin.css'

async function uploadImage(file: File, folder: string): Promise<string | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const ext = file.name.split('.').pop()
  const fileName = `${folder}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from('home-images')
    .upload(fileName, file)

  if (error) {
    console.error('Upload failed:', error)
    return null
  }

  const { data: { publicUrl } } = supabase.storage
    .from('home-images')
    .getPublicUrl(fileName)

  return publicUrl
}

export default function EditHome() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Firm info
  const [firmName, setFirmName] = useState('')
  const [firmTagline, setFirmTagline] = useState('')
  const [firmPhone, setFirmPhone] = useState('')
  const [firmEmail, setFirmEmail] = useState('')
  const [firmAddress, setFirmAddress] = useState('')
  const [firmHours, setFirmHours] = useState('')

  // Hero headlines (3 slides)
  const [headline1Primary, setHeadline1Primary] = useState('')
  const [headline1Accent, setHeadline1Accent] = useState('')
  const [headline2Primary, setHeadline2Primary] = useState('')
  const [headline2Accent, setHeadline2Accent] = useState('')
  const [headline3Primary, setHeadline3Primary] = useState('')
  const [headline3Accent, setHeadline3Accent] = useState('')

  // Trust pillars (3 items)
  const [pillar1Label, setPillar1Label] = useState('')
  const [pillar2Label, setPillar2Label] = useState('')
  const [pillar3Label, setPillar3Label] = useState('')

  // Home about section
  const [aboutImage, setAboutImage] = useState('')
  const [aboutLabel, setAboutLabel] = useState('')
  const [aboutTitle, setAboutTitle] = useState('')
  const [aboutExcerpt, setAboutExcerpt] = useState('')
  const [highlight1, setHighlight1] = useState('')
  const [highlight2, setHighlight2] = useState('')
  const [highlight3, setHighlight3] = useState('')
  const [highlight4, setHighlight4] = useState('')
  const [highlight5, setHighlight5] = useState('')
  const [highlight6, setHighlight6] = useState('')

  // Why choose us (5 reasons)
  const [reason1Title, setReason1Title] = useState('')
  const [reason1Text, setReason1Text] = useState('')
  const [reason2Title, setReason2Title] = useState('')
  const [reason2Text, setReason2Text] = useState('')
  const [reason3Title, setReason3Title] = useState('')
  const [reason3Text, setReason3Text] = useState('')
  const [reason4Title, setReason4Title] = useState('')
  const [reason4Text, setReason4Text] = useState('')
  const [reason5Title, setReason5Title] = useState('')
  const [reason5Text, setReason5Text] = useState('')

  // Values (3 items)
  const [value1Title, setValue1Title] = useState('')
  const [value1Text, setValue1Text] = useState('')
  const [value2Title, setValue2Title] = useState('')
  const [value2Text, setValue2Text] = useState('')
  const [value3Title, setValue3Title] = useState('')
  const [value3Text, setValue3Text] = useState('')

  useEffect(() => {
    async function load() {
      const d = await getSiteContent<any>('homeContent')

      const f = d?.firm ?? firm
      setFirmName(f.name)
      setFirmTagline(f.tagline)
      setFirmPhone(f.phone)
      setFirmEmail(f.email)
      setFirmAddress(f.address)
      setFirmHours(f.hours)

      const h = d?.heroHeadlines ?? heroHeadlines
      setHeadline1Primary(h[0]?.primary ?? '')
      setHeadline1Accent(h[0]?.accent ?? '')
      setHeadline2Primary(h[1]?.primary ?? '')
      setHeadline2Accent(h[1]?.accent ?? '')
      setHeadline3Primary(h[2]?.primary ?? '')
      setHeadline3Accent(h[2]?.accent ?? '')

      const p = d?.heroTrustPillars ?? heroTrustPillars
      setPillar1Label(p[0]?.label ?? '')
      setPillar2Label(p[1]?.label ?? '')
      setPillar3Label(p[2]?.label ?? '')

      const a = d?.homeAboutSection ?? homeAboutSection
      setAboutImage(d?.aboutImage ?? '')
      setAboutLabel(a.label)
      setAboutTitle(a.title)
      setAboutExcerpt(a.excerpt)
      setHighlight1((a.highlights ?? [])[0]?.label ?? '')
      setHighlight2((a.highlights ?? [])[1]?.label ?? '')
      setHighlight3((a.highlights ?? [])[2]?.label ?? '')
      setHighlight4((a.highlights ?? [])[3]?.label ?? '')
      setHighlight5((a.highlights ?? [])[4]?.label ?? '')
      setHighlight6((a.highlights ?? [])[5]?.label ?? '')

      const w = d?.whyChooseUs ?? whyChooseUs
      setReason1Title(w.reasons?.[0]?.title ?? '')
      setReason1Text(w.reasons?.[0]?.text ?? '')
      setReason2Title(w.reasons?.[1]?.title ?? '')
      setReason2Text(w.reasons?.[1]?.text ?? '')
      setReason3Title(w.reasons?.[2]?.title ?? '')
      setReason3Text(w.reasons?.[2]?.text ?? '')
      setReason4Title(w.reasons?.[3]?.title ?? '')
      setReason4Text(w.reasons?.[3]?.text ?? '')
      setReason5Title(w.reasons?.[4]?.title ?? '')
      setReason5Text(w.reasons?.[4]?.text ?? '')

      const v = d?.values ?? values
      setValue1Title(v[0]?.title ?? '')
      setValue1Text(v[0]?.text ?? '')
      setValue2Title(v[1]?.title ?? '')
      setValue2Text(v[1]?.text ?? '')
      setValue3Title(v[2]?.title ?? '')
      setValue3Text(v[2]?.text ?? '')

      setLoading(false)
    }
    load()
  }, [])

  async function handleImageUpload(
    setter: (v: string) => void,
    file: File | null,
  ) {
    if (!file) return
    const url = await uploadImage(file, 'about')
    if (url) setter(url)
    else alert('Failed to upload image.')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const result = await upsertSiteContent('homeContent', {
      firm: {
        name: firmName, tagline: firmTagline, phone: firmPhone,
        email: firmEmail, address: firmAddress, hours: firmHours,
        mapsEmbed: (firm as any).mapsEmbed ?? '',
        directionsUrl: (firm as any).directionsUrl ?? '',
      },
      heroHeadlines: [
        { primary: headline1Primary, accent: headline1Accent },
        { primary: headline2Primary, accent: headline2Accent },
        { primary: headline3Primary, accent: headline3Accent },
      ],
      heroTrustPillars: [
        { num: '01', label: pillar1Label, icon: 'accessible' as const },
        { num: '02', label: pillar2Label, icon: 'experienced' as const },
        { num: '03', label: pillar3Label, icon: 'results' as const },
      ],
      aboutImage: aboutImage || undefined,
      homeAboutSection: {
        label: aboutLabel, title: aboutTitle, excerpt: aboutExcerpt,
        highlights: [
          { label: highlight1, icon: 'justice' as const },
          { label: highlight2, icon: 'attorney' as const },
          { label: highlight3, icon: 'gavel' as const },
          { label: highlight4, icon: 'recommend' as const },
          { label: highlight5, icon: 'results' as const },
          { label: highlight6, icon: 'education' as const },
        ].filter((h) => h.label),
      },
      whyChooseUs: {
        eyebrow: 'The Big Question',
        title: 'Why Ibezim Law?',
        reasons: [
          { title: reason1Title, text: reason1Text, icon: 'accessible' as const },
          { title: reason2Title, text: reason2Text, icon: 'experience' as const },
          { title: reason3Title, text: reason3Text, icon: 'personable' as const },
          { title: reason4Title, text: reason4Text, icon: 'communication' as const },
          { title: reason5Title, text: reason5Text, icon: 'results' as const },
        ].filter((r) => r.title || r.text),
      },
      values: [
        { title: value1Title, text: value1Text, icon: 'integrity' as const },
        { title: value2Title, text: value2Text, icon: 'excellence' as const },
        { title: value3Title, text: value3Text, icon: 'client' as const },
      ].filter((v) => v.title || v.text),
    })

    setSaving(false)

    if (!result.ok) {
      alert(result.error)
      return
    }

    alert('Home page content saved successfully!')
    navigate('/admin/edit-website')
  }

  if (loading) return <section className="section admin-body"><div className="container"><p>Loading...</p></div></section>

  const imgField = (
    label: string,
    value: string,
    setter: (v: string) => void,
  ) => (
    <div className="form-group">
      <label>{label}</label>
      {value && (
        <div style={{ marginBottom: 8 }}>
          <img src={value} alt="" style={{ width: 180, height: 130, objectFit: 'cover', borderRadius: 8 }} />
        </div>
      )}
      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(setter, e.target.files?.[0] || null)} />
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
          <h1 className="section-title">Edit Home Page</h1>
          <p className="section-lead">Update firm info, hero, trust pillars, about preview, highlights, why choose us, and values</p>
        </div>
      </section>

      <section className="section admin-body">
        <div className="container">
          <form onSubmit={handleSubmit} className="admin-form">

            <h2 className="admin-form-section-title">Firm Information</h2>
            <div className="form-group">
              <label>Firm Name</label>
              <input value={firmName} onChange={(e) => setFirmName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Tagline</label>
              <input value={firmTagline} onChange={(e) => setFirmTagline(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={firmPhone} onChange={(e) => setFirmPhone(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input value={firmEmail} onChange={(e) => setFirmEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input value={firmAddress} onChange={(e) => setFirmAddress(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Hours</label>
              <input value={firmHours} onChange={(e) => setFirmHours(e.target.value)} required />
            </div>

            <h2 className="admin-form-section-title">Hero Headlines (3 slides)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Slide 1 — Primary</label>
                <input value={headline1Primary} onChange={(e) => setHeadline1Primary(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Slide 1 — Accent</label>
                <input value={headline1Accent} onChange={(e) => setHeadline1Accent(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Slide 2 — Primary</label>
                <input value={headline2Primary} onChange={(e) => setHeadline2Primary(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Slide 2 — Accent</label>
                <input value={headline2Accent} onChange={(e) => setHeadline2Accent(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Slide 3 — Primary</label>
                <input value={headline3Primary} onChange={(e) => setHeadline3Primary(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Slide 3 — Accent</label>
                <input value={headline3Accent} onChange={(e) => setHeadline3Accent(e.target.value)} />
              </div>
            </div>

            <h2 className="admin-form-section-title">Hero Trust Pillars</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Pillar 1 Label</label>
                <input value={pillar1Label} onChange={(e) => setPillar1Label(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Pillar 2 Label</label>
                <input value={pillar2Label} onChange={(e) => setPillar2Label(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Pillar 3 Label</label>
                <input value={pillar3Label} onChange={(e) => setPillar3Label(e.target.value)} />
              </div>
            </div>

            <h2 className="admin-form-section-title">About Preview Section</h2>
            {imgField('About Image (appears on the left)', aboutImage, setAboutImage)}
            <div className="form-group">
              <label>Label</label>
              <input value={aboutLabel} onChange={(e) => setAboutLabel(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Title</label>
              <input value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Excerpt</label>
              <textarea rows={4} value={aboutExcerpt} onChange={(e) => setAboutExcerpt(e.target.value)} />
            </div>

            <h2 className="admin-form-section-title">Highlights (6 items)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Excellent Legal Services', val: highlight1, set: setHighlight1 },
                { label: 'Expert Attorneys', val: highlight2, set: setHighlight2 },
                { label: 'Superb Success Rate', val: highlight3, set: setHighlight3 },
                { label: 'Highly Recommend', val: highlight4, set: setHighlight4 },
                { label: 'Truly Result Oriented', val: highlight5, set: setHighlight5 },
                { label: 'Highly Knowledgeable', val: highlight6, set: setHighlight6 },
              ].map((h) => (
                <div className="form-group" key={h.label}>
                  <label>{h.label}</label>
                  <input value={h.val} onChange={(e) => h.set(e.target.value)} />
                </div>
              ))}
            </div>

            <h2 className="admin-form-section-title">Why Choose Us — Reasons</h2>
            {[
              { title: reason1Title, setTitle: setReason1Title, text: reason1Text, setText: setReason1Text, num: 1 },
              { title: reason2Title, setTitle: setReason2Title, text: reason2Text, setText: setReason2Text, num: 2 },
              { title: reason3Title, setTitle: setReason3Title, text: reason3Text, setText: setReason3Text, num: 3 },
              { title: reason4Title, setTitle: setReason4Title, text: reason4Text, setText: setReason4Text, num: 4 },
              { title: reason5Title, setTitle: setReason5Title, text: reason5Text, setText: setReason5Text, num: 5 },
            ].map((r) => (
              <div key={r.num} style={{ marginBottom: 20, padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
                <p style={{ fontWeight: 600, marginBottom: 8 }}>Reason {r.num}</p>
                <div className="form-group">
                  <label>Title</label>
                  <input value={r.title} onChange={(e) => r.setTitle(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Text</label>
                  <textarea rows={2} value={r.text} onChange={(e) => r.setText(e.target.value)} />
                </div>
              </div>
            ))}

            <h2 className="admin-form-section-title">Our Values (Built on Trust section)</h2>
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