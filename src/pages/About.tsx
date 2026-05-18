import { Link } from 'react-router-dom'
import { firm, values } from '../data/site'
import officeImg from '../office.jpg'
import receptionImg from '../reception.jpg'
import doorImg from '../door.jpg'
import outdoorImg from '../officeoutdoor.jpg'
import './About.css'

const galleryImages = [
  {
    src: officeImg,
    alt: 'Law library and conference area at Ibezim Law Offices',
    caption: 'Our consultation suite',
  },
  {
    src: receptionImg,
    alt: 'Reception area welcoming clients',
    caption: 'Client reception',
  },
  {
    src: doorImg,
    alt: 'Entrance to Ibezim Law Offices',
    caption: 'Office entrance',
  },
  {
    src: outdoorImg,
    alt: 'Ibezim Law Offices building exterior in Irvington, New Jersey',
    caption: 'Irvington, New Jersey',
  },
] as const

export default function About() {
  return (
    <>
      <section className="page-hero about-hero">
        <div className="container about-hero-grid">
          <div className="about-hero-content">
            <span className="section-label">About us</span>
            <h1 className="section-title">A firm rooted in excellence</h1>
            <p className="section-lead">
              For over two decades, {firm.name} has delivered strategic legal counsel to clients
              across New Jersey—with integrity, preparation, and a relentless focus on results.
            </p>
            <Link to="/attorney" className="btn btn-primary about-hero-cta">
              Meet our attorney
            </Link>
          </div>
          <figure className="about-hero-figure">
            <img src={officeImg} alt="Ibezim Law Offices interior" className="about-hero-image" />
          </figure>
        </div>
      </section>

      <section className="section about-story">
        <div className="container about-story-grid">
          <div className="about-story-text">
            <span className="section-label">Who we are</span>
            <h2 className="section-title">Dedicated advocacy, personal attention</h2>
            <p>
              Founded on the belief that every client deserves attentive, principled representation,
              our firm combines deep local expertise with a modern approach to legal service.
            </p>
            <p>
              From personal injury and immigration to workers&apos; compensation, real estate, and
              family matters—we prepare thoroughly, communicate clearly, and advocate fiercely on
              your behalf.
            </p>
          </div>
          <div className="about-gallery">
            {galleryImages.map(({ src, alt, caption }) => (
              <figure key={caption} className="about-gallery-item">
                <img src={src} alt={alt} loading="lazy" />
                <figcaption>{caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-values">
        <div className="container">
          <div className="about-values-header">
            <span className="section-label">Our values</span>
            <h2 className="section-title">What guides us</h2>
          </div>
          <div className="values-grid about-values-grid">
            {values.map(({ title, text }) => (
              <article key={title} className="about-value-card">
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-band">
        <div className="container">
          <h2 className="section-title">Let us advocate for you</h2>
          <p className="section-lead">
            Schedule a confidential consultation at our Irvington office today.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Contact us
          </Link>
        </div>
      </section>
    </>
  )
}
