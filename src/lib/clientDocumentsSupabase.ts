import { getSupabase, isSupabaseConfigured } from './supabase'
import type { ClientDocument } from './clientDocuments'

function makeStorageObjectName(userId: string, fileName: string, storageId: string) {
  const safeName = fileName.replace(/[^\w.\-]+/g, '_')
  return `${userId}/${storageId}_${safeName}`
}

export async function addClientDocumentToSupabase(params: {
  userId: string
  userEmail: string
  file: File
  note: string
}): Promise<Omit<ClientDocument, 'blob' | 'status'> & { status?: 'submitted' }> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.')
  const supabase = getSupabase()

  const { userId, file, note } = params

  const normalizedEmail = params.userEmail.trim().toLowerCase()
  const storageId = crypto.randomUUID()
  const objectName = makeStorageObjectName(userId, file.name, storageId)

  // 1) Upload file to Storage (must be inside folder auth.uid())
  const { error: storageError } = await supabase.storage
    .from('client-documents')
    .upload(objectName, file, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    })
  if (storageError) throw new Error(storageError.message)

  // 2) Insert metadata row in table
  const { error: dbError } = await supabase.from('client_documents').insert({
    user_id: userId,
    file_name: file.name,
    mime_type: file.type || 'application/octet-stream',
    size: file.size,
    note: note.trim(),
    status: 'submitted',
    storage_path: objectName,
    // uploaded_at defaults to now()
  })

  if (dbError) throw new Error(dbError.message)

  // Return shape compatible with existing UI expectations
  return {
    id: storageId,
    userEmail: normalizedEmail,
    fileName: file.name,
    mimeType: file.type || 'application/octet-stream',
    size: file.size,
    note: note.trim(),
    uploadedAt: new Date().toISOString(),
    status: 'submitted',
  }
}
