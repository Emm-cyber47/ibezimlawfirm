import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { profileInitials } from '../lib/profileDisplay'
import './ProfileAvatar.css'

type ProfileAvatarProps = {
  firstName: string
  lastName: string
  email: string
  avatarUrl?: string
  size?: 'sm' | 'lg'
  className?: string
}

function avatarHue(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i += 1) h = seed.charCodeAt(i) + ((h << 5) - h)
  return Math.abs(h % 340) + 20
}

export default function ProfileAvatar({
  firstName,
  lastName,
  email,
  avatarUrl,
  size = 'lg',
  className = '',
}: ProfileAvatarProps) {
  const [photoFailed, setPhotoFailed] = useState(false)
  useEffect(() => setPhotoFailed(false), [avatarUrl])
  const initials = profileInitials(firstName, lastName)
  const hue = avatarHue(`${firstName}|${lastName}|${email}`)
  const photoSrc = avatarUrl?.trim()
  const showPhoto = Boolean(photoSrc) && !photoFailed

  return (
    <div
      className={`profile-avatar profile-avatar--${size}${className ? ` ${className}` : ''}`}
      style={{ '--avatar-h': `${hue}deg` } as CSSProperties}
    >
      <div className="profile-avatar-ring">
        <div className="profile-avatar-inner">
          {showPhoto ? (
            <img
              src={photoSrc}
              alt=""
              className="profile-avatar-img"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              onError={() => setPhotoFailed(true)}
            />
          ) : (
            <span className="profile-avatar-initials" aria-hidden>
              {initials}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
