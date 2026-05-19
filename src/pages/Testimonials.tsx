import { useState } from 'react'
import { Link } from 'react-router-dom'
import { firm, faqs, testimonials } from '../data/site'
import './Testimonials.css'

function StarRating({ count }: { count: number }) {
  return (
    <div className="testimonial-stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} aria-hidden>
          ★
        </span>
      ))}
    </div>
  )
}

function getInitials(name: string) {
  return name
    .replace(/\./g, '')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function FaqAccordion() {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null)

  return (
    <div className="faq-accordion">
      {faqs.map((item) => {
        const isOpen = openId === item.id
        return (
          <div key={item.id} className={`faq-item luxe-card ${isOpen ? 'faq-item--open' : ''}`}>
            <span className="luxe-card-shine" aria-hidden />
            <button
              type="button"
              className="faq-trigger"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              <span className="faq-icon" aria-hidden>
                {isOpen ? '−' : '+'}
              </span>
              <span className="faq-question">{item.question}</span>
            </button>
            <div className="faq-panel">
              <p>{item.answer}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Testimonials() {
  return (
    <>
      <section className="testimonials-page-hero">
        <div className="container testimonials-page-hero-inner">
          <span className="testimonials-pill">Testimonials</span>
          <h1>What our clients say</h1>
          <p>
            Hear from individuals and families across New Jersey who trusted {firm.name} with
            their most important legal matters.
          </p>
        </div>
      </section>

      <section className="testimonials-wall">
        <div className="container">
          <div className="testimonials-masonry">
            {testimonials.map((item, index) => (
              <article
                key={item.id}
                className={`testimonial-tile luxe-card testimonial-tile--${index + 1}`}
              >
                <span className="luxe-card-shine" aria-hidden />
                <StarRating count={item.rating} />
                <blockquote>{item.quote}</blockquote>
                <footer className="testimonial-tile-author">
                  <span className="testimonial-avatar" aria-hidden>
                    {getInitials(item.name)}
                  </span>
                  <div>
                    <cite>{item.name}</cite>
                    <span className="testimonial-role">
                      {item.matter} · {item.location}
                    </span>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials-faq section">
        <div className="container testimonials-faq-grid">
          <div className="testimonials-faq-intro">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Frequently asked questions</h2>
            <p className="testimonials-faq-lead">
              Have another question? Reach out and our team will be glad to help.
            </p>
            <Link to="/contact" className="btn btn-navy testimonials-faq-cta">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              Contact us
            </Link>
          </div>

          <FaqAccordion />
        </div>
      </section>
    </>
  )
}
