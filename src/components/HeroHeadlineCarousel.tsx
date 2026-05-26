import { useCallback, useEffect, useState } from 'react'
import { heroHeadlines as staticHeroHeadlines } from '../data/site'
import './HeroHeadlineCarousel.css'

const ROTATE_MS = 2800

type HeadlineEntry = {
  primary: string
  accent: string
}

type Props = {
  headlines: readonly HeadlineEntry[] | HeadlineEntry[]
}

export default function HeroHeadlineCarousel({ headlines = staticHeroHeadlines as unknown as HeadlineEntry[] }: Props) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((next: number) => {
    const len = headlines.length
    setIndex(((next % len) + len) % len)
  }, [headlines.length])

  useEffect(() => {
    if (paused || headlines.length === 0) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % headlines.length)
    }, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [paused, headlines.length])

  if (headlines.length === 0) return null

  return (
    <div
      className="hero-headline-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setPaused(false)
        }
      }}
    >
      <h1 className="hero-headline-carousel-title">
        <span className="hero-headline-carousel-track" aria-live="polite">
          {headlines.map((line, i) => (
            <span
              key={line.primary + i}
              className={`hero-headline-slide${i === index ? ' hero-headline-slide--active' : ''}`}
              aria-hidden={i !== index}
            >
              {line.primary} <em>{line.accent}</em>
            </span>
          ))}
        </span>
      </h1>

      <div className="hero-headline-carousel-dots" role="tablist" aria-label="Hero messages">
        {headlines.map((line, i) => (
          <button
            key={line.primary + i}
            type="button"
            role="tab"
            className={`hero-headline-dot${i === index ? ' hero-headline-dot--active' : ''}`}
            aria-selected={i === index}
            aria-label={`Message ${i + 1} of ${headlines.length}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  )
}