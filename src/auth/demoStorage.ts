import type { AuthUserProfile } from '../context/authTypes'

const PROFILE_SESSION = 'ibezimlaw_demo_profile_session'
/** Demo-only plaintext passwords — replace with OAuth / hashed auth in production */
const CREDENTIALS = 'ibezimlaw_demo_credentials'
/** Long-lived profile shape per email */
const PROFILE_RECORD = 'ibezimlaw_demo_profiles'

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function readJson<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function readCredentials(): Record<string, string> {
  return readJson(localStorage.getItem(CREDENTIALS)) ?? {}
}

function writeCredentials(data: Record<string, string>) {
  localStorage.setItem(CREDENTIALS, JSON.stringify(data))
}

function readPersistedProfiles(): Record<string, Omit<AuthUserProfile, 'email'>> {
  return readJson(localStorage.getItem(PROFILE_RECORD)) ?? {}
}

export function persistProfileRecord(profile: AuthUserProfile) {
  const all = readPersistedProfiles()
  const { email, ...rest } = profile
  all[normalizeEmail(email)] = rest
  localStorage.setItem(PROFILE_RECORD, JSON.stringify(all))
}

export function loadProfileRecord(email: string): Partial<AuthUserProfile> | null {
  const normalized = normalizeEmail(email)
  const blob = readPersistedProfiles()[normalized]
  return blob ? { email: normalized, ...blob } : null
}

/** Clears persisted session tokens from storage used for remembered vs tab sessions */
export function clearSessionAcrossStorages() {
  localStorage.removeItem(PROFILE_SESSION)
  sessionStorage.removeItem(PROFILE_SESSION)
}

export function readSessionProfile(): AuthUserProfile | null {
  return (
    readJson(sessionStorage.getItem(PROFILE_SESSION)) ??
    readJson(localStorage.getItem(PROFILE_SESSION))
  )
}

export function writeSessionProfile(profile: AuthUserProfile, persistDevice: boolean) {
  clearSessionAcrossStorages()
  const serialized = JSON.stringify(profile)
  if (persistDevice) localStorage.setItem(PROFILE_SESSION, serialized)
  else sessionStorage.setItem(PROFILE_SESSION, serialized)
}

/** Update current session without changing which storage bucket is used */
export function replaceSessionProfile(profile: AuthUserProfile) {
  const serialized = JSON.stringify(profile)
  if (localStorage.getItem(PROFILE_SESSION) !== null) {
    localStorage.setItem(PROFILE_SESSION, serialized)
  } else if (sessionStorage.getItem(PROFILE_SESSION) !== null) {
    sessionStorage.setItem(PROFILE_SESSION, serialized)
  }
}

export function credentialExists(email: string): boolean {
  const n = normalizeEmail(email)
  return readCredentials()[n] !== undefined
}

export function putCredential(email: string, password: string) {
  const n = normalizeEmail(email)
  const next = readCredentials()
  next[n] = password
  writeCredentials(next)
}

export function checkPassword(email: string, password: string): boolean {
  const n = normalizeEmail(email)
  const saved = readCredentials()[n]
  if (saved === undefined) return true
  return saved === password
}
