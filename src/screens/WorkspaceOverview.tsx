import { ArrowRight, CheckCircle2, Plus, Radio, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WorkspaceMatterCard } from '../app/WorkspaceMatterCard'
import { workspaceStatus } from '../app/workspaceStatus'
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
  const completion = visible.length === 0 ? 0 : Math.round((completed.length / visible.length) * 100)
  const relatedUsers = state.users.filter((candidate) => candidate.id !== user.id).slice(0, 3)

  return (
    <main className="workspace-page workspace-overview">
      <section className="relay-command-hero" aria-labelledby="workspace-hero-title">
        <div className="relay-hero-grid" aria-hidden="true" />
        <div className="relay-command-copy">
          <p className="relay-online-chip"><i /> 责任信号在线</p>
          <p className="micro-label">今天 · {user.role} · {visible.length} 个相关事项</p>
          <h1 id="workspace-hero-title">早上好，{user.name}</h1>
          <h2 className="relay-command-headline">
            <span><em>下一步</em></span>
            <span>交给对的人</span>
          </h2>
          <p className="relay-command-intro">同一件事会根据当前视角显示不同状态，但负责人、下一步和完成结果始终来自同一份共享数据。</p>
          <div className="relay-hero-actions">
            <Link className="workspace-primary-action" to="/matters/new"><span>新建一件事项</span><Plus size={18} /></Link>
            <Link className="workspace-secondary-action" to="/handoffs">查看协作进度 <ArrowRight size={16} /></Link>
          </div>

          <section className="workspace-stat-grid" aria-label={`${user.name}的事项概览`}>
            <article><span>待我处理</span><strong>{mine.length}</strong><small>下一步由我处理</small></article>
            <article className="is-incoming"><span>等我确认</span><strong>{incoming.length}</strong><small>接受或说明不方便</small></article>
            <article><span>等待回复</span><strong>{waiting.length}</strong><small>邀请已经发出</small></article>
            <article className="is-relayed"><span>对方处理中</span><strong>{relayed.length}</strong><small>负责人已经明确</small></article>
            <article><span>最近完成</span><strong>{completed.length}</strong><small>双方都能看到结果</small></article>
          </section>
        </div>

        <div className="relay-signal-stage" aria-label={`正在展示 ${user.name} 与相关协作者之间的责任信号`}>
          <div className="relay-orbit relay-orbit--outer" aria-hidden="true" />
          <div className="relay-orbit relay-orbit--middle" aria-hidden="true" />
          <div className="relay-orbit relay-orbit--inner" aria-hidden="true" />
          <div className="relay-signal-beam relay-signal-beam--a" aria-hidden="true"><i /></div>
          <div className="relay-signal-beam relay-signal-beam--b" aria-hidden="true"><i /></div>
          <div className={`relay-person-node relay-person-node--center tone-${user.tone}`}>
            <span>{user.initial}</span><strong>{user.name}</strong><small>当前视角</small>
          </div>
          {relatedUsers.map((related, index) => (
            <div key={related.id} className={`relay-person-node relay-person-node--${index + 1} tone-${related.tone}`}>
              <span>{related.initial}</span><strong>{related.name}</strong><small>{related.role}</small>
            </div>
          ))}
          {next && (
            <Link className="relay-floating-matter" to={`/matters/${next.id}`}>
              <small>下一信号</small>
              <strong>{next.title}</strong>
              <span><Radio size={13} /> {workspaceStatus[getPerspectiveStatus(next, user.id)].label}</span>
            </Link>
          )}
          <div className="relay-readiness" aria-label={`可见事项完成度 ${completion}%`}>
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="44" />
              <circle className="is-progress" cx="50" cy="50" r="44" style={{ strokeDashoffset: 276 - 276 * completion / 100 }} />
            </svg>
            <strong>{completion}</strong><span>% 已完成</span>
          </div>
          <p className="relay-signal-caption"><Sparkles size={14} /> 视角切换会重新解释位置，不会复制数据</p>
        </div>
      </section>

      <div className="workspace-overview-grid relay-operations-grid">
        <section className="workspace-panel workspace-panel--next">
          <div className="workspace-panel__heading"><div><p className="micro-label">01 · 当前任务队列</p><h2>接下来</h2></div><Link to="/matters">查看全部 <ArrowRight size={15} /></Link></div>
          {next ? <WorkspaceMatterCard matter={next} /> : <p className="workspace-empty-copy">当前没有需要处理的事项。</p>}
          <div className="relay-queue-list">
            {open.filter((matter) => matter.id !== next?.id).slice(0, 3).map((matter, index) => (
              <Link key={matter.id} to={`/matters/${matter.id}`}>
                <span>0{index + 2}</span><strong>{matter.title}</strong><small>{workspaceStatus[getPerspectiveStatus(matter, user.id)].label}</small><ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </section>

        <section className="workspace-panel workspace-panel--handoffs">
          <div className="workspace-panel__heading"><div><p className="micro-label">02 · 共享信号</p><h2>协作进度</h2></div><span className="relay-panel-pulse" aria-hidden="true" /></div>
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
