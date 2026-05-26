import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  deleteBlogPost,
  listAllBlogPosts,
} from '../../lib/adminBlogPosts'
import type { BlogPost } from '../../types/blog'
import '../pages.css'
import './admin.css'

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  async function loadPosts() {
    setLoading(true)
    const data = await listAllBlogPosts()
    setPosts(data)
    setLoading(false)
  }

  useEffect(() => {
    loadPosts()
  }, [])

  async function handleDelete(slug: string) {
    const ok = window.confirm(
      'Are you sure you want to delete this post?',
    )

    if (!ok) return

    const result = await deleteBlogPost(slug)

    if (!result.ok) {
      alert(result.error)
      return
    }

    loadPosts()
  }

  const filtered = search
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase()),
      )
    : posts

  return (
    <>
      <section className="page-hero admin-hero">
        <div className="container">
          <h1 className="section-title">Blog Management</h1>
          <p className="section-lead">
            Create, edit, and manage resource articles
          </p>
        </div>
      </section>

      <section className="section admin-body">
        <div className="container">

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
            }}
          >
            <h2>All Blog Posts</h2>

            <Link
              to="/admin/blog/new"
              className="btn btn-primary"
            >
              + New Post
            </Link>
          </div>

          {loading ? (
            <p>Loading posts...</p>
          ) : posts.length === 0 ? (
            <p>No blog posts yet.</p>
          ) : (
            <>
              <div className="admin-search-bar">
                <input
                  className="admin-search-input"
                  type="text"
                  placeholder="Search by title or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {filtered.length === 0 ? (
                <p>No posts match your search.</p>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filtered.map((post) => (
                        <tr key={post.id}>
                          <td>
                            {post.image_key ? (
                              <img
                                src={post.image_key}
                                alt=""
                                style={{
                                  width: 80,
                                  height: 60,
                                  objectFit: 'cover',
                                  borderRadius: 8,
                                }}
                              />
                            ) : (
                              '—'
                            )}
                          </td>

                          <td>{post.title}</td>

                          <td>{post.category}</td>

                          <td>
                            {new Date(post.date).toLocaleDateString()}
                          </td>

                          <td>
                            <div
                              style={{
                                display: 'flex',
                                gap: '0.75rem',
                              }}
                            >
                              <Link
                                to={`/admin/blog/${post.slug}`}
                                className="btn btn-navy"
                              >
                                Edit
                              </Link>

                              <button
                                className="btn btn-primary"
                                onClick={() => handleDelete(post.slug)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

        </div>
      </section>
    </>
  )
}