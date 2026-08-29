import { ArrowRight, CheckCircle2, Feather, Handshake, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../app/PageHeader'
import { WorkspaceMatterCard } from '../app/WorkspaceMatterCard'
import { useWorkspace } from '../workspace/WorkspaceContext'

export function WorkspaceOverview() {
  const { state } = useWorkspace()
  const active = state.matters.filter((matter) => matter.status !== 'completed')
  const mine = active.filter((matter) => matter.status === 'mine')
  const waiting = active.filter((matter) => matter.status === 'waiting')
  const relayed = active.filter((matter) => matter.status === 'relayed')
  const next = [...active].sort((a, b) => (a.dueAt ?? '9').localeCompare(b.dueAt ?? '9'))[0]

  return (
    <main className="workspace-page workspace-overview">
      <PageHeader eyebrow="今天 · 林然的工作区" title="早上好，林然" description="这里不只记录要做什么，也记录下一步现在由谁负责。" actions={<Link className="workspace-primary-action" to="/matters/new"><Plus size={18} /> 新建事项</Link>} />

      <section className="workspace-stat-grid" aria-label="事项负责人概览">
        <article><span>待我处理</span><strong>{mine.length}</strong><small>今天优先处理</small></article>
        <article><span>等待回复</span><strong>{waiting.length}</strong><small>不必重复追问</small></article>
        <article className="is-relayed"><span>对方处理中</span><strong>{relayed.length}</strong><small>负责人已经明确</small></article>
        <article><span>本月完成</span><strong>{state.matters.filter((matter) => matter.status === 'completed').length}</strong><small>共同完成的记录</small></article>
      </section>

      <div className="workspace-overview-grid">
        <section className="workspace-panel workspace-panel--next">
          <div className="workspace-panel__heading"><div><p className="micro-label">最靠近的下一步</p><h2>接下来</h2></div><Link to="/matters">查看全部 <ArrowRight size={15} /></Link></div>
          {next && <WorkspaceMatterCard matter={next} />}
          <div className="workspace-gentle-note"><Feather size={18} /><p><strong>{relayed.length} 件事已有明确负责人。</strong>只要没有超出约定范围，你不需要继续催问。</p></div>
        </section>

        <section className="workspace-panel workspace-panel--handoffs">
          <div className="workspace-panel__heading"><div><p className="micro-label">需要别人参与的事项</p><h2>协作进度</h2></div><Handshake size={21} /></div>
          <div className="workspace-handoff-summary">
            {relayed.slice(0, 3).map((matter) => <WorkspaceMatterCard key={matter.id} matter={matter} compact />)}
            {relayed.length === 0 && <p className="workspace-empty-copy">现在没有由对方处理的事项。</p>}
          </div>
          <Link className="workspace-secondary-action" to="/handoffs">查看全部协作 <ArrowRight size={16} /></Link>
        </section>
      </div>

      <section className="workspace-panel workspace-panel--story">
        <div><p className="micro-label">为什么不是聊天里的又一条消息</p><h2>聊天保存说过什么，Relay 记录下一步现在由谁负责。</h2><p>要做什么、做到哪里、由谁负责和什么情况要重新联系，都放在同一件事项里。</p><Link to="/about">了解设计背景 <ArrowRight size={16} /></Link></div>
        <div className="workspace-story-rail" aria-label="这一步的负责人从林然变为小雨"><span>林然</span><i /><b /><i className="is-filled" /><span>小雨</span></div>
        <CheckCircle2 className="workspace-story-check" size={30} />
      </section>
    </main>
  )
}
