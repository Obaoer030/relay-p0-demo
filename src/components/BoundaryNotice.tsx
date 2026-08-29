import { ShieldCheck } from 'lucide-react'

export function BoundaryNotice({ boundary, compact = false }: { boundary: string; compact?: boolean }) {
  return (
    <aside className={`boundary-notice ${compact ? 'boundary-notice--compact' : ''}`} aria-label="需要先联系林然的情况">
      <div className="boundary-notice__heading">
        <ShieldCheck size={compact ? 16 : 18} strokeWidth={1.8} aria-hidden="true" />
        <strong>遇到这些情况，请先联系林然</strong>
      </div>
      <p>{boundary}</p>
    </aside>
  )
}
