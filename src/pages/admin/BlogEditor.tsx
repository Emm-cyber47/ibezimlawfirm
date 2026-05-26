import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createBlogPost,
  getBlogPostBySlug,
  updateBlogPostById,
} from '../../lib/adminBlogPosts'
import { uploadBlogImage } from '../../lib/blogImageUpload'
import RichTextEditor from '../../components/RichTextEditor'
import './admin.css'

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

export default function BlogEditor() {
  const navigate = useNavigate()
  const { slug } = useParams()

  const isEditing = useMemo(
    () => slug && slug !== 'new',
    [slug],
  )

  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('')
  const [authorName, setAuthorName] = useState('Admin')
  const [readTime, setReadTime] = useState('5 min read')
  const [body, setBody] = useState('')
  const [bodyType, setBodyType] = useState<'markdown' | 'html'>('markdown')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [postId, setPostId] = useState<string | null>(null)

  useEffect(() => {
    async function loadPost() {
      if (!isEditing || !slug) return

      const post = await getBlogPostBySlug(slug)

      if (!post) return

      setTitle(post.title)
      setExcerpt(post.excerpt)
      setCategory(post.category)
      setAuthorName(post.author_name)
      setReadTime(post.read_time)
      // Detect if body is HTML (from Quill editor) or markdown (legacy)
      const rawBody = Array.isArray(post.body) ? post.body.join('\n\n') : post.body
      // Check if it contains HTML tags
      const isHtml = /<[a-z][\s\S]*>/i.test(rawBody)
      setBodyType(isHtml ? 'html' : 'markdown')
      setBody(isHtml ? rawBody : rawBody)
      setImageUrl(post.image_key || '')
      setPostId(post.id)
    }

    loadPost()
  }, [isEditing, slug])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setLoading(true)

    let uploadedImage = imageUrl

    if (imageFile) {
      const uploaded = await uploadBlogImage(imageFile)

      if (!uploaded) {
        alert('Failed to upload image.')
        setLoading(false)
        return
      }

      uploadedImage = uploaded
    }

    const isHtml = bodyType === 'html'
    const bodyValue: string[] = isHtml
      ? [body]  // wrap HTML in a single array element
      : body
          .split('\n')
          .map((p) => p.trim())
          .filter(Boolean)

    const payload = {
      slug: slugify(title),
      title,
      excerpt,
      category,
      author_name: authorName,
      read_time: readTime,
      image_key: uploadedImage,
      body: bodyValue,
    }

    const result = isEditing
      ? postId
        ? await updateBlogPostById(postId, payload)
        : { ok: false as const, error: 'Cannot update: missing post id.' }
      : await createBlogPost(payload)

    setLoading(false)

    if (!result.ok) {
      alert(result.error)
      return
    }

    navigate('/admin/blog')
  }

  return (
    <>
      <section className="page-hero admin-hero">
        <div className="container">
          <h1 className="section-title">
            {isEditing ? 'Edit Blog Post' : 'Create Blog Post'}
          </h1>
        </div>
      </section>

      <section className="section admin-body">
        <div className="container">

          <form
            onSubmit={handleSubmit}
            className="admin-form"
          >

            <div className="form-group">
              <label>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Excerpt</label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Author Name</label>
              <input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Read Time</label>
              <input
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Featured Image</label>

              {imageUrl && (
                <img
                  src={imageUrl}
                  alt=""
                  style={{
                    width: 240,
                    borderRadius: 12,
                    marginBottom: '1rem',
                  }}
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImageFile(e.target.files?.[0] || null)
                }
              />
            </div>

            <div className="form-group">
              <label>Body</label>

              {bodyType === 'html' ? (
                <RichTextEditor
                  value={body}
                  onChange={setBody}
                  placeholder="Write your blog content here..."
                />
              ) : (
                <textarea
                  rows={14}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Separate paragraphs with empty lines. Supports Markdown: # Heading, ## Heading, - bullet, **bold**, *italic*"
                  required
                />
              )}

              <div className="admin-toggle-body-mode" style={{ marginTop: '0.5rem' }}>
                <label className="admin-label" style={{ fontSize: '0.85rem' }}>
                  <input
                    type="checkbox"
                    checked={bodyType === 'html'}
                    onChange={(e) => {
                      const newMode = e.target.checked ? 'html' : 'markdown'
                      setBodyType(newMode)
                      if (newMode === 'markdown' && body) {
                        // Convert to plain text
                        const temp = document.createElement('div')
                        temp.innerHTML = body
                        setBody(temp.textContent || temp.innerText || '')
                      }
                    }}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Use Rich Text Editor (bold, headings, lists, etc.)
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? 'Saving...'
                : isEditing
                ? 'Update Post'
                : 'Create Post'}
            </button>

          </form>

        </div>
      </section>
    </>
  )
}