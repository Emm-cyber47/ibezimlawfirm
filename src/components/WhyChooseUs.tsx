import { whyChooseUs } from '../data/site'
import './WhyChooseUs.css'

type ReasonIcon = (typeof whyChooseUs.reasons)[number]['icon']

function ReasonIconSvg({ type }: { type: ReasonIcon }) {
  const props = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    'aria-hidden': true as const,
  }

  switch (type) {
    case 'accessible':
      return (
        <svg {...props}>
          <path d="M5 12h14M12 5v14" strokeLinecap="round" />
          <circle cx="12" cy="8" r="2.5" />
          <path d="M7 20v-1a5 5 0 0 1 10 0v1" strokeLinecap="round" />
        </svg>
      )
    case 'personable':
      return (
        <svg {...props}>
          <path d="M5 8h14v8H9l-4 4V8z" strokeLinejoin="round" />
          <path d="M8 11h8M8 14h5" strokeLinecap="round" />
        </svg>
      )
    case 'experience':
      return (
        <svg {...props}>
          <path d="M4 10l8-5 8 5v9H4z" strokeLinejoin="round" />
          <path d="M9 19v-5h6v5M12 5v2" strokeLinecap="round" />
        </svg>
      )
    case 'communication':
      return (
        <svg {...props}>
          <path d="M12 3l2.2 4.5 5 .7-3.6 3.5.9 5L12 14.8 7.5 16.7l.9-5L4.8 8.2l5-.7L12 3z" strokeLinejoin="round" />
        </svg>
      )
    case 'results':
      return (
        <svg {...props}>
          <path d="M8 11a4 4 0 1 1 8 0M6 20v-1a6 6 0 0 1 12 0v1" strokeLinecap="round" />
          <path d="M12 11v3M10.5 13.5h3" strokeLinecap="round" />
        </svg>
      )
    default:
      return null
  }
}

export default function WhyChooseUs() {
  const { eyebrow, title, reasons } = whyChooseUs

  return (
    <section className="why-choose" aria-labelledby="why-choose-title">
      <div className="why-choose-bg" aria-hidden="true" />
      <div className="container why-choose-inner">
        <header className="why-choose-header">
          <span className="why-choose-eyebrow">{eyebrow}</span>
          <h2 id="why-choose-title" className="why-choose-title">
            {title}
          </h2>
          <span className="why-choose-header-rule" aria-hidden="true" />
        </header>

        <div className="why-choose-grid">
          {reasons.map((reason, index) => (
            <article
              key={reason.title}
              className="luxe-card why-choose-card"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <span className="luxe-card-shine" aria-hidden />
              <span className="why-choose-card-num luxe-card-num" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="why-choose-card-icon">
                <ReasonIconSvg type={reason.icon} />
              </span>
              <div className="luxe-card-inner">
                <h3 className="why-choose-card-title luxe-card-title">{reason.title}</h3>
                <p className="why-choose-card-text luxe-card-text">{reason.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
