import { ArrowLeft, Save } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../app/PageHeader'
import { useWorkspace } from '../workspace/WorkspaceContext'
import { getActiveUser } from '../workspace/perspective'
import type { WorkspaceMatter, WorkspaceMatterStatus, WorkspacePriority } from '../workspace/types'

const toInputDate = (value?: string) => value ? value.slice(0, 10) : ''

export function WorkspaceMatterEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useWorkspace()
  const activeUser = getActiveUser(state.users, state.activeUserId)
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
  const [ownerName, setOwnerName] = useState(existing?.ownerName ?? activeUser.name)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const now = new Date().toISOString()
    const selectedUser = state.users.find((user) => user.name === ownerName)
    const selectedPerson = state.people.find((person) => person.name === ownerName)
    const selectedId = selectedUser?.id ?? (selectedPerson?.id === 'mumu' ? 'mumu' : activeUser.id)
    const creatorId = existing?.creatorId ?? activeUser.id
    const ownerId = status === 'waiting' ? creatorId : selectedId
    const handoffTargetId = status === 'waiting' || status === 'relayed' ? selectedId : existing?.handoffTargetId
    const participantIds = [...new Set([...(existing?.participantIds ?? []), creatorId, ...(selectedUser ? [selectedUser.id] : [])])]
    const matter: WorkspaceMatter = {
      id: existing?.id ?? `matter-${Date.now()}`,
      title: title.trim(), context: context.trim(), nextAction: nextAction.trim(), doneDefinition: doneDefinition.trim(), boundary: boundary.trim(),
      dueAt: dueDate ? new Date(`${dueDate}T09:00:00`).toISOString() : undefined,
      category, priority, status, creatorId, ownerId, ownerName: status === 'waiting' ? activeUser.name : ownerName,
      participantIds, handoffTargetId,
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
      <PageHeader eyebrow={existing ? '编辑事项' : '创建事项'} title={existing ? '把信息更新清楚' : '记下一件需要处理的事'} description="把下一步和完成标准写清楚，自己或对方都能直接行动。" />
      <form className="workspace-form" onSubmit={submit}>
        <section className="workspace-form-section"><h2>事项是什么</h2><label><span>标题 *</span><input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="例如：确认搬家验房结果" /></label><label><span>背景</span><textarea value={context} onChange={(event) => setContext(event.target.value)} placeholder="为什么现在需要处理？参与者需要知道什么？" /></label></section>
        <section className="workspace-form-section"><h2>下一步怎么做</h2><label><span>明确的下一步 *</span><textarea required value={nextAction} onChange={(event) => setNextAction(event.target.value)} placeholder="写成对方可以直接行动的一句话" /></label><label><span>完成标准 *</span><textarea required value={doneDefinition} onChange={(event) => setDoneDefinition(event.target.value)} placeholder="做到什么程度，这件事就算完成？" /></label><label><span>什么情况要先联系我</span><textarea value={boundary} onChange={(event) => setBoundary(event.target.value)} placeholder="例如：需要额外花费或改变原计划时先联系我" /></label></section>
        <section className="workspace-form-section workspace-form-grid"><h2>分类与负责人</h2><label><span>日期</span><input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label><label><span>分类</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{['生活','宠物','住房','家人','伴侣','搬家','旅行','行政'].map((item) => <option key={item}>{item}</option>)}</select></label><label><span>优先级</span><select value={priority} onChange={(event) => setPriority(event.target.value as WorkspacePriority)}><option value="low">低</option><option value="normal">普通</option><option value="high">高</option></select></label><label><span>当前状态</span><select value={status} onChange={(event) => setStatus(event.target.value as WorkspaceMatterStatus)}><option value="mine">待我处理</option><option value="waiting">等待对方确认</option><option value="relayed">对方处理中</option><option value="completed">已完成</option></select></label><label><span>{status === 'waiting' ? '发给谁确认' : '当前负责人'}</span><select value={ownerName} onChange={(event) => setOwnerName(event.target.value)}>{state.users.map((user) => <option key={user.id}>{user.name}</option>)}{state.people.filter((person) => !state.users.some((user) => user.id === person.id)).map((person) => <option key={person.id}>{person.name}</option>)}</select></label></section>
        <div className="workspace-form-actions"><button className="workspace-primary-action" type="submit"><Save size={18} /> 保存事项</button><Link className="workspace-secondary-action" to={existing ? `/matters/${existing.id}` : '/matters'}>取消</Link></div>
      </form>
    </main>
  )
}
