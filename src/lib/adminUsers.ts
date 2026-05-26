import { getSupabase, isSupabaseConfigured } from './supabase'

export type AdminUser = {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  createdAt: string
  updatedAt: string
}

export async function listAllUsers(): Promise<AdminUser[]> {
  if (!isSupabaseConfigured) return []

  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name, phone, created_at, updated_at, role')
    .order('created_at', { ascending: false })

  console.debug('profiles query result:', { data, error })

  if (error) {
    console.error('Failed to load users:', error)
    return []
  }

  if (!data) return []

  return data.map((u) => ({
    id: u.id,
    email: u.email,
    firstName: u.first_name,
    lastName: u.last_name,
    phone: u.phone,
    createdAt: u.created_at,
    updatedAt: u.updated_at,
    role: (u as any).role,
  }))
}

export async function updateUser(userId: string, updates: Partial<Pick<AdminUser, 'firstName' | 'lastName' | 'phone' | 'email'>>): Promise<boolean> {
  if (!isSupabaseConfigured) return false

  const supabase = getSupabase()
  if (!supabase) return false

  const dbUpdates: Record<string, string> = {}
  if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName
  if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone
  if (updates.email !== undefined) dbUpdates.email = updates.email

  const { error } = await supabase
    .from('profiles')
    .update(dbUpdates)
    .eq('id', userId)

  if (error) {
    console.error('Failed to update user:', error)
    return false
  }

  return true
}

export async function deleteUser(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false

  const supabase = getSupabase()
  if (!supabase) return false

  // Delete the profile row (auth.users will cascade due to FK constraint)
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId)

  if (error) {
    console.error('Failed to delete user:', error)
    return false
  }

  return true
}

export async function getUserStats(userId: string): Promise<{
  documentsCount: number
  commentsCount: number
}> {
  if (!isSupabaseConfigured) return { documentsCount: 0, commentsCount: 0 }

  const supabase = getSupabase()
  if (!supabase) return { documentsCount: 0, commentsCount: 0 }

  const { count: documentsCount } = await supabase
    .from('client_documents')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  const { count: commentsCount } = await supabase
    .from('blog_comments')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  return {
    documentsCount: documentsCount || 0,
    commentsCount: commentsCount || 0,
  }
}
