import { describe, expect, it } from 'vitest'
import { parsePersistedState } from './persistence'
import { createSeedState, SEED_VERSION } from './seed'

const NOW = new Date('2026-08-29T02:00:00.000Z')

describe('state persistence', () => {
  it('restores a valid persisted state', () => {
    const state = createSeedState(NOW)
    state.demoStage = 'shared'

    expect(parsePersistedState(JSON.stringify(state), NOW).demoStage).toBe('shared')
  })

  it.each(['not json', JSON.stringify({ seedVersion: SEED_VERSION - 1 })])(
    'migrates malformed or stale data back to the complete fixture',
    (serialized) => {
      const state = parsePersistedState(serialized, NOW)

      expect(state.seedVersion).toBe(SEED_VERSION)
      expect(state.demoStage).toBe('initial')
      expect(state.matters).toHaveLength(5)
      expect(state.handoffs).toHaveLength(1)
    },
  )
})
