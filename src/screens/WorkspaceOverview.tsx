import { ArrowRight, CheckCircle2, Feather, Handshake, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../app/PageHeader'
import { WorkspaceMatterCard } from '../app/WorkspaceMatterCard'
import { useWorkspace } from '../workspace/WorkspaceContext'
import { getActiveUser, getPerspectiveStatus, visibleMattersFor } from '../workspace/perspective'

export function WorkspaceOverview() {
  const { state } = useWorkspace()
  const user = getActiveUser(state.users, state.activeUserId)
  const visible = visibleMattersFor(state.matters, user.id)
  const open = visible.filter((matter) => matter.status !== 'completed')
  const byStatus = (status: ReturnType<typeof getPerspectiveStatus>) =>
    open.filter((matter) => getPerspectiveStatus(matter, user.id) === status)
  const mine = byStatus('mine')
  const incoming = byStatus('incoming')
  const waiting = byStatus('waiting')
  const relayed = byStatus('relayed')
  const completed = visible.filter((matter) => matter.status === 'completed')
  const collaboration = open.filter((matter) => matter.handoffTargetId)
  const next = [...open].sort((a, b) => {
    const incomingOrder = Number(getPerspectiveStatus(b, user.id) === 'incoming') - Number(getPerspectiveStatus(a, user.id) === 'incoming')
    return incomingOrder || (a.dueAt ?? '9').localeCompare(b.dueAt ?? '9')
  })[0]

  return (
    <main className="workspace-page workspace-overview">
      <PageHeader eyebrow={`今天 · ${user.role}`} title={`早上好，${user.name}`} description="同一件事会根据当前视角显示不同状态，但负责人和进度始终来自同一份共享数据。" actions={<Link className="workspace-primary-action" to="/matters/new"><Plus size={18} /> 新建事项</Link>} />

      <section className="workspace-stat-grid" aria-label={`${user.name}的事项概览`}>
        <article><span>待我处理</span><strong>{mine.length}</strong><small>下一步轮到我</small></article>
        <article className="is-incoming"><span>等我确认</span><strong>{incoming.length}</strong><small>接受或说明不方便</small></article>
        <article><span>等待回复</span><strong>{waiting.length}</strong><small>邀请已经发出</small></article>
        <article className="is-relayed"><span>对方处理中</span><strong>{relayed.length}</strong><small>负责人已经明确</small></article>
        <article><span>最近完成</span><strong>{completed.length}</strong><small>双方都能看到结果</small></article>
      </section>

      <div className="workspace-overview-grid">
        <section className="workspace-panel workspace-panel--next">
          <div className="workspace-panel__heading"><div><p className="micro-label">当前视角最靠近的下一步</p><h2>接下来</h2></div><Link to="/matters">查看全部 <ArrowRight size={15} /></Link></div>
          {next ? <WorkspaceMatterCard matter={next} /> : <p className="workspace-empty-copy">当前没有需要处理的事项。</p>}
          <div className="workspace-gentle-note"><Feather size={18} /><p><strong>正在查看 {user.name} 的数据。</strong>切换角色后，同一事项会按对方的责任位置重新解释。</p></div>
        </section>

        <section className="workspace-panel workspace-panel--handoffs">
          <div className="workspace-panel__heading"><div><p className="micro-label">跨角色共享事项</p><h2>协作进度</h2></div><Handshake size={21} /></div>
          <div className="workspace-handoff-summary">
            {collaboration.slice(0, 3).map((matter) => <WorkspaceMatterCard key={matter.id} matter={matter} compact />)}
            {collaboration.length === 0 && <p className="workspace-empty-copy">当前没有需要别人参与的事项。</p>}
          </div>
          <Link className="workspace-secondary-action" to="/handoffs">查看全部协作 <ArrowRight size={16} /></Link>
        </section>
      </div>

      <section className="workspace-panel workspace-panel--story">
        <div><p className="micro-label">同一份数据，不同人的位置</p><h2>切换视角不是切换假页面，而是在看同一件事如何流转。</h2><p>林然发出邀请，小雨确认负责；任何一方更新后，相关角色看到的负责人和进度都会一起变化。</p><Link to="/about">了解设计背景 <ArrowRight size={16} /></Link></div>
        <div className="workspace-story-rail" aria-label="这一步的负责人从林然变为小雨"><span>林然</span><i /><b /><i className="is-filled" /><span>小雨</span></div>
        <CheckCircle2 className="workspace-story-check" size={30} />
      </section>
    </main>
  )
}
