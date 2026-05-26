import { getSupabase, isSupabaseConfigured } from './supabase'
import type {
  CreateTestimonialPayload,
  Testimonial,
  UpdateTestimonialPayload,
} from '../types/testimonials'

export async function listAllTestimonials(): Promise<Testimonial[]> {
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

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  if (!isSupabaseConfigured) return null
  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('testimonials')
    .select('id, quote, name, location, matter, rating, created_at, updated_at')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Failed to load testimonial:', error)
    return null
  }

  const t = data as any
  return {
    id: t.id,
    quote: t.quote,
    name: t.name,
    location: t.location,
    matter: t.matter,
    rating: t.rating,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
  }
}

export async function createTestimonial(
  payload: CreateTestimonialPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabase()
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, error: 'Supabase not configured.' }
  }

  const { error } = await supabase.from('testimonials').insert({
    ...payload,
  })

  if (error) {
    console.error(error)
    return { ok: false, error: error.message }
  }

  return { ok: true }
}

export async function updateTestimonial(
  id: string,
  patch: UpdateTestimonialPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabase()
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, error: 'Supabase not configured.' }
  }

  const { error } = await supabase
    .from('testimonials')
    .update({
      ...patch,
    })
    .eq('id', id)

  if (error) {
    console.error(error)
    return { ok: false, error: error.message }
  }

  return { ok: true }
}

export async function deleteTestimonial(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabase()
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, error: 'Supabase not configured.' }
  }

  const { error } = await supabase.from('testimonials').delete().eq('id', id)

  if (error) {
    console.error(error)
    return { ok: false, error: error.message }
  }

  return { ok: true }
}

