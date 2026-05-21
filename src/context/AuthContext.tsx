import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AuthMethod, AuthUserProfile } from './authTypes'
import {
  checkPassword,
  credentialExists,
  loadProfileRecord,
  persistProfileRecord,
  putCredential,
  readSessionProfile,
  replaceSessionProfile,
  writeSessionProfile,
  clearSessionAcrossStorages,
} from '../auth/demoStorage'
import { defaultProfileFromEmail } from '../lib/profileDisplay'
import {
  fetchAuthUserProfile,
  mapAuthError,
  normalizeEmail,
  updateAuthUserProfile,
} from '../lib/authProfile'
import { authEmailConfirmedUrl, authResetPasswordUrl } from '../lib/authUrls'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'

type LoginResult = { ok: true } | { ok: false; error: string }
type SignupResult =
  | { ok: true; needsEmailConfirmation?: boolean }
  | { ok: false; error: string }
type ProfileUpdateResult = { ok: true } | { ok: false; error: string }

type AuthContextValue = {
  user: AuthUserProfile | null
  authLoading: boolean
  passwordRecoveryPending: boolean
  usesSupabase: boolean
  loginWithPassword: (
    email: string,
    password: string,
    rememberDevice: boolean,
  ) => Promise<LoginResult>
  signUpPassword: (
    payload: {
      firstName: string
      lastName: string
      phone: string
      email: string
      password: string
    },
    rememberDevice: boolean,
  ) => Promise<SignupResult>
  loginWithGoogle: () => Promise<{ ok: true } | { ok: false; error: string }>
  requestPasswordReset: (email: string) => Promise<{ ok: true } | { ok: false; error: string }>
  completePasswordRecovery: (password: string) => Promise<{ ok: true } | { ok: false; error: string }>
  logout: () => Promise<void>
  updateProfile: (patch: {
    firstName: string
    lastName: string
    phone: string
  }) => Promise<ProfileUpdateResult>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function isRecoveryCallbackUrl(): boolean {
  const combined = `${window.location.hash}${window.location.search}`
  return combined.includes('type=recovery')
}

function buildDemoUserFromSavedOrDefault(email: string, authMethod: AuthMethod): AuthUserProfile {
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
  const [user, setUser] = useState<AuthUserProfile | null>(() =>
    isSupabaseConfigured ? null : readSessionProfile(),
  )
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured)
  const [passwordRecoveryPending, setPasswordRecoveryPending] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false)
      return
    }

    const supabase = getSupabase()
    if (!supabase) {
      setAuthLoading(false)
      return
    }
    const client = supabase

    let active = true

    async function applySession() {
      if (isRecoveryCallbackUrl()) setPasswordRecoveryPending(true)
      const { data, error } = await client.auth.getSession()
      if (!active) return
      if (error) console.error('getSession failed:', error.message)
      if (data.session?.user) {
        const profile = await fetchAuthUserProfile(data.session.user)
        if (active) setUser(profile)
      } else if (active) {
        setUser(null)
      }
      if (active) setAuthLoading(false)
    }

    void applySession()

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setPasswordRecoveryPending(true)
      }
      void (async () => {
        if (!active) return
        if (session?.user) {
          const profile = await fetchAuthUserProfile(session.user)
          if (active) setUser(profile)
        } else if (active) {
          setUser(null)
          if (event === 'SIGNED_OUT') setPasswordRecoveryPending(false)
        }
        if (active) setAuthLoading(false)
      })()
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      const supabase = getSupabase()
      if (supabase) await supabase.auth.signOut()
    } else {
      clearSessionAcrossStorages()
    }
    setUser(null)
    setPasswordRecoveryPending(false)
  }, [])

  const loginWithPassword = useCallback(
    async (email: string, password: string, rememberDevice: boolean): Promise<LoginResult> => {
      const normalized = normalizeEmail(email)
      if (!normalized) return { ok: false, error: 'Enter your email.' }

      if (!isSupabaseConfigured) {
        if (!checkPassword(normalized, password)) {
          return { ok: false, error: 'Invalid email or password.' }
        }
        const merged = buildDemoUserFromSavedOrDefault(normalized, 'password')
        persistProfileRecord(merged)
        writeSessionProfile(merged, rememberDevice)
        setUser(merged)
        return { ok: true }
      }

      const supabase = getSupabase()
      if (!supabase) return { ok: false, error: 'Sign-in is not configured.' }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalized,
        password,
      })
      if (error) return { ok: false, error: mapAuthError(error.message) }
      if (!data.user) return { ok: false, error: 'Sign-in failed. Please try again.' }

      const profile = await fetchAuthUserProfile(data.user)
      setUser(profile)
      return { ok: true }
    },
    [],
  )

  const signUpPassword = useCallback(
    async (
      payload: {
        firstName: string
        lastName: string
        phone: string
        email: string
        password: string
      },
      rememberDevice: boolean,
    ): Promise<SignupResult> => {
      const normalized = normalizeEmail(payload.email)
      if (!normalized) return { ok: false, error: 'Enter your email.' }

      if (!isSupabaseConfigured) {
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
      }

      const supabase = getSupabase()
      if (!supabase) return { ok: false, error: 'Sign-up is not configured.' }

      const { data, error } = await supabase.auth.signUp({
        email: normalized,
        password: payload.password,
        options: {
          emailRedirectTo: authEmailConfirmedUrl(),
          data: {
            first_name: payload.firstName.trim(),
            last_name: payload.lastName.trim(),
            phone: payload.phone.trim(),
          },
        },
      })
      if (error) return { ok: false, error: mapAuthError(error.message) }

      if (!data.user) return { ok: false, error: 'Sign-up failed. Please try again.' }

      if (!data.session) {
        return { ok: true, needsEmailConfirmation: true }
      }

      const profile = await fetchAuthUserProfile(data.user)
      setUser(profile)
      return { ok: true }
    },
    [],
  )

  const loginWithGoogle = useCallback(async (): Promise<
    { ok: true } | { ok: false; error: string }
  > => {
    if (!isSupabaseConfigured) {
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
      writeSessionProfile(profile, true)
      setUser(profile)
      return { ok: true }
    }

    const supabase = getSupabase()
    if (!supabase) return { ok: false, error: 'Sign-in is not configured.' }

    const redirectTo = `${window.location.origin}/profile`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
    if (error) return { ok: false, error: mapAuthError(error.message) }
    return { ok: true }
  }, [])

  const requestPasswordReset = useCallback(async (email: string): Promise<
    { ok: true } | { ok: false; error: string }
  > => {
    const normalized = normalizeEmail(email)
    if (!normalized) return { ok: false, error: 'Enter your email.' }

    if (!isSupabaseConfigured) {
      return {
        ok: false,
        error: 'Password reset requires Supabase. Add your API keys to enable email reset.',
      }
    }

    const supabase = getSupabase()
    if (!supabase) return { ok: false, error: 'Password reset is not configured.' }

    const { error } = await supabase.auth.resetPasswordForEmail(normalized, {
      redirectTo: authResetPasswordUrl(),
    })
    if (error) return { ok: false, error: mapAuthError(error.message) }
    return { ok: true }
  }, [])

  const completePasswordRecovery = useCallback(
    async (password: string): Promise<{ ok: true } | { ok: false; error: string }> => {
      if (!isSupabaseConfigured) {
        return { ok: false, error: 'Password reset is not configured.' }
      }
      const supabase = getSupabase()
      if (!supabase) return { ok: false, error: 'Password reset is not configured.' }

      const pw = password.trim()
      if (pw.length < 8) {
        return { ok: false, error: 'Password must be at least 8 characters.' }
      }

      const { error } = await supabase.auth.updateUser({ password: pw })
      if (error) return { ok: false, error: mapAuthError(error.message) }

      setPasswordRecoveryPending(false)
      return { ok: true as const }
    },
    [],
  )

  const updateProfile = useCallback(
    async (patch: {
      firstName: string
      lastName: string
      phone: string
    }): Promise<ProfileUpdateResult> => {
      const prev = user
      if (!prev) return { ok: false, error: 'You are not signed in.' }

      const next: AuthUserProfile = {
        ...prev,
        firstName: patch.firstName.trim(),
        lastName: patch.lastName.trim(),
        phone: patch.phone.trim(),
      }

      if (isSupabaseConfigured && prev.id) {
        const result = await updateAuthUserProfile(prev.id, patch)
        if (!result.ok) return result
        setUser(next)
        return { ok: true }
      }

      persistProfileRecord(next)
      replaceSessionProfile(next)
      setUser(next)
      return { ok: true }
    },
    [user],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      authLoading,
      passwordRecoveryPending,
      usesSupabase: isSupabaseConfigured,
      loginWithPassword,
      signUpPassword,
      loginWithGoogle,
      requestPasswordReset,
      completePasswordRecovery,
      logout,
      updateProfile,
    }),
    [
      user,
      authLoading,
      passwordRecoveryPending,
      loginWithPassword,
      signUpPassword,
      loginWithGoogle,
      requestPasswordReset,
      completePasswordRecovery,
      logout,
      updateProfile,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
