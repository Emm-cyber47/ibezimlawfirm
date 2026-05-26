import { getSupabase, isSupabaseConfigured } from './supabase'

export type AdminBlogComment = {
  id: string
  postSlug: string
  authorName: string
  message: string
  userId?: string
  visitorId?: string
  createdAt: string
}

export async function listBlogComments(): Promise<AdminBlogComment[]> {
  if (!isSupabaseConfigured) return []

  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('blog_comments')
    .select('id, post_slug, author_name, message, user_id, visitor_id, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to load comments:', error)
    return []
  }

  return (data ?? []).map((c) => ({
    id: c.id,
    postSlug: c.post_slug,
    authorName: c.author_name,
    message: c.message,
    userId: c.user_id || undefined,
    visitorId: c.visitor_id || undefined,
    createdAt: c.created_at,
  }))
}

export async function deleteBlogComment(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false

  const supabase = getSupabase()
  if (!supabase) return false

  const { error } = await supabase.from('blog_comments').delete().eq('id', id)

  if (error) {
    console.error('Failed to delete comment:', error)
    return false
  }

  return true
}
