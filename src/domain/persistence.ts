import { createSeedState, SEED_VERSION } from './seed'
import type { RelayState } from './types'

export const STORAGE_KEY = 'relay:p0-demo-state'
export const CHANNEL_NAME = 'relay:p0-demo-channel'

export function isRelayState(value: unknown): value is RelayState {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<RelayState>
  const stages = ['initial', 'shared', 'accepted', 'declined', 'completed']
  return (
    candidate.seedVersion === SEED_VERSION &&
    (candidate.activeActor === 'linran' || candidate.activeActor === 'xiaoyu') &&
    typeof candidate.reduceMotion === 'boolean' &&
    typeof candidate.demoStage === 'string' &&
    stages.includes(candidate.demoStage) &&
    typeof candidate.lastEventAt === 'string' &&
    Array.isArray(candidate.matters) &&
    candidate.matters.length === 5 &&
    Array.isArray(candidate.handoffs) &&
    candidate.handoffs.length === 1
  )
}

export function parsePersistedState(
  serialized: string | null,
  now = new Date(),
): RelayState {
  if (!serialized) return createSeedState(now)

  try {
    const parsed: unknown = JSON.parse(serialized)
    return isRelayState(parsed) ? parsed : createSeedState(now)
  } catch {
    return createSeedState(now)
  }
}

export function readPersistedState(now = new Date()) {
  if (typeof window === 'undefined') return createSeedState(now)
  return parsePersistedState(window.localStorage.getItem(STORAGE_KEY), now)
}

export function persistState(state: RelayState) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
