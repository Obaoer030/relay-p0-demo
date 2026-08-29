import { describe, expect, it } from 'vitest'
import { createSeedState, getNextSaturdayAt0930 } from './seed'

describe('fixture dates', () => {
  it('uses the following Saturday when reset happens on Saturday', () => {
    const now = new Date(2026, 7, 29, 10, 0)
    const due = new Date(getNextSaturdayAt0930(now))

    expect(due.getDay()).toBe(6)
    expect(due.getDate()).toBe(5)
    expect(due.getHours()).toBe(9)
    expect(due.getMinutes()).toBe(30)
  })

  it('creates independent deep fixture instances', () => {
    const first = createSeedState(new Date(2026, 7, 29))
    const second = createSeedState(new Date(2026, 7, 29))

    first.matters[0].title = 'changed'
    expect(second.matters[0].title).toBe('周六带布丁完成复诊')
  })
})
