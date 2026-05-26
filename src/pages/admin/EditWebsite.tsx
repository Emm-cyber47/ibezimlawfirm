import { Link } from 'react-router-dom'
import './admin.css'

const sections = [
  {
    title: 'Home',
    description: 'Edit firm info, hero headlines, about preview, and why-choose-us content.',
    icon: '🏠',
    path: '/admin/edit-website/home',
  },
  {
    title: 'About Us',
    description: 'Edit the about page paragraphs, values, and featured practice areas.',
    icon: '📋',
    path: '/admin/edit-website/about',
  },
  {
    title: 'Attorney Details',
    description: 'Edit attorney bio, education, admissions, and highlights.',
    icon: '👤',
    path: '/admin/edit-website/attorney',
  },
  {
    title: 'Practice Areas',
    description: 'Edit practice area titles, descriptions, and icons.',
    icon: '⚖️',
    path: '/admin/edit-website/practice-areas',
  },
  {
    title: 'Other Info',
    description: 'Edit contact details, phone, fax, emails, address, and social media links.',
    icon: '📞',
    path: '/admin/edit-website/other-info',
  },
]

export default function EditWebsite() {
  return (
    <>
      <section className="page-hero admin-hero">
        <div className="container">
          <h1 className="section-title">Edit Website</h1>
          <p className="section-lead">Manage your public website content</p>
        </div>
      </section>

      <section className="section admin-body">
        <div className="container">
          <div className="edit-website-grid">
            {sections.map((section) => (
              <Link to={section.path} key={section.title} className="edit-website-card">
                <div className="edit-website-card-icon">{section.icon}</div>
                <h3 className="edit-website-card-title">{section.title}</h3>
                <p className="edit-website-card-desc">{section.description}</p>
                <span className="edit-website-card-link">Edit →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}