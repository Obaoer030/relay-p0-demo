import { ArrowRight, Check, CheckCircle2, Clock3, FileText, HeartHandshake, PawPrint, X } from 'lucide-react'
import { useState } from 'react'
import { BoundaryNotice } from '../components/BoundaryNotice'
import { BrandMark } from '../components/BrandMark'
import { DetailRow } from '../components/DetailRow'
import { ResponsibilityRail } from '../components/ResponsibilityRail'
import { HERO_MATTER_ID } from '../domain/seed'
import type { RelayState } from '../domain/types'
import { formatDueAt } from '../lib/format'
import { useRelay } from '../store/RelayContext'

function HelperShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="helper-screen">
      <header className="helper-header">
        <BrandMark compact />
        <span>单事项邀请 · 无需账号</span>
      </header>
      {children}
    </div>
  )
}

function NotSharedYet() {
  return (
    <HelperShell>
      <div className="helper-empty">
        <span className="helper-empty__rings" aria-hidden="true"><i /><i /></span>
        <p className="micro-label">小雨的视角</p>
        <h1>分享后，请求会在这里展开</h1>
        <p>只出现这一件事，不需要进入林然的生活空间。</p>
      </div>
    </HelperShell>
  )
}

export function InvalidShareView() {
  return (
    <HelperShell>
      <div className="helper-empty helper-empty--invalid">
        <X size={28} aria-hidden="true" />
        <p className="micro-label">这个演示链接不可用</p>
        <h1>没有可以打开的事项</h1>
        <p>链接可能不完整。请向发起者确认新的单事项邀请。</p>
      </div>
    </HelperShell>
  )
}

export function HelperView({ state, embedded = false }: { state: RelayState; embedded?: boolean }) {
  const { dispatch } = useRelay()
  const [thanked, setThanked] = useState(false)
  const matter = state.matters.find((item) => item.id === HERO_MATTER_ID)!

  if (state.demoStage === 'initial') return <NotSharedYet />

  if (state.demoStage === 'declined') {
    return (
      <HelperShell>
        <div className="helper-result">
          <span className="result-icon result-icon--quiet"><HeartHandshake size={26} /></span>
          <p className="micro-label">已告诉林然</p>
          <h1>这次暂时无法帮忙</h1>
          <p>事情已经回到林然那里。说清自己的边界，也是一种可靠。</p>
        </div>
      </HelperShell>
    )
  }

  if (state.demoStage === 'completed') {
    return (
      <HelperShell>
        <div className="helper-result helper-result--complete">
          <span className="result-icon"><Check size={26} /></span>
          <p className="micro-label">本次接棒已完成</p>
          <h1>布丁已经安全回家</h1>
          <p>复诊结论已发给林然。该由你推进的部分，到这里就结束了。</p>
          <ResponsibilityRail status="completed" reduceMotion={state.reduceMotion} />
          <button className="secondary-button" type="button" onClick={() => setThanked(true)} disabled={thanked}>
            {thanked ? '心意已送达' : '收下林然的“谢谢你”'}
          </button>
        </div>
      </HelperShell>
    )
  }

  const accepted = state.demoStage === 'accepted'

  return (
    <HelperShell>
      <main className={`helper-content ${accepted ? 'helper-content--accepted' : ''}`}>
        <div className="helper-intro">
          <p className="micro-label">林然想问</p>
          <h1>{accepted ? '谢谢你接住布丁的复诊' : '你是否愿意接住这件事？'}</h1>
          <p>{accepted ? '你现在负责约定范围内的下一步。' : '你可以先看清时间、行动和边界，再决定。'}</p>
        </div>
        <article className="helper-matter">
          <div className="helper-matter__title">
            <span className="cat-stamp" aria-hidden="true"><PawPrint size={20} /></span>
            <div>
              <h2>{matter.title}</h2>
              <p><Clock3 size={14} /> {formatDueAt(matter.dueAt)}</p>
            </div>
          </div>
          <ResponsibilityRail
            status={matter.status}
            stage={state.demoStage}
            reduceMotion={state.reduceMotion}
          />
          <div className="detail-stack detail-stack--helper">
            <DetailRow icon={<ArrowRight size={18} />} label="你接住的下一步">
              {matter.nextAction}
            </DetailRow>
            <DetailRow icon={<FileText size={18} />} label="需要带上">
              {matter.requiredMaterial}
            </DetailRow>
            <DetailRow icon={<CheckCircle2 size={18} />} label="做到这里就完成">
              {matter.doneDefinition}
            </DetailRow>
          </div>
        </article>
        <BoundaryNotice boundary={matter.boundary!} compact={embedded} />
        {accepted ? (
          <button className="primary-button" type="button" onClick={() => dispatch({ type: 'complete' })}>
            我已完成本次执行
          </button>
        ) : (
          <div className="helper-actions">
            <button className="primary-button" type="button" onClick={() => dispatch({ type: 'accept' })}>
              我愿意接住
            </button>
            <button className="text-button" type="button" onClick={() => dispatch({ type: 'decline' })}>
              这次暂时无法帮忙
            </button>
          </div>
        )}
      </main>
    </HelperShell>
  )
}
