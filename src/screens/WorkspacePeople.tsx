import { Check, HeartHandshake } from 'lucide-react'
import { PageHeader } from '../app/PageHeader'
import { useWorkspace } from '../workspace/WorkspaceContext'

export function WorkspacePeople() {
  const { state } = useWorkspace()
  return (
    <main className="workspace-page">
      <PageHeader eyebrow="可信关系不是资源池" title="关系人" description="Relay 记录的是清楚、可拒绝的协作历史，不做贡献排行，也不监控在线状态。" />
      <section className="workspace-people-grid">
        {state.people.map((person) => {
          const active = state.matters.filter((matter) => matter.handoffTargetId === person.id && matter.status !== 'completed')
          return <article key={person.id} className="workspace-person-card"><div className={`workspace-person-avatar tone-${person.tone}`}>{person.initial}</div><div className="workspace-person-card__title"><div><h2>{person.name}</h2><p>{person.relationship}</p></div><HeartHandshake size={20} /></div><p>{person.note}</p><div className="workspace-person-stats"><span><strong>{active.length}</strong> 正在处理</span><span><strong>{person.completedCount}</strong> 次共同完成</span></div><div className="workspace-person-trust"><Check size={15} /> 只共享与她有关的单个事项</div></article>
        })}
      </section>
    </main>
  )
}
