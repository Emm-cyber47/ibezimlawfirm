import { useEffect, useState } from 'react'
import { listContactSubmissions } from '../../lib/adminContactSubmissions'
import { listAllClientDocuments } from '../../lib/adminClientDocuments'
import { listBlogComments } from '../../lib/adminBlogComments'
import { listAllUsers } from '../../lib/adminUsers'
import { listAllBlogPosts } from '../../lib/adminBlogPosts'
import { listAllTestimonials } from '../../lib/adminTestimonials'
import '../pages.css'
import './admin.css'

export default function AdminDashboard() {
  const [contactCount, setContactCount] = useState(0)
  const [documentsCount, setDocumentsCount] = useState(0)
  const [commentsCount, setCommentsCount] = useState(0)
  const [usersCount, setUsersCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [postsCount, setPostsCount] = useState(0)
  const [testimonialsCount, setTestimonialsCount] = useState(0)


  useEffect(() => {
    async function loadStats() {
      const [submissions, documents, comments, users, posts, testimonials] = await Promise.all([
        listContactSubmissions(),
        listAllClientDocuments(),
        listBlogComments(),
        listAllUsers(),
        listAllBlogPosts(),
        listAllTestimonials(),
      ])

      setContactCount(submissions.length)


      setDocumentsCount(documents.length)
      setCommentsCount(comments.length)
      setUsersCount(users.length)
      setPostsCount(posts.length)
      setTestimonialsCount(testimonials.length)
      setLoading(false)
    }
    loadStats()
  }, [])


  return (
    <>
      <section className="page-hero admin-hero">
        <div className="container">
          <h1 className="section-title">Welcome to Admin Dashboard</h1>
          <p className="section-lead">Manage your firm's submissions, documents, and engagement</p>
        </div>
      </section>

      <section className="section admin-body">
        <div className="container">
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-icon">📧</div>
              <h3>Contact Submissions</h3>
              <p className="admin-stat-value">{loading ? '...' : contactCount}</p>
              <p className="admin-stat-desc">New inquiries</p>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon">📄</div>
              <h3>Client Documents</h3>
              <p className="admin-stat-value">{loading ? '...' : documentsCount}</p>
              <p className="admin-stat-desc">Pending review</p>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon">💬</div>
              <h3>Blog Comments</h3>
              <p className="admin-stat-value">{loading ? '...' : commentsCount}</p>
              <p className="admin-stat-desc">Awaiting moderation</p>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon">👥</div>
              <h3>Registered Users</h3>
              <p className="admin-stat-value">{loading ? '...' : usersCount}</p>
              <p className="admin-stat-desc">Active clients</p>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon">📝</div>
              <h3>Blog Posts</h3>
              <p className="admin-stat-value">
                {loading ? '...' : postsCount}
              </p>
              <p className="admin-stat-desc">
                Published articles
              </p>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon">⭐</div>
              <h3>Testimonials</h3>
              <p className="admin-stat-value">
                {loading ? '...' : testimonialsCount}
              </p>
              <p className="admin-stat-desc">
                Client feedback
              </p>
            </div>

          </div>



          <div className="admin-quick-actions">

            <h2>Quick Actions</h2>
            <div className="admin-action-buttons">
              <a href="/admin/contacts" className="btn btn-primary">
                View Contact Form
              </a>
              <a href="/admin/documents" className="btn btn-navy">
                Review Documents
              </a>
              <a href="/admin/comments" className="btn btn-navy">
                Moderate Comments
              </a>
              <a href="/admin/users" className="btn btn-navy">
                Manage Users
              </a>
              <a href="/admin/blog" className="btn btn-navy">
                Manage Blog
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
