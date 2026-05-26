import { getSupabase, isSupabaseConfigured } from './supabase'
import type { BlogPost } from '../types/blog'

type CreateBlogPostPayload = {
  slug: string
  title: string
  excerpt: string
  category: string
  author_name: string
  read_time: string
  image_key?: string | null
  body: string[]
}

function normalizeBody(body: unknown): string[] {
  if (Array.isArray(body)) return body
  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body)
      if (Array.isArray(parsed)) return parsed
    } catch {
      // not JSON, treat as single paragraph
    }
    return [body]
  }
  return []
}

export async function listAllBlogPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured) return []

  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('Failed to load blog posts:', error)
    return []
  }

  return ((data as BlogPost[]) || []).map((post) => ({
    ...post,
    body: normalizeBody(post.body),
  }))
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  if (!isSupabaseConfigured) return null

  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Failed to load blog post:', error)
    return null
  }

  return data
    ? { ...(data as BlogPost), body: normalizeBody((data as BlogPost).body) }
    : null
}

export async function createBlogPost(
  post: CreateBlogPostPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabase()

  if (!supabase) {
    return { ok: false, error: 'Supabase not configured.' }
  }

  const { error } = await supabase.from('blog_posts').insert({
    ...post,
    date: new Date().toISOString(),
  })

  if (error) {
    console.error(error)
    return { ok: false, error: error.message }
  }

  return { ok: true }
}

export async function updateBlogPost(
  slug: string,
  patch: Partial<CreateBlogPostPayload>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabase()

  if (!supabase) {
    return { ok: false, error: 'Supabase not configured.' }
  }

  const { error } = await supabase
    .from('blog_posts')
    .update(patch)
    .eq('slug', slug)

  if (error) {
    console.error(error)
    return { ok: false, error: error.message }
  }

  return { ok: true }
}

export async function getBlogPostById(slugId: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured) return null

  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', slugId)
    .single()

  if (error) {
    console.error('Failed to load blog post by id:', error)
    return null
  }

  return data
    ? { ...(data as BlogPost), body: normalizeBody((data as BlogPost).body) }
    : null
}

export async function updateBlogPostById(
  id: string,
  patch: Partial<CreateBlogPostPayload>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabase()

  if (!supabase) {
    return { ok: false, error: 'Supabase not configured.' }
  }

  const { error } = await supabase
    .from('blog_posts')
    .update(patch)
    .eq('id', id)

  if (error) {
    console.error(error)
    return { ok: false, error: error.message }
  }

  return { ok: true }
}

export async function deleteBlogPost(
  slug: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabase()

  if (!supabase) {
    return { ok: false, error: 'Supabase not configured.' }
  }

  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('slug', slug)

  if (error) {
    console.error(error)
    return { ok: false, error: error.message }
  }

  return { ok: true }
}

export async function deleteBlogPostById(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabase()

  if (!supabase) {
    return { ok: false, error: 'Supabase not configured.' }
  }

  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(error)
    return { ok: false, error: error.message }
  }

  return { ok: true }
}
