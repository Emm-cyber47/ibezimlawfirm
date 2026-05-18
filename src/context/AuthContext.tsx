import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AuthMethod, AuthUserProfile } from './authTypes'
import {
  checkPassword,
  credentialExists,
  loadProfileRecord,
  normalizeEmail,
  persistProfileRecord,
  putCredential,
  readSessionProfile,
  replaceSessionProfile,
  writeSessionProfile,
  clearSessionAcrossStorages,
} from '../auth/demoStorage'
import { defaultProfileFromEmail } from '../lib/profileDisplay'

type LoginResult =
  | { ok: true }
  | { ok: false; error: string }

type SignupResult =
  | { ok: true }
  | { ok: false; error: string }

type AuthContextValue = {
  user: AuthUserProfile | null
  loginWithPassword: (email: string, password: string, rememberDevice: boolean) => LoginResult
  signUpPassword: (
    payload: {
      firstName: string
      lastName: string
      phone: string
      email: string
      password: string
    },
    rememberDevice: boolean,
  ) => SignupResult
  loginWithGoogleDemo: (rememberDevice: boolean) => void
  logout: () => void
  updateProfile: (patch: { firstName: string; lastName: string; phone: string }) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function buildUserFromSavedOrDefault(email: string, authMethod: AuthMethod): AuthUserProfile {
  const normalized = normalizeEmail(email)
  const saved = loadProfileRecord(normalized)
  const defaults = defaultProfileFromEmail(normalized, authMethod)
  return {
    email: normalized,
    firstName: (saved?.firstName?.trim() || defaults.firstName).trim(),
    lastName: (saved?.lastName?.trim() || defaults.lastName).trim(),
    phone: saved?.phone?.trim() ?? '',
    authMethod: saved?.authMethod ?? authMethod,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUserProfile | null>(() => readSessionProfile())

  const logout = useCallback(() => {
    clearSessionAcrossStorages()
    setUser(null)
  }, [])

  const loginWithPassword = useCallback(
    (email: string, password: string, rememberDevice: boolean): LoginResult => {
      const normalized = normalizeEmail(email)
      if (!normalized) return { ok: false, error: 'Enter your email.' }
      if (!checkPassword(normalized, password)) {
        return { ok: false, error: 'Invalid email or password.' }
      }
      const merged = buildUserFromSavedOrDefault(normalized, 'password')
      persistProfileRecord(merged)
      writeSessionProfile(merged, rememberDevice)
      setUser(merged)
      return { ok: true }
    },
    [],
  )

  const signUpPassword = useCallback(
    (
      payload: {
        firstName: string
        lastName: string
        phone: string
        email: string
        password: string
      },
      rememberDevice: boolean,
    ): SignupResult => {
      const normalized = normalizeEmail(payload.email)
      if (credentialExists(normalized)) {
        return { ok: false, error: 'An account already exists for this email. Please sign in.' }
      }
      putCredential(normalized, payload.password)
      const profile: AuthUserProfile = {
        email: normalized,
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
        phone: payload.phone.trim(),
        authMethod: 'password',
      }
      persistProfileRecord(profile)
      writeSessionProfile(profile, rememberDevice)
      setUser(profile)
      return { ok: true }
    },
    [],
  )

  const loginWithGoogleDemo = useCallback((rememberDevice: boolean) => {
    const email = 'google.demo@clients.ibezimlaw.com'
    const normalized = normalizeEmail(email)
    const existing = loadProfileRecord(normalized) as Partial<AuthUserProfile> | null
    const profile: AuthUserProfile =
      existing?.firstName && existing.lastName !== undefined && existing.authMethod
        ? {
            email: normalized,
            firstName: existing.firstName,
            lastName: existing.lastName,
            phone: existing.phone ?? '',
            authMethod: 'google',
          }
        : {
            email: normalized,
            firstName: 'Google',
            lastName: 'Client',
            phone: '',
            authMethod: 'google',
          }
    persistProfileRecord(profile)
    writeSessionProfile(profile, rememberDevice)
    setUser(profile)
  }, [])

  const updateProfile = useCallback((patch: { firstName: string; lastName: string; phone: string }) => {
    setUser((prev) => {
      if (!prev) return prev
      const next: AuthUserProfile = {
        ...prev,
        firstName: patch.firstName.trim(),
        lastName: patch.lastName.trim(),
        phone: patch.phone.trim(),
      }
      persistProfileRecord(next)
      replaceSessionProfile(next)
      return next
    })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loginWithPassword,
      signUpPassword,
      loginWithGoogleDemo,
      logout,
      updateProfile,
    }),
    [user, loginWithPassword, signUpPassword, loginWithGoogleDemo, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
