import { ArrowLeft, Save } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../app/PageHeader'
import { useWorkspace } from '../workspace/WorkspaceContext'
import { getActiveUser } from '../workspace/perspective'
import type { WorkspaceMatter, WorkspacePriority, WorkspaceUserId } from '../workspace/types'
import { WorkspaceAgentComposer } from './WorkspaceAgentComposer'

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
  const [assignment, setAssignment] = useState<'self' | 'invite'>('self')
  const availableInvitees = state.users.filter((user) => user.id !== activeUser.id)
  const [inviteeId, setInviteeId] = useState<WorkspaceUserId>(availableInvitees[0]?.id ?? 'xiaoyu')
  const [creationMode, setCreationMode] = useState<'agent' | 'manual'>('agent')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const now = new Date().toISOString()
    const creatorId = existing?.creatorId ?? activeUser.id
    const invitee = state.users.find((user) => user.id === inviteeId)
    const isInviting = !existing && assignment === 'invite' && Boolean(invitee)
    const participantIds = isInviting ? [creatorId, inviteeId] : (existing?.participantIds ?? [creatorId])
    const matter: WorkspaceMatter = {
      id: existing?.id ?? `matter-${crypto.randomUUID()}`,
      title: title.trim(), context: context.trim(), nextAction: nextAction.trim(), doneDefinition: doneDefinition.trim(), boundary: boundary.trim(),
      dueAt: dueDate ? new Date(`${dueDate}T09:00:00`).toISOString() : undefined,
      category, priority, status: isInviting ? 'waiting' : (existing?.status ?? 'mine'), creatorId,
      ownerId: existing?.ownerId ?? creatorId,
      ownerName: existing?.ownerName ?? activeUser.name,
      participantIds,
      handoffTargetId: isInviting ? inviteeId : existing?.handoffTargetId,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      completedAt: existing?.completedAt,
      completionNote: existing?.completionNote,
      adjustmentNote: existing?.adjustmentNote,
    }
    dispatch({ type: existing ? 'update-matter' : 'add-matter', matter })
    void navigate(`/matters/${matter.id}`)
  }

  if (!existing && creationMode === 'agent') {
    return (
      <main className="workspace-page workspace-editor-page workspace-agent-page">
        <Link className="workspace-back-link" to="/matters"><ArrowLeft size={17} /> 返回事项</Link>
        <PageHeader eyebrow="Agent 创建" title="把一件事说出来，Relay 帮你安排清楚" description="Agent 会拆解步骤、建议负责人并发现缺失信息；只有你确认后，计划才会变成真实事项。" />
        <WorkspaceAgentComposer onManual={() => setCreationMode('manual')} />
      </main>
    )
  }

  return (
    <main className="workspace-page workspace-editor-page">
      <Link className="workspace-back-link" to={existing ? `/matters/${existing.id}` : '/matters'}><ArrowLeft size={17} /> 返回事项</Link>
      <PageHeader eyebrow={existing ? '编辑事项' : '手动创建'} title={existing ? '把信息更新清楚' : '逐项填写事项信息'} description="把下一步和完成标准写清楚，自己或对方都能直接行动。" actions={!existing ? <button className="workspace-secondary-action" type="button" onClick={() => setCreationMode('agent')}>返回 Agent 创建</button> : undefined} />
      <form className="workspace-form" onSubmit={submit}>
        <section className="workspace-form-section"><h2>事项是什么</h2><label><span>标题 *</span><input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="例如：确认搬家验房结果" /></label><label><span>背景</span><textarea value={context} onChange={(event) => setContext(event.target.value)} placeholder="为什么现在需要处理？参与者需要知道什么？" /></label></section>
        <section className="workspace-form-section"><h2>下一步怎么做</h2><label><span>明确的下一步 *</span><textarea required value={nextAction} onChange={(event) => setNextAction(event.target.value)} placeholder="写成对方可以直接行动的一句话" /></label><label><span>完成标准 *</span><textarea required value={doneDefinition} onChange={(event) => setDoneDefinition(event.target.value)} placeholder="做到什么程度，这件事就算完成？" /></label><label><span>什么情况要先联系我</span><textarea value={boundary} onChange={(event) => setBoundary(event.target.value)} placeholder="例如：需要额外花费或改变原计划时先联系我" /></label></section>
        <section className="workspace-form-section workspace-form-grid"><h2>安排与分类</h2><label><span>日期</span><input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label><label><span>分类</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{['生活','宠物','住房','家人','伴侣','搬家','旅行','行政'].map((item) => <option key={item}>{item}</option>)}</select></label><label><span>优先级</span><select value={priority} onChange={(event) => setPriority(event.target.value as WorkspacePriority)}><option value="low">低</option><option value="normal">普通</option><option value="high">高</option></select></label>{existing ? <div className="workspace-form-lifecycle"><span>协作状态由流程自动推进</span><strong>{existing.ownerName} · {existing.status === 'waiting' ? '等待确认' : existing.status === 'relayed' ? '处理中' : existing.status === 'completed' ? '已完成' : '待处理'}</strong><p>修改已确认的关键约定后，会自动请对方再次确认。</p></div> : <><label><span>这一步由谁处理</span><select value={assignment} onChange={(event) => setAssignment(event.target.value as 'self' | 'invite')}><option value="self">我自己处理</option><option value="invite">邀请别人协作</option></select></label>{assignment === 'invite' && <label><span>邀请谁确认</span><select value={inviteeId} onChange={(event) => setInviteeId(event.target.value as WorkspaceUserId)}>{availableInvitees.map((user) => <option key={user.id} value={user.id}>{user.name} · {user.role}</option>)}</select></label>}</>}</section>
        <div className="workspace-form-actions"><button className="workspace-primary-action" type="submit"><Save size={18} /> 保存事项</button><Link className="workspace-secondary-action" to={existing ? `/matters/${existing.id}` : '/matters'}>取消</Link></div>
      </form>
    </main>
  )
}
