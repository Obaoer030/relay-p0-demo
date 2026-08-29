import { Activity, CheckCircle2, Pencil, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../app/PageHeader'
import { useWorkspace } from '../workspace/WorkspaceContext'
import { getActiveUser, visibleMattersFor } from '../workspace/perspective'

const icons = { created: Plus, updated: Pencil, status: CheckCircle2, deleted: Trash2, system: Activity }

export function WorkspaceActivity() {
  const { state } = useWorkspace()
  const user = getActiveUser(state.users, state.activeUserId)
  const visibleMatterIds = new Set(visibleMattersFor(state.matters, user.id).map((matter) => matter.id))
  const activity = state.activity.filter((entry) => !entry.matterId || visibleMatterIds.has(entry.matterId))
  return (
    <main className="workspace-page">
      <PageHeader eyebrow={`${user.name} · 发生过什么`} title="活动记录" description="这里只显示当前角色有权看到的事项变化，不记录在线状态、已读或关系人排名。" />
      <section className="workspace-timeline">
        {activity.map((entry) => { const Icon = icons[entry.kind]; return <article key={entry.id}><span className="workspace-timeline__icon"><Icon size={17} /></span><div><div className="workspace-timeline__heading"><h2>{entry.title}</h2><time>{new Date(entry.at).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</time></div><p>{entry.detail}</p><small>{entry.actor}</small>{entry.matterId && state.matters.some((matter) => matter.id === entry.matterId) && <Link to={`/matters/${entry.matterId}`}>打开事项</Link>}</div></article> })}
      </section>
    </main>
  )
}
