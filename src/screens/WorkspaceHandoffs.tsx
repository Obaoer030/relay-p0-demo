import { Check, Handshake, Inbox, Send } from 'lucide-react'
import { PageHeader } from '../app/PageHeader'
import { WorkspaceMatterCard } from '../app/WorkspaceMatterCard'
import { useWorkspace } from '../workspace/WorkspaceContext'
import { getActiveUser, visibleMattersFor } from '../workspace/perspective'

export function WorkspaceHandoffs() {
  const { state } = useWorkspace()
  const user = getActiveUser(state.users, state.activeUserId)
  const visible = visibleMattersFor(state.matters, user.id)
  const incoming = visible.filter((matter) => matter.status === 'waiting' && matter.handoffTargetId === user.id)
  const outgoing = visible.filter((matter) => matter.status === 'waiting' && matter.creatorId === user.id && matter.handoffTargetId !== user.id)
  const active = visible.filter((matter) => matter.status === 'relayed')
  const completed = visible.filter((matter) => matter.status === 'completed' && matter.participantIds.length > 1)

  return (
    <main className="workspace-page">
      <PageHeader eyebrow={`${user.name} · 多角色协作`} title="协作进度" description="同一事项在发起者这里是“等待回复”，在受邀人这里是“等我确认”；确认后双方共享最新负责人。" />
      <section className="workspace-handoff-columns">
        <div className="workspace-handoff-column is-incoming"><header><Inbox size={19} /><div><h2>等我确认</h2><p>{incoming.length} 个发给 {user.name} 的邀请</p></div></header>{incoming.map((matter) => <WorkspaceMatterCard key={matter.id} matter={matter} compact />)}{incoming.length === 0 && <p className="workspace-empty-copy">现在没有需要你确认的邀请。</p>}</div>
        <div className="workspace-handoff-column"><header><Send size={19} /><div><h2>等待回复</h2><p>{outgoing.length} 个由 {user.name} 发出的邀请</p></div></header>{outgoing.map((matter) => <WorkspaceMatterCard key={matter.id} matter={matter} compact />)}{outgoing.length === 0 && <p className="workspace-empty-copy">现在没有等待回复的邀请。</p>}</div>
        <div className="workspace-handoff-column is-held"><header><Handshake size={19} /><div><h2>进行中</h2><p>{active.length} 件事已经明确负责人</p></div></header>{active.map((matter) => <WorkspaceMatterCard key={matter.id} matter={matter} compact />)}{active.length === 0 && <p className="workspace-empty-copy">当前没有进行中的协作。</p>}</div>
        <div className="workspace-handoff-column"><header><Check size={19} /><div><h2>已完成</h2><p>{completed.length} 条双方可见记录</p></div></header>{completed.map((matter) => <WorkspaceMatterCard key={matter.id} matter={matter} compact />)}{completed.length === 0 && <p className="workspace-empty-copy">完成的协作会保留在这里。</p>}</div>
      </section>
    </main>
  )
}
