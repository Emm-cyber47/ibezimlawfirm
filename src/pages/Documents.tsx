import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { firm } from '../data/site'
import { useAuth } from '../context/AuthContext'
import FormField from '../components/FormField'
import { useClientDocuments } from '../hooks/useClientDocuments'
import {
  addClientDocument,
  downloadClientDocument,
  formatFileSize,
  MAX_DOCUMENT_BYTES,
  validateDocumentFile,
  type ClientDocument,
} from '../lib/clientDocuments'
import { addClientDocumentToSupabase } from '../lib/clientDocumentsSupabase'
import '../components/FormField.css'
import './Documents.css'

function fileTypeLabel(mime: string, name: string) {
  if (mime.includes('pdf') || name.endsWith('.pdf')) return 'PDF'
  if (mime.includes('word') || name.match(/\.docx?$/i)) return 'Document'
  if (mime.startsWith('image/')) return 'Image'
  if (mime.startsWith('text/')) return 'Text'
  return 'File'
}

function DocIcon({ mime, name }: { mime: string; name: string }) {
  const label = fileTypeLabel(mime, name)
  return (
    <span className="doc-list-icon" aria-hidden>
      {label === 'PDF' ? 'PDF' : label === 'Image' ? 'IMG' : 'DOC'}
    </span>
  )
}

function DocumentRow({
  doc,
  onDownload,
  downloading,
}: {
  doc: ClientDocument
  onDownload: (id: string) => void
  downloading: string | null
}) {
  return (
    <li className="doc-list-item">
      <DocIcon mime={doc.mimeType} name={doc.fileName} />
      <div className="doc-list-body">
        <p className="doc-list-name">{doc.fileName}</p>
        {doc.note ? <p className="doc-list-note">{doc.note}</p> : null}
        <p className="doc-list-meta">
          <time dateTime={doc.uploadedAt}>
            {new Date(doc.uploadedAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </time>
          <span aria-hidden> · </span>
          {formatFileSize(doc.size)}
          <span aria-hidden> · </span>
          <span className="doc-list-status">Submitted to firm</span>
        </p>
      </div>
      <button
        type="button"
        className="btn btn-navy doc-download-btn"
        onClick={() => onDownload(doc.id)}
        disabled={downloading === doc.id}
        aria-busy={downloading === doc.id}
      >
        {downloading === doc.id ? 'Preparing…' : 'Download'}
      </button>
    </li>
  )
}

export default function Documents() {
  const { user } = useAuth()
  const { documents, loading, refresh } = useClientDocuments(user?.email)
  const fileRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [note, setNote] = useState('')
  const [fileError, setFileError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  if (!user) return null

  const userEmail = user.email

  function onFileChange(file: File | null) {
    setSelectedFile(file)
    setSubmitSuccess(false)
    if (!file) {
      setFileError(null)
      return
    }
    setFileError(validateDocumentFile(file))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(false)

    if (!selectedFile) {
      setFileError('Choose a file to upload.')
      return
    }
    const err = validateDocumentFile(selectedFile)
    if (err) {
      setFileError(err)
      return
    }

    setSubmitting(true)
    try {
      // Supabase mode (persistent + visible to admin)
      if (user?.id) {
        await addClientDocumentToSupabase({
          userId: user.id,
          userEmail,
          file: selectedFile,
          note,
        })
      } else {
        // Demo/local mode (IndexedDB only)
        await addClientDocument(userEmail, selectedFile, note)
      }

      setSelectedFile(null)
      setNote('')
      setFileError(null)
      if (fileRef.current) fileRef.current.value = ''
      setSubmitSuccess(true)
      await refresh()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDownload(id: string) {
    setSubmitError(null)
    setDownloadingId(id)
    try {
      await downloadClientDocument(id, userEmail)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Download failed.')
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <>
      <section className="page-hero documents-hero">
        <div className="container documents-hero-inner">
          <span className="section-label documents-hero-label">Client portal</span>
          <h1 className="section-title documents-hero-title">Your documents</h1>
          <p className="section-lead documents-hero-lead">
            Securely submit files to {firm.name}. Uploads are stored on this device for now — connect your
            backend to deliver them to your admin inbox.
          </p>
        </div>
      </section>

      <section className="section documents-body">
        <div className="container documents-layout">
          <div className="documents-luxe-card documents-upload-card">
            <span className="documents-card-shine" aria-hidden />
            <h2 className="documents-card-title">Submit a document</h2>
            <p className="documents-card-lead">
              PDF, Word, text, or images up to {formatFileSize(MAX_DOCUMENT_BYTES)}. Your firm will review
              submissions from your account.
            </p>

            <form className="documents-upload-form" onSubmit={handleSubmit} noValidate>
              {submitError && (
                <p className="form-summary-error" role="alert">
                  {submitError}
                </p>
              )}
              {submitSuccess && (
                <p className="documents-success" role="status">
                  Document submitted successfully. It appears in your uploads below.
                </p>
              )}

              <div className={`documents-file-zone${fileError ? ' documents-file-zone--error' : ''}`}>
                <input
                  ref={fileRef}
                  id="doc-file-input"
                  type="file"
                  className="documents-file-input"
                  accept=".pdf,.doc,.docx,.txt,.rtf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
                  onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
                  aria-invalid={Boolean(fileError)}
                  aria-describedby={fileError ? 'doc-file-error' : undefined}
                />
                <label htmlFor="doc-file-input" className="documents-file-label">
                  <span className="documents-file-label-title">
                    {selectedFile ? selectedFile.name : 'Choose file or tap to browse'}
                  </span>
                  <span className="documents-file-label-hint">
                    {selectedFile
                      ? formatFileSize(selectedFile.size)
                      : `Max ${formatFileSize(MAX_DOCUMENT_BYTES)} · PDF, DOC, JPG, PNG`}
                  </span>
                </label>
              </div>
              {fileError && (
                <p id="doc-file-error" className="documents-file-error" role="alert">
                  {fileError}
                </p>
              )}

              <FormField id="doc-note" label="Note for the firm (optional)">
                {(a) => (
                  <textarea
                    {...a}
                    className="documents-textarea"
                    rows={3}
                    maxLength={500}
                    placeholder="e.g. Retainer agreement, medical records, court notice…"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                )}
              </FormField>

              <button type="submit" className="btn btn-primary documents-submit" disabled={submitting}>
                {submitting ? 'Uploading…' : 'Submit to firm'}
              </button>
            </form>
          </div>

          <div className="documents-luxe-card documents-list-card">
            <span className="documents-card-shine" aria-hidden />
            <div className="documents-list-header">
              <h2 className="documents-card-title">Your uploads</h2>
              <span className="documents-count">
                {loading ? '…' : documents.length}{' '}
                {!loading && (documents.length === 1 ? 'file' : 'files')}
              </span>
            </div>

            {loading ? (
              <p className="documents-empty">Loading your documents…</p>
            ) : documents.length === 0 ? (
              <p className="documents-empty">
                No documents yet. Use the form to submit your first file to the firm.
              </p>
            ) : (
              <ul className="doc-list">
                {documents.map((doc) => (
                  <DocumentRow
                    key={doc.id}
                    doc={doc}
                    onDownload={handleDownload}
                    downloading={downloadingId}
                  />
                ))}
              </ul>
            )}

            <p className="documents-footnote">
              Downloads retrieve the copy stored on this device. When you connect a server, files will sync
              to your admin dashboard automatically.
            </p>
          </div>

          <p className="documents-back">
            <Link to="/profile" className="documents-back-link">
              ← Back to profile
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
