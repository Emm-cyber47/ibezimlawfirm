import type { ReactNode } from 'react'
import './FormField.css'

type FormFieldProps = {
  id: string
  label: string
  error?: string
  showError?: boolean
  children: (props: {
    id: string
    'aria-invalid': boolean
    'aria-describedby': string | undefined
  }) => ReactNode
}

export default function FormField({ id, label, error, showError, children }: FormFieldProps) {
  const hasError = Boolean(showError && error)
  const errorId = `${id}-error`

  return (
    <div className={`form-group ${hasError ? 'form-group--error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children({
        id,
        'aria-invalid': hasError,
        'aria-describedby': hasError ? errorId : undefined,
      })}
      {hasError && (
        <p className="form-error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
