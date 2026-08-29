import { reviewPlanGranularity } from '../src/agent/granularity.js'
import { guardAgentDueDates } from '../src/agent/dateGuard.js'
import { isAgentTurnResponse, type AgentTurnRequest, type AgentTurnResponse } from '../src/agent/types.js'
import { guardAgentTurn } from '../src/agent/workflowGuard.js'

export type ServerConfig = {
  apiKey?: string
  baseUrl: string
  model: string
}

const MAX_INPUT_LENGTH = 1_500

export function isAgentRequest(value: unknown): value is AgentTurnRequest {
  if (!value || typeof value !== 'object') return false
  const request = value as Partial<AgentTurnRequest>
  return typeof request.input === 'string' && request.input.trim().length > 0 && request.input.length <= MAX_INPUT_LENGTH &&
    ['linran', 'xiaoyu', 'sister', 'chenyu'].includes(String(request.currentUserId)) &&
    Array.isArray(request.transcript) && request.transcript.length <= 12 &&
    request.transcript.every((item) => item && ['user', 'assistant'].includes(item.role) && typeof item.content === 'string' && item.content.length <= MAX_INPUT_LENGTH) &&
    Array.isArray(request.users) && request.users.length === 4
}

const SYSTEM_PROMPT = `你是 Relay 协作编排 Agent。把用户的生活事项转成可执行、可确认的多人协作计划。
只输出一个 JSON 对象，不使用 Markdown，不输出思考过程。结构必须是：
{"status":"needs_input|ready","message":"简短说明","question":"一次只问一个关键问题，可省略","draft":{"title":"计划标题","context":"完整背景","category":"生活|宠物|住房|家人|伴侣|搬家|旅行|行政","priority":"low|normal|high","boundary":"需要先联系发起者的情况","steps":[{"id":"稳定英文短 id","title":"步骤标题","nextAction":"可以直接行动的一句话","ownerId":"白名单用户 id","ownerName":"姓名","doneDefinition":"可观察的完成标准","dueDate":"YYYY-MM-DD，可省略"}],"missingFields":["仍缺字段"],"assumptions":["明确写出的假设"]}}
拆分标准：一步只承载一个可以独立完成、独立确认结果的行动。用户明确说出的每个行动都必须保留，不能概括成“完成后续”“按约定处理”或一个包含多阶段的复杂事项。看到“先、然后、之后、接着、随后、再、最后、完成后、拿完后、看完后”等顺序关系时，在动作之间建立独立步骤。准备多件材料可以合为一个准备步骤，但挂号、看病、取药、购买检查工具、整理物品和反馈结果必须分别成为确认点。根据真实动作数量输出 1 至 10 步，不为凑数量增加“确认对方是否同意”之类的流程步骤。
其他规则：1. 只能使用请求里给出的用户 id；2. 发布计划只会创建邀请，不替受邀人接受，因此绝对不要询问受邀人是否同意、方便或接受委托，也不要假设受邀人一定有空；3. 缺少会阻塞执行的负责人、明确时间或关键边界时 status=needs_input；4. 每轮只能询问一个字段，question 只能包含一个问句，禁止把时间、地点、注意事项合并询问，missingFields 也只保留本轮询问的一个字段，并使用中文字段名；5. 用户给出“周六”“明天”“下周三”等相对日期或“常去的医院”“家里”等双方已知地点时视为可执行，不强求绝对日期或详细地址；无法可靠换算相对日期时省略 dueDate，绝不能输出“YYYY-MM-DD”等占位符；6. 不主动询问用户没有提及的特殊照护、费用或医疗决策；7. 信息足够时 status=ready；8. 不捏造地址、日期、费用或医疗决定。`

function extractJson(content: string): unknown {
  const withoutThinking = content.replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/```(?:json)?|```/gi, '').trim()
  const start = withoutThinking.indexOf('{')
  const end = withoutThinking.lastIndexOf('}')
  if (start < 0 || end <= start) throw new Error('missing-json')
  return JSON.parse(withoutThinking.slice(start, end + 1)) as unknown
}

const modelResponseShape = (response: AgentTurnResponse) => ({ status: response.status, message: response.message, question: response.question, draft: response.draft })

function normalizeModelDates(value: unknown) {
  if (!value || typeof value !== 'object') return value
  const response = value as Record<string, unknown>
  if (!response.draft || typeof response.draft !== 'object') return value
  const draft = response.draft as Record<string, unknown>
  if (!Array.isArray(draft.steps)) return value
  const rawSteps: unknown[] = draft.steps
  const steps = rawSteps.map((value): unknown => {
    if (!value || typeof value !== 'object') return value
    const step = value as Record<string, unknown>
    const dueDate = step.dueDate
    if (dueDate === undefined || (typeof dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dueDate))) return step
    const { dueDate: _discarded, ...withoutPlaceholder } = step
    void _discarded
    return withoutPlaceholder
  })
  return { ...response, draft: { ...draft, steps } }
}

async function requestMiniMax(config: ServerConfig, messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>, signal: AbortSignal) {
  const result = await fetch(`${config.baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: config.model, messages, temperature: 0.1, top_p: 0.85, max_tokens: 4_000 }),
    signal,
  })
  if (!result.ok) throw new Error(`minimax-${result.status}`)
  const payload = await result.json() as { choices?: Array<{ message?: { content?: string } }> }
  const parsed = normalizeModelDates(extractJson(payload.choices?.[0]?.message?.content ?? ''))
  const candidate = {
    ...(typeof parsed === 'object' && parsed ? parsed : {}),
    engine: 'minimax',
    notice: `由 ${config.model} 生成；发布前仍需人工确认。`,
  }
  if (!isAgentTurnResponse(candidate)) throw new Error('invalid-agent-shape')
  return candidate
}

export async function runMiniMax(config: ServerConfig, request: AgentTurnRequest): Promise<AgentTurnResponse> {
  if (!config.apiKey) throw new Error('minimax-not-configured')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(new Error('minimax-timeout')), 55_000)
  const context = JSON.stringify({ currentDate: new Date().toISOString().slice(0, 10), currentUserId: request.currentUserId, users: request.users, transcript: request.transcript, latestInput: request.input })
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: context },
  ]
  try {
    let response = await requestMiniMax(config, messages, controller.signal)
    let violations = reviewPlanGranularity(request, response.draft.steps)
    if (violations.length > 0) {
      response = await requestMiniMax(config, [
        ...messages,
        { role: 'assistant', content: JSON.stringify(modelResponseShape(response)) },
        { role: 'user', content: `这份草案没有达到原子步骤要求：${violations.join(' ')}请重新输出完整 JSON；保留用户明确提到的每个动作，每一步只能有一个可独立确认的完成点。` },
      ], controller.signal)
      violations = reviewPlanGranularity(request, response.draft.steps)
    }
    if (violations.length > 0) throw new Error('invalid-agent-granularity')
    return guardAgentTurn(guardAgentDueDates(response, request), request)
  } finally {
    clearTimeout(timer)
  }
}
