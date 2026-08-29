import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import { isAgentTurnResponse, type AgentPlanDraft, type AgentTurnRequest, type AgentTurnResponse } from '../src/agent/types.ts'
import { guardAgentTurn } from '../src/agent/workflowGuard.ts'
import { isWorkspaceState } from '../src/workspace/persistence.ts'
import type { WorkspaceState, WorkspaceUserId } from '../src/workspace/types.ts'

export type ServerConfig = {
  apiKey?: string
  baseUrl: string
  model: string
  agentMode: 'auto' | 'fallback'
}

const MAX_BODY_BYTES = 64_000
const MAX_INPUT_LENGTH = 1_500

async function readJson(request: IncomingMessage): Promise<unknown> {
  const chunks: string[] = []
  let size = 0
  for await (const chunk of request as AsyncIterable<unknown>) {
    const text = typeof chunk === 'string' ? chunk : chunk instanceof Uint8Array ? new TextDecoder().decode(chunk) : ''
    size += Buffer.byteLength(text)
    if (size > MAX_BODY_BYTES) throw new Error('request-too-large')
    chunks.push(text)
  }
  return JSON.parse(chunks.join('')) as unknown
}

function sendJson(response: ServerResponse, status: number, value: unknown) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify(value))
}

function isAgentRequest(value: unknown): value is AgentTurnRequest {
  if (!value || typeof value !== 'object') return false
  const request = value as Partial<AgentTurnRequest>
  return typeof request.input === 'string' && request.input.trim().length > 0 && request.input.length <= MAX_INPUT_LENGTH &&
    ['linran', 'xiaoyu', 'sister', 'chenyu'].includes(String(request.currentUserId)) &&
    Array.isArray(request.transcript) && request.transcript.length <= 12 &&
    request.transcript.every((item) => item && ['user', 'assistant'].includes(item.role) && typeof item.content === 'string' && item.content.length <= MAX_INPUT_LENGTH) &&
    Array.isArray(request.users) && request.users.length === 4
}

const findOwner = (text: string, users: AgentTurnRequest['users'], currentUserId: WorkspaceUserId) =>
  users.find((user) => text.includes(user.name) && user.id !== currentUserId) ?? users.find((user) => user.id === currentUserId)!

function localFallback(request: AgentTurnRequest, notice?: string): AgentTurnResponse {
  const combined = [...request.transcript.filter((item) => item.role === 'user').map((item) => item.content), request.input].join('；')
  const creator = request.users.find((user) => user.id === request.currentUserId)!
  const owner = findOwner(combined, request.users, request.currentUserId)
  const isCat = /布丁|猫|复诊|宠物/.test(combined)
  const hasSpecificTime = /\d{1,2}[:：]\d{2}|上午|下午|晚上|早上/.test(combined)
  const mentionedOtherPerson = owner.id !== creator.id
  const missingFields = [!mentionedOtherPerson ? '协作负责人' : '', isCat && !hasSpecificTime ? '预约时间' : ''].filter(Boolean)
  const ready = missingFields.length === 0
  const boundary = isCat ? '如果医生建议手术、住院、更改治疗方案或产生重大费用，请先联系发起者。' : '如果范围、时间或费用发生重要变化，请先联系发起者。'
  const title = isCat ? '安排布丁完成复诊' : combined.slice(0, 28).replace(/[。；，,].*$/, '') || '新的协作计划'
  const steps = isCat ? [
    { id: 'prepare', title: '准备复诊材料', nextAction: `${creator.name}确认报告、猫包和接送信息已经准备好`, ownerId: creator.id, ownerName: creator.name, doneDefinition: '小雨可以直接取得布丁和全部复诊材料' },
    { id: 'visit', title: '带布丁完成复诊', nextAction: `${owner.name}按确认的时间接到布丁并前往诊所`, ownerId: owner.id, ownerName: owner.name, doneDefinition: '布丁完成复诊并安全回家' },
    { id: 'report', title: '同步复诊结果', nextAction: `${owner.name}把医生结论和后续注意事项发给${creator.name}`, ownerId: owner.id, ownerName: owner.name, doneDefinition: `${creator.name}已经收到复诊结论和下一步建议` },
  ] : [
    { id: 'prepare', title: '确认协作信息', nextAction: `${creator.name}确认时间、材料和处理边界`, ownerId: creator.id, ownerName: creator.name, doneDefinition: '执行者拿到可以直接行动的完整信息' },
    { id: 'execute', title, nextAction: `${owner.name}按确认后的约定完成下一步`, ownerId: owner.id, ownerName: owner.name, doneDefinition: '完成结果已记录并同步给相关人' },
  ]
  const draft: AgentPlanDraft = { title, context: combined, category: isCat ? '宠物' : '生活', priority: isCat ? 'high' : 'normal', boundary, steps, missingFields, assumptions: ['未明确的日期暂不写入截止时间', '所有重要变化都需要发起者再次确认'] }
  const question = !mentionedOtherPerson ? '这件事希望由谁负责主要执行？' : isCat && !hasSpecificTime ? '复诊预约的具体时间是什么？' : undefined
  return {
    status: ready ? 'ready' : 'needs_input',
    message: ready ? `我整理成了 ${steps.length} 个可执行步骤。发布前请确认负责人、完成标准和边界。` : `我先整理了计划草案，还缺少会影响执行的信息。`,
    question,
    draft,
    engine: 'local-demo',
    notice: notice ?? '当前未配置 MiniMax API Key，正在使用可重复的本地演示引擎。',
  }
}

