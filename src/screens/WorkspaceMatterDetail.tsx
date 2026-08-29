import { ArrowLeft, CalendarDays, Check, CheckCircle2, MessageSquareText, Pencil, RotateCcw, ShieldCheck, Trash2, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../app/PageHeader'
import { workspaceStatus } from '../app/workspaceStatus'
import { formatDueAt } from '../lib/format'
import { useWorkspace } from '../workspace/WorkspaceContext'
import { canCompleteMatter, canRespondToMatter, getActiveUser, getPerspectiveStatus, isMatterVisibleTo } from '../workspace/perspective'

export function WorkspaceMatterDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useWorkspace()
  const [showAdjustment, setShowAdjustment] = useState(false)
  const [adjustmentNote, setAdjustmentNote] = useState('')
  const [completionNote, setCompletionNote] = useState('')
  const user = getActiveUser(state.users, state.activeUserId)
  const matter = state.matters.find((item) => item.id === id)
  if (!matter || !isMatterVisibleTo(matter, user.id)) return <Navigate to="/matters" replace />

  const creator = state.users.find((item) => item.id === matter.creatorId)
  const displayStatus = getPerspectiveStatus(matter, user.id)
  const canRespond = canRespondToMatter(matter, user.id)
  const canComplete = canCompleteMatter(matter, user.id)
  const canEdit = matter.creatorId === user.id && matter.status !== 'completed'

  const remove = () => {
    if (!window.confirm(`确定删除“${matter.title}”吗？`)) return
    dispatch({ type: 'delete-matter', id: matter.id })
    void navigate('/matters')
  }

  return (
    <main className="workspace-page workspace-detail-page">
      <Link className="workspace-back-link" to="/matters"><ArrowLeft size={17} /> 返回全部事项</Link>
      <PageHeader eyebrow={`${matter.category} · ${workspaceStatus[displayStatus].label}`} title={matter.title} description={matter.context} actions={canEdit ? <Link className="workspace-secondary-action" to={`/matters/${matter.id}/edit`}><Pencil size={17} /> 编辑</Link> : undefined} />

      <section className="workspace-detail-hero" data-status={displayStatus}>
        <div className="workspace-detail-hero__owner"><span>当前负责人</span><strong>{matter.ownerName}</strong><p>{workspaceStatus[displayStatus].copy}</p></div>
        <div className="workspace-detail-rail" aria-label={`创建人${creator?.name ?? '发起者'}，当前负责人${matter.ownerName}`}><span className={matter.creatorId === matter.ownerId ? 'is-current' : ''}>{creator?.name ?? '发起者'}</span><i /><b className={matter.creatorId === matter.ownerId ? '' : 'is-right'} /><i /><span className={matter.creatorId !== matter.ownerId ? 'is-current' : ''}>{matter.ownerName}</span></div>
      </section>

      <div className="workspace-detail-grid">
        <section className="workspace-panel workspace-detail-content">
          <article><span><CheckCircle2 size={18} /> 下一步</span><p>{matter.nextAction}</p></article>
          <article><span><CalendarDays size={18} /> 时间</span><p>{matter.dueAt ? formatDueAt(matter.dueAt) : '没有固定日期'}</p></article>
          <article><span><UserRound size={18} /> 做到这里就完成</span><p>{matter.doneDefinition}</p></article>
          <article className="workspace-boundary-block"><span><ShieldCheck size={18} /> 需要先联系发起者的情况</span><p>{matter.boundary || `遇到重要变化时，请先联系${creator?.name ?? '发起者'}。`}</p></article>
          {matter.adjustmentNote && <article className="workspace-adjustment-block"><span><MessageSquareText size={18} /> 对方希望调整</span><p>{matter.adjustmentNote}</p>{matter.creatorId === user.id && <Link className="workspace-secondary-action" to={`/matters/${matter.id}/edit`}>更新约定并重新发送</Link>}</article>}
          {matter.completionNote && <article className="workspace-completion-block"><span><CheckCircle2 size={18} /> 完成结果</span><p>{matter.completionNote}</p></article>}
        </section>

        <aside className="workspace-panel workspace-status-actions">
          <p className="micro-label">{user.name} 当前可以做什么</p>
          {canRespond ? (
            <>
              <h2>你愿意负责这一步吗？</h2>
              <p className="workspace-action-explainer">确认后，发起者会立即看到负责人变为 {user.name}。</p>
              <button className="is-primary" type="button" onClick={() => dispatch({ type: 'accept-handoff', id: matter.id })}><span><Check size={18} /> 可以，我来处理</span><small>双方看到“负责人：{user.name}”</small></button>
              {showAdjustment ? <div className="workspace-inline-action"><label htmlFor="adjustment-note">需要调整什么？</label><textarea id="adjustment-note" required value={adjustmentNote} onChange={(event) => setAdjustmentNote(event.target.value)} placeholder="例如：时间改到 10:00 后我可以处理" /><div><button type="button" onClick={() => setShowAdjustment(false)}>取消</button><button className="is-primary" type="button" disabled={!adjustmentNote.trim()} onClick={() => dispatch({ type: 'request-adjustment', id: matter.id, note: adjustmentNote })}>发送调整建议</button></div></div> : <button type="button" onClick={() => setShowAdjustment(true)}><span><MessageSquareText size={18} /> 我需要先调整约定</span><small>告诉发起者需要改动的时间或范围</small></button>}
              <button type="button" onClick={() => dispatch({ type: 'decline-handoff', id: matter.id })}><span><X size={18} /> 这次我不方便</span><small>事项仍由{creator?.name ?? '发起者'}处理</small></button>
            </>
          ) : matter.adjustmentNote ? (
            <div className="workspace-action-result"><MessageSquareText size={24} /><h2>{matter.creatorId === user.id ? '需要更新约定' : '已提出调整建议'}</h2><p>{matter.creatorId === user.id ? '请根据对方的说明修改事项，保存后会再次等待确认。' : `正在等待${creator?.name ?? '发起者'}更新约定。`}</p></div>
          ) : canComplete ? (
            <>
              <h2>下一步由你负责</h2>
              <p className="workspace-action-explainer">完成后留一句结果，相关角色就不必再追问。</p>
              <div className="workspace-inline-action"><label htmlFor="completion-note">完成结果</label><textarea id="completion-note" value={completionNote} onChange={(event) => setCompletionNote(event.target.value)} placeholder={matter.doneDefinition} /><button className="is-primary" type="button" onClick={() => dispatch({ type: 'complete-matter', id: matter.id, note: completionNote.trim() || matter.doneDefinition })}><span><CheckCircle2 size={18} /> 确认完成并同步结果</span></button></div>
            </>
          ) : matter.status === 'completed' ? (
            <div className="workspace-action-result"><CheckCircle2 size={24} /><h2>这件事已经完成</h2><p>{matter.completionNote ?? matter.doneDefinition}</p>{matter.creatorId === user.id && <button className="workspace-secondary-action" type="button" onClick={() => dispatch({ type: 'reopen-matter', id: matter.id })}><RotateCcw size={17} /> 重新打开事项</button>}</div>
          ) : (
            <div className="workspace-action-result"><UserRound size={24} /><h2>{workspaceStatus[displayStatus].label}</h2><p>当前负责人是 {matter.ownerName}。状态变化后，这里会自动更新。</p></div>
          )}
          {matter.creatorId === user.id && <button className="workspace-delete-action" type="button" onClick={remove}><Trash2 size={17} /> 删除事项</button>}
        </aside>
      </div>
    </main>
  )
}
