import { getSupabase, isSupabaseConfigured } from './supabase'

export type ContactSubmission = {
  id: string
  name: string
  email: string
  phone?: string
  matter?: string
  message: string
  createdAt: string
}

export async function listContactSubmissions(): Promise<ContactSubmission[]> {
  if (!isSupabaseConfigured) return []

  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('contact_submissions')
    .select('id, name, email, phone, matter, message, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to load submissions:', error)
    return []
  }

  return (data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    phone: s.phone || undefined,
    matter: s.matter || undefined,
    message: s.message,
    createdAt: s.created_at,
  }))
}

export async function getContactSubmission(id: string): Promise<ContactSubmission | null> {
  if (!isSupabaseConfigured) return null

  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('contact_submissions')
    .select('id, name, email, phone, matter, message, created_at')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Failed to load submission:', error)
    return null
  }

  return data
    ? {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        matter: data.matter || undefined,
        message: data.message,
        createdAt: data.created_at,
      }
    : null
}

export async function deleteContactSubmission(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false

  const supabase = getSupabase()
  if (!supabase) return false

  const { error } = await supabase.from('contact_submissions').delete().eq('id', id)

  if (error) {
    console.error('Failed to delete submission:', error)
    return false
  }

  return true
}
