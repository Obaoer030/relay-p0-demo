import { type ReactNode, useEffect, useMemo, useReducer, useRef } from 'react'
import { isWorkspaceState, persistWorkspaceState, readWorkspaceState, WORKSPACE_CHANNEL, WORKSPACE_STORAGE_KEY } from './persistence'
import { workspaceReducer } from './reducer'
import type { WorkspaceState } from './types'
import { WorkspaceContext } from './WorkspaceContext'

type Message = { source: string; state: WorkspaceState }

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workspaceReducer, undefined, readWorkspaceState)
  const source = useRef(crypto.randomUUID())
  const channel = useRef<BroadcastChannel | null>(null)
  const remote = useRef(false)

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return
    channel.current = new BroadcastChannel(WORKSPACE_CHANNEL)
    channel.current.onmessage = (event: MessageEvent<unknown>) => {
      const message = event.data as Partial<Message>
      if (message.source === source.current || !isWorkspaceState(message.state)) return
      remote.current = true
      dispatch({ type: 'hydrate', state: message.state })
    }
    return () => channel.current?.close()
  }, [])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== WORKSPACE_STORAGE_KEY || !event.newValue) return
      try {
        const parsed: unknown = JSON.parse(event.newValue)
        if (!isWorkspaceState(parsed)) return
        remote.current = true
        dispatch({ type: 'hydrate', state: parsed })
      } catch { /* ignore malformed external writes */ }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    persistWorkspaceState(state)
    if (remote.current) {
      remote.current = false
      return
    }
    channel.current?.postMessage({ source: source.current, state } satisfies Message)
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}
