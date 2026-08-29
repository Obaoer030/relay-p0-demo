import { describe, expect, it } from 'vitest'
import { reviewPlanFidelity } from './fidelity.ts'
import type { AgentTurnRequest, AgentTurnResponse } from './types.ts'

const request: AgentTurnRequest = {
  input: '周日上午请小雨带布丁复诊，超过300元先联系林然。', transcript: [], currentUserId: 'linran',
  users: [
    { id: 'linran', name: '林然', role: '发起者' }, { id: 'xiaoyu', name: '小雨', role: '朋友' },
    { id: 'sister', name: '姐姐', role: '家人' }, { id: 'chenyu', name: '陈屿', role: '伴侣' },
  ],
}

const response: AgentTurnResponse = {
  status: 'ready', message: '已整理', engine: 'minimax',
  draft: {
    title: '布丁复诊', context: request.input, category: '宠物', priority: 'normal', boundary: '超过300元先联系林然', missingFields: [], assumptions: [],
    steps: [{ id: 'visit', title: '带布丁复诊', nextAction: '周日上午带布丁复诊', ownerId: 'xiaoyu', ownerName: '小雨', doneDefinition: '复诊完成' }],
  },
}

describe('Agent factual fidelity', () => {
  it('accepts only numbers supplied by the user', () => {
    expect(reviewPlanFidelity(request, response)).toEqual([])
    const inventedTime = { ...response, draft: { ...response.draft, steps: [{ ...response.draft.steps[0], nextAction: '周日上午9:00带布丁复诊' }] } }
    expect(reviewPlanFidelity(request, inventedTime)).toContainEqual(expect.stringContaining('没有提供的数字'))
    const inventedRule = { ...response, draft: { ...response.draft, steps: [{ ...response.draft.steps[0], doneDefinition: '护照有效期至少六个月' }] } }
    expect(reviewPlanFidelity(request, inventedRule)).toContainEqual(expect.stringContaining('没有提供的数字'))
  })

  it('rejects common execution details that were not present in the request', () => {
    const inventedMethod = { ...response, draft: { ...response.draft, steps: [{ ...response.draft.steps[0], nextAction: '在国家医保服务平台完成人脸识别并支付' }] } }
    expect(reviewPlanFidelity(request, inventedMethod)).toContainEqual(expect.stringContaining('执行细节'))
  })

  it('rejects model assumptions unless the user explicitly authorized them', () => {
    const assumed = { ...response, draft: { ...response.draft, assumptions: ['医院周日正常接诊'] } }
    expect(reviewPlanFidelity(request, assumed)).toContainEqual(expect.stringContaining('assumptions 必须为空'))
    expect(reviewPlanFidelity({ ...request, input: `${request.input} 可以假设医院正常接诊。` }, assumed)).toEqual([])
  })
})
