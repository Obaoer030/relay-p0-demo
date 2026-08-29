import { Check, HeartHandshake } from 'lucide-react'
import { PageHeader } from '../app/PageHeader'
import { useWorkspace } from '../workspace/WorkspaceContext'
import { getActiveUser, isMatterVisibleTo } from '../workspace/perspective'

export function WorkspacePeople() {
  const { state } = useWorkspace()
  const user = getActiveUser(state.users, state.activeUserId)
  const people = state.users.filter((person) => person.id !== user.id)

  return (
    <main className="workspace-page">
      <PageHeader eyebrow={`${user.name} · 可信协作者`} title="关系人" description="不同角色拥有不同的共同事项；这里不做贡献排行，也不监控在线状态。" />
      <section className="workspace-people-grid">
        {people.map((person) => {
          const shared = state.matters.filter((matter) => isMatterVisibleTo(matter, user.id) && isMatterVisibleTo(matter, person.id))
          const active = shared.filter((matter) => matter.status !== 'completed')
          const completed = shared.filter((matter) => matter.status === 'completed')
          return <article key={person.id} className="workspace-person-card"><div className={`workspace-person-avatar tone-${person.tone}`}>{person.initial}</div><div className="workspace-person-card__title"><div><h2>{person.name}</h2><p>{person.role}</p></div><HeartHandshake size={20} /></div><p>{person.note}</p><div className="workspace-person-stats"><span><strong>{active.length}</strong> 正在协作</span><span><strong>{completed.length}</strong> 次共同完成</span></div><div className="workspace-person-trust"><Check size={15} /> 与 {user.name} 共享 {shared.length} 个相关事项</div></article>
        })}
      </section>
    </main>
  )
}
