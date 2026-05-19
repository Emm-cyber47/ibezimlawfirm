import type { ReactNode } from 'react'
import './LuxeCard.css'

type LuxeCardProps = {
  children: ReactNode
  className?: string
  icon?: ReactNode
  num?: string
  as?: 'article' | 'div' | 'aside'
}

export default function LuxeCard({
  children,
  className = '',
  icon,
  num,
  as: Tag = 'article',
}: LuxeCardProps) {
  return (
    <Tag className={`luxe-card ${className}`.trim()}>
      <span className="luxe-card-shine" aria-hidden />
      {num ? (
        <span className="luxe-card-num" aria-hidden>
          {num}
        </span>
      ) : null}
      {icon ? <span className="luxe-card-icon">{icon}</span> : null}
      <div className="luxe-card-inner">{children}</div>
    </Tag>
  )
}
