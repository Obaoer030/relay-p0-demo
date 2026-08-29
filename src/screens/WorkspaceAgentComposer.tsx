import { ArrowRight, CheckCircle2, CircleAlert, LoaderCircle, MessageSquareText, PenLine, Send, ShieldCheck, Workflow } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAgentTurnResponse, type AgentPlanDraft, type AgentTranscriptMessage } from '../agent/types'
import { useWorkspace } from '../workspace/WorkspaceContext'
import { getActiveUser } from '../workspace/perspective'
import type { WorkspaceMatter, WorkspaceUserId } from '../workspace/types'

const starters = [
  '我周五临时出差，想请小雨周六带布丁复诊。',
  '妈妈的体检报告需要有人去医院领取，想请姐姐处理。',
  '月底搬家，想把验房、纸箱和钥匙交接安排清楚。',
]

export function WorkspaceAgentComposer({ onManual }: { onManual: () => void }) {
  const navigate = useNavigate()
  const { state, dispatch } = useWorkspace()
  const currentUser = getActiveUser(state.users, state.activeUserId)
  const [input, setInput] = useState('')
  const [transcript, setTranscript] = useState<AgentTranscriptMessage[]>([])
  const [draft, setDraft] = useState<AgentPlanDraft | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'needs_input' | 'ready'>('idle')
  const [engine, setEngine] = useState<'minimax' | 'local-demo' | null>(null)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const send = async (event: FormEvent) => {
    event.preventDefault()
    const value = input.trim()
    if (!value || status === 'loading') return
    setStatus('loading')
    setError('')
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: value, transcript, currentUserId: currentUser.id, users: state.users.map(({ id, name, role }) => ({ id, name, role })) }),
      })
      if (!response.ok) throw new Error('agent-service-unavailable')
      const payload: unknown = await response.json()
      if (!isAgentTurnResponse(payload)) throw new Error('invalid-agent-response')
      const assistantContent = [payload.message, payload.question].filter(Boolean).join('\n')
      setTranscript((messages) => [...messages, { role: 'user', content: value }, { role: 'assistant', content: assistantContent }])
      setDraft(payload.draft)
      setStatus(payload.status)
      setEngine(payload.engine)
      setNotice(payload.notice ?? '')
      setInput('')
    } catch {
      setStatus('idle')
      setError('Agent 服务暂时没有响应。你可以重试，或切换到手动创建。')
    }
  }

  const updateOwner = (stepId: string, ownerId: WorkspaceUserId) => {
    const owner = state.users.find((user) => user.id === ownerId)
    if (!owner) return
    setDraft((current) => current ? { ...current, steps: current.steps.map((step) => step.id === stepId ? { ...step, ownerId, ownerName: owner.name } : step) } : current)
  }

  const publish = () => {
    if (!draft || status !== 'ready') return
    const now = new Date().toISOString()
    const planId = `plan-${crypto.randomUUID()}`
    const matters = draft.steps.map((step, index): WorkspaceMatter => {
      const isSelf = step.ownerId === currentUser.id
      return {
        id: `matter-${crypto.randomUUID()}`,
        title: step.title,
        context: draft.context,
        nextAction: step.nextAction,
        doneDefinition: step.doneDefinition,
        boundary: draft.boundary,
        dueAt: step.dueDate ? new Date(`${step.dueDate}T09:00:00`).toISOString() : undefined,
        status: isSelf ? 'mine' : 'waiting',
        creatorId: currentUser.id,
        ownerId: currentUser.id,
        ownerName: currentUser.name,
        participantIds: isSelf ? [currentUser.id] : [currentUser.id, step.ownerId],
        handoffTargetId: isSelf ? undefined : step.ownerId,
        category: draft.category,
        priority: draft.priority,
        createdAt: now,
        updatedAt: now,
        planId,
        planTitle: draft.title,
        planStepIndex: index + 1,
        planStepTotal: draft.steps.length,
        agentGenerated: true,
      }
    })
    matters.forEach((matter) => dispatch({ type: 'add-matter', matter }))
    void navigate(`/matters/${matters[0].id}`)
  }

  return (
    <section className="workspace-agent-composer" aria-labelledby="agent-composer-title">
      <div className="workspace-agent-dialogue">
        <header><div className="workspace-agent-mark"><Workflow size={20} /><i /></div><div><p className="micro-label">RELAY COORDINATOR · TEXT</p><h2 id="agent-composer-title">先说清楚发生了什么</h2></div><button type="button" onClick={onManual}><PenLine size={16} /> 手动填写</button></header>
        <p className="workspace-agent-lead">不用先想字段。像发消息一样说明事情、相关的人和你担心的边界，我会先整理草案，再只追问真正影响执行的信息。</p>

        {transcript.length === 0 && <div className="workspace-agent-starters">{starters.map((starter) => <button key={starter} type="button" onClick={() => setInput(starter)}>{starter}<ArrowRight size={14} /></button>)}</div>}
        {transcript.length > 0 && <div className="workspace-agent-thread" aria-label="与协作 Agent 的对话">{transcript.map((message, index) => <article key={`${message.role}-${index}`} data-role={message.role}><span>{message.role === 'user' ? currentUser.name : 'Relay Agent'}</span><p>{message.content}</p></article>)}</div>}

        {error && <div className="workspace-agent-error"><CircleAlert size={18} /><span>{error}</span></div>}
        <form className="workspace-agent-input" onSubmit={(event) => { void send(event) }}>
          <label htmlFor="agent-input">{status === 'needs_input' ? '补充 Agent 询问的信息' : '描述你想安排的事情'}</label>
          <div><textarea id="agent-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder={status === 'needs_input' ? '直接回答上面的问题即可…' : '例如：我周五临时出差，想请小雨周六带布丁复诊…'} /><button type="submit" disabled={!input.trim() || status === 'loading'} aria-label="发送给协作 Agent">{status === 'loading' ? <LoaderCircle className="is-spinning" size={20} /> : <Send size={20} />}</button></div>
          <small>Agent 只生成草案，不会替任何人接受或直接发布。</small>
        </form>
      </div>

      <aside className="workspace-agent-plan" aria-live="polite">
        {!draft ? <div className="workspace-agent-plan-empty"><MessageSquareText size={28} /><p className="micro-label">LIVE PLAN</p><h2>计划会在这里形成</h2><p>负责人、步骤、完成标准和决策边界会随着你的补充实时更新。</p></div> : <>
          <header><div><p className="micro-label">LIVE PLAN · {draft.steps.length} STEPS</p><h2>{draft.title}</h2></div><span data-engine={engine}>{engine === 'minimax' ? 'MiniMax 在线' : '本地演示引擎'}</span></header>
          {notice && <p className="workspace-agent-notice">{notice}</p>}
          {draft.missingFields.length > 0 && <div className="workspace-agent-missing"><CircleAlert size={17} /><div><strong>发布前还缺</strong><p>{draft.missingFields.join(' · ')}</p></div></div>}
          <div className="workspace-agent-steps">{draft.steps.map((step, index) => <article key={step.id}><b>{String(index + 1).padStart(2, '0')}</b><div><h3>{step.title}</h3><p>{step.nextAction}</p><label><span>建议负责人</span><select aria-label={`步骤 ${index + 1} 负责人`} value={step.ownerId} onChange={(event) => updateOwner(step.id, event.target.value as WorkspaceUserId)}>{state.users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></label><small><CheckCircle2 size={13} /> {step.doneDefinition}</small></div></article>)}</div>
          <div className="workspace-agent-boundary"><ShieldCheck size={18} /><div><strong>需要先联系发起者</strong><p>{draft.boundary}</p></div></div>
          {draft.assumptions.length > 0 && <details><summary>Agent 使用了 {draft.assumptions.length} 条明确假设</summary><ul>{draft.assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}</ul></details>}
          <button className="workspace-primary-action workspace-agent-publish" type="button" disabled={status !== 'ready'} onClick={publish}>{status === 'ready' ? `确认并创建 ${draft.steps.length} 个步骤` : '补全信息后才能创建'} <ArrowRight size={17} /></button>
        </>}
      </aside>
    </section>
  )
}
