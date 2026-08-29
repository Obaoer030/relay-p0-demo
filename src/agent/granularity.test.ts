import { describe, expect, it } from 'vitest'
import { requestedCheckpointFloor, reviewPlanGranularity } from './granularity.ts'
import type { AgentPlanStep, AgentTurnRequest } from './types.ts'

const request: AgentTurnRequest = {
  input: '下周三上午9点请小雨陪妈妈去医院复诊。先准备医保卡和上次检查报告，到医院完成挂号和复诊；看完病后按处方去药房取药；拿完药后去外面的药店购买血糖检测工具；回家整理药品和工具，并把结果发给我。如果医生建议住院，请先联系我。',
  transcript: [],
  currentUserId: 'linran',
  users: [
    { id: 'linran', name: '林然', role: '发起者' },
    { id: 'xiaoyu', name: '小雨', role: '朋友' },
    { id: 'sister', name: '姐姐', role: '家人' },
    { id: 'chenyu', name: '陈屿', role: '伴侣' },
  ],
}

const step = (id: string, title: string, nextAction = title): AgentPlanStep => ({ id, title, nextAction, ownerId: 'xiaoyu', ownerName: '小雨', doneDefinition: `${title}已确认完成` })

describe('Agent plan granularity', () => {
  it('recognizes the explicit healthcare action chain instead of treating it as one task', () => {
    expect(requestedCheckpointFloor(request)).toBe(7)
    expect(reviewPlanGranularity(request, [step('all', '完成就医后续')])).toContainEqual(expect.stringContaining('连续行动确认点'))
  })

  it('accepts independently confirmable checkpoints', () => {
    const steps = [
      step('prepare', '准备就医材料'),
      step('register', '完成医院挂号'),
      step('visit', '完成医生复诊'),
      step('medicine', '按处方领取药品'),
      step('tools', '购买血糖检测工具'),
      step('organize', '整理药品和检测工具'),
      step('report', '反馈本次处理结果'),
    ]
    expect(reviewPlanGranularity(request, steps)).toEqual([])
  })

  it('rejects a step that still hides sequential actions', () => {
    expect(reviewPlanGranularity({ ...request, input: '请小雨处理复诊。' }, [step('mixed', '完成复诊', '完成复诊之后再去药房取药')])).toContainEqual(expect.stringContaining('继续拆分'))
  })

  it('rejects parallel actions that have separate completion evidence', () => {
    expect(reviewPlanGranularity({ ...request, input: '请小雨处理复诊。' }, [step('mixed', '挂号和复诊')])).toContainEqual(expect.stringContaining('继续拆分'))
  })

  it('counts repair and event preparation checkpoints that use ordinary action verbs', () => {
    const repair = { ...request, input: '陈屿先拍下漏水位置和水表读数，再联系物业报修并取得工单号；姐姐联系两个师傅询价；林然比较报价；小雨在家等师傅，维修后测试十分钟；陈屿最后录入发票。' }
    const birthday = { ...request, input: '姐姐先确认时间，再预订餐厅；陈屿订购蛋糕；小雨联系亲友，再整理名单；林然准备礼物，聚会前一天核对全部安排。' }
    expect(requestedCheckpointFloor(repair)).toBe(7)
    expect(requestedCheckpointFloor(birthday)).toBe(7)
  })
})
