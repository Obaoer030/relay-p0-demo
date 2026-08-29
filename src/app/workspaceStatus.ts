import type { WorkspaceMatterStatus } from '../workspace/types'

export const workspaceStatus: Record<WorkspaceMatterStatus, { label: string; copy: string }> = {
  mine: { label: '需要我推进', copy: '下一步仍由林然行动' },
  waiting: { label: '等待回应', copy: '正在等待对方给出回应' },
  relayed: { label: '已有人接住', copy: '当前由对方继续推进' },
  completed: { label: '已完成', copy: '本次执行已经闭环' },
}
