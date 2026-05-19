type ValueIconType = 'integrity' | 'excellence' | 'client' | 'justice' | 'star' | 'chat'

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  'aria-hidden': true as const,
}

export default function LuxeCardIcon({ type }: { type: ValueIconType }) {
  switch (type) {
    case 'integrity':
      return (
        <svg {...svgProps}>
          <path d="M12 3 4 7v6c0 5 3.5 8 8 8s8-3 8-8V7l-8-4z" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'excellence':
      return (
        <svg {...svgProps}>
          <path d="M12 3l2.2 4.5 5 .7-3.6 3.5.9 5L12 14.8 7.5 16.7l.9-5L4.8 8.2l5-.7L12 3z" strokeLinejoin="round" />
        </svg>
      )
    case 'client':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M6 20c0-3.5 3-5.5 6-5.5s6 2 6 5.5" strokeLinecap="round" />
          <path d="M12 11v2M11 12h2" strokeLinecap="round" />
        </svg>
      )
    case 'justice':
      return (
        <svg {...svgProps}>
          <path d="M12 3v18M8 7h8M6 10l6 4 6-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'star':
      return (
        <svg {...svgProps}>
          <path d="M12 4l1.8 3.6 4 .6-2.9 2.8.7 4L12 13.2 8.4 15l.7-4L6.2 8.2l4-.6L12 4z" strokeLinejoin="round" />
        </svg>
      )
    case 'chat':
      return (
        <svg {...svgProps}>
          <path d="M5 8h14v9H9l-4 4V8z" strokeLinejoin="round" />
          <path d="M8 11h8M8 14h5" strokeLinecap="round" />
        </svg>
      )
    default:
      return null
  }
}
