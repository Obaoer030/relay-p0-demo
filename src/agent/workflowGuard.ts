import type { AgentTurnRequest, AgentTurnResponse } from './types.ts'

const acceptanceField = /接受|同意|是否方便|有(?:没有)?时间|是否有空|确认.*(?:委托|邀请|负责)|能否(?:处理|负责|帮忙|陪同?)/
const dateField = /日期|哪一天|dueDate|date/i
const placeField = /详细地址|具体地址|地点名称|医院名称/
const relativeDate = /今天|明天|后天|本周|下周|周[一二三四五六日天]|星期[一二三四五六日天]|月初|月底/
const sharedPlace = /常去的|家里|新家|公司|办公室|学校/

export function guardAgentTurn(response: AgentTurnResponse, request: AgentTurnRequest): AgentTurnResponse {
  const combined = [...request.transcript.filter((item) => item.role === 'user').map((item) => item.content), request.input].join('；')
  const isCatVisit = /布丁|猫咪?|宠物/.test(combined)
  const hasSpecificTime = /\d{1,2}[:：]\d{2}|上午|下午|晚上|早上/.test(combined)
  const canonicalSteps = response.draft.steps.map((step) => {
    const owner = request.users.find((user) => user.id === step.ownerId)
    return owner ? { ...step, ownerName: owner.name } : step
  })
  const safeAssumptions = response.draft.assumptions.filter((assumption) => !acceptanceField.test(assumption))

  if (isCatVisit && !hasSpecificTime) {
    return {
      ...response,
      status: 'needs_input',
      message: '我先整理了计划草案，还缺少一个会影响执行的信息。',
      question: '复诊预约的具体时间是什么？',
      draft: { ...response.draft, steps: canonicalSteps, missingFields: ['预约时间'], assumptions: safeAssumptions },
    }
  }

  const missingFields = response.draft.missingFields
  const isNonBlocking = (field: string) => acceptanceField.test(field) || (relativeDate.test(combined) && dateField.test(field)) || (sharedPlace.test(combined) && placeField.test(field))
  if (response.status === 'needs_input' && missingFields.length > 0 && missingFields.every(isNonBlocking)) {
    const defersAcceptance = missingFields.some((field) => acceptanceField.test(field))
    return {
      ...response,
      status: 'ready',
      message: defersAcceptance
        ? `我整理成了 ${canonicalSteps.length} 个可执行步骤。发布后将由受邀人本人确认是否负责。`
        : `我整理成了 ${canonicalSteps.length} 个可执行步骤。相对日期和双方已知地点会按原话保留。`,
      question: undefined,
      draft: { ...response.draft, steps: canonicalSteps, missingFields: [], assumptions: safeAssumptions },
    }
  }

  const firstMissingField = missingFields[0]
  const firstQuestion = response.question?.split(/[？?]/, 1)[0]?.trim()
  const safeQuestion = firstQuestion && !acceptanceField.test(firstQuestion)
    ? `${firstQuestion}？`
    : firstMissingField
      ? `请补充${firstMissingField}。`
      : undefined
  return {
    ...response,
    question: response.status === 'needs_input' ? safeQuestion : undefined,
    draft: {
      ...response.draft,
      missingFields: response.status === 'needs_input' ? missingFields.slice(0, 1) : [],
      steps: canonicalSteps,
      assumptions: safeAssumptions,
    },
  }
}
