import { socialLinks } from '../data/site'
import './SocialLinks.css'

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 4.127 0 2.062 2.062 0 0 1-2.064 2.065zM5.337 20.452H1.771V9h3.566v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

type SocialLinksProps = {
  className?: string
  variant?: 'footer' | 'contact'
}

export default function SocialLinks({ className = '', variant = 'footer' }: SocialLinksProps) {
  return (
    <div
      className={`social-links social-links--${variant} ${className}`.trim()}
      aria-label="Social media"
    >
      <a
        href={socialLinks.facebook}
        className="social-link"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
      >
        <IconFacebook />
        <span>Facebook</span>
      </a>
      <a
        href={socialLinks.linkedin}
        className="social-link"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
      >
        <IconLinkedIn />
        <span>LinkedIn</span>
      </a>
    </div>
  )
}
