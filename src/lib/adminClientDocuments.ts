import { getSupabase, isSupabaseConfigured } from './supabase'

export type AdminClientDocument = {
  id: string
  userId: string
  userEmail: string
  fileName: string
  mimeType: string
  size: number
  note: string
  status: string
  uploadedAt: string
  storagePath: string | null
}

export async function listAllClientDocuments(): Promise<AdminClientDocument[]> {
  if (!isSupabaseConfigured) return []

  const supabase = getSupabase()
  if (!supabase) return []

  const { data: docs, error: docsError } = await supabase
    .from('client_documents')
    .select('id, user_id, file_name, mime_type, size, note, status, uploaded_at, storage_path')
    .order('uploaded_at', { ascending: false })

  if (docsError) {
    console.error('Failed to load documents:', docsError)
    return []
  }

  if (!docs || docs.length === 0) return []

  const userIds = [...new Set(docs.map((d) => d.user_id))]
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, email')
    .in('id', userIds)

  if (profilesError) {
    console.error('Failed to load user emails:', profilesError)
  }

  const emailMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p.email]))

  return (docs ?? []).map((d) => ({
    id: d.id,
    userId: d.user_id,
    userEmail: emailMap[d.user_id] || 'unknown',
    fileName: d.file_name,
    mimeType: d.mime_type,
    size: d.size,
    note: d.note,
    status: d.status,
    uploadedAt: d.uploaded_at,
    storagePath: d.storage_path ?? null,
  }))
}

export async function updateDocumentStatus(
  id: string,
  status: string,
): Promise<boolean> {
  if (!isSupabaseConfigured) return false

  const supabase = getSupabase()
  if (!supabase) return false

  const { error } = await supabase
    .from('client_documents')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Failed to update document status:', error)
    return false
  }

  return true
}

export async function deleteClientDocument(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false

  const supabase = getSupabase()
  if (!supabase) return false

  // Delete DB row first (this is what the admin table is listing).
  // Also delete the storage file (otherwise it may look like the delete "didn't work").
  const { data: row, error: rowError } = await supabase
    .from('client_documents')
    .select('storage_path')
    .eq('id', id)
    .maybeSingle()

  if (rowError) {
    console.error('Failed to load document for deletion:', rowError)
    return false
  }

  const { error: deleteError } = await supabase
    .from('client_documents')
    .delete()
    .eq('id', id)

  if (deleteError) {
    console.error('Failed to delete document row:', deleteError)
    return false
  }

  const storagePath = row?.storage_path ?? null
  if (storagePath) {
    const { error: storageError } = await supabase.storage
      .from('client-documents')
      .remove([storagePath])

    // If storage removal fails, still return true so the DB state matches.
    // But log the error to help debugging.
    if (storageError) {
      console.error('Failed to delete document from storage:', storageError)
    }
  }

  return true
}


export async function downloadClientDocument(storagePath: string, fileName: string) {
  if (!isSupabaseConfigured) throw new Error('Database not configured')
  const supabase = getSupabase()
  if (!supabase) throw new Error('Database connection failed')

  const { data, error } = await supabase.storage
    .from('client-documents')
    .download(storagePath)

  if (error) {
    console.error('Download error:', error)
    throw new Error('Could not download document.')
  }

  const url = URL.createObjectURL(data)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 100)
}
