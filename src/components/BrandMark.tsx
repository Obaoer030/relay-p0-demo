export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-mark ${compact ? 'brand-mark--compact' : ''}`} aria-label="Relay 接棒">
      <span className="brand-mark__symbol" aria-hidden="true">
        <i />
        <i />
      </span>
      <span>
        <strong>Relay</strong>
        {!compact && <small>接棒</small>}
      </span>
    </div>
  )
}
