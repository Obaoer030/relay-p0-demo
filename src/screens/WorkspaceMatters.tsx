import { Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../app/PageHeader'
import { WorkspaceMatterCard } from '../app/WorkspaceMatterCard'
import { workspaceStatus } from '../app/workspaceStatus'
import { useWorkspace } from '../workspace/WorkspaceContext'
import type { WorkspaceMatterStatus } from '../workspace/types'

const filters: Array<{ value: 'all' | WorkspaceMatterStatus; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'mine', label: '待我处理' },
  { value: 'waiting', label: '等待回复' },
  { value: 'relayed', label: '对方处理中' },
  { value: 'completed', label: '已完成' },
]

export function WorkspaceMatters() {
  const { state } = useWorkspace()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | WorkspaceMatterStatus>('all')
  const results = useMemo(() => state.matters.filter((matter) => {
    const matchesStatus = filter === 'all' || matter.status === filter
    const text = `${matter.title} ${matter.context} ${matter.nextAction} ${matter.category}`.toLowerCase()
    return matchesStatus && text.includes(query.trim().toLowerCase())
  }), [filter, query, state.matters])

  return (
    <main className="workspace-page">
      <PageHeader eyebrow="完整事项管理" title="所有事项" description="把下一步、负责人、完成标准和需要重新联系的情况放在一起，不让事情沉进聊天记录。" actions={<Link className="workspace-primary-action" to="/matters/new"><Plus size={18} /> 新建事项</Link>} />
      <section className="workspace-toolbar">
        <label className="workspace-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索标题、下一步或场景" /></label>
        <div className="workspace-filter-chips" aria-label="筛选事项状态">
          {filters.map((item) => <button key={item.value} type="button" className={filter === item.value ? 'is-active' : ''} onClick={() => setFilter(item.value)}>{item.label}</button>)}
        </div>
      </section>
      <div className="workspace-result-heading"><span>{results.length} 个事项</span><span>{filter === 'all' ? '按最近更新' : workspaceStatus[filter].copy}</span></div>
      <section className="workspace-matter-grid">
        {results.map((matter) => <WorkspaceMatterCard key={matter.id} matter={matter} />)}
        {results.length === 0 && <div className="workspace-empty-state"><Search size={26} /><h2>没有匹配的事项</h2><p>换一个关键词或状态，或者创建一件新的生活事项。</p></div>}
      </section>
    </main>
  )
}
