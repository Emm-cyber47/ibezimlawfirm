import type { ContactFormValues } from './formValidation'
import { getSupabase, isSupabaseConfigured } from './supabase'

export type ContactSubmitResult =
  | { ok: true; stored: 'supabase' | 'local' }
  | { ok: false; error: string }

/**
 * Persists a contact form to Supabase when configured; otherwise succeeds locally
 * (same UX as before — success screen without server storage).
 */
export async function submitContactForm(
  values: ContactFormValues,
): Promise<ContactSubmitResult> {
  const supabase = getSupabase()
  if (!isSupabaseConfigured || !supabase) {
    return { ok: true, stored: 'local' }
  }

  const { error } = await supabase.from('contact_submissions').insert({
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim() || null,
    matter: values.matter.trim() || null,
    message: values.message.trim(),
  })

  if (error) {
    console.error('contact_submissions insert failed:', error.message, error)
    const devHint =
      import.meta.env.DEV && error.message
        ? ` (${error.message})`
        : ''
    return {
      ok: false,
      error: `We could not send your message right now. Please call our office directly.${devHint}`,
    }
  }

  return { ok: true, stored: 'supabase' }
}
