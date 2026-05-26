import type { User } from '@supabase/supabase-js'
import type { AuthMethod, AuthUserProfile } from '../context/authTypes'
import { defaultProfileFromEmail } from './profileDisplay'
import {
  isPlaceholderProfileName,
  parseOAuthProfileFields,
} from './oauthUserMetadata'
import { getSupabase } from './supabase'

type ProfileRow = {
  first_name: string
  last_name: string
  phone: string
  email: string
  role?: string
  avatar_url?: string | null
}

type ResolvedProfile = {
  firstName: string
  lastName: string
  phone: string
  avatarUrl: string
}

/** Avoid repeated OAuth writes in the same browser session */
const oauthSyncDoneFor = new Set<string>()

const PROFILE_BASE_SELECT = 'first_name, last_name, phone, email, role'


/** Set VITE_PROFILES_AVATAR_COLUMN=true in .env.local after running migration 20250521000003 */
function profilesAvatarColumnEnabled(): boolean {
  return import.meta.env.VITE_PROFILES_AVATAR_COLUMN === 'true'
}

function profileSnapshot(resolved: ResolvedProfile): string {
  return [resolved.firstName, resolved.lastName, resolved.phone, resolved.avatarUrl].join('|')
}

async function loadProfileRow(
  supabase: NonNullable<ReturnType<typeof getSupabase>>,
  userId: string,
): Promise<ProfileRow | null> {
  if (profilesAvatarColumnEnabled()) {
    const { data, error } = await supabase
      .from('profiles')
      .select(`${PROFILE_BASE_SELECT}, avatar_url`)
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      if (import.meta.env.DEV) console.warn('profiles fetch:', error.message)
      return null
    }
    return data
  }

  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_BASE_SELECT)
    .eq('id', userId)
    .maybeSingle()


  if (error) {
    if (import.meta.env.DEV) console.warn('profiles fetch:', error.message)
    return null
  }

  return data ? { ...data, avatar_url: '' } : null
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function authMethodFromUser(user: User): AuthMethod {
  const provider = user.app_metadata?.provider as string | undefined
  if (provider === 'google') return 'google'
  if (user.identities?.some((i) => i.provider === 'google')) return 'google'
  return 'password'
}

/** Email/password accounts must confirm via inbox before sign-in (OAuth exempt) */
export function isPasswordAccountEmailConfirmed(user: User): boolean {
  if (authMethodFromUser(user) !== 'password') return true
  return Boolean(user.email_confirmed_at)
}

function resolveProfileFields(
  row: ProfileRow | null,
  oauth: ReturnType<typeof parseOAuthProfileFields>,
  authMethod: AuthMethod,
  email: string,
): ResolvedProfile {
  const defaults = defaultProfileFromEmail(email, authMethod)
  const isGoogle = authMethod === 'google'

  let firstName = row?.first_name?.trim() ?? ''
  let lastName = row?.last_name?.trim() ?? ''
  let phone = row?.phone?.trim() ?? ''
  let avatarUrl = row?.avatar_url?.trim() ?? ''

  const needsNameFix =
    !firstName ||
    !lastName ||
    isPlaceholderProfileName(lastName) ||
    (isGoogle && oauth.firstName && firstName !== oauth.firstName) ||
    (isGoogle && oauth.lastName && (lastName !== oauth.lastName || isPlaceholderProfileName(lastName)))

  if (needsNameFix && (oauth.firstName || oauth.lastName)) {
    if (oauth.firstName) firstName = oauth.firstName
    if (oauth.lastName) lastName = oauth.lastName
  }

  if (!phone && oauth.phone) phone = oauth.phone
  if (!avatarUrl && oauth.avatarUrl) avatarUrl = oauth.avatarUrl
  if (isGoogle && oauth.avatarUrl) avatarUrl = oauth.avatarUrl

  if (!isGoogle || (!oauth.firstName && !oauth.lastName)) {
    if (!firstName) firstName = defaults.firstName
    if (!lastName) lastName = defaults.lastName
  } else {
    if (!firstName) firstName = oauth.firstName || defaults.firstName
    if (!lastName) lastName = oauth.lastName
  }

  return { firstName, lastName, phone, avatarUrl }
}

