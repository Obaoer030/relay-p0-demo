import { createContext, type Dispatch, useContext } from 'react'
import type { RelayAction, RelayState } from '../domain/types'

export type RelayContextValue = {
  state: RelayState
  dispatch: Dispatch<RelayAction>
}

export const RelayContext = createContext<RelayContextValue | null>(null)

export function useRelay() {
  const context = useContext(RelayContext)
  if (!context) throw new Error('useRelay must be used within RelayProvider')
  return context
}
