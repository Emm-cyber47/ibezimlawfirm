/** Redirect targets for Supabase auth emails — must be allow-listed in Dashboard → URL Configuration */

export function authEmailConfirmedUrl(): string {
  return `${window.location.origin}/auth/confirmed`
}

export function authResetPasswordUrl(): string {
  return `${window.location.origin}/auth/reset-password`
}
