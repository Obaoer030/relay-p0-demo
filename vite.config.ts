import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import { relayServerPlugin } from './server/relayServerPlugin.ts'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), relayServerPlugin({ apiKey: env.MINIMAX_API_KEY, baseUrl: env.MINIMAX_BASE_URL || 'https://api.minimaxi.com/v1', model: env.MINIMAX_MODEL || 'MiniMax-M2.7', agentMode: env.RELAY_AGENT_MODE === 'fallback' ? 'fallback' : 'auto' })],
    test: {
      environment: 'jsdom',
      include: ['src/**/*.test.{ts,tsx}'],
      setupFiles: ['./src/test/setup.ts'],
    },
    server: { host: '0.0.0.0' },
    preview: { host: '0.0.0.0' },
  }
})
