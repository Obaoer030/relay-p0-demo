import { afterEach, describe, expect, it, vi } from 'vitest'
import { runMiniMax } from '../../server/agentService.ts'
import type { AgentTurnRequest } from './types.ts'

const request: AgentTurnRequest = {
  input: '请小雨整理医保卡。', transcript: [], currentUserId: 'linran',
  users: [
    { id: 'linran', name: '林然', role: '发起者' }, { id: 'xiaoyu', name: '小雨', role: '朋友' },
    { id: 'sister', name: '姐姐', role: '家人' }, { id: 'chenyu', name: '陈屿', role: '伴侣' },
  ],
}

const validModelContent = JSON.stringify({
  status: 'ready', message: '已整理',
  draft: {
    title: '整理医保卡', context: request.input, category: '家人', priority: 'normal', boundary: '', missingFields: [], assumptions: [],
    steps: [{ id: 'prepare-card', title: '整理医保卡', nextAction: '整理医保卡', ownerId: 'xiaoyu', ownerName: '小雨', doneDefinition: '医保卡已整理好' }],
  },
})

function providerResponse(content: string) {
  return { ok: true, json: () => Promise.resolve({ choices: [{ message: { content } }] }) } as Response
}

afterEach(() => vi.unstubAllGlobals())

describe('MiniMax protocol recovery', () => {
  it('retries malformed JSON once instead of returning a provider failure immediately', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(providerResponse('{"status":"ready","draft":['))
      .mockResolvedValueOnce(providerResponse(validModelContent))
    vi.stubGlobal('fetch', fetchMock)

    const response = await runMiniMax({ apiKey: 'test-only', baseUrl: 'https://example.invalid/v1', model: 'test-model' }, request)

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(response.status).toBe('ready')
    expect(response.draft.steps).toHaveLength(1)
  })
})
