import { useState } from 'react'
import type { FormEvent } from 'react'
import FormField from './FormField.tsx'
import {
  addComment,
  toggleReaction,
  type ReactionType,
} from '../lib/blogEngagement'
import { useAuth } from '../context/AuthContext'
import { isValidResult, validateCommentText } from '../lib/formValidation'
import {
  copyPostLink,
  nativeSharePost,
  shareToFacebook,
  shareToLinkedIn,
  shareToX,
} from '../lib/sharePost'
import { usePostEngagement } from '../hooks/usePostEngagement'
import './BlogEngagement.css'
const REACTIONS: { type: ReactionType; label: string; emoji: string }[] = [
  { type: 'like', label: 'Like', emoji: '👍' },
  { type: 'appreciate', label: 'Appreciate', emoji: '❤️' },
  { type: 'insightful', label: 'Insightful', emoji: '💡' },
]

type BlogEngagementProps = {
  slug: string
  title: string
  excerpt: string
}

function displayNameFromUser(user: { firstName: string; lastName: string; email: string }) {
  const combined = `${user.firstName} ${user.lastName}`.trim()
  return combined || user.email.split('@')[0] || user.email
}

export default function BlogEngagement({ slug, title, excerpt }: BlogEngagementProps) {
  const engagement = usePostEngagement(slug)
  const { user } = useAuth()
  const [shareMessage, setShareMessage] = useState('')
  const [commentText, setCommentText] = useState('')
  const [commentErrors, setCommentErrors] = useState<Record<string, string>>({})
  const [commentTouched, setCommentTouched] = useState<Record<string, boolean>>({})
  const [commentAttempted, setCommentAttempted] = useState(false)
  const [commentSuccess, setCommentSuccess] = useState(false)

  const totalReactions =
    engagement.reactions.like +
    engagement.reactions.appreciate +
    engagement.reactions.insightful

  function handleReaction(type: ReactionType) {
    toggleReaction(slug, type)
  }

  async function handleShare(action: 'copy' | 'native' | 'facebook' | 'linkedin' | 'x') {
    let result = { ok: false, message: '' }
    switch (action) {
      case 'copy':
        result = await copyPostLink(slug, title)
        break
      case 'native':
        result = await nativeSharePost(slug, title, excerpt)
        break
      case 'facebook':
        shareToFacebook(slug)
        result = { ok: true, message: 'Opening Facebook…' }
        break
      case 'linkedin':
        shareToLinkedIn(slug, title)
        result = { ok: true, message: 'Opening LinkedIn…' }
        break
      case 'x':
        shareToX(slug, title)
        result = { ok: true, message: 'Opening X…' }
        break
    }
    if (result.message) {
      setShareMessage(result.message)
      setTimeout(() => setShareMessage(''), 3000)
    }
  }

  function showCommentError(field: 'text') {
    return (commentAttempted || commentTouched[field]) && Boolean(commentErrors[field])
  }

  function handleCommentSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return

    setCommentAttempted(true)
    setCommentTouched({ text: true })

    const textResult = validateCommentText(commentText)
    if (!isValidResult(textResult)) {
      setCommentErrors({ text: textResult.message })
      document.getElementById(`comment-text-${slug}`)?.focus()
      return
    }

    addComment(slug, displayNameFromUser(user), commentText)
    setCommentText('')
    setCommentErrors({})
    setCommentTouched({})
    setCommentAttempted(false)
    setCommentSuccess(true)
    setTimeout(() => setCommentSuccess(false), 4000)
  }

  return (
    <aside className="blog-engagement" aria-label="Article engagement">
      <section className="blog-engagement-section">
        <h2 className="blog-engagement-heading">React to this article</h2>
        <p className="blog-engagement-sub">
          {totalReactions} {totalReactions === 1 ? 'reaction' : 'reactions'}
        </p>
        <div className="blog-reactions">
          {REACTIONS.map(({ type, label, emoji }) => (
            <button
              key={type}
              type="button"
              className={`blog-reaction-btn ${engagement.userReaction === type ? 'is-active' : ''}`}
              onClick={() => handleReaction(type)}
              aria-pressed={engagement.userReaction === type}
            >
              <span aria-hidden>{emoji}</span>
              <span>{label}</span>
              <span>{engagement.reactions[type]}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="blog-engagement-section">
        <h2 className="blog-engagement-heading">Share</h2>
        <p className="blog-engagement-sub">Spread the word with colleagues and friends.</p>
        <div className="blog-share-actions">
          <button type="button" className="blog-share-btn" onClick={() => handleShare('copy')}>
            Copy link
          </button>
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button type="button" className="blog-share-btn" onClick={() => handleShare('native')}>
              Share…
            </button>
          )}
          <button type="button" className="blog-share-btn" onClick={() => handleShare('facebook')}>
            Facebook
          </button>
          <button type="button" className="blog-share-btn" onClick={() => handleShare('linkedin')}>
            LinkedIn
          </button>
          <button type="button" className="blog-share-btn" onClick={() => handleShare('x')}>
            X
          </button>
        </div>
        {shareMessage && <p className="blog-share-toast">{shareMessage}</p>}
      </section>

      <section className="blog-engagement-section">
        <h2 className="blog-engagement-heading">
          Comments ({engagement.comments.length})
        </h2>

        {user ? (
          <form className="blog-comment-form" onSubmit={handleCommentSubmit} noValidate>
            <p className="blog-comment-as">
              Posting as <strong>{displayNameFromUser(user)}</strong>
            </p>
            {commentAttempted && commentErrors.text && (
              <p className="form-summary-error" role="alert">
                Please fix the error below before posting.
              </p>
            )}
            <FormField
              id={`comment-text-${slug}`}
              label="Your comment"
              error={commentErrors.text}
              showError={showCommentError('text')}
            >
              {(aria) => (
                <textarea
                  {...aria}
                  maxLength={1000}
                  placeholder="Share your thoughts on this article…"
                  value={commentText}
                  onChange={(e) => {
                    setCommentText(e.target.value)
                    if (commentAttempted || commentTouched.text) {
                      const r = validateCommentText(e.target.value)
                      setCommentErrors(isValidResult(r) ? {} : { text: r.message })
                    }
                  }}
                  onBlur={(e) => {
                    setCommentTouched((t) => ({ ...t, text: true }))
                    const r = validateCommentText(e.target.value)
                    setCommentErrors(isValidResult(r) ? {} : { text: r.message })
                  }}
                />
              )}
            </FormField>
            <button type="submit" className="btn btn-navy">
              Post comment
            </button>
            {commentSuccess && (
              <p className="blog-share-toast">Thank you—your comment has been posted.</p>
            )}
          </form>
        ) : (
          <div className="blog-comment-gate">
            <p className="blog-comment-gate-title">Join the conversation</p>
            <p className="blog-comment-gate-lead">
              Comments are available to signed-in clients only. You can still react to this article
              and share it—no account required for those.
            </p>
            <p className="blog-comment-gate-hint">
              Use <strong>Login</strong> in the header to sign in or create an account, then return
              here to post.
            </p>
          </div>
        )}

        {engagement.comments.length === 0 ? (
          <p className="blog-comments-empty">
            {user
              ? 'Be the first to leave a comment.'
              : 'No comments yet. Sign in to start the thread.'}
          </p>
        ) : (
          <ul className="blog-comments-list">
            {engagement.comments.map((comment) => (
              <li key={comment.id} className="blog-comment-item">
                <header>
                  <strong>{comment.name}</strong>
                  <time dateTime={comment.createdAt}>
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </header>
                <p>{comment.message}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="blog-engagement-note">
        Reactions are open to everyone; only signed-in visitors can post comments. Everything is
        saved on this device until you connect a backend.
      </p>
    </aside>
  )
}