function shouldSyncProfileToDb(
  userId: string,
  row: ProfileRow | null,
  resolved: ResolvedProfile,
  oauth: ReturnType<typeof parseOAuthProfileFields>,
  authMethod: AuthMethod,
  canStoreAvatarInDb: boolean,
): boolean {
  if (authMethod !== 'google' && !oauth.avatarUrl) return false
  if (!oauth.firstName && !oauth.lastName && !oauth.avatarUrl && !oauth.phone) return false

  const syncKey = `${userId}:${profileSnapshot(resolved)}`
  if (oauthSyncDoneFor.has(syncKey)) return false

  if (!row) return true

  const dbFirst = row.first_name?.trim() ?? ''
  const dbLast = row.last_name?.trim() ?? ''
  const dbPhone = row.phone?.trim() ?? ''
  const dbAvatar = (row.avatar_url ?? '').trim()

  if (resolved.firstName && dbFirst !== resolved.firstName) return true
  if (resolved.lastName && dbLast !== resolved.lastName) return true
  if (resolved.phone && dbPhone !== resolved.phone) return true
  if (canStoreAvatarInDb && resolved.avatarUrl && dbAvatar !== resolved.avatarUrl) return true
  if (isPlaceholderProfileName(dbLast) && resolved.lastName) return true

  oauthSyncDoneFor.add(syncKey)
  return false
}

async function syncProfileFromOAuth(
  userId: string,
  email: string,
  row: ProfileRow | null,
  resolved: ResolvedProfile,
  canStoreAvatarInDb: boolean,
): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) return

  const payload: Record<string, string> = {
    first_name: resolved.firstName,
    last_name: resolved.lastName,
    phone: resolved.phone,
    updated_at: new Date().toISOString(),
  }
  if (canStoreAvatarInDb) payload.avatar_url = resolved.avatarUrl

  const syncKey = `${userId}:${profileSnapshot(resolved)}`

  const error = row
    ? (await supabase.from('profiles').update(payload).eq('id', userId)).error
    : (await supabase.from('profiles').insert({ id: userId, email, ...payload })).error

  if (error) {
    if (import.meta.env.DEV) console.warn('profiles oauth sync skipped:', error.message)
    return
  }

  oauthSyncDoneFor.add(syncKey)
}

export async function fetchAuthUserProfile(user: User): Promise<AuthUserProfile> {
  const supabase = getSupabase()
  const email = normalizeEmail(user.email ?? '')
  const authMethod = authMethodFromUser(user)
  const oauth = parseOAuthProfileFields(user.user_metadata as Record<string, unknown>)

  let row: ProfileRow | null = null
  let canStoreAvatarInDb = false

  if (supabase) {
    canStoreAvatarInDb = profilesAvatarColumnEnabled()
    row = await loadProfileRow(supabase, user.id)
  }

  const resolved = resolveProfileFields(row, oauth, authMethod, email)

  if (
    supabase &&
    shouldSyncProfileToDb(user.id, row, resolved, oauth, authMethod, canStoreAvatarInDb)
  ) {
    await syncProfileFromOAuth(user.id, email, row, resolved, canStoreAvatarInDb)
  }

  // Attempt to read admin role from profiles row if it exists.
  // Note: AuthUserProfile type currently doesn't include role; we attach it dynamically.
  const dbRole = (row as any)?.role

  return {
    id: user.id,
    email: normalizeEmail(row?.email ?? email),
    firstName: resolved.firstName,
    lastName: resolved.lastName,
    phone: resolved.phone,
    avatarUrl: resolved.avatarUrl || undefined,
    authMethod,
    ...(dbRole ? { role: dbRole } : {}),
  }
}



export async function updateAuthUserProfile(
  userId: string,
  patch: { firstName: string; lastName: string; phone: string },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabase()
  if (!supabase) return { ok: false, error: 'Profile storage is not configured.' }

  const { error } = await supabase
    .from('profiles')
    .update({
      first_name: patch.firstName.trim(),
      last_name: patch.lastName.trim(),
      phone: patch.phone.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) {
    if (import.meta.env.DEV) console.warn('profiles update failed:', error.message)
    return { ok: false, error: 'Could not save your profile. Please try again.' }
  }
  return { ok: true }
}

/** User-facing messages for Supabase Auth API errors */
export function mapAuthError(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('invalid login credentials')) return 'Invalid email or password.'
  if (m.includes('email not confirmed')) return 'Confirm your email using the link we sent, then sign in.'
  if (m.includes('user already registered') || m.includes('already been registered')) {
    return 'An account already exists for this email. Sign in or check your inbox for a confirmation link.'
  }
  if (m.includes('signup') && m.includes('email') && m.includes('sent')) {
    return 'Check your email for a confirmation link, then sign in.'
  }
  if (m.includes('password should be at least') || m.includes('weak password')) {
    return 'Use a stronger password (at least 8 characters).'
  }
  if (m.includes('signup is disabled')) return 'New sign-ups are temporarily unavailable. Please call our office.'
  if (m.includes('rate limit') || m.includes('too many requests')) {
    return 'Too many attempts. Please wait a moment and try again.'
  }
  return message
}
