import type { AgentPlanStep, AgentTurnRequest } from './types.ts'

const actionVerb = /准备|预约|确认|收集|整理|打印|提交|填写|联系|通知|发送|同步|挂号|检查|复诊|看病|就诊|取药|领取|购买|买|安装|验收|交接|归还|接送|送到|带到|办理|缴费|支付|拿到|完成/
const conditionalBoundary = /^(?:如果|若|如遇|遇到|一旦|除非|当).*(?:联系|确认|询问)/
const sequenceBoundary = /(?:[。；;\n]+|，?(?:然后|接着|随后|最后|之后还需要|之后再|之后|以后还需要|以后再|再去|再把|再将)|，并(?=把|将|去|完成|联系|发送|同步|整理|购买|领取))/
const coarseConnector = /然后|接着|随后|之后(?:还|再)?|以后(?:还|再)?|再去|再把|再将|并(?:完成|购买|领取|取|发送|同步|整理)/
const parallelAction = /(?:挂号|预约)[^，。；;]{0,10}(?:和|并|、)(?:复诊|就诊|看病|检查)|(?:整理|收好)[^，。；;]{0,16}(?:并|然后|再)(?:把|将)?[^，。；;]{0,12}(?:发送|同步|反馈)/

function normalizedClauses(input: string) {
  const normalized = input
    .replace(/(?:看完|做完|拿完|取完|买完|完成)[^，。；;]{0,12}后/g, '；')
    .replace(/，(?=(?:到|去|回到|回家|按|凭|把|将)[^，。；;]{1,24}(?:挂号|复诊|检查|取药|领取|购买|买|整理|发送|同步|完成))/g, '；')
  return normalized
    .split(sequenceBoundary)
    .map((clause) => clause.trim())
    .filter((clause) => clause.length >= 3 && actionVerb.test(clause) && !conditionalBoundary.test(clause))
}

export function requestedCheckpointFloor(request: AgentTurnRequest) {
  const combined = [...request.transcript.filter((item) => item.role === 'user').map((item) => item.content), request.input].join('；')
  const clauses = normalizedClauses(combined)
  if (clauses.length < 3) return 0
  const explicitExtraActions = clauses.filter((clause) => parallelAction.test(clause)).length
  return Math.min(clauses.length + explicitExtraActions, 10)
}

export function reviewPlanGranularity(request: AgentTurnRequest, steps: AgentPlanStep[]) {
  const violations: string[] = []
  const floor = requestedCheckpointFloor(request)
  if (floor > 0 && steps.length < floor) {
    violations.push(`用户明确描述了至少 ${floor} 个连续行动确认点，但草案只有 ${steps.length} 步。`)
  }
  steps.forEach((step, index) => {
    if (coarseConnector.test(`${step.title} ${step.nextAction}`) || parallelAction.test(`${step.title} ${step.nextAction}`)) {
      violations.push(`第 ${index + 1} 步仍包含连续动作，需要按完成点继续拆分。`)
    }
  })
  return violations
}
