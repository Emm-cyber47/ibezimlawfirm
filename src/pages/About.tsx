import { Link } from 'react-router-dom'
import LuxeCard from '../components/LuxeCard.tsx'
import LuxeCardIcon from '../components/LuxeCardIcon.tsx'
import { aboutPage, firm, values } from '../data/site'
import officeImg from '../office.jpg'
import receptionImg from '../reception.jpg'
import doorImg from '../door.jpg'
import outdoorImg from '../officeoutdoor.jpeg'
import thelawImg from '../thelaw.jpg'
import ibezimImg from '../ibezim.jpg'
import './About.css'

const aboutGalleryImages = [
  {
    src: officeImg,
    alt: 'Attorney reviewing legal materials at Ibezim Law Offices',
  },
  {
    src: receptionImg,
    alt: 'Professional consultation at Ibezim Law Offices',
  },
  {
    src: thelawImg,
    alt: 'Legal counsel and advocacy at Ibezim Law Offices',
  },
  {
    src: ibezimImg,
    alt: 'Sebastian O. Ibezim, founding attorney',
  },
] as const

const storyGalleryImages = [
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
  const { label, title, paragraphs, featuredPracticeAreas } = aboutPage

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

      <section className="about-page">
        <div className="container about-page-grid">
          <div className="about-page-gallery" aria-label="Ibezim Law Offices gallery">
            {aboutGalleryImages.map(({ src, alt }) => (
              <figure key={alt} className="about-page-gallery-item">
                <img src={src} alt={alt} loading="lazy" />
              </figure>
            ))}
          </div>

          <div className="about-page-content">
            <span className="about-page-watermark" aria-hidden="true">
              <svg viewBox="0 0 120 120" fill="none">
                <path
                  d="M60 8v104M20 28h80M28 36l32 20 32-20M24 100h72"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="32" cy="28" r="10" stroke="currentColor" strokeWidth="2" />
                <circle cx="88" cy="28" r="10" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>

            <span className="section-label about-page-label">{label}</span>
            <h2 className="about-page-title">{title}</h2>

            {paragraphs.map((text) => (
              <p key={text.slice(0, 24)} className="about-page-text">
                {text}
              </p>
            ))}

            <ul className="about-page-areas">
              {featuredPracticeAreas.map((area) => (
                <li key={area}>
                  <Link to="/services" className="about-page-area-link">
                    <span className="about-page-area-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
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
            {storyGalleryImages.map(({ src, alt, caption }) => (
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
            {values.map(({ title: valueTitle, text, icon }, index) => (
              <LuxeCard
                key={valueTitle}
                className="about-value-card"
                icon={<LuxeCardIcon type={icon} />}
                num={String(index + 1).padStart(2, '0')}
              >
                <h3 className="luxe-card-title">{valueTitle}</h3>
                <p className="luxe-card-text">{text}</p>
              </LuxeCard>
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
            Contact {firm.name}
          </Link>
        </div>
      </section>
    </>
  )
}
