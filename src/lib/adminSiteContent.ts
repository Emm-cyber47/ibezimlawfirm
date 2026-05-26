import { getSupabase, isSupabaseConfigured } from './supabase'

export type SiteContentKey =
  | 'firm'
  | 'heroHeadlines'
  | 'heroTrustPillars'
  | 'homeAboutSection'
  | 'homeContent'
  | 'whyChooseUs'
  | 'values'
  | 'aboutPage'
  | 'aboutContent'
  | 'attorney'
  | 'team'
  | 'affiliations'
  | 'practiceAreas'
  | 'socialLinks'
  | 'faqs'

export async function getSiteContent<T>(key: SiteContentKey): Promise<T | null> {
  if (!isSupabaseConfigured) return null

  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('site_content')
    .select('data')
    .eq('key', key)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // not found
    console.error(`Failed to load site content "${key}":`, error)
    return null
  }

  return data?.data as T | null
}

export async function upsertSiteContent(
  key: SiteContentKey,
  data: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabase()

  if (!supabase) {
    return { ok: false, error: 'Supabase not configured.' }
  }

  const { error } = await supabase.from('site_content').upsert(
    { key, data, updated_at: new Date().toISOString() },
    { onConflict: 'key' },
  )

  if (error) {
    console.error(error)
    return { ok: false, error: error.message }
  }

  return { ok: true }
}