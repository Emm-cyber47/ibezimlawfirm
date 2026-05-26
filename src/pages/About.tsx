import { Link } from 'react-router-dom'
import LuxeCard from '../components/LuxeCard.tsx'
import LuxeCardIcon from '../components/LuxeCardIcon.tsx'
import { useSiteContent } from '../hooks/useSiteContent'
import { aboutPage as staticAboutPage, firm, values as staticValues } from '../data/site'
import officeImgFallback from '../office.jpg'
import receptionImgFallback from '../reception.jpg'
import doorImgFallback from '../door.jpg'
import outdoorFallback from '../officeoutdoor.jpeg'
import thelawImgFallback from '../thelaw.jpg'
import ibezimImgFallback from '../ibezim.jpg'
import './About.css'

const fallbackGallery = [
  { src: officeImgFallback, alt: 'Attorney reviewing legal materials at Ibezim Law Offices' },
  { src: receptionImgFallback, alt: 'Professional consultation at Ibezim Law Offices' },
  { src: thelawImgFallback, alt: 'Legal counsel and advocacy at Ibezim Law Offices' },
  { src: ibezimImgFallback, alt: 'Sebastian O. Ibezim, founding attorney' },
]

const fallbackStoryGallery = [
  { src: officeImgFallback, alt: 'Law library and conference area', caption: 'Our consultation suite' },
  { src: receptionImgFallback, alt: 'Reception area welcoming clients', caption: 'Client reception' },
  { src: doorImgFallback, alt: 'Entrance to Ibezim Law Offices', caption: 'Office entrance' },
  { src: outdoorFallback, alt: 'Building exterior in Irvington', caption: 'Irvington, New Jersey' },
]

export default function About() {
  const data = useSiteContent<any>('aboutContent', {})

  const aboutPage = data.aboutPage ?? staticAboutPage
  const { label, title, paragraphs, featuredPracticeAreas } = aboutPage

  const aboutGallery = data.aboutGallery?.length
    ? data.aboutGallery.map((src: string, i: number) => ({
        src,
        alt: fallbackGallery[i]?.alt ?? `About image ${i + 1}`,
      }))
    : fallbackGallery

  const whoWeAre = data.whoWeAre ?? {}
  const storyGallery = data.storyGallery?.length
    ? data.storyGallery.map((src: string, i: number) => ({
        src,
        alt: fallbackStoryGallery[i]?.alt ?? `Story image ${i + 1}`,
        caption: fallbackStoryGallery[i]?.caption ?? '',
      }))
    : fallbackStoryGallery

  const values = data.values?.length ? data.values : staticValues
  const heroImage = data.heroImage || officeImgFallback

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
            <img src={heroImage} alt="Ibezim Law Offices interior" className="about-hero-image" />
          </figure>
        </div>
      </section>

      <section className="about-page">
        <div className="container about-page-grid">
          <div className="about-page-gallery" aria-label="Ibezim Law Offices gallery">
            {aboutGallery.map(({ src, alt }: { src: string; alt: string }) => (
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

            {paragraphs.map((text: string) => (
              <p key={text.slice(0, 24)} className="about-page-text">
                {text}
              </p>
            ))}

            <ul className="about-page-areas">
              {featuredPracticeAreas.map((area: string) => (
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
            <span className="section-label">{whoWeAre.label ?? 'Who we are'}</span>
            <h2 className="section-title">{whoWeAre.title ?? 'Dedicated advocacy, personal attention'}</h2>
            {(whoWeAre.paragraphs ?? [
              'Founded on the belief that every client deserves attentive, principled representation, our firm combines deep local expertise with a modern approach to legal service.',
              'From personal injury and immigration to workers\u2019 compensation, real estate, and family matters\u2014we prepare thoroughly, communicate clearly, and advocate fiercely on your behalf.',
            ]).map((text: string) => (
              <p key={text.slice(0, 24)}>{text}</p>
            ))}
          </div>
          <div className="about-gallery">
            {storyGallery.map(({ src, alt, caption }: { src: string; alt: string; caption: string }) => (
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
            {values.map((v: { title: string; text: string; icon: string }, index: number) => (
              <LuxeCard
                key={v.title}
                className="about-value-card"
                icon={<LuxeCardIcon type={v.icon as any} />}
                num={String(index + 1).padStart(2, '0')}
              >
                <h3 className="luxe-card-title">{v.title}</h3>
                <p className="luxe-card-text">{v.text}</p>
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