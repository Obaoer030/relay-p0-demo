import type { Page, Route } from '@playwright/test'

const users = {
  linran: '林然',
  xiaoyu: '小雨',
  sister: '姐姐',
  chenyu: '陈屿',
} as const

type AgentRequest = {
  input?: string
  transcript?: Array<{ role?: string; content?: string }>
  currentUserId?: keyof typeof users
}

const step = (id: string, title: string, nextAction: string, ownerId: keyof typeof users, doneDefinition: string) => ({
  id,
  title,
  nextAction,
  ownerId,
  ownerName: users[ownerId],
  doneDefinition,
})

async function respond(route: Route) {
  const request = route.request().postDataJSON() as AgentRequest
  const fullText = [...(request.transcript ?? []).map((message) => message.content ?? ''), request.input ?? ''].join(' ')
  const ownerId = fullText.includes('小雨') ? 'xiaoyu' : request.currentUserId ?? 'linran'
  const isComplexCare = /妈妈|医保卡|检查报告|血糖/.test(fullText)
  const hasTime = /\d{1,2}[:：]\d{2}|上午|下午|晚上|早上/.test(fullText)
  const steps = isComplexCare
    ? [
        step('prepare', '准备就医材料', '整理医保卡和上次检查报告', ownerId, '医保卡和检查报告已经带齐'),
        step('register', '完成医院挂号', '到医院按预约信息完成挂号', ownerId, '已经取得本次复诊的挂号凭证'),
        step('visit', '完成医生复诊', '按挂号顺序完成医生复诊', ownerId, '本次复诊已经完成并拿到医嘱'),
        step('medicine', '领取处方药品', '凭处方到药房领取本次药品', ownerId, '处方内药品已经领取并核对'),
        step('tool', '购买检测工具', '到院外药店购买血糖检测工具', ownerId, '血糖检测工具已经买到'),
        step('organize', '整理药品和工具', '回家后分类整理药品与检测工具', ownerId, '药品与工具已经妥善放置'),
        step('report', '同步处理结果', '把复诊、药品和工具结果发给发起者', ownerId, '发起者已经收到完整结果'),
      ]
    : [
        step('pickup', '接到布丁并核对资料', '按约定接到布丁，带齐病历和检查材料', ownerId, '布丁与就诊材料都已接到'),
        step('visit', '完成布丁复诊', '按预约到宠物医院完成复诊', ownerId, '复诊完成并拿到医生建议'),
        step('return', '送布丁安全回家', '按原路线把布丁送回并同步结果', ownerId, '布丁已安全到家且结果已同步'),
      ]
  const needsInput = !isComplexCare && !hasTime
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      status: needsInput ? 'needs_input' : 'ready',
      message: needsInput ? '我先整理了计划草案，还缺少一个会影响执行的信息。' : `我整理成了 ${steps.length} 个可执行步骤。`,
      question: needsInput ? '复诊预约的具体时间是什么？' : undefined,
      draft: {
        title: isComplexCare ? '陪妈妈完成复诊和后续安排' : '带布丁完成复诊',
        context: fullText,
        category: isComplexCare ? '家人' : '宠物',
        priority: 'normal',
        boundary: isComplexCare ? '如医生建议住院或调整方案，请先联系发起者。' : '如建议手术、住院、更改方案或产生重大费用，请先联系发起者。',
        steps,
        missingFields: needsInput ? ['预约时间'] : [],
        assumptions: [],
      },
      engine: 'minimax',
      notice: 'MiniMax 测试夹具；发布前仍需人工确认。',
    }),
  })
}

export async function installAgentFixture(page: Page) {
  await page.route('**/api/agent', respond)
}
