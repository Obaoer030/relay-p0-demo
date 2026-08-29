import {
  type ReactNode,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import {
  CHANNEL_NAME,
  isRelayState,
  parsePersistedState,
  persistState,
  readPersistedState,
  STORAGE_KEY,
} from '../domain/persistence'
import { relayReducer } from '../domain/reducer'
import type { RelayState } from '../domain/types'
import { RelayContext } from './RelayContext'

type SyncMessage = {
  sourceId: string
  state: RelayState
}

export function RelayProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(relayReducer, undefined, readPersistedState)
  const sourceId = useRef(crypto.randomUUID())
  const channelRef = useRef<BroadcastChannel | null>(null)
  const applyingRemote = useRef(false)

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return
    const channel = new BroadcastChannel(CHANNEL_NAME)
    channelRef.current = channel
    channel.onmessage = (event: MessageEvent<unknown>) => {
      const message = event.data as Partial<SyncMessage>
      if (message.sourceId === sourceId.current || !isRelayState(message.state)) return
      applyingRemote.current = true
      dispatch({ type: 'hydrate', state: message.state })
    }
    return () => channel.close()
  }, [])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return
      const incoming = parsePersistedState(event.newValue)
      if (JSON.stringify(incoming) === JSON.stringify(state)) return
      applyingRemote.current = true
      dispatch({ type: 'hydrate', state: incoming })
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [state])

  useEffect(() => {
    persistState(state)
    if (applyingRemote.current) {
      applyingRemote.current = false
      return
    }
    const message: SyncMessage = { sourceId: sourceId.current, state }
    channelRef.current?.postMessage(message)
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <RelayContext.Provider value={value}>{children}</RelayContext.Provider>
}
