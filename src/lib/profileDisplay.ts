import type { AuthMethod } from '../context/authTypes'

/** Initials shown in the avatar when no uploaded photo exists. */
export function profileInitials(firstName: string, lastName: string): string {
  const f = firstName.trim()[0]?.toUpperCase() ?? ''
  const l = lastName.trim()[0]?.toUpperCase() ?? ''
  if (f && l) return `${f}${l}`
  const compact = `${firstName}${lastName}`.replace(/\s+/g, '').toUpperCase()
  if (compact.length >= 2) return compact.slice(0, 2)
  if (f) return `${f}${f}`
  return 'CL'
}

function capitalizeWord(w: string) {
  if (!w) return ''
  return w[0]?.toUpperCase() + w.slice(1).toLowerCase()
}

/** Derive display names from email local-part when profile is absent (demo only). */
export function defaultProfileFromEmail(emailNormalized: string, _authMethod: AuthMethod): Pick<
  { firstName: string; lastName: string },
  'firstName' | 'lastName'
> {
  const local = emailNormalized.split('@')[0] ?? 'client'
  const parts = local.split(/[._\-+]+/).filter(Boolean)
  if (parts.length >= 2)
    return { firstName: capitalizeWord(parts[0]), lastName: capitalizeWord(parts[1]) }
  const single = parts[0] ?? local
  return { firstName: capitalizeWord(single), lastName: 'Client' }
}
