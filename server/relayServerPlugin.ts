import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import { isAgentRequest, runMiniMax, type ServerConfig } from './agentService.js'
import { isWorkspaceState } from '../src/workspace/persistence.ts'
import type { WorkspaceState } from '../src/workspace/types.ts'

export type { ServerConfig } from './agentService.js'

const MAX_BODY_BYTES = 64_000

async function readJson(request: IncomingMessage): Promise<unknown> {
  const chunks: string[] = []
  let size = 0
  for await (const chunk of request as AsyncIterable<unknown>) {
    const text = typeof chunk === 'string' ? chunk : chunk instanceof Uint8Array ? new TextDecoder().decode(chunk) : ''
    size += Buffer.byteLength(text)
    if (size > MAX_BODY_BYTES) throw new Error('request-too-large')
    chunks.push(text)
  }
  return JSON.parse(chunks.join('')) as unknown
}

function sendJson(response: ServerResponse, status: number, value: unknown) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify(value))
}

export type RelayMiddleware = (request: IncomingMessage, response: ServerResponse, next: () => void) => Promise<void>

export function createRelayMiddleware(config: ServerConfig): RelayMiddleware {
  let workspaceState: WorkspaceState | null = null
  const eventClients = new Set<ServerResponse>()
  const broadcast = (source: string, state: WorkspaceState) => {
    const data = `data: ${JSON.stringify({ source, state })}\n\n`
    eventClients.forEach((client) => client.write(data))
  }
  const middleware = async (request: IncomingMessage, response: ServerResponse, next: () => void) => {
    const url = new URL(request.url ?? '/', 'http://relay.local')
    if (!url.pathname.startsWith('/api/')) return next()
    try {
      if (url.pathname === '/api/health' && request.method === 'GET') return sendJson(response, 200, { ok: true, agent: config.apiKey ? 'minimax' : 'unconfigured', room: 'memory-demo' })
      if (url.pathname === '/api/workspace/events' && request.method === 'GET') {
        response.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive' })
        response.write(': connected\n\n')
        eventClients.add(response)
        request.on('close', () => eventClients.delete(response))
        return
      }
      if (url.pathname === '/api/workspace' && request.method === 'GET') {
        if (!workspaceState) { response.statusCode = 204; response.end(); return }
        return sendJson(response, 200, { state: workspaceState })
      }
      if (url.pathname === '/api/workspace' && request.method === 'DELETE') {
        workspaceState = null
        return sendJson(response, 200, { ok: true })
      }
      if (url.pathname === '/api/workspace' && request.method === 'PUT') {
        const body = await readJson(request) as { source?: unknown; state?: unknown }
        if (typeof body.source !== 'string' || !isWorkspaceState(body.state)) return sendJson(response, 400, { error: 'invalid-workspace-state' })
        workspaceState = body.state
        broadcast(body.source, body.state)
        return sendJson(response, 200, { ok: true })
      }
      if (url.pathname === '/api/agent' && request.method === 'POST') {
        const body = await readJson(request)
        if (!isAgentRequest(body)) return sendJson(response, 400, { error: 'invalid-agent-request' })
        if (!config.apiKey) return sendJson(response, 503, { error: 'minimax-not-configured' })
        try {
          return sendJson(response, 200, await runMiniMax(config, body))
        } catch (error) {
          const reason = error instanceof Error ? error.message : 'minimax-unavailable'
          return sendJson(response, reason.includes('timeout') || reason.includes('aborted') ? 504 : 502, { error: 'minimax-unavailable', reason })
        }
      }
      return sendJson(response, 404, { error: 'not-found' })
    } catch (error) {
      return sendJson(response, error instanceof Error && error.message === 'request-too-large' ? 413 : 500, { error: 'server-error' })
    }
  }
  return middleware
}

export function relayServerPlugin(config: ServerConfig): Plugin {
  const middleware = createRelayMiddleware(config)
  return {
    name: 'relay-server',
    configureServer(server) { server.middlewares.use((request, response, next) => { void middleware(request, response, next) }) },
    configurePreviewServer(server) { server.middlewares.use((request, response, next) => { void middleware(request, response, next) }) },
  }
}
