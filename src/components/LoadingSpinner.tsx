import './LoadingSpinner.css'

type LoadingSpinnerProps = {
  message?: string
}

export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <section className="loading-section">
      <div className="container loading-container">
        <div className="loading-spinner" aria-hidden="true">
          <div className="loading-spinner-ring" />
        </div>
        <p className="loading-message">{message}</p>
      </div>
    </section>
  )
}