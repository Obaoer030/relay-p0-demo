import { createContext, type Dispatch, useContext } from 'react'
import type { WorkspaceAction, WorkspaceState } from './types'

export type WorkspaceContextValue = {
  state: WorkspaceState
  dispatch: Dispatch<WorkspaceAction>
  syncMode: 'connecting' | 'room' | 'local'
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function useWorkspace() {
  const value = useContext(WorkspaceContext)
  if (!value) throw new Error('useWorkspace must be used within WorkspaceProvider')
  return value
}
