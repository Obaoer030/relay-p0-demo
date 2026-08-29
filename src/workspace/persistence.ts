import { createWorkspaceState, WORKSPACE_VERSION } from './seed'
import type { WorkspaceState } from './types'

export const WORKSPACE_STORAGE_KEY = 'relay:workspace-state'
export const WORKSPACE_CHANNEL = 'relay:workspace-channel'

const userIds = new Set(['linran', 'xiaoyu', 'sister', 'chenyu'])
const statuses = new Set(['mine', 'waiting', 'relayed', 'completed'])
const priorities = new Set(['low', 'normal', 'high'])

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object'
const isString = (value: unknown): value is string => typeof value === 'string'

const isMatter = (value: unknown) => {
  if (!isRecord(value)) return false
  return ['id', 'title', 'context', 'nextAction', 'doneDefinition', 'boundary', 'ownerName', 'category', 'createdAt', 'updatedAt'].every((key) => isString(value[key])) &&
    statuses.has(String(value.status)) && priorities.has(String(value.priority)) &&
    userIds.has(String(value.creatorId)) && isString(value.ownerId) &&
    Array.isArray(value.participantIds) && value.participantIds.every((id) => userIds.has(String(id))) &&
    (value.handoffTargetId === undefined || isString(value.handoffTargetId)) &&
    (value.completionNote === undefined || isString(value.completionNote)) &&
    (value.adjustmentNote === undefined || isString(value.adjustmentNote))
}

export function isWorkspaceState(value: unknown): value is WorkspaceState {
  if (!value || typeof value !== 'object') return false
  const state = value as Partial<WorkspaceState>
  return state.version === WORKSPACE_VERSION &&
    userIds.has(String(state.activeUserId)) &&
    Array.isArray(state.users) && state.users.length === 4 &&
    Array.isArray(state.matters) && state.matters.every(isMatter) &&
    Array.isArray(state.people) &&
    Array.isArray(state.activity) &&
    typeof state.reduceMotion === 'boolean'
}

export function readWorkspaceState(now = new Date()): WorkspaceState {
  if (typeof window === 'undefined') return createWorkspaceState(now)
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(WORKSPACE_STORAGE_KEY) ?? 'null')
    return isWorkspaceState(parsed) ? parsed : createWorkspaceState(now)
  } catch {
    return createWorkspaceState(now)
  }
}

export function persistWorkspaceState(state: WorkspaceState) {
  window.localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(state))
}
