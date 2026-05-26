import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSupabase } from '../../lib/supabase'


export default function CreateBlogPost() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('')
  const [imageKey, setImageKey] = useState('')
  const [loading, setLoading] = useState(false)

  function generateSlug(text: string) {

    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = getSupabase()

      const slug = generateSlug(title)

        const { error } = await supabase.from('blog_posts').insert([
        {
            slug,
            title,
            excerpt,
            body,
            category,
            image_key: imageKey,
            created_at: new Date().toISOString(),
        },
        ])

        if (error) {
        console.error(error)
        alert('Failed to create post')
        return
        }

        alert('Post created successfully')
      navigate('/resources')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section">
      <div className="container">
        <h1>Create Blog Post</h1>

        <form onSubmit={handleSubmit} className="admin-form">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            placeholder="Excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            required
          />

          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <input
            placeholder="Image Key (e.g. office, door)"
            value={imageKey}
            onChange={(e) => setImageKey(e.target.value)}
          />

          <textarea
            placeholder="Write full blog content..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            required
          />

          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </form>
      </div>
    </section>
  )
}