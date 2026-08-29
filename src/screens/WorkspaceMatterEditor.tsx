import { ArrowLeft, Save } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../app/PageHeader'
import { useWorkspace } from '../workspace/WorkspaceContext'
import type { WorkspaceMatter, WorkspaceMatterStatus, WorkspacePriority } from '../workspace/types'

const toInputDate = (value?: string) => value ? value.slice(0, 10) : ''

export function WorkspaceMatterEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useWorkspace()
  const existing = state.matters.find((matter) => matter.id === id)
  const [title, setTitle] = useState(existing?.title ?? '')
  const [context, setContext] = useState(existing?.context ?? '')
  const [nextAction, setNextAction] = useState(existing?.nextAction ?? '')
  const [doneDefinition, setDoneDefinition] = useState(existing?.doneDefinition ?? '')
  const [boundary, setBoundary] = useState(existing?.boundary ?? '')
  const [dueDate, setDueDate] = useState(toInputDate(existing?.dueAt))
  const [category, setCategory] = useState(existing?.category ?? '生活')
  const [priority, setPriority] = useState<WorkspacePriority>(existing?.priority ?? 'normal')
  const [status, setStatus] = useState<WorkspaceMatterStatus>(existing?.status ?? 'mine')
  const [ownerName, setOwnerName] = useState(existing?.ownerName ?? '林然')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const now = new Date().toISOString()
    const matter: WorkspaceMatter = {
      id: existing?.id ?? `matter-${Date.now()}`,
      title: title.trim(), context: context.trim(), nextAction: nextAction.trim(), doneDefinition: doneDefinition.trim(), boundary: boundary.trim(),
      dueAt: dueDate ? new Date(`${dueDate}T09:00:00`).toISOString() : undefined,
      category, priority, status, ownerName,
      handoffTargetId: existing?.handoffTargetId,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      completedAt: status === 'completed' ? (existing?.completedAt ?? now) : undefined,
    }
    dispatch({ type: existing ? 'update-matter' : 'add-matter', matter })
    void navigate(`/matters/${matter.id}`)
  }

  return (
    <main className="workspace-page workspace-editor-page">
      <Link className="workspace-back-link" to={existing ? `/matters/${existing.id}` : '/matters'}><ArrowLeft size={17} /> 返回事项</Link>
      <PageHeader eyebrow={existing ? '编辑事项' : '创建事项'} title={existing ? '把信息更新清楚' : '倒出一件需要推进的事'} description="标题、下一步和完成标准会帮助参与者在不反复追问的情况下行动。" />
      <form className="workspace-form" onSubmit={submit}>
        <section className="workspace-form-section"><h2>事项是什么</h2><label><span>标题 *</span><input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="例如：确认搬家验房结果" /></label><label><span>背景</span><textarea value={context} onChange={(event) => setContext(event.target.value)} placeholder="为什么现在需要处理？参与者需要知道什么？" /></label></section>
        <section className="workspace-form-section"><h2>怎样算推进</h2><label><span>明确的下一步 *</span><textarea required value={nextAction} onChange={(event) => setNextAction(event.target.value)} placeholder="写成对方可以直接行动的一句话" /></label><label><span>完成标准 *</span><textarea required value={doneDefinition} onChange={(event) => setDoneDefinition(event.target.value)} placeholder="做到什么程度，这次执行就结束？" /></label><label><span>责任边界</span><textarea value={boundary} onChange={(event) => setBoundary(event.target.value)} placeholder="什么情况必须回来联系发起者？" /></label></section>
        <section className="workspace-form-section workspace-form-grid"><h2>分类与责任</h2><label><span>日期</span><input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label><label><span>分类</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{['生活','宠物','住房','家人','伴侣','搬家','行政'].map((item) => <option key={item}>{item}</option>)}</select></label><label><span>优先级</span><select value={priority} onChange={(event) => setPriority(event.target.value as WorkspacePriority)}><option value="low">低</option><option value="normal">普通</option><option value="high">高</option></select></label><label><span>当前状态</span><select value={status} onChange={(event) => setStatus(event.target.value as WorkspaceMatterStatus)}><option value="mine">需要我推进</option><option value="waiting">等待回应</option><option value="relayed">已有人接住</option><option value="completed">已完成</option></select></label><label><span>当前责任人</span><select value={ownerName} onChange={(event) => setOwnerName(event.target.value)}><option>林然</option>{state.people.map((person) => <option key={person.id}>{person.name}</option>)}</select></label></section>
        <div className="workspace-form-actions"><button className="workspace-primary-action" type="submit"><Save size={18} /> 保存事项</button><Link className="workspace-secondary-action" to={existing ? `/matters/${existing.id}` : '/matters'}>取消</Link></div>
      </form>
    </main>
  )
}
