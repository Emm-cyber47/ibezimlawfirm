import { getSupabase } from './supabase'

export async function uploadBlogImage(file: File): Promise<string | null> {
  const supabase = getSupabase()

  if (!supabase) return null

  const ext = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from('blog-images')
    .upload(fileName, file)

  if (error) {
    console.error(error)
    return null
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from('blog-images')
    .getPublicUrl(fileName)

  return publicUrl
}