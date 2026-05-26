export type ReactionType = 'like' | 'appreciate' | 'insightful'

export type BlogComment = {
  id: string
  name: string
  message: string
  createdAt: string
}

export type PostEngagement = {
  reactions: Record<ReactionType, number>
  userReaction: ReactionType | null
  comments: BlogComment[]
}

const STORAGE_KEY = 'ibezimlaw_blog_engagement'
const VISITOR_KEY = 'ibezimlaw_blog_visitor'

const emptyReactions = (): Record<ReactionType, number> => ({
  like: 0,
  appreciate: 0,
  insightful: 0,
})

/** Stable empty snapshot — required for useSyncExternalStore */
export const EMPTY_POST_ENGAGEMENT: PostEngagement = {
  reactions: { like: 0, appreciate: 0, insightful: 0 },
  userReaction: null,
  comments: [],
}

const snapshotCache = new Map<string, { raw: string; snapshot: PostEngagement }>()

function clearSnapshotCache(slug?: string) {
  if (slug) snapshotCache.delete(slug)
  else snapshotCache.clear()
}

function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(VISITOR_KEY, id)
  }
  return id
}

function readAll(): Record<string, PostEngagement> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, PostEngagement>
  } catch {
    return {}
  }
}

function writeAll(data: Record<string, PostEngagement>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  clearSnapshotCache()
  window.dispatchEvent(new Event('blog-engagement-updated'))
}

export function getPostEngagement(slug: string): PostEngagement {
  const data = readAll()
  const post = data[slug]
  const raw = post ? JSON.stringify(post) : ''

  const cached = snapshotCache.get(slug)
  if (cached && cached.raw === raw) {
    return cached.snapshot
  }

  const snapshot: PostEngagement = post
    ? {
        reactions: { ...emptyReactions(), ...post.reactions },
        userReaction: post.userReaction ?? null,
        comments: post.comments ?? [],
      }
    : EMPTY_POST_ENGAGEMENT

  snapshotCache.set(slug, { raw, snapshot })
  return snapshot
}

export function toggleReaction(slug: string, type: ReactionType): PostEngagement {
  const data = readAll()
  const current = data[slug] ?? {
    reactions: emptyReactions(),
    userReaction: null,
    comments: [],
  }

  const reactions = { ...emptyReactions(), ...current.reactions }
  let userReaction = current.userReaction

  if (userReaction === type) {
    reactions[type] = Math.max(0, reactions[type] - 1)
    userReaction = null
  } else {
    if (userReaction) {
      reactions[userReaction] = Math.max(0, reactions[userReaction] - 1)
    }
    reactions[type] += 1
    userReaction = type
  }

  const updated: PostEngagement = { ...current, reactions, userReaction }
  data[slug] = updated
  writeAll(data)
  getVisitorId()
  return updated
}

export function addComment(
  slug: string,
  name: string,
  message: string,
): BlogComment {
  const data = readAll()
  const current = data[slug] ?? {
    reactions: emptyReactions(),
    userReaction: null,
    comments: [],
  }

  const comment: BlogComment = {
    id: crypto.randomUUID(),
    name: name.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  }

  const updated: PostEngagement = {
    ...current,
    comments: [comment, ...current.comments],
  }
  data[slug] = updated
  writeAll(data)

  // NOTE: Supabase insert is handled by the caller when running in Supabase mode.
  // This keeps this function synchronous for local UX, while still allowing DB-backed writes elsewhere.
  return comment
}

export function getTotalReactions(slug: string): number {
  const { reactions } = getPostEngagement(slug)
  return reactions.like + reactions.appreciate + reactions.insightful
}

export function subscribeEngagement(callback: () => void) {
  const handler = () => callback()
  window.addEventListener('blog-engagement-updated', handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener('blog-engagement-updated', handler)
    window.removeEventListener('storage', handler)
  }
}
