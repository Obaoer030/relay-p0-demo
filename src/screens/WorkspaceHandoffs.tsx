import { Check, Clock3, Handshake } from 'lucide-react'
import { PageHeader } from '../app/PageHeader'
import { WorkspaceMatterCard } from '../app/WorkspaceMatterCard'
import { useWorkspace } from '../workspace/WorkspaceContext'

export function WorkspaceHandoffs() {
  const { state } = useWorkspace()
  const waiting = state.matters.filter((matter) => matter.status === 'waiting')
  const held = state.matters.filter((matter) => matter.status === 'relayed')
  const completed = state.matters.filter((matter) => matter.status === 'completed' && matter.handoffTargetId)
  return (
    <main className="workspace-page">
      <PageHeader eyebrow="一句“帮我看看”还不够" title="协作进度" description="把等待回复、对方确认负责和已经完成分开记录，你才能知道下一步还要不要行动。" />
      <section className="workspace-handoff-columns">
        <div className="workspace-handoff-column"><header><Clock3 size={19} /><div><h2>等待回复</h2><p>{waiting.length} 件事还在等待确认</p></div></header>{waiting.map((matter) => <WorkspaceMatterCard key={matter.id} matter={matter} compact />)}{waiting.length === 0 && <p className="workspace-empty-copy">现在没有等待回复的邀请。</p>}</div>
        <div className="workspace-handoff-column is-held"><header><Handshake size={19} /><div><h2>对方处理中</h2><p>{held.length} 件事已有明确负责人</p></div></header>{held.map((matter) => <WorkspaceMatterCard key={matter.id} matter={matter} compact />)}{held.length === 0 && <p className="workspace-empty-copy">对方确认负责后会在这里显示。</p>}</div>
        <div className="workspace-handoff-column"><header><Check size={19} /><div><h2>已完成</h2><p>{completed.length} 条协作记录</p></div></header>{completed.map((matter) => <WorkspaceMatterCard key={matter.id} matter={matter} compact />)}</div>
      </section>
    </main>
  )
}
