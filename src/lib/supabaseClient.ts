import { getSupabase } from './supabase'

const client = getSupabase()

if (!client) {
  throw new Error('Supabase is not configured. Check environment variables.')
}

export const supabase = client