import { ArrowLeft, CalendarDays, Check, CheckCircle2, Pencil, ShieldCheck, Trash2, UserRound, X } from 'lucide-react'
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
  const user = getActiveUser(state.users, state.activeUserId)
  const matter = state.matters.find((item) => item.id === id)
  if (!matter || !isMatterVisibleTo(matter, user.id)) return <Navigate to="/matters" replace />

  const creator = state.users.find((item) => item.id === matter.creatorId)
  const displayStatus = getPerspectiveStatus(matter, user.id)
  const canRespond = canRespondToMatter(matter, user.id)
  const canComplete = canCompleteMatter(matter, user.id)
  const canEdit = matter.creatorId === user.id || matter.ownerId === user.id

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
        </section>

        <aside className="workspace-panel workspace-status-actions">
          <p className="micro-label">{user.name} 当前可以做什么</p>
          {canRespond ? (
            <>
              <h2>你愿意负责这一步吗？</h2>
              <p className="workspace-action-explainer">确认后，发起者会立即看到负责人变为 {user.name}。</p>
              <button className="is-primary" type="button" onClick={() => dispatch({ type: 'accept-handoff', id: matter.id })}><span><Check size={18} /> 可以，我来处理</span><small>双方看到“负责人：{user.name}”</small></button>
              <button type="button" onClick={() => dispatch({ type: 'decline-handoff', id: matter.id })}><span><X size={18} /> 这次我不方便</span><small>事项仍由{creator?.name ?? '发起者'}处理</small></button>
            </>
          ) : canComplete ? (
            <>
              <h2>下一步由你负责</h2>
              <p className="workspace-action-explainer">完成后，所有相关角色都会看到结果。</p>
              <button className="is-primary" type="button" onClick={() => dispatch({ type: 'complete-matter', id: matter.id })}><span><CheckCircle2 size={18} /> 标记为已完成</span><small>{matter.doneDefinition}</small></button>
            </>
          ) : matter.status === 'completed' ? (
            <div className="workspace-action-result"><CheckCircle2 size={24} /><h2>这件事已经完成</h2><p>{matter.doneDefinition}</p></div>
          ) : (
            <div className="workspace-action-result"><UserRound size={24} /><h2>{workspaceStatus[displayStatus].label}</h2><p>当前负责人是 {matter.ownerName}。状态变化后，这里会自动更新。</p></div>
          )}
          {matter.creatorId === user.id && <button className="workspace-delete-action" type="button" onClick={remove}><Trash2 size={17} /> 删除事项</button>}
        </aside>
      </div>
    </main>
  )
}
