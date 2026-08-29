import type { ActivityEntry, TrustedPerson, WorkspaceMatter, WorkspaceState } from './types'

export const WORKSPACE_VERSION = 2

const localIso = (base: Date, days: number, hour: number, minute = 0) => {
  const result = new Date(base)
  result.setDate(result.getDate() + days)
  result.setHours(hour, minute, 0, 0)
  return result.toISOString()
}

export const PEOPLE: TrustedPerson[] = [
  { id: 'xiaoyu', name: '小雨', initial: '雨', relationship: '朋友 · 宠物照护', note: '住得离宠物诊所近，曾两次帮忙照顾布丁。', completedCount: 6, tone: 'sand' },
  { id: 'sister', name: '姐姐', initial: '姐', relationship: '家人 · 父母照护', note: '方便处理异地父母的线下手续。', completedCount: 11, tone: 'sage' },
  { id: 'chenyu', name: '陈屿', initial: '屿', relationship: '伴侣 · 共同生活', note: '共同处理采购、预约与住房事项。', completedCount: 9, tone: 'plum' },
  { id: 'mumu', name: '木木', initial: '木', relationship: '室友 · 搬家协作', note: '擅长现场确认、拍照和物品交接。', completedCount: 4, tone: 'coral' },
]

function matter(
  value: Omit<WorkspaceMatter, 'createdAt' | 'updatedAt'>,
  now: Date,
  ageDays = 0,
): WorkspaceMatter {
  return {
    ...value,
    createdAt: localIso(now, -ageDays, 9),
    updatedAt: localIso(now, 0, 9),
  }
}

export function createWorkspaceState(now = new Date()): WorkspaceState {
  const matters: WorkspaceMatter[] = [
    matter({ id: 'ws-cat-checkup', title: '周六带布丁完成复诊', context: '周五临时出差，周日晚返回。小雨住得离诊所更近。', nextAction: '08:40 接到布丁，09:20 前到达诊所', doneDefinition: '布丁完成复诊并安全回家，复诊结论发给林然', boundary: '如建议手术、住院、更改方案或产生重大费用，请先联系林然。', dueAt: localIso(now, 2, 9, 30), status: 'relayed', ownerName: '小雨', handoffTargetId: 'xiaoyu', category: '宠物', priority: 'high' }, now, 2),
    matter({ id: 'ws-spare-key', title: '把备用钥匙放到门卫', context: '小雨接布丁时需要备用钥匙。', nextAction: '装入写有小雨名字的信封，交给门卫', doneDefinition: '门卫确认已经代为保管', boundary: '只用于本次接送布丁，完成后归还。', dueAt: localIso(now, 1, 18), status: 'mine', ownerName: '林然', category: '生活', priority: 'normal' }, now, 1),
    matter({ id: 'ws-heater', title: '确认热水器维修时间', context: '已经把三个可上门时段发给房东。', nextAction: '等待房东确认维修师傅上门时间', doneDefinition: '具体日期和两小时时间窗确定', boundary: '涉及更换设备或费用时先确认报价。', status: 'waiting', ownerName: '房东', category: '住房', priority: 'normal' }, now, 4),
    matter({ id: 'ws-mom-report', title: '替妈妈取体检报告', context: '姐姐离医院更近，妈妈不熟悉自助机。', nextAction: '姐姐周三下班后去自助机领取', doneDefinition: '报告已取到并交给妈妈', boundary: '只领取材料，不代替妈妈确认医疗方案。', dueAt: localIso(now, 4, 19), status: 'relayed', ownerName: '姐姐', handoffTargetId: 'sister', category: '家人', priority: 'high' }, now, 5),
    matter({ id: 'ws-moving-boxes', title: '确认搬家纸箱送达数量', context: '周末开始打包，纸箱由室友木木代收。', nextAction: '木木核对 20 个纸箱和 4 卷胶带', doneDefinition: '数量核对完成，破损部分已拍照', boundary: '缺件可以登记，不直接加购。', dueAt: localIso(now, 3, 15), status: 'waiting', ownerName: '木木', handoffTargetId: 'mumu', category: '搬家', priority: 'normal' }, now, 3),
    matter({ id: 'ws-passport', title: '更新护照到期提醒', context: '年底可能出境，需要提前检查有效期。', nextAction: '今晚拍下证件有效期并确认办理窗口', doneDefinition: '日期已记录，预约入口已保存', boundary: '不上传证件照片到共享事项。', dueAt: localIso(now, 6, 20), status: 'mine', ownerName: '林然', category: '行政', priority: 'low' }, now, 6),
    matter({ id: 'ws-groceries', title: '补齐本周家庭采购', context: '冰箱里的早餐食材和猫砂都快用完。', nextAction: '陈屿下班路上采购清单里的 6 项物品', doneDefinition: '物品带回家并勾掉缺货项', boundary: '单件超过 200 元先问林然。', dueAt: localIso(now, 0, 19), status: 'completed', ownerName: '陈屿', handoffTargetId: 'chenyu', category: '伴侣', priority: 'normal', completedAt: localIso(now, 0, 18, 20) }, now, 1),
    matter({ id: 'ws-cat-feeding', title: '上次出差期间上门喂猫', context: '小雨按约定上门两次。', nextAction: '无需继续行动', doneDefinition: '布丁按时吃饭，门窗确认锁好', boundary: '异常情况立即联系林然。', status: 'completed', ownerName: '小雨', handoffTargetId: 'xiaoyu', category: '宠物', priority: 'normal', completedAt: localIso(now, -12, 20) }, now, 14),
  ]

  const activity: ActivityEntry[] = [
    { id: 'activity-1', matterId: 'ws-cat-checkup', kind: 'status', title: '小雨确认负责布丁复诊', detail: '这一步现在由小雨负责。', actor: '小雨', at: localIso(now, 0, 8, 40) },
    { id: 'activity-2', matterId: 'ws-heater', kind: 'status', title: '维修事项进入等待', detail: '正在等待房东确认具体上门时间。', actor: '林然', at: localIso(now, -1, 21) },
    { id: 'activity-3', matterId: 'ws-groceries', kind: 'status', title: '本周采购已完成', detail: '陈屿完成了清单中的 6 项采购。', actor: '陈屿', at: localIso(now, -1, 19) },
    { id: 'activity-4', kind: 'system', title: 'Relay 工作区已准备好', detail: '所有数据均为可交互的虚构演示数据。', actor: 'Relay', at: localIso(now, -2, 9) },
  ]

  return { version: WORKSPACE_VERSION, matters, people: PEOPLE.map((person) => ({ ...person })), activity, reduceMotion: false }
}