const SYSTEM_PROMPT = `你是 Relay 协作编排 Agent。把用户的生活事项转成可执行、可确认的多人协作计划。
只输出一个 JSON 对象，不使用 Markdown，不输出思考过程。结构必须是：
{"status":"needs_input|ready","message":"简短说明","question":"一次只问一个关键问题，可省略","draft":{"title":"计划标题","context":"完整背景","category":"生活|宠物|住房|家人|伴侣|搬家|旅行|行政","priority":"low|normal|high","boundary":"需要先联系发起者的情况","steps":[{"id":"稳定英文短 id","title":"步骤标题","nextAction":"可以直接行动的一句话","ownerId":"白名单用户 id","ownerName":"姓名","doneDefinition":"可观察的完成标准","dueDate":"YYYY-MM-DD，可省略"}],"missingFields":["仍缺字段"],"assumptions":["明确写出的假设"]}}
规则：1. 只能使用请求里给出的用户 id；2. 通常拆成 2 至 4 个有行动价值的步骤，最多 6 步，不要把“确认对方是否同意”单独列成步骤；如果一件事同时包含事前准备、他人执行和结果同步，必须分别拆成 3 步，不得压缩成 1 步；3. 发布计划只会创建邀请，不替受邀人接受，因此绝对不要询问受邀人是否同意、方便或接受委托；4. 缺少会阻塞执行的负责人、明确时间或关键边界时 status=needs_input；5. 每轮只能询问一个字段，question 只能包含一个问句，禁止把时间、地点、注意事项合并询问，missingFields 也只保留本轮询问的一个字段；6. 用户给出“周六”“明天”等相对日期或“常去的医院”“家里”等双方已知地点时视为可执行，不强求绝对日期或详细地址；7. 不主动询问用户没有提及的特殊照护、费用或医疗决策；8. 信息足够时 status=ready；9. 不捏造地址、日期、费用或医疗决定。`

function extractJson(content: string): unknown {
  const withoutThinking = content.replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/```(?:json)?|```/gi, '').trim()
  const start = withoutThinking.indexOf('{')
  const end = withoutThinking.lastIndexOf('}')
  if (start < 0 || end <= start) throw new Error('missing-json')
  return JSON.parse(withoutThinking.slice(start, end + 1)) as unknown
}

