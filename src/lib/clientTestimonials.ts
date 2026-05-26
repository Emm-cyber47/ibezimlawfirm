import { getSupabase, isSupabaseConfigured } from './supabase'
import type { Testimonial } from '../types/testimonials'

export async function listAllClientTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured) return []
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('testimonials')
    .select('id, quote, name, location, matter, rating, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to load testimonials:', error)
    return []
  }

  return (data ?? []).map((t: any) => ({
    id: t.id,
    quote: t.quote,
    name: t.name,
    location: t.location,
    matter: t.matter,
    rating: t.rating,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
  }))
}

