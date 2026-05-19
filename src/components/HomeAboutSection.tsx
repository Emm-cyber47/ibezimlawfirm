import { Link } from 'react-router-dom'
import { homeAboutSection } from '../data/site'
import thelawImg from '../thelaw.jpg'
import './HomeAboutSection.css'

type HighlightIcon = (typeof homeAboutSection.highlights)[number]['icon']

function HighlightIconSvg({ type }: { type: HighlightIcon }) {
  const props = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    'aria-hidden': true as const,
  }

  switch (type) {
    case 'justice':
      return (
        <svg {...props}>
          <path d="M12 3v18M8 7h8M6 10l6 4 6-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="7" cy="7" r="2" />
          <circle cx="17" cy="7" r="2" />
        </svg>
      )
    case 'attorney':
      return (
        <svg {...props}>
          <circle cx="12" cy="7" r="3" />
          <path d="M6 20v-1.5a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4V20" strokeLinecap="round" />
          <path d="M9 12h6" strokeLinecap="round" />
        </svg>
      )
    case 'gavel':
      return (
        <svg {...props}>
          <path d="M5 20h14l-1.5-3H6.5L5 20z" strokeLinejoin="round" />
          <path d="M8 17V9h8v8M10 9V6.5A2 2 0 0 1 12 4.5h0a2 2 0 0 1 2 2V9" strokeLinecap="round" />
        </svg>
      )
    case 'recommend':
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5" strokeLinecap="round" />
          <path d="M16 8.5l1.5 1.5L20 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'results':
      return (
        <svg {...props}>
          <path d="M6 4h12v14H6z" strokeLinejoin="round" />
          <path d="M9 8h6M9 12h4" strokeLinecap="round" />
          <circle cx="15" cy="15" r="2.5" />
          <path d="M16.5 16.5 18 18" strokeLinecap="round" />
        </svg>
      )
    case 'education':
      return (
        <svg {...props}>
          <path d="M4 10 12 6l8 4-8 4-8-4z" strokeLinejoin="round" />
          <path d="M6 11.5V16c0 1.5 2.5 3 6 3s6-1.5 6-3v-4.5" strokeLinecap="round" />
          <path d="M20 10v6" strokeLinecap="round" />
        </svg>
      )
    default:
      return null
  }
}

export default function HomeAboutSection() {
  const { label, title, excerpt, highlights } = homeAboutSection

  return (
    <section className="home-about" aria-labelledby="home-about-title">
      <div className="home-about-grid">
        <figure className="home-about-media">
          <img
            src={thelawImg}
            alt="Attorney at Ibezim Law Offices — professional legal representation"
            className="home-about-image"
            width={640}
            height={800}
            loading="lazy"
          />
          <span className="home-about-media-accent" aria-hidden="true" />
        </figure>

        <div className="home-about-content">
          <span className="section-label home-about-label">{label}</span>
          <h2 id="home-about-title" className="home-about-title">
            {title}
          </h2>
          <p className="home-about-excerpt">{excerpt}</p>
          <Link to="/about" className="home-about-read-more">
            Read More
          </Link>

          <ul className="home-about-highlights">
            {highlights.map((item) => (
              <li key={item.label} className="home-about-highlight">
                <span className="home-about-highlight-icon">
                  <HighlightIconSvg type={item.icon} />
                </span>
                <span className="home-about-highlight-label">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
