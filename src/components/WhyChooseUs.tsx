import { whyChooseUs as staticWhyChooseUs } from '../data/site'
import LuxeCard from './LuxeCard'
import './WhyChooseUs.css'

type ReasonEntry = {
  title: string
  text: string
  icon: string
}

type Props = {
  reasons?: ReasonEntry[]
}

function ReasonIcon({ icon }: { icon: string }) {
  const p = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    'aria-hidden': true as const,
  }

  if (icon === 'accessible')
    return (
      <svg {...p}>
        <circle cx="12" cy="7" r="3" />
        <path d="M6 20v-1.5a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4V20" strokeLinecap="round" />
        <path d="M9 11h6M12 8v6" strokeLinecap="round" />
      </svg>
    )
  if (icon === 'experience')
    return (
      <svg {...p}>
        <path d="M3 12h4l2-3 3 3 3-3 2 3h4" strokeLinejoin="round" />
        <path d="M4 16h16" strokeLinecap="round" />
        <circle cx="12" cy="6" r="2" />
      </svg>
    )
  if (icon === 'personable')
    return (
      <svg {...p}>
        <circle cx="12" cy="7" r="3" />
        <path d="M6 20v-1.5a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4V20" strokeLinecap="round" />
        <path d="M9 13l3-2 3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  if (icon === 'communication')
    return (
      <svg {...p}>
        <path d="M4 21v-4a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4" strokeLinejoin="round" />
        <circle cx="12" cy="7" r="4" />
        <path d="M10 16l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  return (
    <svg {...p}>
      <path d="M5 20h14l-1.5-3H6.5L5 20z" strokeLinejoin="round" />
      <path d="M8 17V9h8v8M10 9V6.5A2 2 0 0 1 12 4.5h0a2 2 0 0 1 2 2V9" strokeLinecap="round" />
      <path d="M6 9h12" strokeLinecap="round" />
    </svg>
  )
}

export default function WhyChooseUs({
  reasons = staticWhyChooseUs.reasons as unknown as ReasonEntry[],
}: Props) {
  const topRow = reasons.slice(0, 3)
  const bottomRow = reasons.slice(3, 5)

  return (
    <section className="why-choose">
      <div className="why-choose-bg" />
      <div className="why-choose-inner">
        <div className="why-choose-header">
          <span className="why-choose-eyebrow">{staticWhyChooseUs.eyebrow}</span>
          <h2 className="why-choose-title">{staticWhyChooseUs.title}</h2>
        </div>

        <div className="why-choose-grid--pyramid">
          <div className="why-choose-row">
            {topRow.map((reason, i) => (
              <LuxeCard
                key={reason.title + i}
                className="why-choose-card"
                icon={<ReasonIcon icon={reason.icon} />}
                num={String(i + 1).padStart(2, '0')}
              >
                <div className="why-choose-card-body">
                  <div className="why-choose-card-head">
                    <h3 className="why-choose-card-title">{reason.title}</h3>
                  </div>
                  <p className="why-choose-card-text">{reason.text}</p>
                </div>
              </LuxeCard>
            ))}
          </div>

          <div className="why-choose-row why-choose-row--bottom">
            {bottomRow.map((reason, i) => (
              <LuxeCard
                key={reason.title + i}
                className="why-choose-card"
                icon={<ReasonIcon icon={reason.icon} />}
                num={String(i + 4).padStart(2, '0')}
              >
                <div className="why-choose-card-body">
                  <div className="why-choose-card-head">
                    <h3 className="why-choose-card-title">{reason.title}</h3>
                  </div>
                  <p className="why-choose-card-text">{reason.text}</p>
                </div>
              </LuxeCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
