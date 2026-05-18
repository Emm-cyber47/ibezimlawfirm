export type AuthMethod = 'password' | 'google'

export type AuthUserProfile = {
  email: string
  firstName: string
  lastName: string
  phone: string
  authMethod: AuthMethod
}
