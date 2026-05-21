import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { blogPosts, blogTags, firm } from '../data/site'
import { formatBlogDate, getBlogCategories, getRecentPosts } from '../lib/blogHelpers'
import { getBlogImage } from '../lib/blogImages'
import { nativeSharePost } from '../lib/sharePost'
import { validateEmail, validateSearchQuery } from '../lib/formValidation'
import { usePostEngagement } from '../hooks/usePostEngagement'
import adminImg from '../admin.jpg'
import { blogAuthor } from '../data/site'
import './Resources.css'

const POSTS_PER_PAGE = 4

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.5 11 15.5 7M8.5 13l7 4" />
    </svg>
  )
}

function ResourceCardEngagement({ slug }: { slug: string }) {
  const engagement = usePostEngagement(slug)
  const totalReactions =
    engagement.reactions.like +
    engagement.reactions.appreciate +
    engagement.reactions.insightful
  const commentCount = engagement.comments.length

  if (totalReactions === 0 && commentCount === 0) return null

  return (
    <p className="resource-card-engagement">
      {totalReactions > 0 && (
        <span>
          {totalReactions} {totalReactions === 1 ? 'reaction' : 'reactions'}
        </span>
      )}
      {commentCount > 0 && (
        <span>
          {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
        </span>
      )}
    </p>
  )
}

export default function Resources() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterDone, setNewsletterDone] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [newsletterError, setNewsletterError] = useState('')

  const categories = useMemo(() => getBlogCategories(), [])

  useEffect(() => {
    const cat = searchParams.get('category')
    const valid =
      cat && blogPosts.some((post) => post.category === cat) ? cat : null
    setCategoryFilter(valid)
    setPage(1)
  }, [searchParams])

  function applyCategoryFilter(name: string | null) {
    setCategoryFilter(name)
    setPage(1)
    if (name) setSearchParams({ category: name })
    else setSearchParams({})
  }

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return blogPosts.filter((post) => {
      if (categoryFilter && post.category !== categoryFilter) return false
      if (tagFilter) {
        const hay = `${post.title} ${post.category} ${post.excerpt}`.toLowerCase()
        if (!hay.includes(tagFilter.toLowerCase())) return false
      }
      if (!q) return true
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q)
      )
    })
  }, [searchQuery, categoryFilter, tagFilter])

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  )

  const recentPosts = getRecentPosts()

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    const result = validateSearchQuery(searchQuery)
    if (!result.valid) {
      setSearchError(result.message)
      return
    }
    setSearchError('')
    setPage(1)
  }

  function handleShare(slug: string, title: string, excerpt: string) {
    nativeSharePost(slug, title, excerpt).catch(() => {})
  }

  function handleNewsletter(e: FormEvent) {
    e.preventDefault()
    const result = validateEmail(newsletterEmail)
    if (!result.valid) {
      setNewsletterError(result.message)
      return
    }
    setNewsletterError('')
    setNewsletterDone(true)
    setNewsletterEmail('')
  }

  return (
    <>
      <section className="resources-hero">
        <div className="container resources-hero-inner">
          <span className="section-label">Resources</span>
          <h1 className="section-title">Legal insights &amp; updates</h1>
          <p className="section-lead">
            Articles and guides from {firm.name} on matters affecting individuals and
            businesses across New Jersey.
          </p>
        </div>
      </section>

      <section className="resources-layout section">
        <div className="container resources-layout-grid">
          <div className="resources-posts">
            <div className="resources-posts-grid">
              {paginatedPosts.length === 0 ? (
                <p className="resources-empty">No articles match your search. Try another term.</p>
              ) : (
                paginatedPosts.map((post) => (
                  <article key={post.slug} className="resource-card">
                    <Link to={`/resources/${post.slug}`} className="resource-card-image">
                      <img src={getBlogImage(post.imageKey)} alt="" />
                    </Link>
                    <div className="resource-card-body">
                      <time className="resource-card-date" dateTime={post.date}>
                        {formatBlogDate(post.date, true)}
                      </time>
                      <h2>
                        <Link to={`/resources/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p className="resource-card-excerpt">{post.excerpt}</p>
                      <ResourceCardEngagement slug={post.slug} />
                      <footer className="resource-card-footer">
                        <div className="resource-card-author">
                          <img
                            src={adminImg}
                            alt=""
                            className="resource-author-avatar"
                          />
                          <div className="resource-author-info">
                            <strong>{blogAuthor.name}</strong>
                            <span>{blogAuthor.role}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="resource-share-btn"
                          aria-label={`Share ${post.title}`}
                          onClick={() => handleShare(post.slug, post.title, post.excerpt)}
                        >
                          <ShareIcon />
                        </button>
                      </footer>
                    </div>
                  </article>
                ))
              )}
            </div>

            {totalPages > 1 && (
              <nav className="resources-pagination" aria-label="Blog pagination">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  aria-label="Previous page"
                >
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={n === currentPage ? 'is-active' : ''}
                    onClick={() => setPage(n)}
                    aria-current={n === currentPage ? 'page' : undefined}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  aria-label="Next page"
                >
                  →
                </button>
              </nav>
            )}
          </div>

          <aside className="resources-sidebar">
            <div className="sidebar-widget luxe-card">
              <span className="luxe-card-shine" aria-hidden />
              <h3>Search</h3>
              <form className={`sidebar-search ${searchError ? 'sidebar-search--error' : ''}`} onSubmit={handleSearch}>
                <input
                  id="resources-search-input"
                  type="search"
                  placeholder="Search articles..."
                  aria-invalid={Boolean(searchError)}
                  aria-describedby={searchError ? 'resources-search-error' : undefined}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setSearchError('')
                    setPage(1)
                  }}
                />
                <button type="submit" aria-label="Search">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-4-4" />
                  </svg>
                </button>
              </form>
              {searchError && (
                <p className="sidebar-search-error" id="resources-search-error" role="alert">
                  {searchError}
                </p>
              )}
            </div>

            <div className="sidebar-widget luxe-card">
              <span className="luxe-card-shine" aria-hidden />
              <h3>Recent posts</h3>
              <ul className="sidebar-recent">
                {recentPosts.map((post) => (
                  <li key={post.slug}>
                    <Link to={`/resources/${post.slug}`}>
                      <img src={getBlogImage(post.imageKey)} alt="" />
                      <div>
                        <strong>{post.title}</strong>
                        <time dateTime={post.date}>{formatBlogDate(post.date, true)}</time>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-widget luxe-card">
              <span className="luxe-card-shine" aria-hidden />
              <h3>Categories</h3>
              <ul className="sidebar-categories">
                <li>
                  <button
                    type="button"
                    className={categoryFilter === null ? 'is-active' : ''}
                    onClick={() => applyCategoryFilter(null)}
                  >
                    <span>All articles</span>
                    <span>({blogPosts.length})</span>
                  </button>
                </li>
                {categories.map(([name, count]) => (
                  <li key={name}>
                    <button
                      type="button"
                      className={categoryFilter === name ? 'is-active' : ''}
                      onClick={() => applyCategoryFilter(name)}
                    >
                      <span>{name}</span>
                      <span>({count})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-widget luxe-card">
              <span className="luxe-card-shine" aria-hidden />
              <h3>Tag cloud</h3>
              <div className="sidebar-tags">
                {blogTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={tagFilter === tag ? 'is-active' : ''}
                    onClick={() => {
                      setTagFilter(tagFilter === tag ? null : tag)
                      setPage(1)
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="resources-newsletter">
        <div className="container resources-newsletter-inner">
          <h2>Subscribe to newsletter</h2>
          {newsletterDone ? (
            <p className="resources-newsletter-success">
              Thank you for subscribing. Legal insights from our team will arrive in your inbox.
            </p>
          ) : (
            <form
              className={`resources-newsletter-form ${newsletterError ? 'form-group--error' : ''}`}
              onSubmit={handleNewsletter}
              noValidate
            >
              <input
                id="newsletter-email"
                type="email"
                placeholder="E-mail address"
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value)
                  setNewsletterError('')
                }}
                aria-invalid={Boolean(newsletterError)}
                aria-describedby={newsletterError ? 'newsletter-error' : undefined}
              />
              <button type="submit" aria-label="Subscribe">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
              {newsletterError && (
                <p className="resources-newsletter-error" id="newsletter-error" role="alert">
                  {newsletterError}
                </p>
              )}
            </form>
          )}
        </div>
      </section>
    </>
  )
}
