import { useEffect, useState } from 'react'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'

/**
 * Fetches site content from the `site_content` Supabase table,
 * falling back to the provided static default if nothing is saved yet.
 */
export function useSiteContent<T>(key: string, staticDefault: T): T {
  const [content, setContent] = useState<T>(staticDefault)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    const supabase = getSupabase()
    if (!supabase) return

    ;(async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('data')
        .eq('key', key)
        .single()

      if (!error && data?.data) {
        setContent(data.data as T)
      }
    })()
  }, [key])

  return content
}
