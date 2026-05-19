import { Link } from 'react-router-dom'
import { attorney, firm } from '../data/site'
import attorneyPhoto from '../ibezim.jpg'
import './Attorney.css'

export default function Attorney() {
  const phoneHref = `tel:${firm.phone.replace(/[^\d+]/g, '')}`

  return (
    <>
      <section className="page-hero attorney-hero">
        <div className="container attorney-hero-grid">
          <div className="attorney-photo-wrap">
            <img
              src={attorneyPhoto}
              alt={attorney.name}
              className="attorney-photo"
              width={400}
              height={500}
            />
          </div>
          <div className="attorney-hero-text">
            <span className="section-label">Attorney details</span>
            <h1 className="section-title">{attorney.name}</h1>
            <p className="attorney-title">{attorney.title}</p>
            <p className="attorney-subtitle">{attorney.subtitle}</p>
            <div className="attorney-hero-actions">
              <Link to="/contact" className="btn btn-primary">
                Schedule a consultation
              </Link>
              <a href={phoneHref} className="btn btn-outline">
                {firm.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section attorney-bio-section">
        <div className="container attorney-bio-grid">
          <div className="attorney-bio-main">
            <span className="section-label">Biography</span>
            <h2 className="section-title">About Sebastian O. Ibezim</h2>
            {attorney.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="attorney-bio-p">
                {paragraph}
              </p>
            ))}
          </div>
          <aside className="attorney-sidebar">
            <div className="attorney-sidebar-card luxe-card">
              <span className="luxe-card-shine" aria-hidden />
              <h3>Bar admissions</h3>
              <ul>
                {attorney.admissions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="attorney-sidebar-card luxe-card">
              <span className="luxe-card-shine" aria-hidden />
              <h3>Education</h3>
              <ul>
                {attorney.education.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="attorney-sidebar-card attorney-sidebar-card--accent luxe-card">
              <span className="luxe-card-shine" aria-hidden />
              <h3>Practice highlights</h3>
              <ul>
                {attorney.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="section cta-band">
        <div className="container">
          <h2 className="section-title">Discuss your matter with Mr. Ibezim</h2>
          <p className="section-lead">
            Contact our Irvington office for a confidential consultation.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Get in touch
          </Link>
        </div>
      </section>
    </>
  )
}