async function runMiniMax(config: ServerConfig, request: AgentTurnRequest): Promise<AgentTurnResponse> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 30_000)
  try {
    const context = JSON.stringify({ currentUserId: request.currentUserId, users: request.users, transcript: request.transcript, latestInput: request.input })
    const result = await fetch(`${config.baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: config.model, messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: context }], temperature: 0.3, top_p: 0.9, max_tokens: 2_000 }),
      signal: controller.signal,
    })
    if (!result.ok) throw new Error(`minimax-${result.status}`)
    const payload = await result.json() as { choices?: Array<{ message?: { content?: string } }> }
    const parsed = extractJson(payload.choices?.[0]?.message?.content ?? '')
    if (!isAgentTurnResponse(parsed)) throw new Error('invalid-agent-shape')
    return guardAgentTurn({
      ...parsed,
      engine: 'minimax',
      notice: `由 ${config.model} 生成；发布前仍需人工确认。`,
    }, request)
  } finally {
    clearTimeout(timer)
  }
}

export type RelayMiddleware = (request: IncomingMessage, response: ServerResponse, next: () => void) => Promise<void>

export function createRelayMiddleware(config: ServerConfig): RelayMiddleware {
  let workspaceState: WorkspaceState | null = null
  const eventClients = new Set<ServerResponse>()
  const broadcast = (source: string, state: WorkspaceState) => {
    const data = `data: ${JSON.stringify({ source, state })}\n\n`
    eventClients.forEach((client) => client.write(data))
  }
  const middleware = async (request: IncomingMessage, response: ServerResponse, next: () => void) => {
    const url = new URL(request.url ?? '/', 'http://relay.local')
    if (!url.pathname.startsWith('/api/')) return next()
    try {
      if (url.pathname === '/api/health' && request.method === 'GET') return sendJson(response, 200, { ok: true, agent: config.apiKey && config.agentMode !== 'fallback' ? 'minimax' : 'local-demo', room: 'memory-demo' })
      if (url.pathname === '/api/workspace/events' && request.method === 'GET') {
        response.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive' })
        response.write(': connected\n\n')
        eventClients.add(response)
        request.on('close', () => eventClients.delete(response))
        return
      }
      if (url.pathname === '/api/workspace' && request.method === 'GET') {
        if (!workspaceState) { response.statusCode = 204; response.end(); return }
        return sendJson(response, 200, { state: workspaceState })
      }
      if (url.pathname === '/api/workspace' && request.method === 'DELETE') {
        workspaceState = null
        return sendJson(response, 200, { ok: true })
      }
      if (url.pathname === '/api/workspace' && request.method === 'PUT') {
        const body = await readJson(request) as { source?: unknown; state?: unknown }
        if (typeof body.source !== 'string' || !isWorkspaceState(body.state)) return sendJson(response, 400, { error: 'invalid-workspace-state' })
        workspaceState = body.state
        broadcast(body.source, body.state)
        return sendJson(response, 200, { ok: true })
      }
      if (url.pathname === '/api/agent' && request.method === 'POST') {
        const body = await readJson(request)
        if (!isAgentRequest(body)) return sendJson(response, 400, { error: 'invalid-agent-request' })
        if (!config.apiKey || config.agentMode === 'fallback') return sendJson(response, 200, localFallback(body))
        try {
          return sendJson(response, 200, await runMiniMax(config, body))
        } catch (error) {
          const reason = error instanceof Error ? error.message : 'unknown-provider-error'
          return sendJson(response, 200, localFallback(body, `MiniMax 暂时不可用（${reason}），已切换到本地演示引擎。`))
        }
      }
      return sendJson(response, 404, { error: 'not-found' })
    } catch (error) {
      return sendJson(response, error instanceof Error && error.message === 'request-too-large' ? 413 : 500, { error: 'server-error' })
    }
  }
  return middleware
}

export function relayServerPlugin(config: ServerConfig): Plugin {
  const middleware = createRelayMiddleware(config)
  return {
    name: 'relay-server',
    configureServer(server) { server.middlewares.use((request, response, next) => { void middleware(request, response, next) }) },
    configurePreviewServer(server) { server.middlewares.use((request, response, next) => { void middleware(request, response, next) }) },
  }
}
