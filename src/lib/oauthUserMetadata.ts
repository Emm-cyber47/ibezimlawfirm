/** Parse display fields from Supabase Auth user_metadata (Google, etc.) */

function str(value: unknown): string {
  if (value == null) return ''
  return String(value).trim()
}

export type OAuthProfileFields = {
  firstName: string
  lastName: string
  phone: string
  avatarUrl: string
}

export function parseOAuthProfileFields(
  metadata: Record<string, unknown> | undefined,
): OAuthProfileFields {
  if (!metadata) {
    return { firstName: '', lastName: '', phone: '', avatarUrl: '' }
  }

  let firstName = str(metadata.first_name ?? metadata.firstName)
  let lastName = str(metadata.last_name ?? metadata.lastName)

  const given = str(metadata.given_name)
  const family = str(metadata.family_name)
  if (!firstName && given) firstName = given
  if (!lastName && family) lastName = family

  if (!firstName || !lastName) {
    const full = str(metadata.full_name ?? metadata.name)
    if (full) {
      const parts = full.split(/\s+/).filter(Boolean)
      if (parts.length >= 2) {
        if (!firstName) firstName = parts[0]
        if (!lastName) lastName = parts.slice(1).join(' ')
      } else if (parts.length === 1 && !firstName) {
        firstName = parts[0]
      }
    }
  }

  return {
    firstName,
    lastName,
    phone: str(metadata.phone ?? metadata.phone_number),
    avatarUrl: str(metadata.avatar_url ?? metadata.picture),
  }
}

export function isPlaceholderProfileName(lastName: string): boolean {
  return lastName.trim().toLowerCase() === 'client'
}
