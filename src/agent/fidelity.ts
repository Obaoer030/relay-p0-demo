import type { AgentTurnRequest, AgentTurnResponse } from './types.ts'

const numberToken = /\d+/g
const chineseNumberToken = /([零〇一二两三四五六七八九十百千万]+)(?=个?月|年|日|天|点|时|分|秒|人|个|项|条|次|元|％|像素|晚|位|款|份|本|张|台|公里|米|周)/g
const assumptionAuthorization = /可以假设|可以默认|假设为|默认按|默认是/
const guardedDetails = ['原件', '人脸识别', '签字', '电商平台', '国家医保服务平台', '医保局官网', '支付', '付款', '连接水管', '连接电源', '完整洗衣程序', '演示文稿', '屏幕共享']

function userText(request: AgentTurnRequest) {
  return [...request.transcript.filter((item) => item.role === 'user').map((item) => item.content), request.input].join('；')
}

function normalizedNumbers(text: string) {
  const arabic = (text.match(numberToken) ?? []).map((token) => String(Number(token)))
  const chinese = [...text.matchAll(chineseNumberToken)].map((match) => String(parseChineseNumber(match[1])))
  return [...arabic, ...chinese]
}

function parseChineseNumber(value: string) {
  const digits: Record<string, number> = { 零: 0, 〇: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 }
  const units: Record<string, number> = { 十: 10, 百: 100, 千: 1_000, 万: 10_000 }
  if (![...value].some((character) => character in units)) {
    return Number([...value].map((character) => digits[character]).join(''))
  }
  let total = 0
  let section = 0
  let current = 0
  for (const character of value) {
    if (character in digits) {
      current = digits[character]
    } else if (units[character] === 10_000) {
      total += (section + current) * 10_000
      section = 0
      current = 0
    } else {
      section += (current || 1) * units[character]
      current = 0
    }
  }
  return total + section + current
}

export function reviewPlanFidelity(request: AgentTurnRequest, response: AgentTurnResponse) {
  const source = userText(request)
  const sourceNumbers = new Set(normalizedNumbers(source))
  const generated = [
    response.draft.title,
    response.draft.context,
    response.draft.boundary,
    ...response.draft.assumptions,
    ...response.draft.steps.flatMap((step) => [step.title, step.nextAction, step.doneDefinition]),
  ].join('；')
  const unsupportedNumbers = [...new Set(normalizedNumbers(generated).filter((token) => !sourceNumbers.has(token)))]
  const violations: string[] = []

  if (unsupportedNumbers.length > 0) {
    violations.push(`草案增加了用户没有提供的数字：${unsupportedNumbers.join('、')}。`)
  }
  const unsupportedDetails = guardedDetails.filter((detail) => generated.includes(detail) && !source.includes(detail))
  if (unsupportedDetails.length > 0) {
    violations.push(`草案增加了用户没有提供的执行细节：${unsupportedDetails.join('、')}。`)
  }
  if (response.draft.assumptions.length > 0 && !assumptionAuthorization.test(source)) {
    violations.push('用户没有授权任何假设，assumptions 必须为空。')
  }
  return violations
}
