import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { firm } from '../data/site'
import { useAuth } from '../context/AuthContext'
import FormField from '../components/FormField'
import ProfileAvatar from '../components/ProfileAvatar'
import { hasErrors, validateOptionalPhone, validatePersonName } from '../lib/formValidation'
import '../components/FormField.css'
import './Profile.css'

export default function Profile() {
  const { user, updateProfile, logout } = useAuth()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({
    firstName: user!.firstName,
    lastName: user!.lastName,
    phone: user!.phone,
  })
  const [touched, setTouched] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!editing) {
      setDraft({
        firstName: user!.firstName,
        lastName: user!.lastName,
        phone: user!.phone,
      })
      setTouched(false)
      setErrors({})
    }
  }, [user, editing])

  if (!user) return null

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setTouched(true)
    setSaveError(null)
    const next: Record<string, string> = {}
    const fn = validatePersonName(draft.firstName, 'First name')
    if (!fn.valid) next.firstName = fn.message
    const ln = validatePersonName(draft.lastName, 'Last name')
    if (!ln.valid) next.lastName = ln.message
    const ph = validateOptionalPhone(draft.phone)
    if (!ph.valid) next.phone = ph.message
    setErrors(next)
    if (hasErrors(next)) return
    setSaving(true)
    const result = await updateProfile(draft)
    setSaving(false)
    if (!result.ok) {
      setSaveError(result.error)
      return
    }
    setEditing(false)
    setTouched(false)
  }

  const emailNote =
    user.authMethod === 'google'
      ? 'This address is managed by Google. It cannot be changed here.'
      : 'Your sign-in email is fixed for this account. Contact the firm if you need to update it.'

  return (
    <>
      <section className="page-hero profile-hero">
        <div className="container profile-hero-inner">
          <span className="section-label profile-hero-label">Client portal</span>
          <h1 className="section-title profile-hero-title">Your profile</h1>
          <p className="section-lead profile-hero-lead">
            A private workspace for inquiries, documents, and messages — the same care and discretion
            you receive at {firm.name}.
          </p>
        </div>
      </section>

      <section className="section profile-body">
        <div className="container profile-shell">
          <aside className="profile-luxe-card profile-card--summary">
            <span className="profile-card-shine" aria-hidden />
            <ProfileAvatar
              firstName={user.firstName}
              lastName={user.lastName}
              email={user.email}
              avatarUrl={user.avatarUrl}
              size="lg"
            />
            <p className="profile-summary-name">
              {user.firstName} {user.lastName}
            </p>
            <p className="profile-summary-email">{user.email}</p>
            <div className="profile-chip-row">
              <span className={`profile-chip ${user.authMethod === 'google' ? 'profile-chip--google' : ''}`}>
                {user.authMethod === 'google' ? 'Google-linked' : 'Email & password'}
              </span>
            </div>

            {!editing && (
              <>
                {!user.phone.trim() ? (
                  <p className="profile-phone-muted">No phone on file · add one when you edit your profile.</p>
                ) : (
                  <a href={`tel:${user.phone.replace(/\D/g, '')}`} className="profile-phone-link">
                    {user.phone}
                  </a>
                )}

                <button type="button" className="btn btn-primary profile-edit-start" onClick={() => setEditing(true)}>
                  Edit profile
                </button>
              </>
            )}
          </aside>

          <div className="profile-luxe-card profile-card--detail">
            <span className="profile-card-shine" aria-hidden />
            {!editing ? (
              <>
                <h2 className="profile-detail-heading">Personal details</h2>
                <div className="profile-fields">
                  <div className="profile-field">
                    <span className="profile-field-label">Full name</span>
                    <p className="profile-field-value">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                  <div className="profile-field profile-field--muted">
                    <span className="profile-field-label">Email</span>
                    <p className="profile-field-value">{user.email}</p>
                  </div>
                  <div className="profile-field">
                    <span className="profile-field-label">Mobile / direct line</span>
                    <p className="profile-field-value">
                      {user.phone.trim() ? (
                        <a href={`tel:${user.phone.replace(/\D/g, '')}`} className="profile-inline-link">
                          {user.phone}
                        </a>
                      ) : (
                        <span className="profile-dd-placeholder">Not added · use Edit profile to add your number.</span>
                      )}
                    </p>
                  </div>
                </div>

                <p className="profile-footnote">{emailNote}</p>
              </>
            ) : (
              <form className="profile-edit-form" onSubmit={handleSave} noValidate>
                <div className="profile-edit-heading-row">
                  <h2 className="profile-detail-heading">Edit profile</h2>
                  <button
                    type="button"
                    className="profile-cancel"
                    onClick={() => {
                      setEditing(false)
                      setDraft({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phone: user.phone,
                      })
                      setTouched(false)
                      setErrors({})
                    }}
                  >
                    Cancel
                  </button>
                </div>

                <fieldset className="profile-fieldset-edit">
                  <legend className="visually-hidden">Name and phone</legend>
                  <div className="profile-name-grid">
                    <FormField
                      id="profile-first"
                      label="First name"
                      error={errors.firstName}
                      showError={touched}
                    >
                      {(a) => (
                        <input
                          {...a}
                          type="text"
                          className="profile-input"
                          value={draft.firstName}
                          onChange={(e) => setDraft((x) => ({ ...x, firstName: e.target.value }))}
                          autoComplete="given-name"
                        />
                      )}
                    </FormField>
                    <FormField
                      id="profile-last"
                      label="Last name"
                      error={errors.lastName}
                      showError={touched}
                    >
                      {(a) => (
                        <input
                          {...a}
                          type="text"
                          className="profile-input"
                          value={draft.lastName}
                          onChange={(e) => setDraft((x) => ({ ...x, lastName: e.target.value }))}
                          autoComplete="family-name"
                        />
                      )}
                    </FormField>
                  </div>

                  <FormField id="profile-phone" label="Phone number" error={errors.phone} showError={touched}>
                    {(a) => (
                      <input
                        {...a}
                        type="tel"
                        className="profile-input"
                        placeholder="Optional — we'll only call with your permission"
                        value={draft.phone}
                        onChange={(e) => setDraft((x) => ({ ...x, phone: e.target.value }))}
                        autoComplete="tel"
                      />
                    )}
                  </FormField>

                  <div className="profile-email-readonly">
                    <span className="profile-email-label">Email (read-only)</span>
                    <p className="profile-email-value">{user.email}</p>
                    <p className="profile-email-hint">{emailNote}</p>
                  </div>
                </fieldset>

                {saveError ? (
                  <p className="profile-save-error" role="alert">
                    {saveError}
                  </p>
                ) : null}
                <div className="profile-form-actions">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              </form>
            )}

            <div className="profile-secondary-actions">
              <Link to="/documents" className="profile-inline-link">
                My documents
              </Link>
              <span className="profile-action-sep" aria-hidden>
                ·
              </span>
              <Link to="/contact" className="profile-inline-link">
                Request a consultation
              </Link>
              <span className="profile-action-sep" aria-hidden>
                ·
              </span>
              <button type="button" className="profile-signout" onClick={() => void logout()}>
                Sign out
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
