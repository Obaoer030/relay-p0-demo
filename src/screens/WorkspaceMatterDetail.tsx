import { ArrowLeft, CalendarDays, CheckCircle2, Pencil, ShieldCheck, Trash2, UserRound } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../app/PageHeader'
import { workspaceStatus } from '../app/workspaceStatus'
import { formatDueAt } from '../lib/format'
import { useWorkspace } from '../workspace/WorkspaceContext'
import type { WorkspaceMatterStatus } from '../workspace/types'

const actions: Array<{ status: WorkspaceMatterStatus; label: string }> = [
  { status: 'mine', label: '由我处理' },
  { status: 'waiting', label: '等待回复' },
  { status: 'relayed', label: '由对方处理' },
  { status: 'completed', label: '标记完成' },
]

export function WorkspaceMatterDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useWorkspace()
  const matter = state.matters.find((item) => item.id === id)
  if (!matter) return <Navigate to="/matters" replace />

  const changeStatus = (status: WorkspaceMatterStatus) => {
    const person = status === 'relayed' ? state.people[0] : undefined
    dispatch({ type: 'set-status', id: matter.id, status, ownerName: status === 'mine' ? '林然' : person?.name ?? matter.ownerName, targetId: person?.id })
  }

  const remove = () => {
    if (!window.confirm(`确定删除“${matter.title}”吗？`)) return
    dispatch({ type: 'delete-matter', id: matter.id })
    void navigate('/matters')
  }

  return (
    <main className="workspace-page workspace-detail-page">
      <Link className="workspace-back-link" to="/matters"><ArrowLeft size={17} /> 返回全部事项</Link>
      <PageHeader eyebrow={`${matter.category} · ${workspaceStatus[matter.status].label}`} title={matter.title} description={matter.context} actions={<Link className="workspace-secondary-action" to={`/matters/${matter.id}/edit`}><Pencil size={17} /> 编辑</Link>} />

      <section className="workspace-detail-hero" data-status={matter.status}>
        <div className="workspace-detail-hero__owner"><span>当前负责人</span><strong>{matter.ownerName}</strong><p>{workspaceStatus[matter.status].copy}</p></div>
        <div className="workspace-detail-rail" aria-label={`当前负责人：${matter.ownerName}`}><span className={matter.ownerName === '林然' ? 'is-current' : ''}>林然</span><i /><b className={matter.ownerName === '林然' ? '' : 'is-right'} /><i /><span className={matter.ownerName !== '林然' ? 'is-current' : ''}>{matter.ownerName === '林然' ? '协作者' : matter.ownerName}</span></div>
      </section>

      <div className="workspace-detail-grid">
        <section className="workspace-panel workspace-detail-content">
          <article><span><CheckCircle2 size={18} /> 下一步</span><p>{matter.nextAction}</p></article>
          <article><span><CalendarDays size={18} /> 时间</span><p>{matter.dueAt ? formatDueAt(matter.dueAt) : '没有固定日期'}</p></article>
          <article><span><UserRound size={18} /> 做到这里就完成</span><p>{matter.doneDefinition}</p></article>
          <article className="workspace-boundary-block"><span><ShieldCheck size={18} /> 需要先联系我的情况</span><p>{matter.boundary || '遇到重要变化时，请先联系林然。'}</p></article>
        </section>
        <aside className="workspace-panel workspace-status-actions"><p className="micro-label">更新事项状态</p><h2>下一步由谁负责？</h2>{actions.map((action) => <button key={action.status} type="button" className={matter.status === action.status ? 'is-active' : ''} onClick={() => changeStatus(action.status)}>{action.label}<small>{workspaceStatus[action.status].copy}</small></button>)}<button className="workspace-delete-action" type="button" onClick={remove}><Trash2 size={17} /> 删除事项</button></aside>
      </div>
    </main>
  )
}
