// import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// /** True when `.env.local` has both Vite Supabase variables set */
// export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// let client: SupabaseClient | null = null

// export function getSupabase(): SupabaseClient | null {
//   if (!isSupabaseConfigured) return null
//   if (!client) {
//     client = createClient(supabaseUrl!, supabaseAnonKey!, {
//       auth: {
//         persistSession: true,
//         autoRefreshToken: true,
//         detectSessionInUrl: true,
//       },
//     })
//   }
//   return client
// }

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase is not configured. Check your environment variables.')
  }

  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }

  return client
}