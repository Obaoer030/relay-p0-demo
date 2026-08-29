import type { ActivityEntry, TrustedPerson, WorkspaceMatter, WorkspaceState, WorkspaceUser } from './types'

export const WORKSPACE_VERSION = 4

const localIso = (base: Date, days: number, hour: number, minute = 0) => {
  const result = new Date(base)
  result.setDate(result.getDate() + days)
  result.setHours(hour, minute, 0, 0)
  return result.toISOString()
}

export const USERS: WorkspaceUser[] = [
  { id: 'linran', name: '林然', initial: '林', role: '事项发起者 · 独立生活', note: '管理宠物、住房、行政和家人事项。', tone: 'coral' },
  { id: 'xiaoyu', name: '小雨', initial: '雨', role: '朋友 · 宠物照护', note: '住得离宠物诊所近，也有自己的生活安排。', tone: 'sand' },
  { id: 'sister', name: '姐姐', initial: '姐', role: '家人 · 父母照护', note: '负责部分线下手续，也会向家人发出协作邀请。', tone: 'sage' },
  { id: 'chenyu', name: '陈屿', initial: '屿', role: '伴侣 · 共同生活', note: '共同处理采购、预约、住房和家庭计划。', tone: 'blue' },
]

export const PEOPLE: TrustedPerson[] = [
  { id: 'xiaoyu', name: '小雨', initial: '雨', relationship: '朋友 · 宠物照护', note: '住得离宠物诊所近，曾多次帮忙照顾布丁。', completedCount: 6, tone: 'sand' },
  { id: 'sister', name: '姐姐', initial: '姐', relationship: '家人 · 父母照护', note: '方便处理异地父母的线下手续。', completedCount: 11, tone: 'sage' },
  { id: 'chenyu', name: '陈屿', initial: '屿', relationship: '伴侣 · 共同生活', note: '共同处理采购、预约与住房事项。', completedCount: 9, tone: 'plum' },
  { id: 'mumu', name: '木木', initial: '木', relationship: '室友 · 搬家协作', note: '擅长现场确认、拍照和物品交接。', completedCount: 4, tone: 'coral' },
]

function matter(value: Omit<WorkspaceMatter, 'createdAt' | 'updatedAt'>, now: Date, ageDays = 0): WorkspaceMatter {
  return { ...value, createdAt: localIso(now, -ageDays, 9), updatedAt: localIso(now, 0, 9) }
}

