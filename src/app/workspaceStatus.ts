import type { WorkspaceDisplayStatus } from '../workspace/types'

export const workspaceStatus: Record<WorkspaceDisplayStatus, { label: string; copy: string }> = {
  mine: { label: '待我处理', copy: '下一步由我处理' },
  incoming: { label: '等我确认', copy: '需要确认是否由我负责' },
  waiting: { label: '等待回复', copy: '正在等待对方确认是否负责' },
  relayed: { label: '对方处理中', copy: '对方已经确认负责下一步' },
  completed: { label: '已完成', copy: '这件事已经完成' },
}
