import { describe, expect, it } from 'vitest'
import { isAgentTurnResponse } from './types'

describe('Agent response schema', () => {
  it('accepts a bounded plan and rejects unknown owners or empty steps', () => {
    const response = {
      status: 'ready', message: '计划已整理', engine: 'minimax',
      draft: {
        title: '布丁复诊', context: '周六复诊', category: '宠物', priority: 'high', boundary: '重大变化先联系', missingFields: [], assumptions: [],
        steps: [{ id: 'visit', title: '完成复诊', nextAction: '小雨带布丁复诊', ownerId: 'xiaoyu', ownerName: '小雨', doneDefinition: '安全回家' }],
      },
    }
    expect(isAgentTurnResponse(response)).toBe(true)
    expect(isAgentTurnResponse({ ...response, draft: { ...response.draft, steps: [] } })).toBe(false)
    expect(isAgentTurnResponse({ ...response, draft: { ...response.draft, steps: [{ ...response.draft.steps[0], ownerId: 'unknown' }] } })).toBe(false)
  })

  it('rejects due-date placeholders that would create an invalid matter date', () => {
    const response = {
      status: 'ready', message: '完成', engine: 'minimax',
      draft: {
        title: '复诊', context: '下周三复诊', category: '家人', priority: 'normal', boundary: '变化先联系', missingFields: [], assumptions: [],
        steps: [{ id: 'visit', title: '完成复诊', nextAction: '完成医生复诊', ownerId: 'xiaoyu', ownerName: '小雨', doneDefinition: '取得医嘱', dueDate: 'YYYY-MM-DD' }],
      },
    }
    expect(isAgentTurnResponse(response)).toBe(false)
  })
})
