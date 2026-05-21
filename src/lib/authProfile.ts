import type { User } from '@supabase/supabase-js'
import type { AuthMethod, AuthUserProfile } from '../context/authTypes'
import { defaultProfileFromEmail } from './profileDisplay'
import { getSupabase } from './supabase'

type ProfileRow = {
  first_name: string
  last_name: string
  phone: string
  email: string
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

export async function fetchAuthUserProfile(user: User): Promise<AuthUserProfile> {
  const supabase = getSupabase()
  const email = normalizeEmail(user.email ?? '')
  const authMethod = authMethodFromUser(user)
  const defaults = defaultProfileFromEmail(email, authMethod)

  let row: ProfileRow | null = null
  if (supabase) {
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, phone, email')
      .eq('id', user.id)
      .maybeSingle()
    if (error) console.error('profiles fetch failed:', error.message)
    row = data
  }

  const meta = user.user_metadata ?? {}
  const metaFirst = String(meta.first_name ?? meta.firstName ?? '')
  const metaLast = String(meta.last_name ?? meta.lastName ?? '')
  const metaPhone = String(meta.phone ?? '')

  return {
    id: user.id,
    email: normalizeEmail(row?.email ?? email),
    firstName: (row?.first_name?.trim() || metaFirst.trim() || defaults.firstName).trim(),
    lastName: (row?.last_name?.trim() || metaLast.trim() || defaults.lastName).trim(),
    phone: (row?.phone?.trim() || metaPhone.trim() || '').trim(),
    authMethod,
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
    console.error('profiles update failed:', error.message)
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
    return 'An account already exists for this email. Please sign in.'
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
