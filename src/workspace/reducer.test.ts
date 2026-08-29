import { describe, expect, it } from 'vitest'
import { createWorkspaceState } from './seed'
import { workspaceReducer } from './reducer'
import { getPerspectiveStatus, visibleMattersFor } from './perspective'
import type { WorkspaceMatter } from './types'

const NOW = new Date('2026-08-29T08:00:00.000Z')
const AT = '2026-08-29T09:00:00.000Z'

describe('workspaceReducer', () => {
  it('creates, updates, and deletes a persisted matter record', () => {
    const initial = createWorkspaceState(NOW)
    const matter: WorkspaceMatter = {
      id: 'matter-test', title: '测试事项', context: '背景', nextAction: '完成下一步', doneDefinition: '结果已记录', boundary: '超出预算先联系', status: 'mine', creatorId: 'linran', ownerId: 'linran', ownerName: '林然', participantIds: ['linran'], category: '生活', priority: 'normal', createdAt: AT, updatedAt: AT,
    }
    const added = workspaceReducer(initial, { type: 'add-matter', matter })
    expect(added.matters[0]).toEqual(matter)
    expect(added.activity[0].kind).toBe('created')

    const updatedMatter = { ...matter, title: '更新后的事项', updatedAt: '2026-08-29T10:00:00.000Z' }
    const updated = workspaceReducer(added, { type: 'update-matter', matter: updatedMatter })
    expect(updated.matters.find((item) => item.id === matter.id)?.title).toBe('更新后的事项')

    const removed = workspaceReducer(updated, { type: 'delete-matter', id: matter.id, at: AT })
    expect(removed.matters.some((item) => item.id === matter.id)).toBe(false)
    expect(removed.activity[0].kind).toBe('deleted')
  })

  it('moves responsibility and records a whole status transition', () => {
    const initial = createWorkspaceState(NOW)
    const next = workspaceReducer(initial, { type: 'set-status', id: 'ws-spare-key', status: 'relayed', ownerName: '小雨', targetId: 'xiaoyu', at: AT })
    expect(next.matters.find((item) => item.id === 'ws-spare-key')).toMatchObject({ status: 'relayed', ownerId: 'xiaoyu', ownerName: '小雨', handoffTargetId: 'xiaoyu' })
    expect(next.activity[0]).toMatchObject({ kind: 'status', actor: '林然' })
  })

  it('resets all interactive demo data', () => {
    const initial = createWorkspaceState(NOW)
    const removed = workspaceReducer(initial, { type: 'delete-matter', id: 'ws-heater', at: AT })
    const reset = workspaceReducer(removed, { type: 'reset', now: NOW })
    expect(reset.matters).toHaveLength(14)
    expect(reset.users).toHaveLength(4)
    expect(reset.people).toHaveLength(4)
    expect(reset.activity).toHaveLength(8)
  })

  it('shows one shared invitation differently and synchronizes acceptance across perspectives', () => {
    const initial = createWorkspaceState(NOW)
    const invitation = initial.matters.find((item) => item.id === 'ws-access-card')!
    expect(getPerspectiveStatus(invitation, 'linran')).toBe('waiting')
    expect(getPerspectiveStatus(invitation, 'xiaoyu')).toBe('incoming')

    const xiaoyu = workspaceReducer(initial, { type: 'set-active-user', userId: 'xiaoyu' })
    const accepted = workspaceReducer(xiaoyu, { type: 'accept-handoff', id: invitation.id, at: AT })
    const shared = accepted.matters.find((item) => item.id === invitation.id)!
    expect(shared).toMatchObject({ status: 'relayed', ownerId: 'xiaoyu', ownerName: '小雨' })
    expect(getPerspectiveStatus(shared, 'xiaoyu')).toBe('mine')
    expect(getPerspectiveStatus(shared, 'linran')).toBe('relayed')

    const completed = workspaceReducer(accepted, { type: 'complete-matter', id: invitation.id, at: AT })
    expect(completed.matters.find((item) => item.id === invitation.id)?.status).toBe('completed')
    expect(visibleMattersFor(completed.matters, 'linran').some((item) => item.id === invitation.id)).toBe(true)
  })

  it('returns a declined invitation to the creator and removes it from the invitee view', () => {
    const initial = createWorkspaceState(NOW)
    const xiaoyu = workspaceReducer(initial, { type: 'set-active-user', userId: 'xiaoyu' })
    const declined = workspaceReducer(xiaoyu, { type: 'decline-handoff', id: 'ws-access-card', at: AT })
    const matter = declined.matters.find((item) => item.id === 'ws-access-card')!
    expect(matter).toMatchObject({ status: 'mine', ownerId: 'linran', handoffTargetId: undefined })
    expect(visibleMattersFor(declined.matters, 'xiaoyu').some((item) => item.id === matter.id)).toBe(false)
  })
})
