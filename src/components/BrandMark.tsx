export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-mark ${compact ? 'brand-mark--compact' : ''}`} aria-label="Relay 生活事项协作">
      <span className="brand-mark__symbol" aria-hidden="true">
        <i />
        <i />
      </span>
      <span>
        <strong>Relay</strong>
        {!compact && <small>生活协作</small>}
      </span>
    </div>
  )
}
