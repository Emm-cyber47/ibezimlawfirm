import { useCallback, useEffect, useState } from 'react'
import { heroHeadlines } from '../data/site'
import './HeroHeadlineCarousel.css'

const ROTATE_MS = 2800

export default function HeroHeadlineCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((next: number) => {
    setIndex(((next % heroHeadlines.length) + heroHeadlines.length) % heroHeadlines.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % heroHeadlines.length)
    }, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [paused])

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
          {heroHeadlines.map((line, i) => (
            <span
              key={line.primary}
              className={`hero-headline-slide${i === index ? ' hero-headline-slide--active' : ''}`}
              aria-hidden={i !== index}
            >
              {line.primary} <em>{line.accent}</em>
            </span>
          ))}
        </span>
      </h1>

      <div className="hero-headline-carousel-dots" role="tablist" aria-label="Hero messages">
        {heroHeadlines.map((line, i) => (
          <button
            key={line.primary}
            type="button"
            role="tab"
            className={`hero-headline-dot${i === index ? ' hero-headline-dot--active' : ''}`}
            aria-selected={i === index}
            aria-label={`Message ${i + 1} of ${heroHeadlines.length}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  )
}