export function createWorkspaceState(now = new Date()): WorkspaceState {
  const matters: WorkspaceMatter[] = [
    matter({ id: 'ws-access-card', title: '去物业代领新的门禁卡', context: '林然出差前赶不上物业工作时间，授权书已经放在门卫。', nextAction: '小雨周五 17:30 前带授权书到物业前台领取', doneDefinition: '门禁卡已领到并放入林然家信箱', boundary: '如果物业要求签新合同、补缴费用或提供额外证件，请先联系林然。', dueAt: localIso(now, 1, 17, 30), status: 'waiting', creatorId: 'linran', ownerId: 'linran', ownerName: '林然', participantIds: ['linran', 'xiaoyu'], handoffTargetId: 'xiaoyu', category: '住房', priority: 'high' }, now, 1),
    matter({ id: 'ws-cat-checkup', title: '周六带布丁完成复诊', context: '周五临时出差，周日晚返回。小雨住得离诊所更近。', nextAction: '08:40 接到布丁，09:20 前到达诊所', doneDefinition: '布丁完成复诊并安全回家，复诊结论发给林然', boundary: '如建议手术、住院、更改方案或产生重大费用，请先联系林然。', dueAt: localIso(now, 2, 9, 30), status: 'waiting', creatorId: 'linran', ownerId: 'linran', ownerName: '林然', participantIds: ['linran', 'xiaoyu'], handoffTargetId: 'xiaoyu', category: '宠物', priority: 'high' }, now, 2),
    matter({ id: 'ws-spare-key', title: '把备用钥匙放到门卫', context: '小雨接布丁时需要备用钥匙。', nextAction: '装入写有小雨名字的信封，交给门卫', doneDefinition: '门卫确认已经代为保管', boundary: '只用于本次接送布丁，完成后归还。', dueAt: localIso(now, 1, 18), status: 'mine', creatorId: 'linran', ownerId: 'linran', ownerName: '林然', participantIds: ['linran'], category: '生活', priority: 'normal' }, now, 1),
    matter({ id: 'ws-heater', title: '确认热水器维修时间', context: '已经把三个可上门时段发给房东。', nextAction: '等待房东确认维修师傅上门时间', doneDefinition: '具体日期和两小时时间窗确定', boundary: '涉及更换设备或费用时先确认报价。', status: 'waiting', creatorId: 'linran', ownerId: 'landlord', ownerName: '房东', participantIds: ['linran'], category: '住房', priority: 'normal' }, now, 4),
    matter({ id: 'ws-mom-report', title: '替妈妈取体检报告', context: '姐姐离医院更近，妈妈不熟悉自助机。', nextAction: '姐姐周三下班后去自助机领取', doneDefinition: '报告已取到并交给妈妈', boundary: '只领取材料，不代替妈妈确认医疗方案。', dueAt: localIso(now, 4, 19), status: 'relayed', creatorId: 'linran', ownerId: 'sister', ownerName: '姐姐', participantIds: ['linran', 'sister'], handoffTargetId: 'sister', category: '家人', priority: 'high' }, now, 5),
    matter({ id: 'ws-moving-boxes', title: '确认搬家纸箱送达数量', context: '周末开始打包，纸箱由室友木木代收。', nextAction: '木木核对 20 个纸箱和 4 卷胶带', doneDefinition: '数量核对完成，破损部分已拍照', boundary: '缺件可以登记，不直接加购。', dueAt: localIso(now, 3, 15), status: 'waiting', creatorId: 'linran', ownerId: 'linran', ownerName: '林然', participantIds: ['linran'], handoffTargetId: 'mumu', category: '搬家', priority: 'normal' }, now, 3),
    matter({ id: 'ws-passport', title: '更新护照到期提醒', context: '年底可能出境，需要提前检查有效期。', nextAction: '今晚拍下证件有效期并确认办理窗口', doneDefinition: '日期已记录，预约入口已保存', boundary: '不上传证件照片到共享事项。', dueAt: localIso(now, 6, 20), status: 'mine', creatorId: 'linran', ownerId: 'linran', ownerName: '林然', participantIds: ['linran'], category: '行政', priority: 'low' }, now, 6),
    matter({ id: 'ws-groceries', title: '补齐本周家庭采购', context: '冰箱里的早餐食材和猫砂都快用完。', nextAction: '陈屿下班路上采购清单里的 6 项物品', doneDefinition: '物品带回家并勾掉缺货项', boundary: '单件超过 200 元先问林然。', dueAt: localIso(now, 0, 19), status: 'completed', creatorId: 'linran', ownerId: 'chenyu', ownerName: '陈屿', participantIds: ['linran', 'chenyu'], handoffTargetId: 'chenyu', category: '伴侣', priority: 'normal', completedAt: localIso(now, 0, 18, 20) }, now, 1),
    matter({ id: 'ws-cat-feeding', title: '上次出差期间上门喂猫', context: '小雨按约定上门两次。', nextAction: '无需继续行动', doneDefinition: '布丁按时吃饭，门窗确认锁好', boundary: '异常情况立即联系林然。', status: 'completed', creatorId: 'linran', ownerId: 'xiaoyu', ownerName: '小雨', participantIds: ['linran', 'xiaoyu'], handoffTargetId: 'xiaoyu', category: '宠物', priority: 'normal', completedAt: localIso(now, -12, 20) }, now, 14),
    matter({ id: 'ws-carrier-return', title: '周日把航空箱送回林然家', context: '布丁复诊后航空箱会暂时留在小雨家。', nextAction: '林然周日晚回家后到小雨门口取走航空箱', doneDefinition: '航空箱已经归还并擦拭干净', boundary: '如果返程延误，直接改到周一，不必等待。', dueAt: localIso(now, 3, 20), status: 'waiting', creatorId: 'xiaoyu', ownerId: 'xiaoyu', ownerName: '小雨', participantIds: ['xiaoyu', 'linran'], handoffTargetId: 'linran', category: '宠物', priority: 'normal' }, now, 1),
    matter({ id: 'ws-camping-list', title: '整理下月露营装备清单', context: '小雨第一次参加两天露营，需要核对借用和购买物品。', nextAction: '今晚先标出可以向朋友借的 5 件装备', doneDefinition: '借用人和需要购买的物品都已确认', boundary: '不代替同行人购买个人药品。', dueAt: localIso(now, 5, 21), status: 'mine', creatorId: 'xiaoyu', ownerId: 'xiaoyu', ownerName: '小雨', participantIds: ['xiaoyu'], category: '旅行', priority: 'normal' }, now, 2),
    matter({ id: 'ws-pharmacy', title: '给妈妈续配慢病处方', context: '姐姐负责本月线下取药，处方将在周四到期。', nextAction: '周三午休前确认医院线上续方入口', doneDefinition: '处方状态确认，取药日期已安排', boundary: '药品调整必须由医生和妈妈确认。', dueAt: localIso(now, 3, 12), status: 'mine', creatorId: 'sister', ownerId: 'sister', ownerName: '姐姐', participantIds: ['sister'], category: '家人', priority: 'high' }, now, 2),
    matter({ id: 'ws-family-call', title: '参加周日晚家庭视频', context: '姐姐希望陈屿一起确认国庆返乡安排。', nextAction: '陈屿周日 20:00 加入 20 分钟视频', doneDefinition: '返乡日期和接站安排已经记入事项', boundary: '行程费用各自确认，不在通话中替别人决定。', dueAt: localIso(now, 3, 20), status: 'waiting', creatorId: 'sister', ownerId: 'sister', ownerName: '姐姐', participantIds: ['sister', 'chenyu'], handoffTargetId: 'chenyu', category: '家人', priority: 'normal' }, now, 1),
    matter({ id: 'ws-parking-renewal', title: '续办小区停车证', context: '陈屿的停车证月底到期，需要提前上传新的保单页。', nextAction: '今晚确认保单有效期并提交续办资料', doneDefinition: '物业系统显示审核中并生成受理编号', boundary: '不上传包含身份证号码的完整保单。', dueAt: localIso(now, 4, 20), status: 'mine', creatorId: 'chenyu', ownerId: 'chenyu', ownerName: '陈屿', participantIds: ['chenyu'], category: '住房', priority: 'normal' }, now, 3),
  ]

  const activity: ActivityEntry[] = [
    { id: 'activity-1', matterId: 'ws-access-card', kind: 'status', title: '林然邀请小雨代领门禁卡', detail: '正在等待小雨确认是否负责。', actor: '林然', at: localIso(now, 0, 9, 10) },
    { id: 'activity-2', matterId: 'ws-cat-checkup', kind: 'status', title: '林然邀请小雨负责布丁复诊', detail: '正在等待小雨确认下一步和边界。', actor: '林然', at: localIso(now, 0, 8, 40) },
    { id: 'activity-3', matterId: 'ws-carrier-return', kind: 'status', title: '小雨邀请林然取回航空箱', detail: '正在等待林然确认时间。', actor: '小雨', at: localIso(now, -1, 21) },
    { id: 'activity-4', matterId: 'ws-mom-report', kind: 'status', title: '姐姐开始处理体检报告', detail: '林然可以在事项中查看完成进度。', actor: '姐姐', at: localIso(now, -1, 18) },
    { id: 'activity-5', matterId: 'ws-family-call', kind: 'status', title: '姐姐邀请陈屿参加家庭视频', detail: '等待陈屿确认周日晚时间。', actor: '姐姐', at: localIso(now, -1, 12) },
    { id: 'activity-6', matterId: 'ws-groceries', kind: 'status', title: '本周采购已完成', detail: '陈屿完成了清单中的 6 项采购。', actor: '陈屿', at: localIso(now, -1, 19) },
    { id: 'activity-7', matterId: 'ws-heater', kind: 'status', title: '维修事项进入等待', detail: '正在等待房东确认具体上门时间。', actor: '林然', at: localIso(now, -1, 21) },
    { id: 'activity-8', kind: 'system', title: '多角色演示数据已准备好', detail: '右上角可切换角色；所有角色读取同一份本地演示状态。', actor: 'Relay', at: localIso(now, -2, 9) },
  ]

  return { version: WORKSPACE_VERSION, activeUserId: 'linran', users: USERS.map((user) => ({ ...user })), matters, people: PEOPLE.map((person) => ({ ...person })), activity, reduceMotion: false }
}
