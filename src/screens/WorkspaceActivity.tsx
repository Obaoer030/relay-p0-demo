import { Activity, CheckCircle2, Pencil, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../app/PageHeader'
import { useWorkspace } from '../workspace/WorkspaceContext'

const icons = { created: Plus, updated: Pencil, status: CheckCircle2, deleted: Trash2, system: Activity }

export function WorkspaceActivity() {
  const { state } = useWorkspace()
  return (
    <main className="workspace-page">
      <PageHeader eyebrow="发生过什么，不需要翻聊天" title="活动记录" description="这里记录事项状态变化，不记录在线状态、已读或关系人排名。" />
      <section className="workspace-timeline">
        {state.activity.map((entry) => { const Icon = icons[entry.kind]; return <article key={entry.id}><span className="workspace-timeline__icon"><Icon size={17} /></span><div><div className="workspace-timeline__heading"><h2>{entry.title}</h2><time>{new Date(entry.at).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</time></div><p>{entry.detail}</p><small>{entry.actor}</small>{entry.matterId && state.matters.some((matter) => matter.id === entry.matterId) && <Link to={`/matters/${entry.matterId}`}>打开事项</Link>}</div></article> })}
      </section>
    </main>
  )
}
