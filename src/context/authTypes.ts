export type AuthMethod = 'password' | 'google'

export type AuthUserProfile = {
  /** Supabase auth user id; absent in local demo mode */
  id?: string
  email: string
  firstName: string
  lastName: string
  phone: string
  authMethod: AuthMethod
}
