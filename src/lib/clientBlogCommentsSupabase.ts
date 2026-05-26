import { getSupabase, isSupabaseConfigured } from './supabase'
import type { BlogComment } from './blogEngagement'

export async function listBlogCommentsBySlug(slug: string): Promise<BlogComment[]> {
  if (!isSupabaseConfigured) return []

  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('blog_comments')
    .select('id, post_slug, author_name, message, created_at')
    .eq('post_slug', slug)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Failed to load blog comments by slug:', { slug, error })
    return []
  }

  return (data ?? []).map((c) => ({
    id: c.id,
    name: c.author_name,
    message: c.message,
    createdAt: c.created_at,
  }))
}
