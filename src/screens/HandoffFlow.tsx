import { ArrowLeft, CalendarDays, CheckCircle2, FileText, PawPrint } from 'lucide-react'
import { useState } from 'react'
import { BoundaryNotice } from '../components/BoundaryNotice'
import { DetailRow } from '../components/DetailRow'
import { ProductChrome } from '../components/ProductChrome'
import { ResponsibilityRail } from '../components/ResponsibilityRail'
import { HERO_MATTER_ID } from '../domain/seed'
import type { RelayState } from '../domain/types'
import { formatDueAt } from '../lib/format'
import { useRelay } from '../store/RelayContext'
import { TodayView } from './TodayView'

type Surface = 'home' | 'confirm' | 'preview'

function SurfaceHeader({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <header className="surface-header">
      <button className="icon-button" type="button" onClick={onBack} aria-label="返回">
        <ArrowLeft size={20} />
      </button>
      <strong>{label}</strong>
      <span className="surface-header__spacer" />
    </header>
  )
}

function ConfirmSurface({ state, onBack, onNext }: { state: RelayState; onBack: () => void; onNext: () => void }) {
  const matter = state.matters.find((item) => item.id === HERO_MATTER_ID)!

  return (
    <ProductChrome hideNavigation>
      <SurfaceHeader label="确认事情和下一步" onBack={onBack} />
      <div className="sheet-content" role="dialog" aria-label="确认事项内容" aria-modal="true">
        <div className="sheet-title">
          <p className="micro-label">已整理成一件可执行的事</p>
          <h1>{matter.title}</h1>
          <p>{matter.context}</p>
        </div>
        <div className="detail-stack">
          <DetailRow icon={<CalendarDays size={18} />} label="约定时间">
            {formatDueAt(matter.dueAt)}
          </DetailRow>
          <DetailRow icon={<PawPrint size={18} />} label="下一步">
            {matter.nextAction}
          </DetailRow>
          <DetailRow icon={<FileText size={18} />} label="要带的资料">
            {matter.requiredMaterial}
          </DetailRow>
          <DetailRow icon={<CheckCircle2 size={18} />} label="做到这里就完成">
            {matter.doneDefinition}
          </DetailRow>
        </div>
        <BoundaryNotice boundary={matter.boundary!} compact />
        <button className="primary-button" type="button" onClick={onNext}>
          下一步：确认发给小雨的内容
        </button>
      </div>
    </ProductChrome>
  )
}

function PreviewSurface({ state, onBack, onShare }: { state: RelayState; onBack: () => void; onShare: () => void }) {
  const matter = state.matters.find((item) => item.id === HERO_MATTER_ID)!

  return (
    <ProductChrome hideNavigation>
      <SurfaceHeader label="发给小雨的内容" onBack={onBack} />
      <div className="sheet-content sheet-content--preview" role="dialog" aria-label="邀请预览" aria-modal="true">
        <div className="preview-recipient">
          <span className="preview-recipient__avatar" aria-hidden="true">雨</span>
          <div>
            <p className="micro-label">发给朋友 · 无需账号</p>
            <h1>想请小雨帮忙完成这次复诊</h1>
          </div>
        </div>
        <p className="privacy-copy">对方只会看到这一件事，以及完成它所需的信息。</p>
        <article className="preview-card">
          <p className="micro-label">来自林然</p>
          <h2>{matter.title}</h2>
          <p className="preview-card__time">{formatDueAt(matter.dueAt)}</p>
          <ResponsibilityRail status="waiting" reduceMotion={state.reduceMotion} />
          <div className="preview-card__summary">
            <span>下一步</span>
            <p>{matter.nextAction}</p>
          </div>
        </article>
        <BoundaryNotice boundary={matter.boundary!} compact />
        <button className="primary-button" type="button" onClick={onShare}>
          发给小雨
        </button>
      </div>
    </ProductChrome>
  )
}

export function LinRanExperience({ state }: { state: RelayState }) {
  const { dispatch } = useRelay()
  const [surface, setSurface] = useState<Surface>('home')

  if (state.demoStage !== 'initial') {
    return <TodayView state={state} onStart={() => setSurface('confirm')} />
  }

  if (surface === 'confirm') {
    return <ConfirmSurface state={state} onBack={() => setSurface('home')} onNext={() => setSurface('preview')} />
  }

  if (surface === 'preview') {
    return (
      <PreviewSurface
        state={state}
        onBack={() => setSurface('confirm')}
        onShare={() => {
          dispatch({ type: 'share' })
          setSurface('home')
        }}
      />
    )
  }

  return <TodayView state={state} onStart={() => setSurface('confirm')} />
}
