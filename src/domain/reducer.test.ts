import { describe, expect, it } from 'vitest'
import { createSeedState, HERO_MATTER_ID } from './seed'
import { jumpToStage, relayReducer } from './reducer'

const NOW = new Date('2026-08-29T02:00:00.000Z')
const AT = '2026-08-29T03:00:00.000Z'

const hero = (state: ReturnType<typeof createSeedState>) =>
  state.matters.find((matter) => matter.id === HERO_MATTER_ID)!

describe('relayReducer', () => {
  it('shares a complete waiting state', () => {
    const state = relayReducer(createSeedState(NOW), { type: 'share', at: AT })

    expect(state.demoStage).toBe('shared')
    expect(state.handoffs[0]).toMatchObject({ status: 'shared', sharedAt: AT })
    expect(hero(state)).toMatchObject({ status: 'waiting', currentActor: 'linran' })
  })

  it('transfers current execution responsibility only after acceptance', () => {
    const shared = relayReducer(createSeedState(NOW), { type: 'share', at: AT })
    const accepted = relayReducer(shared, { type: 'accept', at: AT })

    expect(accepted.demoStage).toBe('accepted')
    expect(accepted.handoffs[0]).toMatchObject({ status: 'accepted', respondedAt: AT })
    expect(hero(accepted)).toMatchObject({ status: 'relayed', currentActor: 'xiaoyu' })
  })

  it('keeps acceptance distinct from completion', () => {
    const accepted = jumpToStage('accepted', NOW)
    const completed = relayReducer(accepted, { type: 'complete', at: AT })

    expect(hero(accepted).status).toBe('relayed')
    expect(hero(accepted).completedAt).toBeUndefined()
    expect(hero(completed)).toMatchObject({
      status: 'completed',
      completedAt: AT,
      completedBy: 'xiaoyu',
    })
    expect(completed.handoffs[0].status).toBe('completed')
  })

  it('returns responsibility to Lin Ran after a respectful decline', () => {
    const shared = jumpToStage('shared', NOW)
    const declined = relayReducer(shared, { type: 'decline', at: AT })

    expect(declined.demoStage).toBe('declined')
    expect(hero(declined)).toMatchObject({ status: 'mine', currentActor: 'linran' })
    expect(declined.handoffs[0].status).toBe('declined')
  })

  it('ignores illegal and duplicate transitions', () => {
    const initial = createSeedState(NOW)
    expect(relayReducer(initial, { type: 'accept', at: AT })).toBe(initial)

    const shared = relayReducer(initial, { type: 'share', at: AT })
    expect(relayReducer(shared, { type: 'share', at: AT })).toBe(shared)
  })

  it('builds every controller stage as a legal whole state', () => {
    expect(jumpToStage('initial', NOW).handoffs[0].status).toBe('draft')
    expect(jumpToStage('shared', NOW).handoffs[0].status).toBe('shared')
    expect(jumpToStage('accepted', NOW).handoffs[0].status).toBe('accepted')
    expect(jumpToStage('completed', NOW).handoffs[0].status).toBe('completed')
  })

  it('recomputes the complete fixture on reset', () => {
    const completed = jumpToStage('completed', NOW)
    const resetAt = new Date('2026-09-06T02:00:00.000Z')
    const reset = relayReducer(completed, { type: 'reset', now: resetAt })

    expect(reset.demoStage).toBe('initial')
    expect(reset.matters).toHaveLength(5)
    expect(hero(reset).status).toBe('mine')
    expect(hero(reset).dueAt).not.toBe(hero(completed).dueAt)
  })
})
