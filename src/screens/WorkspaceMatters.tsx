import { ListFilter, Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../app/PageHeader'
import { WorkspaceMatterCard } from '../app/WorkspaceMatterCard'
import { workspaceStatus } from '../app/workspaceStatus'
import { useWorkspace } from '../workspace/WorkspaceContext'
import { getActiveUser, getPerspectiveStatus, visibleMattersFor } from '../workspace/perspective'
import type { WorkspaceDisplayStatus } from '../workspace/types'

type MatterFilter = 'all' | WorkspaceDisplayStatus

const filters: Array<{ value: MatterFilter; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'mine', label: '待我处理' },
  { value: 'incoming', label: '等我确认' },
  { value: 'waiting', label: '等待回复' },
  { value: 'relayed', label: '对方处理中' },
  { value: 'completed', label: '已完成' },
]

export function WorkspaceMatters() {
  const { state } = useWorkspace()
  const user = getActiveUser(state.users, state.activeUserId)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<MatterFilter>('all')
  const visibleMatters = useMemo(() => visibleMattersFor(state.matters, user.id), [state.matters, user.id])
  const filterCounts = useMemo(() => Object.fromEntries(filters.map((item) => [
    item.value,
    item.value === 'all'
      ? visibleMatters.length
      : visibleMatters.filter((matter) => getPerspectiveStatus(matter, user.id) === item.value).length,
  ])) as Record<MatterFilter, number>, [user.id, visibleMatters])
  const results = useMemo(() => visibleMatters.filter((matter) => {
    const matchesStatus = filter === 'all' || getPerspectiveStatus(matter, user.id) === filter
    const text = `${matter.title} ${matter.context} ${matter.nextAction} ${matter.category}`.toLowerCase()
    return matchesStatus && text.includes(query.trim().toLowerCase())
  }), [filter, query, user.id, visibleMatters])
  const activeFilter = filters.find((item) => item.value === filter) ?? filters[0]

  return (
    <main className="workspace-page workspace-matters-page">
      <section className="workspace-matters-hero">
        <PageHeader eyebrow={`${user.name} · 行动队列`} title="所有事项" description="按责任位置查看每件事：谁在推进、下一步是什么、哪里正在等待，一眼就能确认。" actions={<Link className="workspace-primary-action" to="/matters/new"><Plus size={18} /> 新建事项</Link>} />
        <div className="workspace-matters-brief" aria-label="当前事项视角">
          <span><i /> 当前视角</span>
          <strong>{user.name} 的行动队列</strong>
          <small>{visibleMatters.length} 条相关记录 · 切换用户后会显示对应责任位置</small>
        </div>
      </section>

      <section className="workspace-matters-console" aria-label="事项查找与筛选">
        <div className="workspace-matters-console__top">
          <label className="workspace-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索标题、下一步或场景" /></label>
          <div className="workspace-result-count" aria-live="polite">
            <span>当前结果</span>
            <strong>{results.length}</strong>
            <small>条事项</small>
          </div>
        </div>
        <div className="workspace-filter-chips" aria-label="筛选事项状态">
          {filters.map((item) => (
            <button key={item.value} type="button" className={filter === item.value ? 'is-active' : ''} aria-label={item.label} aria-pressed={filter === item.value} onClick={() => setFilter(item.value)}>
              <span>{item.label}</span>
              <strong>{filterCounts[item.value]}</strong>
            </button>
          ))}
        </div>
      </section>

      <div className="workspace-result-heading">
        <span><ListFilter size={14} /> {activeFilter.label} · {results.length} 个事项</span>
        <span>{filter === 'all' ? '按最近更新' : workspaceStatus[filter].copy}</span>
      </div>
      <section className="workspace-matter-grid">
        {results.map((matter, index) => <WorkspaceMatterCard key={matter.id} matter={matter} order={index + 1} />)}
        {results.length === 0 && <div className="workspace-empty-state"><Search size={26} /><h2>没有匹配的事项</h2><p>换一个关键词或状态，或者创建一件新的生活事项。</p></div>}
      </section>
    </main>
  )
}
