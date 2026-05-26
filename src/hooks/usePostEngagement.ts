import { useEffect, useMemo, useState } from 'react'
import { getPostEngagement, subscribeEngagement, EMPTY_POST_ENGAGEMENT } from '../lib/blogEngagement'
import { isSupabaseConfigured } from '../lib/supabase'
import { listBlogCommentsBySlug } from '../lib/clientBlogCommentsSupabase'
import type { PostEngagement } from '../lib/blogEngagement'

export function usePostEngagement(slug: string): PostEngagement {
  // LocalStorage-driven reactions + userReaction
  const [localEngagement, setLocalEngagement] = useState(() => getPostEngagement(slug))

  // Supabase-driven comments (for all users)
  const [supabaseComments, setSupabaseComments] = useState(() => EMPTY_POST_ENGAGEMENT.comments)

  useEffect(() => {
    // Recompute local engagement on event updates
    const unsubscribe = subscribeEngagement(() => {
      setLocalEngagement(getPostEngagement(slug))
    })
    setLocalEngagement(getPostEngagement(slug))
    return unsubscribe
  }, [slug])

  useEffect(() => {
    let active = true

    async function loadComments() {
      if (!isSupabaseConfigured) return
      const comments = await listBlogCommentsBySlug(slug)
      if (!active) return
      setSupabaseComments(comments)
    }

    void loadComments()

    // Refresh after client submits a comment (we already dispatch blog-engagement-updated)
    function onUpdated() {
      void loadComments()
    }

    window.addEventListener('blog-engagement-updated', onUpdated)
    return () => {
      active = false
      window.removeEventListener('blog-engagement-updated', onUpdated)
    }
  }, [slug])

  return useMemo(() => {
    return {
      ...localEngagement,
      comments: isSupabaseConfigured ? supabaseComments : localEngagement.comments,
    }
  }, [localEngagement, supabaseComments])
}
