import { Link } from 'react-router-dom'
import { firm, heroTrustPillars } from '../data/site'
import './HeroTrustBar.css'

const phoneHref = `tel:+${firm.phone.replace(/\D/g, '')}`

function PillarIcon({ type }: { type: (typeof heroTrustPillars)[number]['icon'] }) {
  const props = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    'aria-hidden': true as const,
  }

  if (type === 'accessible') {
    return (
      <svg {...props}>
        <circle cx="12" cy="7" r="3" />
        <path d="M6 20v-1.5a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4V20" strokeLinecap="round" />
        <path d="M9 11h6M12 8v6" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'experienced') {
    return (
      <svg {...props}>
        <path d="M4 20V10l8-6 8 6v10" strokeLinejoin="round" />
        <path d="M9 20v-5h6v5M12 4v3" strokeLinecap="round" />
        <path d="M7 13h10" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg {...props}>
      <path d="M5 20h14l-1.5-3H6.5L5 20z" strokeLinejoin="round" />
      <path d="M8 17V9h8v8M10 9V6.5A2 2 0 0 1 12 4.5h0a2 2 0 0 1 2 2V9" strokeLinecap="round" />
      <path d="M6 9h12" strokeLinecap="round" />
    </svg>
  )
}

export default function HeroTrustBar() {
  return (
    <section className="hero-trust-bar" aria-label="Why clients choose us">
      <div className="hero-trust-pillars">
        {heroTrustPillars.map((pillar, index) => (
          <div
            key={pillar.label}
            className="hero-trust-pillar"
            style={{ animationDelay: `${index * 0.12}s` }}
          >
            <span className="hero-trust-pillar-num" aria-hidden="true">
              {pillar.num}
            </span>
            <span className="hero-trust-pillar-icon">
              <PillarIcon type={pillar.icon} />
            </span>
            <span className="hero-trust-pillar-label">{pillar.label}</span>
          </div>
        ))}
      </div>

      <Link to="/contact" className="hero-trust-consult">
        <span className="hero-trust-phone-ring" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path
              d="M5.5 4.5h3l1.5 4-2 1.2a11 11 0 0 0 5.3 5.3L14.5 13l4 1.5v3a1.5 1.5 0 0 1-1.5 1.5A14.5 14.5 0 0 1 4 6a1.5 1.5 0 0 1 1.5-1.5z"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="hero-trust-consult-copy">
          <span className="hero-trust-consult-eyebrow">Free Consultation</span>
          <span className="hero-trust-consult-phone">{firm.phone}</span>
        </span>
      </Link>
      <a href={phoneHref} className="hero-trust-phone-sr">
        Call {firm.phone}
      </a>
    </section>
  )
}
