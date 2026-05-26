import { Link } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner.tsx'
import PracticeAreaCard from '../components/PracticeAreaCard.tsx'
import { useSiteContent } from '../hooks/useSiteContent'
import { practiceAreas as staticPracticeAreas } from '../data/site'
import './pages.css'

type AreaEntry = {
  title: string
  description: string
  imageKey: string
  icon: string
}

export default function Services() {
  const { content: areas, loading } = useSiteContent<AreaEntry[]>('practiceAreas', staticPracticeAreas as unknown as AreaEntry[])

  if (loading) {
    return <LoadingSpinner message="Loading practice areas..." />
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="section-label">Practice Areas</span>
          <h1 className="section-title">Legal services that protect what matters</h1>
          <p className="section-lead">
            Focused expertise across key areas of New Jersey law for individuals,
            families, and businesses.
          </p>
        </div>
      </section>

      <section className="section section--practice-areas">
        <div className="container">
          {areas.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999' }}>Practice areas coming soon.</p>
          ) : (
            <div className="practice-grid">
              {areas.map(({ title, description, imageKey }) => (
                <PracticeAreaCard
                  key={title}
                  title={title}
                  description={description}
                  imageKey={imageKey}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section cta-band">
        <div className="container">
          <h2 className="section-title">Not sure where to start?</h2>
          <p className="section-lead">
            Tell us about your situation and we will connect you with the right attorney.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Request a Consultation
          </Link>
        </div>
      </section>
    </>
  )
}
