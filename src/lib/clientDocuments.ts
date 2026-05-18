export type ClientDocument = {
  id: string
  userEmail: string
  fileName: string
  mimeType: string
  size: number
  note: string
  uploadedAt: string
  status: 'submitted'
}

const DB_NAME = 'ibezimlaw_client_documents'
const DB_VERSION = 1
const STORE = 'documents'
const UPDATE_EVENT = 'client-documents-updated'

export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024

const ALLOWED_EXTENSIONS = new Set([
  'pdf',
  'doc',
  'docx',
  'txt',
  'rtf',
  'jpg',
  'jpeg',
  'png',
  'heic',
  'webp',
])

const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/rtf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
])

type StoredDocument = ClientDocument & { blob: Blob }

function extensionOf(name: string) {
  const i = name.lastIndexOf('.')
  return i >= 0 ? name.slice(i + 1).toLowerCase() : ''
}

export function validateDocumentFile(file: File): string | null {
  if (!file.name.trim()) return 'Choose a file to upload.'
  if (file.size === 0) return 'The selected file is empty.'
  if (file.size > MAX_DOCUMENT_BYTES) {
    return `File must be ${formatFileSize(MAX_DOCUMENT_BYTES)} or smaller.`
  }
  const ext = extensionOf(file.name)
  if (!ALLOWED_EXTENSIONS.has(ext) && !ALLOWED_MIME.has(file.type)) {
    return 'Allowed types: PDF, Word, text, and common images (JPG, PNG).'
  }
  return null
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onerror = () => reject(req.error ?? new Error('Could not open document storage.'))
    req.onsuccess = () => resolve(req.result)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' })
        store.createIndex('userEmail', 'userEmail', { unique: false })
        store.createIndex('uploadedAt', 'uploadedAt', { unique: false })
      }
    }
  })
}

function notify() {
  window.dispatchEvent(new Event(UPDATE_EVENT))
}

export function subscribeClientDocuments(callback: () => void) {
  const handler = () => callback()
  window.addEventListener(UPDATE_EVENT, handler)
  return () => window.removeEventListener(UPDATE_EVENT, handler)
}

export async function addClientDocument(
  userEmail: string,
  file: File,
  note: string,
): Promise<ClientDocument> {
  const validation = validateDocumentFile(file)
  if (validation) throw new Error(validation)

  const normalized = userEmail.trim().toLowerCase()
  const record: StoredDocument = {
    id: crypto.randomUUID(),
    userEmail: normalized,
    fileName: file.name,
    mimeType: file.type || 'application/octet-stream',
    size: file.size,
    note: note.trim(),
    uploadedAt: new Date().toISOString(),
    status: 'submitted',
    blob: file,
  }

  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error('Upload failed.'))
    tx.objectStore(STORE).put(record)
  })
  db.close()

  notify()
  const { blob: _b, ...meta } = record
  return meta
}

export async function listClientDocuments(userEmail: string): Promise<ClientDocument[]> {
  const normalized = userEmail.trim().toLowerCase()
  const db = await openDb()
  const all = await new Promise<StoredDocument[]>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).getAll()
    req.onsuccess = () => resolve((req.result as StoredDocument[]) ?? [])
    req.onerror = () => reject(req.error ?? new Error('Could not load documents.'))
  })
  db.close()

  return all
    .filter((d) => d.userEmail === normalized)
    .map(({ blob: _b, ...meta }) => meta)
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
}

async function getStoredDocument(id: string): Promise<StoredDocument | null> {
  const db = await openDb()
  const doc = await new Promise<StoredDocument | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(id)
    req.onsuccess = () => resolve(req.result as StoredDocument | undefined)
    req.onerror = () => reject(req.error ?? new Error('Could not read document.'))
  })
  db.close()
  return doc ?? null
}

export async function downloadClientDocument(id: string, userEmail: string) {
  const doc = await getStoredDocument(id)
  if (!doc || doc.userEmail !== userEmail.trim().toLowerCase()) {
    throw new Error('Document not found.')
  }
  const url = URL.createObjectURL(doc.blob)
  const a = document.createElement('a')
  a.href = url
  a.download = doc.fileName
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export async function deleteClientDocument(id: string, userEmail: string) {
  const doc = await getStoredDocument(id)
  if (!doc || doc.userEmail !== userEmail.trim().toLowerCase()) {
    throw new Error('Document not found.')
  }
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error('Could not delete document.'))
    tx.objectStore(STORE).delete(id)
  })
  db.close()
  notify()
}
