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
      <PageHeader eyebrow="责任不是一句“帮我看看”" title="接棒管理" description="区分等待、已接受和已完成，发起者才能知道自己是否还需要行动。" />
      <section className="workspace-handoff-columns">
        <div className="workspace-handoff-column"><header><Clock3 size={19} /><div><h2>等待回应</h2><p>{waiting.length} 件事还在等待决定</p></div></header>{waiting.map((matter) => <WorkspaceMatterCard key={matter.id} matter={matter} compact />)}{waiting.length === 0 && <p className="workspace-empty-copy">没有悬着的请求。</p>}</div>
        <div className="workspace-handoff-column is-held"><header><Handshake size={19} /><div><h2>已有人接住</h2><p>{held.length} 件事由协作者推进</p></div></header>{held.map((matter) => <WorkspaceMatterCard key={matter.id} matter={matter} compact />)}{held.length === 0 && <p className="workspace-empty-copy">接棒后会在这里显示。</p>}</div>
        <div className="workspace-handoff-column"><header><Check size={19} /><div><h2>协作完成</h2><p>{completed.length} 条可信记录</p></div></header>{completed.map((matter) => <WorkspaceMatterCard key={matter.id} matter={matter} compact />)}</div>
      </section>
    </main>
  )
}
