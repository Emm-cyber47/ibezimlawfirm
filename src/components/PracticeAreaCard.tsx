import { Link } from 'react-router-dom'
import type { PracticeAreaImageKey } from '../lib/practiceAreaImages'
import { getPracticeAreaImage } from '../lib/practiceAreaImages'
import './PracticeAreaCard.css'

type PracticeAreaCardProps = {
  title: string
  description: string
  imageKey: string
}

export default function PracticeAreaCard({ title, description, imageKey }: PracticeAreaCardProps) {
  // If imageKey is a URL (starts with http), use it directly.
  // Otherwise resolve it from the local static image map.
  const image = imageKey.startsWith('http')
    ? imageKey
    : getPracticeAreaImage(imageKey as PracticeAreaImageKey)

  const contactHref = `/contact?area=${encodeURIComponent(title)}`

  return (
    <Link to={contactHref} className="practice-card">
      <div
        className="practice-card-bg"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden="true"
      />
      <div className="practice-card-overlay" aria-hidden="true" />
      <div className="practice-card-shine" aria-hidden="true" />
      <div className="practice-card-body">
        <h3>{title}</h3>
        <p>{description}</p>
        <span className="practice-card-cta">
          Discuss your matter
          <span className="practice-card-cta-arrow" aria-hidden="true">
            →
          </span>
        </span>
      </div>
    </Link>
  )
}