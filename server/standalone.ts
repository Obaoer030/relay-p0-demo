import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { extname, join, resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import { createRelayMiddleware, type ServerConfig } from './relayServerPlugin.ts'

try { process.loadEnvFile('.env.local') } catch { /* .env.local is optional */ }

const config: ServerConfig = {
  apiKey: process.env.MINIMAX_API_KEY,
  baseUrl: process.env.MINIMAX_BASE_URL || 'https://api.minimaxi.com/v1',
  model: process.env.MINIMAX_MODEL || 'MiniMax-M2.7',
  agentMode: process.env.RELAY_AGENT_MODE === 'fallback' ? 'fallback' : 'auto',
}
const middleware = createRelayMiddleware(config)
const distRoot = resolve(process.cwd(), 'dist')
const mimeTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
}

async function serveStatic(request: IncomingMessage, response: ServerResponse) {
  const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://relay.local').pathname)
  const extension = extname(pathname)
  const relativePath = extension ? pathname.replace(/^\/+/, '') : 'index.html'
  const filePath = join(distRoot, relativePath)
  if (!filePath.startsWith(distRoot)) { response.statusCode = 403; return response.end('Forbidden') }
  try {
    const data = await readFile(filePath)
    response.statusCode = 200
    response.setHeader('Content-Type', mimeTypes[extname(filePath)] ?? 'application/octet-stream')
    response.setHeader('Cache-Control', extension && extension !== '.html' ? 'public, max-age=31536000, immutable' : 'no-cache')
    response.end(data)
  } catch {
    response.statusCode = 404
    response.end('Not found')
  }
}

const server = createServer((request, response) => {
  void middleware(request, response, () => { void serveStatic(request, response) })
})
const port = Number.parseInt(process.env.PORT || '4173', 10)
const host = process.env.HOST || '0.0.0.0'
server.listen(port, host, () => {
  console.log(`Relay server ready at http://${host}:${port}`)
  console.log(`Agent engine: ${config.apiKey && config.agentMode !== 'fallback' ? config.model : 'local-demo'}`)
})
