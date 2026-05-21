import { Link, Navigate, useParams } from 'react-router-dom'
import BlogEngagement from '../components/BlogEngagement.tsx'
import BlogSidebar from '../components/BlogSidebar.tsx'
import { blogAuthor, blogPosts } from '../data/site'
import { formatBlogDate, getRelatedPosts } from '../lib/blogHelpers'
import { getBlogImage } from '../lib/blogImages'
import './Resources.css'
import './pages.css'

export default function ResourcePost() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return <Navigate to="/resources" replace />
  }

  const image = getBlogImage(post.imageKey)
  const relatedPosts = getRelatedPosts(post.slug, post.category)

  return (
    <>
      <section className="page-hero resource-post-hero">
        <div className="container article-header">
          <span className="section-label">{post.category}</span>
          <h1 className="section-title">{post.title}</h1>
          <p className="article-lead">{post.excerpt}</p>
          <div className="article-meta">
            <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
            <span>{blogAuthor.name}</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>

      <section className="section resource-post-body-section">
        <div className="container resource-post-page-grid">
          <div className="resource-post-main">
            <Link to="/resources" className="article-back">
              ← Back to Resources
            </Link>
            <figure className="resource-post-featured">
              <img src={image} alt="" />
            </figure>
            <article className="article-body resource-post-article">
              {post.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </article>
            <BlogEngagement slug={post.slug} title={post.title} excerpt={post.excerpt} />
          </div>
          <BlogSidebar currentSlug={post.slug} />
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="resource-post-continue" aria-labelledby="continue-reading-heading">
          <div className="container">
            <header className="resource-post-continue-header">
              <span className="section-label">Keep reading</span>
              <h2 id="continue-reading-heading" className="section-title">
                More articles you may find helpful
              </h2>
            </header>
            <div className="resource-post-related-grid">
              {relatedPosts.map((related) => (
                <article key={related.slug} className="resource-card resource-related-card">
                  <Link to={`/resources/${related.slug}`} className="resource-card-image">
                    <img src={getBlogImage(related.imageKey)} alt="" />
                  </Link>
                  <div className="resource-card-body">
                    <span className="resource-card-category">{related.category}</span>
                    <time className="resource-card-date" dateTime={related.date}>
                      {formatBlogDate(related.date, true)}
                    </time>
                    <h3>
                      <Link to={`/resources/${related.slug}`}>{related.title}</Link>
                    </h3>
                    <p className="resource-card-excerpt">{related.excerpt}</p>
                    <Link to={`/resources/${related.slug}`} className="resource-related-read">
                      Read article →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
