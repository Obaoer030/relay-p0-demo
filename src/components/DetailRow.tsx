import type { ReactNode } from 'react'

export function DetailRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="detail-row">
      <span className="detail-row__icon" aria-hidden="true">
        {icon}
      </span>
      <div>
        <span className="detail-row__label">{label}</span>
        <p>{children}</p>
      </div>
    </div>
  )
}
