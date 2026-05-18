import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import FormField from '../components/FormField.tsx'
import SocialLinks from '../components/SocialLinks.tsx'
import { firm, practiceAreas } from '../data/site'
import {
  hasErrors,
  validateContactForm,
  type ContactFormValues,
} from '../lib/formValidation'
import './Contact.css'

function matterValue(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const CONTACT_FIELDS: (keyof ContactFormValues)[] = [
  'name',
  'phone',
  'email',
  'matter',
  'message',
]

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

function IconPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12l5 5L20 7" />
    </svg>
  )
}

const emptyContactValues = (): ContactFormValues => ({
  name: '',
  phone: '',
  email: '',
  matter: '',
  message: '',
})

export default function Contact() {
  const [searchParams] = useSearchParams()
  const [submitted, setSubmitted] = useState(false)
  const [values, setValues] = useState<ContactFormValues>(emptyContactValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)

  const phoneHref = `tel:${firm.phone.replace(/[^\d+]/g, '')}`

  const defaultMatter = useMemo(() => {
    const area = searchParams.get('area')
    if (!area) return ''
    const match = practiceAreas.find((p) => p.title === area)
    return match ? matterValue(match.title) : ''
  }, [searchParams])

  useEffect(() => {
    if (defaultMatter) {
      setValues((v) => ({ ...v, matter: defaultMatter }))
    }
  }, [defaultMatter])

  function showError(field: keyof ContactFormValues) {
    return (attemptedSubmit || touched[field]) && Boolean(errors[field])
  }

  function updateField<K extends keyof ContactFormValues>(field: K, value: string) {
    setValues((prev) => {
      const next = { ...prev, [field]: value }
      if (attemptedSubmit || touched[field]) {
        setErrors(validateContactForm(next))
      }
      return next
    })
  }

  function handleBlur(field: keyof ContactFormValues) {
    setTouched((t) => ({ ...t, [field]: true }))
    setValues((prev) => {
      setErrors(validateContactForm(prev))
      return prev
    })
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setAttemptedSubmit(true)
    setTouched(CONTACT_FIELDS.reduce((acc, key) => ({ ...acc, [key]: true }), {}))

    setValues((prev) => {
      const nextErrors = validateContactForm(prev)
      setErrors(nextErrors)

      if (hasErrors(nextErrors)) {
        const firstInvalid = CONTACT_FIELDS.find((field) => nextErrors[field])
        if (firstInvalid) {
          queueMicrotask(() => document.getElementById(firstInvalid)?.focus())
        }
      } else {
        setSubmitted(true)
        queueMicrotask(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
      }
      return prev
    })
  }

  return (
    <>
      <section className="page-hero contact-hero">
        <div className="container">
          <span className="section-label">Contact Us</span>
          <h1 className="section-title">Schedule your confidential consultation</h1>
          <p className="section-lead">
            Tell us about your matter below—we respond within one business day. Prefer to call?
            Our team is ready to help.
          </p>
          <div className="contact-hero-actions">
            <a href={phoneHref} className="contact-hero-link">
              <IconPhone />
              {firm.phone}
            </a>
            <a href={`mailto:${firm.email}`} className="contact-hero-link">
              <IconMail />
              {firm.email}
            </a>
          </div>
        </div>
      </section>

      <section className="contact-main">
        <div className="container contact-layout">
          <div className="contact-form-panel">
            {submitted ? (
              <div className="contact-success">
                <div className="contact-success-icon">
                  <IconCheck />
                </div>
                <h3>Thank you for reaching out</h3>
                <p>
                  Your message has been received. A member of our team will contact you shortly.
                  For urgent matters, please call our office directly.
                </p>
                <a href={phoneHref} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                  Call {firm.phone}
                </a>
              </div>
            ) : (
              <>
                <header className="contact-form-header">
                  <h2>Request a consultation</h2>
                  <p>
                    Complete the form below—most clients finish in under two minutes. All
                    information is kept strictly confidential.
                  </p>
                </header>
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  {attemptedSubmit && hasErrors(errors) && (
                    <p className="form-summary-error" role="alert">
                      Please correct the highlighted fields before sending your message.
                    </p>
                  )}
                  <div className="contact-form-row">
                    <FormField
                      id="name"
                      label="Full name"
                      error={errors.name}
                      showError={showError('name')}
                    >
                      {(aria) => (
                        <input
                          {...aria}
                          name="name"
                          type="text"
                          autoComplete="name"
                          placeholder="Your full name"
                          value={values.name}
                          onChange={(e) => updateField('name', e.target.value)}
                          onBlur={() => handleBlur('name')}
                        />
                      )}
                    </FormField>
                    <FormField
                      id="phone"
                      label="Phone"
                      error={errors.phone}
                      showError={showError('phone')}
                    >
                      {(aria) => (
                        <input
                          {...aria}
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="(973) 555-0100"
                          value={values.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          onBlur={() => handleBlur('phone')}
                        />
                      )}
                    </FormField>
                  </div>
                  <FormField
                    id="email"
                    label="Email address"
                    error={errors.email}
                    showError={showError('email')}
                  >
                    {(aria) => (
                      <input
                        {...aria}
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@email.com"
                        value={values.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                      />
                    )}
                  </FormField>
                  <FormField
                    id="matter"
                    label="Type of matter"
                    error={errors.matter}
                    showError={showError('matter')}
                  >
                    {(aria) => (
                      <select
                        {...aria}
                        name="matter"
                        value={values.matter}
                        onChange={(e) => updateField('matter', e.target.value)}
                        onBlur={() => handleBlur('matter')}
                      >
                        <option value="" disabled>
                          Select your area of concern
                        </option>
                        {practiceAreas.map(({ title }) => (
                          <option key={title} value={matterValue(title)}>
                            {title}
                          </option>
                        ))}
                        <option value="other">Other</option>
                      </select>
                    )}
                  </FormField>
                  <FormField
                    id="message"
                    label="Brief description"
                    error={errors.message}
                    showError={showError('message')}
                  >
                    {(aria) => (
                      <textarea
                        {...aria}
                        name="message"
                        placeholder="Share a few details about your situation so we can prepare for your consultation..."
                        value={values.message}
                        onChange={(e) => updateField('message', e.target.value)}
                        onBlur={() => handleBlur('message')}
                      />
                    )}
                  </FormField>
                  <button type="submit" className="btn btn-primary contact-submit">
                    Send message
                  </button>
                  <p className="form-note">
                    Submitting this form does not create an attorney-client relationship.
                    Please do not include confidential information until we confirm representation.
                  </p>
                </form>
              </>
            )}
          </div>

          <aside className="contact-aside" aria-label="Office information">
            <div className="contact-social-card">
              <h3>Connect with us</h3>
              <p>Follow {firm.name} for updates, legal insights, and firm news.</p>
              <SocialLinks variant="contact" />
            </div>
            <div className="contact-trust">
              <h3>What to expect</h3>
              <ul>
                <li>Response within one business day</li>
                <li>Confidential review of your matter</li>
                <li>Clear guidance on next steps</li>
                <li>No obligation after initial consultation</li>
              </ul>
            </div>
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <IconPhone />
              </div>
              <div className="contact-info-body">
                <h3>Call us</h3>
                <a href={phoneHref}>{firm.phone}</a>
              </div>
            </div>
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <IconMail />
              </div>
              <div className="contact-info-body">
                <h3>Email</h3>
                <a href={`mailto:${firm.email}`}>{firm.email}</a>
              </div>
            </div>
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <IconClock />
              </div>
              <div className="contact-info-body">
                <h3>Office hours</h3>
                <p>{firm.hours}</p>
              </div>
            </div>
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <IconPin />
              </div>
              <div className="contact-info-body">
                <h3>Visit us</h3>
                <p>{firm.address}</p>
                <a
                  href={firm.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-block', marginTop: '0.375rem' }}
                >
                  Get directions →
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="contact-map-section" aria-label="Office location map">
        <div className="contact-map-wrap">
          <iframe
            title={`${firm.name} office location`}
            src={firm.mapsEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="contact-map-overlay">
            <h3>{firm.name}</h3>
            <p>{firm.address}</p>
            <a
              href={firm.directionsUrl}
              className="btn btn-navy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
