import { Link, useLocation } from 'react-router-dom'
import { firm, navLinks, practiceAreas, affiliations } from '../data/site'
import { useContactInfo } from '../hooks/useContactInfo'
import logoImg from '../ibezimlogo.png'
import part1Img from '../part1.jpg'
import part2Img from '../part2.jpg'
import part3Img from '../part3.jpg'
import SocialLinks from './SocialLinks.tsx'
import './Footer.css'

const affiliationImages = {
  part1: part1Img,
  part2: part2Img,
  part3: part3Img,
} as const

/** Pages where membership badges add credibility */
const AFFILIATION_PATHS = ['/', '/about', '/attorney', '/contact', '/testimonials'] as const

export default function Footer() {
  const { pathname } = useLocation()
  const contactInfo = useContactInfo()
  const showAffiliations = AFFILIATION_PATHS.includes(
    pathname as (typeof AFFILIATION_PATHS)[number],
  )
  const year = new Date().getFullYear()
  const phoneHref = `tel:${contactInfo.phone.replace(/[^\d+]/g, '')}`
  const faxHref = `tel:${contactInfo.fax.replace(/[^\d+]/g, '')}`

  return (
    <footer className="footer">
      {showAffiliations && (
        <div className="footer-affiliations">
          <div className="container footer-affiliations-inner">
            <p className="footer-affiliations-label">Professional memberships &amp; affiliations</p>
            <ul className="footer-badges">
              {affiliations.map(({ image, name, short }) => (
                <li key={image}>
                  <figure className="footer-badge">
                    <img
                      src={affiliationImages[image]}
                      alt={`${name} (${short})`}
                      loading="lazy"
                    />
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="footer-main">
        <div className="container footer-grid">
          <div className="footer-brand-col">
            <Link to="/" className="footer-logo">
              <img src={logoImg} alt="" className="footer-logo-image" width={44} height={52} />
              <span>{firm.name}</span>
            </Link>
            <p className="footer-tagline">{firm.tagline}</p>
            <Link to="/testimonials" className="btn btn-primary footer-cta">
              View testimonials
            </Link>
          </div>

          <div>
            <h3 className="footer-heading">Quick links</h3>
            <ul className="footer-links">
              {navLinks.flatMap((item) =>
                'children' in item && item.children
                  ? item.children.map((child) => (
                      <li key={child.path}>
                        <Link to={child.path}>{child.label}</Link>
                      </li>
                    ))
                  : [
                      <li key={item.path}>
                        <Link to={item.path}>{item.label}</Link>
                      </li>,
                    ],
              )}
            </ul>
          </div>

          <div>
            <h3 className="footer-heading">Practice areas</h3>
            <ul className="footer-links footer-links--compact">
              {practiceAreas.map(({ title }) => (
                <li key={title}>
                  <Link to="/services">{title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="footer-heading">Contact</h3>
            <address className="footer-contact">
              <p>{contactInfo.address}</p>
              <p>
                <a href={phoneHref}>{contactInfo.phone}</a>
              </p>
              <p>
                Fax: <a href={faxHref}>{contactInfo.fax}</a>
              </p>
              <p>
                <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
              </p>
              <p>
                <a href={`mailto:${contactInfo.secondEmail}`}>{contactInfo.secondEmail}</a>
              </p>
              <p>{firm.hours}</p>
            </address>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-copy">
            &copy; {year} {firm.name}. All rights reserved.
          </p>
          <SocialLinks className="social-links--inline-bottom" />
          <p className="footer-disclaimer">
            Attorney advertising. Prior results do not guarantee a similar outcome.
          </p>
        </div>
      </div>
    </footer>
  )
}
