import { useEffect, useState } from 'react'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'

type UseSiteContentResult<T> = {
  content: T
  loading: boolean
}

/**
 * Fetches site content from the `site_content` Supabase table,
 * falling back to the provided static default if nothing is saved yet.
 * Returns `loading: true` until the fetch completes.
 */
export function useSiteContent<T>(key: string, staticDefault: T): UseSiteContentResult<T> {
  const [content, setContent] = useState<T>(staticDefault)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    const supabase = getSupabase()
    if (!supabase) {
      setLoading(false)
      return
    }

    ;(async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('site_content')
        .select('data')
        .eq('key', key)
        .single()

      if (!error && data?.data) {
        setContent(data.data as T)
      }
      setLoading(false)
    })()
  }, [key])

  return { content, loading }
}
