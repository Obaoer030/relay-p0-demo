import type { Handoff, Matter, RelayState } from './types'

export const SEED_VERSION = 1
export const HERO_MATTER_ID = 'matter-cat-checkup'
export const DEMO_TOKEN = 'demo-cat-checkup'

const atLocalTime = (base: Date, dayOffset: number, hour: number, minute = 0) => {
  const result = new Date(base)
  result.setDate(base.getDate() + dayOffset)
  result.setHours(hour, minute, 0, 0)
  return result.toISOString()
}

export function getNextSaturdayAt0930(now: Date) {
  const daysUntilSaturday = ((6 - now.getDay() + 7) % 7) || 7
  return atLocalTime(now, daysUntilSaturday, 9, 30)
}

function createMatters(now: Date): Matter[] {
  return [
    {
      id: HERO_MATTER_ID,
      title: '周六带布丁完成复诊',
      context: '林然周五临时出差，周日晚返回',
      nextAction: '08:40 接到布丁，09:20 前到达诊所',
      requiredMaterial: '纸质报告放在猫包侧袋',
      doneDefinition: '布丁完成复诊并安全回家，复诊结论发给林然',
      boundary:
        '如果医生建议当日手术、住院、更改治疗方案或产生重大额外费用，请先联系林然，不替她作医疗决定。',
      dueAt: getNextSaturdayAt0930(now),
      status: 'mine',
      currentActor: 'linran',
      loadLevel: 'heavy',
      relationship: '布丁的复诊',
    },
    {
      id: 'matter-spare-key',
      title: '把备用钥匙放到门卫',
      context: '小雨周六接布丁时会用到',
      nextAction: '周五出门前装入写有小雨名字的信封',
      doneDefinition: '门卫确认已代为保管',
      dueAt: atLocalTime(now, 1, 18),
      status: 'mine',
      currentActor: 'linran',
      loadLevel: 'normal',
      relationship: '出差准备',
    },
    {
      id: 'matter-water-heater',
      title: '等房东确认热水器维修时间',
      context: '已经发过可上门的时间段',
      nextAction: '等房东回复具体时间',
      doneDefinition: '确认维修师傅上门时段',
      status: 'waiting',
      currentActor: 'landlord',
      relationship: '租房',
    },
    {
      id: 'matter-mom-report',
      title: '替妈妈取体检报告',
      context: '姐姐离医院更近',
      nextAction: '姐姐周三下班后去自助机领取',
      doneDefinition: '报告已取到并交给妈妈',
      dueAt: atLocalTime(now, 4, 19),
      status: 'relayed',
      currentActor: 'sister',
      relationship: '家人照护',
    },
    {
      id: 'matter-cat-feeding-history',
      title: '上次出差期间上门喂猫',
      context: '小雨按约定上门两次',
      nextAction: '无需继续行动',
      doneDefinition: '布丁按时吃饭，门窗确认锁好',
      status: 'completed',
      currentActor: 'xiaoyu',
      completedAt: atLocalTime(now, -14, 20),
      completedBy: 'xiaoyu',
      relationship: '安心记录',
    },
  ]
}

function createHandoffs(): Handoff[] {
  return [
    {
      id: 'handoff-cat-checkup',
      matterId: HERO_MATTER_ID,
      requester: 'linran',
      target: 'xiaoyu',
      token: DEMO_TOKEN,
      status: 'draft',
    },
  ]
}

export function createSeedState(now = new Date()): RelayState {
  return {
    seedVersion: SEED_VERSION,
    activeActor: 'linran',
    demoStage: 'initial',
    reduceMotion: false,
    matters: createMatters(now),
    handoffs: createHandoffs(),
    lastEventAt: now.toISOString(),
  }
}
