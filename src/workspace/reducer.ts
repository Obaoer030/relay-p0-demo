import { createWorkspaceState } from './seed'
import type { ActivityEntry, WorkspaceAction, WorkspaceMatterStatus, WorkspaceState } from './types'

const nowIso = (at?: string) => at ?? new Date().toISOString()

const statusLabel: Record<WorkspaceMatterStatus, string> = {
  mine: '待我处理',
  waiting: '等待回复',
  relayed: '对方处理中',
  completed: '已完成',
}

function activity(entry: Omit<ActivityEntry, 'id'>): ActivityEntry {
  return { ...entry, id: `activity-${entry.at}-${entry.matterId ?? 'workspace'}` }
}

export function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'add-matter':
      return {
        ...state,
        matters: [action.matter, ...state.matters],
        activity: [activity({ matterId: action.matter.id, kind: 'created', title: `创建了“${action.matter.title}”`, detail: action.matter.nextAction, actor: '林然', at: action.matter.createdAt }), ...state.activity],
      }
    case 'update-matter':
      return {
        ...state,
        matters: state.matters.map((item) => item.id === action.matter.id ? action.matter : item),
        activity: [activity({ matterId: action.matter.id, kind: 'updated', title: `更新了“${action.matter.title}”`, detail: '事情背景、下一步或联系说明已更新。', actor: '林然', at: action.matter.updatedAt }), ...state.activity],
      }
    case 'delete-matter': {
      const target = state.matters.find((item) => item.id === action.id)
      if (!target) return state
      const at = nowIso(action.at)
      return {
        ...state,
        matters: state.matters.filter((item) => item.id !== action.id),
        activity: [activity({ kind: 'deleted', title: `删除了“${target.title}”`, detail: '该演示事项已从工作区移除。', actor: '林然', at }), ...state.activity],
      }
    }
    case 'set-status': {
      const target = state.matters.find((item) => item.id === action.id)
      if (!target || target.status === action.status) return state
      const at = nowIso(action.at)
      const ownerName = action.ownerName ?? (action.status === 'mine' ? '林然' : target.ownerName)
      return {
        ...state,
        matters: state.matters.map((item) => item.id === action.id ? {
          ...item,
          status: action.status,
          ownerName,
          handoffTargetId: action.targetId ?? item.handoffTargetId,
          updatedAt: at,
          completedAt: action.status === 'completed' ? at : undefined,
        } : item),
        activity: [activity({ matterId: action.id, kind: 'status', title: `“${target.title}”进入${statusLabel[action.status]}`, detail: `当前负责人：${ownerName}`, actor: '林然', at }), ...state.activity],
      }
    }
    case 'set-reduce-motion':
      return { ...state, reduceMotion: action.value }
    case 'reset':
      return createWorkspaceState(action.now)
    case 'hydrate':
      return action.state.version === state.version ? action.state : state
  }
}
