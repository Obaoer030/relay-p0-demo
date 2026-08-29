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

const activeUser = (state: WorkspaceState) =>
  state.users.find((user) => user.id === state.activeUserId) ?? state.users[0]

export function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'add-matter':
      return {
        ...state,
        matters: [action.matter, ...state.matters],
        activity: [activity({ matterId: action.matter.id, kind: 'created', title: `创建了“${action.matter.title}”`, detail: action.matter.nextAction, actor: activeUser(state).name, at: action.matter.createdAt }), ...state.activity],
      }
    case 'update-matter':
      return {
        ...state,
        matters: state.matters.map((item) => item.id === action.matter.id ? action.matter : item),
        activity: [activity({ matterId: action.matter.id, kind: 'updated', title: `更新了“${action.matter.title}”`, detail: '事情背景、下一步或联系说明已更新。', actor: activeUser(state).name, at: action.matter.updatedAt }), ...state.activity],
      }
    case 'delete-matter': {
      const target = state.matters.find((item) => item.id === action.id)
      if (!target) return state
      const at = nowIso(action.at)
      return {
        ...state,
        matters: state.matters.filter((item) => item.id !== action.id),
        activity: [activity({ kind: 'deleted', title: `删除了“${target.title}”`, detail: '该演示事项已从工作区移除。', actor: activeUser(state).name, at }), ...state.activity],
      }
    }
    case 'set-status': {
      const target = state.matters.find((item) => item.id === action.id)
      if (!target || target.status === action.status) return state
      const at = nowIso(action.at)
      const actor = activeUser(state)
      const targetUser = state.users.find((user) => user.id === action.targetId)
      const ownerId = action.status === 'mine' || action.status === 'waiting'
        ? actor.id
        : action.status === 'relayed'
          ? targetUser?.id ?? target.ownerId
          : target.ownerId
      const ownerName = action.ownerName ?? state.users.find((user) => user.id === ownerId)?.name ?? target.ownerName
      const participantIds = targetUser && !target.participantIds.includes(targetUser.id)
        ? [...target.participantIds, targetUser.id]
        : target.participantIds
      return {
        ...state,
        matters: state.matters.map((item) => item.id === action.id ? {
          ...item,
          status: action.status,
          ownerId,
          ownerName,
          handoffTargetId: action.targetId ?? item.handoffTargetId,
          participantIds,
          updatedAt: at,
          completedAt: action.status === 'completed' ? at : undefined,
        } : item),
        activity: [activity({ matterId: action.id, kind: 'status', title: `“${target.title}”进入${statusLabel[action.status]}`, detail: `当前负责人：${ownerName}`, actor: actor.name, at }), ...state.activity],
      }
    }
    case 'set-active-user':
      return state.users.some((user) => user.id === action.userId)
        ? { ...state, activeUserId: action.userId }
        : state
    case 'accept-handoff': {
      const target = state.matters.find((item) => item.id === action.id)
      const actor = activeUser(state)
      if (!target || target.status !== 'waiting' || target.handoffTargetId !== actor.id) return state
      const at = nowIso(action.at)
      return {
        ...state,
        matters: state.matters.map((item) => item.id === action.id ? {
          ...item,
          status: 'relayed',
          ownerId: actor.id,
          ownerName: actor.name,
          updatedAt: at,
        } : item),
        activity: [activity({ matterId: target.id, kind: 'status', title: `${actor.name}确认负责“${target.title}”`, detail: `下一步现在由${actor.name}处理。`, actor: actor.name, at }), ...state.activity],
      }
    }
    case 'decline-handoff': {
      const target = state.matters.find((item) => item.id === action.id)
      const actor = activeUser(state)
      if (!target || target.status !== 'waiting' || target.handoffTargetId !== actor.id) return state
      const creator = state.users.find((user) => user.id === target.creatorId)
      const at = nowIso(action.at)
      return {
        ...state,
        matters: state.matters.map((item) => item.id === action.id ? {
          ...item,
          status: 'mine',
          ownerId: target.creatorId,
          ownerName: creator?.name ?? target.ownerName,
          participantIds: item.participantIds.filter((id) => id !== actor.id),
          handoffTargetId: undefined,
          updatedAt: at,
        } : item),
        activity: [activity({ matterId: target.id, kind: 'status', title: `${actor.name}这次不方便处理“${target.title}”`, detail: `事项仍由${creator?.name ?? '发起者'}处理。`, actor: actor.name, at }), ...state.activity],
      }
    }
    case 'complete-matter': {
      const target = state.matters.find((item) => item.id === action.id)
      const actor = activeUser(state)
      if (!target || target.status === 'completed' || target.ownerId !== actor.id) return state
      const at = nowIso(action.at)
      return {
        ...state,
        matters: state.matters.map((item) => item.id === action.id ? {
          ...item,
          status: 'completed',
          completedAt: at,
          updatedAt: at,
        } : item),
        activity: [activity({ matterId: target.id, kind: 'status', title: `${actor.name}完成了“${target.title}”`, detail: target.doneDefinition, actor: actor.name, at }), ...state.activity],
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
