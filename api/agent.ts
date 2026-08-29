import type { IncomingMessage, ServerResponse } from 'node:http'
import { isAgentRequest, runMiniMax, type ServerConfig } from '../server/agentService.js'

export const maxDuration = 120

type VercelRequest = IncomingMessage & { body?: unknown }

async function parseBody(request: VercelRequest) {
  if (request.body !== undefined) return request.body
  const chunks: Uint8Array[] = []
  for await (const chunk of request as AsyncIterable<unknown>) {
    if (typeof chunk === 'string') chunks.push(Buffer.from(chunk))
    else if (chunk instanceof Uint8Array) chunks.push(chunk)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
}

function sendJson(response: ServerResponse, status: number, body: unknown) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify(body))
}

export default async function handler(request: VercelRequest, response: ServerResponse) {
  if (request.method !== 'POST') return sendJson(response, 405, { error: 'method-not-allowed' })
  const config: ServerConfig = {
    apiKey: process.env.MINIMAX_API_KEY,
    baseUrl: process.env.MINIMAX_BASE_URL || 'https://api.minimaxi.com/v1',
    model: process.env.MINIMAX_MODEL || 'MiniMax-M2.7',
  }
  if (!config.apiKey) return sendJson(response, 503, { error: 'minimax-not-configured' })
  try {
    const body = await parseBody(request)
    if (!isAgentRequest(body)) return sendJson(response, 400, { error: 'invalid-agent-request' })
    return sendJson(response, 200, await runMiniMax(config, body))
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'minimax-unavailable'
    return sendJson(response, reason.includes('timeout') || reason.includes('aborted') ? 504 : 502, { error: 'minimax-unavailable', reason })
  }
}
