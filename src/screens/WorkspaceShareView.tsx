import { Check, CheckCircle2, MessageSquareText, ShieldCheck, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { BrandMark } from '../components/BrandMark'
import { useWorkspace } from '../workspace/WorkspaceContext'

export const WORKSPACE_DEMO_TOKEN = 'demo-cat-checkup'
const TOKEN_MATTER: Record<string, string> = { [WORKSPACE_DEMO_TOKEN]: 'ws-cat-checkup' }

export function WorkspaceShareView({ token }: { token?: string }) {
  const { state, dispatch } = useWorkspace()
  const [adjusting, setAdjusting] = useState(false)
  const [adjustmentNote, setAdjustmentNote] = useState('')
  const [completionNote, setCompletionNote] = useState('')
  const matter = state.matters.find((item) => item.id === TOKEN_MATTER[token ?? ''])

  if (!matter || !matter.handoffTargetId || matter.handoffTargetId === 'mumu') {
    return <main className="workspace-share-shell"><section className="workspace-share-card workspace-share-invalid"><BrandMark /><X size={32} /><h1>这个协作链接不可用</h1><p>链接可能已失效。请联系发起者重新发送，页面不会显示任何事项信息。</p></section></main>
  }

  const helper = state.users.find((user) => user.id === matter.handoffTargetId)
  const creator = state.users.find((user) => user.id === matter.creatorId)
  const isWaiting = matter.status === 'waiting' && !matter.adjustmentNote
  const isOwner = matter.status === 'relayed' && matter.ownerId === helper?.id

  return (
    <main className="workspace-share-shell">
      <section className="workspace-share-card">
        <header><BrandMark /><span>无需注册 · 本地演示</span></header>
        <div className="workspace-share-intro"><p className="micro-label">{creator?.name ?? '发起者'} 想请你协作</p><h1>{matter.title}</h1><p>{matter.context}</p></div>
        <div className="workspace-share-facts">
          <article><span><UserRound size={17} /> 下一步</span><strong>{matter.nextAction}</strong></article>
          <article><span><CheckCircle2 size={17} /> 完成标准</span><strong>{matter.doneDefinition}</strong></article>
          <article className="workspace-share-boundary"><span><ShieldCheck size={17} /> 这些情况先联系{creator?.name}</span><strong>{matter.boundary}</strong></article>
        </div>

        {isWaiting && helper ? <div className="workspace-share-actions">
          <h2>{helper.name}，你愿意负责这一步吗？</h2>
          <button className="workspace-primary-action" type="button" onClick={() => dispatch({ type: 'accept-handoff', id: matter.id, actorId: helper.id })}><Check size={18} /> 可以，我来处理</button>
          {adjusting ? <div className="workspace-inline-action"><label htmlFor="share-adjustment">需要调整什么？</label><textarea id="share-adjustment" value={adjustmentNote} onChange={(event) => setAdjustmentNote(event.target.value)} placeholder="说明时间或范围需要怎样调整" /><div><button type="button" onClick={() => setAdjusting(false)}>取消</button><button type="button" disabled={!adjustmentNote.trim()} onClick={() => dispatch({ type: 'request-adjustment', id: matter.id, note: adjustmentNote, actorId: helper.id })}>发送建议</button></div></div> : <button className="workspace-secondary-action" type="button" onClick={() => setAdjusting(true)}><MessageSquareText size={17} /> 需要先调整约定</button>}
          <button className="workspace-text-action" type="button" onClick={() => dispatch({ type: 'decline-handoff', id: matter.id, actorId: helper.id })}>这次我不方便</button>
        </div> : isOwner && helper ? <div className="workspace-share-actions"><h2>这一步现在由{helper.name}负责</h2><p>处理完成后留下结果，{creator?.name}会同步看到。</p><div className="workspace-inline-action"><label htmlFor="share-completion">完成结果</label><textarea id="share-completion" value={completionNote} onChange={(event) => setCompletionNote(event.target.value)} placeholder={matter.doneDefinition} /><button className="workspace-primary-action" type="button" onClick={() => dispatch({ type: 'complete-matter', id: matter.id, note: completionNote.trim() || matter.doneDefinition, actorId: helper.id })}>确认完成并同步结果</button></div></div> : <div className="workspace-share-result"><CheckCircle2 size={26} /><h2>{matter.status === 'completed' ? '事项已经完成' : matter.adjustmentNote ? '调整建议已发送' : '邀请已经结束'}</h2><p>{matter.completionNote ?? matter.adjustmentNote ?? `如需继续处理，请联系${creator?.name ?? '发起者'}。`}</p></div>}
      </section>
    </main>
  )
}
