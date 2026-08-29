import { describe, expect, it } from 'vitest'
import type { AgentTurnRequest, AgentTurnResponse } from './types.ts'
import { guardAgentTurn } from './workflowGuard.ts'

const users: AgentTurnRequest['users'] = [
  { id: 'linran', name: '林然', role: '发起者' },
  { id: 'xiaoyu', name: '小雨', role: '朋友' },
  { id: 'sister', name: '姐姐', role: '家人' },
  { id: 'chenyu', name: '陈屿', role: '伴侣' },
]

const response: AgentTurnResponse = {
  status: 'needs_input',
  message: '还需要确认。',
  question: '小雨是否同意？还需要地址吗？',
  draft: {
    title: '布丁复诊', context: '安排复诊', category: '宠物', priority: 'high', boundary: '重大医疗决定联系林然', assumptions: [],
    missingFields: ['确认小雨接受委托'],
    steps: [{ id: 'visit', title: '完成复诊', nextAction: '带布丁去复诊', ownerId: 'xiaoyu', ownerName: '错误姓名', doneDefinition: '完成复诊' }],
  },
  engine: 'minimax',
}

describe('Agent workflow guard', () => {
  it('asks only for appointment time before considering invite acceptance', () => {
    const guarded = guardAgentTurn(response, { input: '请小雨周六带布丁复诊', transcript: [], currentUserId: 'linran', users })
    expect(guarded.status).toBe('needs_input')
    expect(guarded.question).toBe('复诊预约的具体时间是什么？')
    expect(guarded.draft.missingFields).toEqual(['预约时间'])
  })

  it('leaves acceptance to the invitee once execution information is complete', () => {
    const guarded = guardAgentTurn(response, { input: '周六上午 9:30', transcript: [{ role: 'user', content: '请小雨周六带布丁复诊' }], currentUserId: 'linran', users })
    expect(guarded.status).toBe('ready')
    expect(guarded.question).toBeUndefined()
    expect(guarded.draft.missingFields).toEqual([])
    expect(guarded.draft.steps[0].ownerName).toBe('小雨')
  })

  it('accepts explicit relative dates instead of demanding an absolute date', () => {
    const dateResponse = { ...response, question: '请问明天是哪一天？', draft: { ...response.draft, missingFields: ['安装日期'] } }
    const guarded = guardAgentTurn(dateResponse, { input: '请陈屿明天下午 2 点在新家等安装师傅', transcript: [], currentUserId: 'linran', users })
    expect(guarded.status).toBe('ready')
    expect(guarded.question).toBeUndefined()
    expect(guarded.draft.missingFields).toEqual([])
  })
})
