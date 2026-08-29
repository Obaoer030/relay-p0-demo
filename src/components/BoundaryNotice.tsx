import { ShieldCheck } from 'lucide-react'

export function BoundaryNotice({ boundary, compact = false }: { boundary: string; compact?: boolean }) {
  return (
    <aside className={`boundary-notice ${compact ? 'boundary-notice--compact' : ''}`} aria-label="责任边界">
      <div className="boundary-notice__heading">
        <ShieldCheck size={compact ? 16 : 18} strokeWidth={1.8} aria-hidden="true" />
        <strong>决定仍在林然这里</strong>
      </div>
      <p>{boundary}</p>
    </aside>
  )
}
