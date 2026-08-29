import { describe, expect, it } from 'vitest'
import { guardAgentDueDates } from './dateGuard.ts'
import type { AgentTurnRequest, AgentTurnResponse } from './types.ts'

const request: AgentTurnRequest = {
  input: '下周三上午9点陪妈妈复诊', transcript: [], currentUserId: 'linran',
  users: [
    { id: 'linran', name: '林然', role: '发起者' }, { id: 'xiaoyu', name: '小雨', role: '朋友' },
    { id: 'sister', name: '姐姐', role: '家人' }, { id: 'chenyu', name: '陈屿', role: '伴侣' },
  ],
}
const response: AgentTurnResponse = {
  status: 'ready', message: '完成', engine: 'minimax',
  draft: {
    title: '复诊', context: request.input, category: '家人', priority: 'normal', boundary: '变化先联系', missingFields: [], assumptions: [],
    steps: [{ id: 'visit', title: '完成复诊', nextAction: '下周三完成复诊', ownerId: 'xiaoyu', ownerName: '小雨', doneDefinition: '取得医嘱', dueDate: '2025-01-22' }],
  },
}

describe('Agent date guard', () => {
  it('removes a model-calculated date when the user only supplied relative wording', () => {
    expect(guardAgentDueDates(response, request).draft.steps[0].dueDate).toBeUndefined()
  })

  it('preserves an ISO date explicitly supplied by the user', () => {
    const matching = { ...response, draft: { ...response.draft, steps: [{ ...response.draft.steps[0], dueDate: '2026-09-02' }] } }
    expect(guardAgentDueDates(matching, { ...request, input: '请在 2026-09-02 上午9点陪妈妈复诊' }).draft.steps[0].dueDate).toBe('2026-09-02')
  })

  it('removes a model date that conflicts with an explicit user date', () => {
    expect(guardAgentDueDates(response, { ...request, input: '请在 2026-09-02 上午9点陪妈妈复诊' }).draft.steps[0].dueDate).toBeUndefined()
  })
})
