import { type ReactNode, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { isWorkspaceState, persistWorkspaceState, readWorkspaceState, WORKSPACE_CHANNEL, WORKSPACE_STORAGE_KEY } from './persistence'
import { workspaceReducer } from './reducer'
import type { WorkspaceState } from './types'
import { WorkspaceContext } from './WorkspaceContext'

type Message = { source: string; state: WorkspaceState }

function createSyncSource() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }
  return `relay-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workspaceReducer, undefined, readWorkspaceState)
  const [syncMode, setSyncMode] = useState<'connecting' | 'room' | 'local'>(() => typeof EventSource === 'undefined' ? 'local' : 'connecting')
  const source = useRef(createSyncSource())
  const channel = useRef<BroadcastChannel | null>(null)
  const remote = useRef(false)
  const roomReady = useRef(false)
  const stateRef = useRef(state)

  useEffect(() => { stateRef.current = state }, [state])

  const hydrateRemote = (next: WorkspaceState) => {
    remote.current = true
    dispatch({ type: 'hydrate', state: { ...next, activeUserId: stateRef.current.activeUserId, reduceMotion: stateRef.current.reduceMotion } })
  }

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return
    channel.current = new BroadcastChannel(WORKSPACE_CHANNEL)
    channel.current.onmessage = (event: MessageEvent<unknown>) => {
      const message = event.data as Partial<Message>
      if (message.source === source.current || !isWorkspaceState(message.state)) return
      hydrateRemote(message.state)
    }
    return () => channel.current?.close()
  }, [])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== WORKSPACE_STORAGE_KEY || !event.newValue) return
      try {
        const parsed: unknown = JSON.parse(event.newValue)
        if (!isWorkspaceState(parsed)) return
        hydrateRemote(parsed)
      } catch { /* ignore malformed external writes */ }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    if (typeof EventSource === 'undefined') {
      return
    }
    let cancelled = false
    let events: EventSource | null = null
    const connectRoom = async () => {
      const health = await fetch('/api/health', { headers: { Accept: 'application/json' } })
      const capability = health.ok ? await health.json() as { room?: unknown } : null
      if (cancelled) return
      if (capability?.room !== 'memory-demo') {
        setSyncMode('local')
        return
      }
      events = new EventSource('/api/workspace/events')
      events.onopen = () => { if (!cancelled) setSyncMode('room') }
      events.onerror = () => { if (!cancelled && !roomReady.current) setSyncMode('local') }
      events.onmessage = (event) => {
        try {
          const eventData: unknown = event.data
          if (typeof eventData !== 'string') return
          const message = JSON.parse(eventData) as Partial<Message>
          if (message.source === source.current || !isWorkspaceState(message.state)) return
          hydrateRemote(message.state)
        } catch { /* ignore malformed room events */ }
      }

      const response = await fetch('/api/workspace', { headers: { Accept: 'application/json' } })
      if (cancelled) return
      if (response.status === 204) {
        roomReady.current = true
        setSyncMode('room')
        await fetch('/api/workspace', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source: source.current, state: stateRef.current }) })
        return
      }
      if (!response.ok) throw new Error('room-unavailable')
      const payload = await response.json() as { state?: unknown }
      if (isWorkspaceState(payload.state)) hydrateRemote(payload.state)
      roomReady.current = true
      setSyncMode('room')
    }
    void connectRoom().catch(() => { if (!cancelled) setSyncMode('local') })

    return () => {
      cancelled = true
      events?.close()
    }
  }, [])

  useEffect(() => {
    persistWorkspaceState(state)
    if (remote.current) {
      remote.current = false
      return
    }
    channel.current?.postMessage({ source: source.current, state } satisfies Message)
    if (roomReady.current) {
      void fetch('/api/workspace', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source: source.current, state }) }).catch(() => setSyncMode('local'))
    }
  }, [state])

  const value = useMemo(() => ({ state, dispatch, syncMode }), [state, syncMode])
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}
