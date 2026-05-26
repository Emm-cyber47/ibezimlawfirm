import { blogPosts } from '../data/site'

export function formatBlogDate(iso: string, uppercase = false) {
  const formatted = new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return uppercase ? formatted.toUpperCase() : formatted
}

export function getRecentPosts(excludeSlug?: string, limit = 4) {
  return [...blogPosts]
    .filter((post) => post.slug !== excludeSlug)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit)
}

export function getRelatedPosts(currentSlug: string, category: string, limit = 3) {
  const others = blogPosts.filter((post) => post.slug !== currentSlug)
  const sameCategory = others.filter((post) => post.category === category)
  const otherCategories = others.filter((post) => post.category !== category)

  return [...sameCategory, ...otherCategories]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit)
}

export function getBlogCategories() {
  const counts = new Map<string, number>()
  for (const post of blogPosts) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1)
  }
  return Array.from(counts.entries()).sort(([a], [b]) => a.localeCompare(b))
}


