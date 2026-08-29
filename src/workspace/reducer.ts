import { createWorkspaceState } from './seed'
import type { ActivityEntry, WorkspaceAction, WorkspaceState, WorkspaceUserId } from './types'

const nowIso = (at?: string) => at ?? new Date().toISOString()

function activity(entry: Omit<ActivityEntry, 'id'>): ActivityEntry {
  return { ...entry, id: `activity-${entry.at}-${entry.matterId ?? 'workspace'}` }
}

const activeUser = (state: WorkspaceState) =>
  state.users.find((user) => user.id === state.activeUserId) ?? state.users[0]

const actionUser = (state: WorkspaceState, actorId?: WorkspaceUserId) =>
  state.users.find((user) => user.id === actorId) ?? activeUser(state)

const agreementChanged = (before: WorkspaceState['matters'][number], after: WorkspaceState['matters'][number]) =>
  before.title !== after.title || before.context !== after.context ||
  before.nextAction !== after.nextAction || before.doneDefinition !== after.doneDefinition ||
  before.boundary !== after.boundary || before.dueAt !== after.dueAt

export function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'add-matter': {
      const actor = activeUser(state)
      if (action.matter.creatorId !== actor.id || !['mine', 'waiting'].includes(action.matter.status)) return state
      return {
        ...state,
        matters: [action.matter, ...state.matters],
        activity: [activity({ matterId: action.matter.id, kind: 'created', title: action.matter.status === 'waiting' ? `创建并发出了“${action.matter.title}”` : `创建了“${action.matter.title}”`, detail: action.matter.status === 'waiting' ? `正在等待${state.users.find((user) => user.id === action.matter.handoffTargetId)?.name ?? '对方'}确认。` : action.matter.nextAction, actor: actor.name, at: action.matter.createdAt }), ...state.activity],
      }
    }
    case 'update-matter': {
      const target = state.matters.find((item) => item.id === action.matter.id)
      const actor = activeUser(state)
      if (!target || target.creatorId !== actor.id || target.status === 'completed') return state
      const changed = agreementChanged(target, action.matter)
      const needsConfirmation = changed && target.status === 'relayed'
      const updated = {
        ...target,
        title: action.matter.title,
        context: action.matter.context,
        nextAction: action.matter.nextAction,
        doneDefinition: action.matter.doneDefinition,
        boundary: action.matter.boundary,
        dueAt: action.matter.dueAt,
        category: action.matter.category,
        priority: action.matter.priority,
        updatedAt: action.matter.updatedAt,
        status: needsConfirmation ? 'waiting' as const : target.status,
        ownerId: needsConfirmation ? target.creatorId : target.ownerId,
        ownerName: needsConfirmation ? actor.name : target.ownerName,
        adjustmentNote: undefined,
      }
      return {
        ...state,
        matters: state.matters.map((item) => item.id === target.id ? updated : item),
        activity: [activity({ matterId: target.id, kind: needsConfirmation ? 'status' : 'updated', title: needsConfirmation ? `“${updated.title}”的约定已更新，等待再次确认` : `更新了“${updated.title}”`, detail: needsConfirmation ? `下一步仍需${target.ownerName}再次确认。` : '事情背景、下一步或联系说明已更新。', actor: actor.name, at: updated.updatedAt }), ...state.activity],
      }
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
    case 'set-active-user':
      return state.users.some((user) => user.id === action.userId)
        ? { ...state, activeUserId: action.userId }
        : state
    case 'accept-handoff': {
      const target = state.matters.find((item) => item.id === action.id)
      const actor = actionUser(state, action.actorId)
      if (!target || target.status !== 'waiting' || target.adjustmentNote || target.handoffTargetId !== actor.id) return state
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
    case 'request-adjustment': {
      const target = state.matters.find((item) => item.id === action.id)
      const actor = actionUser(state, action.actorId)
      const note = action.note.trim()
      if (!target || !note || target.status !== 'waiting' || target.handoffTargetId !== actor.id) return state
      const creator = state.users.find((user) => user.id === target.creatorId)
      const at = nowIso(action.at)
      return {
        ...state,
        matters: state.matters.map((item) => item.id === target.id ? { ...item, ownerId: target.creatorId, ownerName: creator?.name ?? target.ownerName, adjustmentNote: note, updatedAt: at } : item),
        activity: [activity({ matterId: target.id, kind: 'status', title: `${actor.name}希望调整“${target.title}”`, detail: note, actor: actor.name, at }), ...state.activity],
      }
    }
    case 'decline-handoff': {
      const target = state.matters.find((item) => item.id === action.id)
      const actor = actionUser(state, action.actorId)
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
          adjustmentNote: undefined,
          updatedAt: at,
        } : item),
        activity: [activity({ matterId: target.id, kind: 'status', title: `${actor.name}这次不方便处理“${target.title}”`, detail: `事项仍由${creator?.name ?? '发起者'}处理。`, actor: actor.name, at }), ...state.activity],
      }
    }
    case 'complete-matter': {
      const target = state.matters.find((item) => item.id === action.id)
      const actor = actionUser(state, action.actorId)
      const note = action.note.trim()
      if (!target || !note || target.status === 'completed' || target.ownerId !== actor.id) return state
      const at = nowIso(action.at)
      return {
        ...state,
        matters: state.matters.map((item) => item.id === action.id ? {
          ...item,
          status: 'completed',
          completedAt: at,
          completionNote: note,
          updatedAt: at,
        } : item),
        activity: [activity({ matterId: target.id, kind: 'status', title: `${actor.name}完成了“${target.title}”`, detail: note, actor: actor.name, at }), ...state.activity],
      }
    }
    case 'reopen-matter': {
      const target = state.matters.find((item) => item.id === action.id)
      const actor = activeUser(state)
      if (!target || target.status !== 'completed' || target.creatorId !== actor.id) return state
      const at = nowIso(action.at)
      return {
        ...state,
        matters: state.matters.map((item) => item.id === target.id ? { ...item, status: 'mine', ownerId: actor.id, ownerName: actor.name, completedAt: undefined, completionNote: undefined, updatedAt: at } : item),
        activity: [activity({ matterId: target.id, kind: 'status', title: `${actor.name}重新打开了“${target.title}”`, detail: '事项回到待我处理，可更新约定后再次邀请。', actor: actor.name, at }), ...state.activity],
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
