import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AdminSidebar.css'

export default function AdminSidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2 className="admin-sidebar-title">Admin</h2>
        <p className="admin-sidebar-badge">Staff</p>
      </div>

      <nav className="admin-sidebar-nav">
        <Link
          to="/admin"
          className={`admin-nav-link ${isActive('/admin') ? 'is-active' : ''}`}
        >
          <span className="admin-nav-icon">📊</span>
          <span>Dashboard</span>
        </Link>

        <Link
          to="/admin/contacts"
          className={`admin-nav-link ${isActive('/admin/contacts') ? 'is-active' : ''}`}
        >
          <span className="admin-nav-icon">📧</span>
          <span>Contact Form</span>
        </Link>

        <Link
          to="/admin/comments"
          className={`admin-nav-link ${isActive('/admin/comments') ? 'is-active' : ''}`}
        >
          <span className="admin-nav-icon">💬</span>
          <span>Blog Comments</span>
        </Link>

        <Link
          to="/admin/blog"
          className={`admin-nav-link ${isActive('/admin/blog') ? 'is-active' : ''}`}
        >
          <span className="admin-nav-icon">📝</span>
          <span>Blog</span>
        </Link>

        <Link
          to="/admin/testimonials"
          className={`admin-nav-link ${isActive('/admin/testimonials') ? 'is-active' : ''}`}
        >
          <span className="admin-nav-icon">⭐</span>
          <span>Testimonials</span>
        </Link>

        <Link
          to="/admin/documents"
          className={`admin-nav-link ${isActive('/admin/documents') ? 'is-active' : ''}`}
        >
          <span className="admin-nav-icon">📄</span>
          <span>Documents</span>
        </Link>

        <Link
          to="/admin/users"
          className={`admin-nav-link ${isActive('/admin/users') ? 'is-active' : ''}`}
        >
          <span className="admin-nav-icon">👥</span>
          <span>Users</span>
        </Link>

        <Link
          to="/admin/edit-website"
          className={`admin-nav-link ${location.pathname.startsWith('/admin/edit-website') ? 'is-active' : ''}`}
        >
          <span className="admin-nav-icon">🌐</span>
          <span>Edit Website</span>
        </Link>
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-user-info">
          <p className="admin-user-email">{user?.email}</p>
          <p className="admin-user-role">Admin</p>
        </div>
        <button onClick={() => logout()} className="admin-logout-btn">
          Logout
        </button>
      </div>
    </aside>
  )
}
