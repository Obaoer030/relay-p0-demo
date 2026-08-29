import { createWorkspaceState, WORKSPACE_VERSION } from './seed'
import type { WorkspaceState } from './types'

export const WORKSPACE_STORAGE_KEY = 'relay:workspace-state'
export const WORKSPACE_CHANNEL = 'relay:workspace-channel'

export function isWorkspaceState(value: unknown): value is WorkspaceState {
  if (!value || typeof value !== 'object') return false
  const state = value as Partial<WorkspaceState>
  return state.version === WORKSPACE_VERSION && Array.isArray(state.matters) && Array.isArray(state.people) && Array.isArray(state.activity) && typeof state.reduceMotion === 'boolean'
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
