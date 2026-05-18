export function getPostShareUrl(slug: string) {
  const base = window.location.origin
  return `${base}/resources/${slug}`
}

export async function copyPostLink(slug: string, _title?: string) {
  const url = getPostShareUrl(slug)
  try {
    await navigator.clipboard.writeText(url)
    return { ok: true, message: 'Link copied to clipboard' }
  } catch {
    return { ok: false, message: 'Could not copy link' }
  }
}

export async function nativeSharePost(slug: string, title: string, excerpt: string) {
  const url = getPostShareUrl(slug)
  if (navigator.share) {
    try {
      await navigator.share({ title, text: excerpt, url })
      return { ok: true, message: 'Shared successfully' }
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        return { ok: false, message: '' }
      }
    }
  }
  return copyPostLink(slug, title)
}

export function shareToFacebook(slug: string) {
  const url = encodeURIComponent(getPostShareUrl(slug))
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer')
}

export function shareToLinkedIn(slug: string, title: string) {
  const url = encodeURIComponent(getPostShareUrl(slug))
  const text = encodeURIComponent(title)
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${text}`,
    '_blank',
    'noopener,noreferrer',
  )
}

export function shareToX(slug: string, title: string) {
  const url = encodeURIComponent(getPostShareUrl(slug))
  const text = encodeURIComponent(title)
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer')
}
