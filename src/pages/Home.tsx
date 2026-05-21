import { Link } from 'react-router-dom'
import HeroHeadlineCarousel from '../components/HeroHeadlineCarousel.tsx'
import HeroTrustBar from '../components/HeroTrustBar.tsx'
import HomeAboutSection from '../components/HomeAboutSection.tsx'
import PracticeAreaCard from '../components/PracticeAreaCard.tsx'
import LuxeCard from '../components/LuxeCard.tsx'
import LuxeCardIcon from '../components/LuxeCardIcon.tsx'
import WhyChooseUs from '../components/WhyChooseUs.tsx'
import { firm, practiceAreas, values } from '../data/site'
import attorneyPortrait from '../ibezim.jpg'
import courthouseImg from '../courthouse.jpg'
import './pages.css'

export default function Home() {
  return (
    <>
      <section className="page-hero hero-home">
        <HeroTrustBar />
        <div className="hero-home-split">
          <div className="hero-home-media">
            <img
              className="hero-home-image"
              src={courthouseImg}
              alt=""
              fetchPriority="high"
              decoding="async"
            />
            <div className="hero-home-media-overlay" aria-hidden="true" />
            <div className="hero-home-content">
              <span className="hero-home-rule" aria-hidden="true" />
              <span className="section-label">{firm.tagline}</span>
              <HeroHeadlineCarousel />
              <span className="hero-home-rule hero-home-rule--short" aria-hidden="true" />
              <p className="section-lead">
                {firm.name} serves individuals and businesses across the US with integrity,
                rigor, and a client-first approach to every matter.
              </p>
              <div className="hero-actions">
                <Link to="/contact" className="btn btn-primary hero-home-cta">
                  Schedule a Consultation
                </Link>
                <Link to="/services" className="btn btn-outline hero-home-cta-secondary">
                  Our Practice Areas
                </Link>
              </div>
            </div>
          </div>

          <figure className="hero-home-portrait">
            <img
              src={attorneyPortrait}
              alt="Sebastian O. Ibezim, founding attorney"
            />
            <span className="hero-home-portrait-accent" aria-hidden="true" />
          </figure>
        </div>
        <span className="hero-home-bottom-bar" aria-hidden="true" />
      </section>

      <HomeAboutSection />

      <section className="section section--practice-areas">
        <div className="container">
          <span className="section-label">What We Do</span>
          <h2 className="section-title">Practice Areas</h2>
          <p className="section-lead" style={{ marginBottom: '2.5rem' }}>
            Comprehensive legal services tailored to your personal and business needs.
          </p>
          <div className="practice-grid">
            {practiceAreas.slice(0, 3).map(({ title, description, imageKey }) => (
              <PracticeAreaCard
                key={title}
                title={title}
                description={description}
                imageKey={imageKey}
              />
            ))}
          </div>
          <p style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link to="/services" className="btn btn-navy">
              View All Practice Areas
            </Link>
          </p>
        </div>
      </section>

      <WhyChooseUs />

      <section className="section" style={{ background: 'var(--color-white)' }}>
        <div className="container">
          <span className="section-label">Our Approach</span>
          <h2 className="section-title">Built on Trust</h2>
          <div className="values-grid" style={{ marginTop: '2rem' }}>
            {values.map(({ title, text, icon }, index) => (
              <LuxeCard
                key={title}
                className="value-item"
                icon={<LuxeCardIcon type={icon} />}
                num={String(index + 1).padStart(2, '0')}
              >
                <h3 className="luxe-card-title">{title}</h3>
                <p className="luxe-card-text">{text}</p>
              </LuxeCard>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-band">
        <div className="container">
          <h2 className="section-title">Ready to discuss your matter?</h2>
          <p className="section-lead">
            Contact our office for a confidential consultation with an experienced attorney.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  )
}
