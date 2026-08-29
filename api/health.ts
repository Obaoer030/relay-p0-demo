import type { IncomingMessage, ServerResponse } from 'node:http'

export default function handler(request: IncomingMessage, response: ServerResponse) {
  if (request.method !== 'GET') {
    response.statusCode = 405
    return response.end(JSON.stringify({ error: 'method-not-allowed' }))
  }
  response.statusCode = 200
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify({ ok: true, agent: process.env.MINIMAX_API_KEY ? 'minimax' : 'unconfigured', room: 'browser-local' }))
}
