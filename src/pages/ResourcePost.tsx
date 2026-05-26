// import { Link, Navigate, useParams } from 'react-router-dom'
// import BlogEngagement from '../components/BlogEngagement.tsx'
// import BlogSidebar from '../components/BlogSidebar.tsx'
// import { blogAuthor, blogPosts } from '../data/site'
// import { formatBlogDate, getRelatedPosts } from '../lib/blogHelpers'
// import { getBlogImage } from '../lib/blogImages'
// import './Resources.css'
// import './pages.css'

// export default function ResourcePost() {
//   const { slug } = useParams<{ slug: string }>()
//   const post = blogPosts.find((p) => p.slug === slug)

//   if (!post) {
//     return <Navigate to="/resources" replace />
//   }

//   const image = getBlogImage(post.imageKey)
//   const relatedPosts = getRelatedPosts(post.slug, post.category)

//   return (
//     <>
//       <section className="page-hero resource-post-hero">
//         <div className="container article-header">
//           <span className="section-label">{post.category}</span>
//           <h1 className="section-title">{post.title}</h1>
//           <p className="article-lead">{post.excerpt}</p>
//           <div className="article-meta">
//             <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
//             <span>{blogAuthor.name}</span>
//             <span>{post.readTime}</span>
//           </div>
//         </div>
//       </section>

//       <section className="section resource-post-body-section">
//         <div className="container resource-post-page-grid">
//           <div className="resource-post-main">
//             <Link to="/resources" className="article-back">
//               ← Back to Resources
//             </Link>
//             <figure className="resource-post-featured">
//               <img src={image} alt="" />
//             </figure>
//             <article className="article-body resource-post-article">
//               {post.body.map((paragraph) => (
//                 <p key={paragraph.slice(0, 40)}>{paragraph}</p>
//               ))}
//             </article>
//             <BlogEngagement slug={post.slug} title={post.title} excerpt={post.excerpt} />
//           </div>
//           <BlogSidebar currentSlug={post.slug} />
//         </div>
//       </section>

//       {relatedPosts.length > 0 && (
//         <section className="resource-post-continue" aria-labelledby="continue-reading-heading">
//           <div className="container">
//             <header className="resource-post-continue-header">
//               <span className="section-label">Keep reading</span>
//               <h2 id="continue-reading-heading" className="section-title">
//                 More articles you may find helpful
//               </h2>
//             </header>
//             <div className="resource-post-related-grid">
//               {relatedPosts.map((related) => (
//                 <article key={related.slug} className="resource-card resource-related-card">
//                   <Link to={`/resources/${related.slug}`} className="resource-card-image">
//                     <img src={getBlogImage(related.imageKey)} alt="" />
//                   </Link>
//                   <div className="resource-card-body">
//                     <span className="resource-card-category">{related.category}</span>
//                     <time className="resource-card-date" dateTime={related.date}>
//                       {formatBlogDate(related.date, true)}
//                     </time>
//                     <h3>
//                       <Link to={`/resources/${related.slug}`}>{related.title}</Link>
//                     </h3>
//                     <p className="resource-card-excerpt">{related.excerpt}</p>
//                     <Link to={`/resources/${related.slug}`} className="resource-related-read">
//                       Read article →
//                     </Link>
//                   </div>
//                 </article>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}
//     </>
//   )
// }

import { useEffect, useMemo, useState } from 'react'
import { Navigate, Link, useParams } from 'react-router-dom'
import BlogEngagement from '../components/BlogEngagement.tsx'
import BlogSidebar from '../components/BlogSidebar.tsx'
import { blogAuthor } from '../data/site'
import { formatBlogDate, getRelatedPosts } from '../lib/blogHelpers'
import { getBlogImage } from '../lib/blogImages'
import { renderBlogBody } from '../lib/blogBodyRenderer'
import './Resources.css'
import './pages.css'
import { getSupabase } from '../lib/supabase'

type BlogPostView = {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string[]
  date: string
  category: string
  imageKey: string
  readTime?: string
  authorName?: string
}

/**
 * Normalize body from Supabase.
 * Handles: JSON arrays, JSON-array-as-string (e.g. '["<p>...</p>"]'),
 * plain text, and newline-separated entries.
 */
function normalizeBody(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map(s => String(s))
  }

  const str = String(raw).trim()

  if (!str) return []

  // Try to parse as JSON array (handles `["<p>...</p>"]`)
  if (str.startsWith('[') && str.endsWith(']')) {
    try {
      const parsed = JSON.parse(str)
      if (Array.isArray(parsed)) return parsed.map(s => String(s))
    } catch {
      // not valid JSON, fall through
    }
  }

  // Fallback: split by newlines
  return str
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)
}

export default function ResourcePost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPostView | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPost() {
      const supabase = getSupabase()
      if (!supabase || !slug) {
        setPost(null)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error || !data) {
        console.error(error)
        setPost(null)
        setLoading(false)
        return
      }

      setPost({
        id: data.id,
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        body: normalizeBody(data.body),
        date: data.date,
        category: data.category,
        imageKey: data.image_key,
        readTime: data.read_time || undefined,
        authorName: data.author_name || blogAuthor.name,
      })
      setLoading(false)
    }

    void fetchPost()
  }, [slug])

  const relatedPosts = useMemo(() => {
    if (!post) return []
    return getRelatedPosts(post.slug, post.category)
  }, [post])

  if (loading) {
    return (
      <section className="section">
        <div className="container">Loading article...</div>
      </section>
    )
  }

  if (!post) {
    return <Navigate to="/resources" replace />
  }

  const image = getBlogImage(post.imageKey)

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
              {renderBlogBody(post.body)}
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
