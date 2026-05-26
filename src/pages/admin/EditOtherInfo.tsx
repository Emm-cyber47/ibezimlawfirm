import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { firm as staticFirm, socialLinks as staticSocialLinks } from '../../data/site'
import './admin.css'

type OtherInfoData = {
  phone: string
  fax: string
  email: string
  secondEmail: string
  address: string
  socialLinks: {
    facebook: string
    instagram: string
    tiktok: string
    linkedin: string
  }
}

export default function EditOtherInfo() {
  const [data, setData] = useState<OtherInfoData>({
    phone: staticFirm.phone,
    fax: '973-474-1005',
    email: staticFirm.email,
    secondEmail: 'Receptionist@ibezimlaw.com',
    address: staticFirm.address,
    socialLinks: {
      facebook: staticSocialLinks.facebook,
      instagram: staticSocialLinks.instagram,
      tiktok: staticSocialLinks.tiktok,
      linkedin: staticSocialLinks.linkedin,
    },
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: result } = await supabase
        .from('site_content')
        .select('data')
        .eq('key', 'otherInfo')
        .single()

      if (result?.data) {
        setData((prev) => ({ ...prev, ...result.data }))
      }
    } catch (error) {
      console.error('Error loading other info:', error)
    }
  }

  const handleChange = (field: keyof OtherInfoData, value: string) => {
    if (field === 'socialLinks') {
      return
    }
    setData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSocialChange = (platform: keyof OtherInfoData['socialLinks'], value: string) => {
    setData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.from('site_content').upsert(
        {
          key: 'otherInfo',
          data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      )

      if (error) throw error
      setMessage('✅ Saved successfully')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('❌ Error saving: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="page-hero admin-hero">
        <div className="container">
          <h1 className="section-title">Other Info</h1>
          <p className="section-lead">Edit contact details and social media links</p>
        </div>
      </section>

      <section className="section admin-body">
        <div className="container">
          <div className="admin-form-card">
            <h2 className="admin-section-title">Contact Information</h2>

            <div className="admin-form-group">
              <label className="admin-label">Phone</label>
              <input
                type="tel"
                className="admin-input"
                value={data.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="e.g., +1 (973) 351-5800"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Fax</label>
              <input
                type="tel"
                className="admin-input"
                value={data.fax}
                onChange={(e) => handleChange('fax', e.target.value)}
                placeholder="e.g., 973-474-1005"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Primary Email</label>
              <input
                type="email"
                className="admin-input"
                value={data.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="e.g., sebastian@ibezimlaw.com"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Secondary Email (Receptionist)</label>
              <input
                type="email"
                className="admin-input"
                value={data.secondEmail}
                onChange={(e) => handleChange('secondEmail', e.target.value)}
                placeholder="e.g., Receptionist@ibezimlaw.com"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Office Address</label>
              <textarea
                className="admin-textarea"
                value={data.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Full office address"
                rows={3}
              />
            </div>

            <h2 className="admin-section-title" style={{ marginTop: '2rem' }}>
              Social Media Links
            </h2>

            <div className="admin-form-group">
              <label className="admin-label">Facebook URL</label>
              <input
                type="url"
                className="admin-input"
                value={data.socialLinks.facebook}
                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                placeholder="https://facebook.com/..."
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Instagram URL</label>
              <input
                type="url"
                className="admin-input"
                value={data.socialLinks.instagram}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">TikTok URL</label>
              <input
                type="url"
                className="admin-input"
                value={data.socialLinks.tiktok}
                onChange={(e) => handleSocialChange('tiktok', e.target.value)}
                placeholder="https://tiktok.com/@..."
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">LinkedIn URL</label>
              <input
                type="url"
                className="admin-input"
                value={data.socialLinks.linkedin}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            {message && <p className="admin-message">{message}</p>}

            <button
              onClick={handleSave}
              disabled={loading}
              className="btn btn-primary"
              style={{ marginTop: '1.5rem' }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}