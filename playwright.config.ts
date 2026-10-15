import { defineConfig } from '@playwright/test'

import { existsSync } from 'node:fs'

const defaultChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const chromePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || (existsSync(defaultChrome) ? defaultChrome : undefined)

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  workers: 2,
  timeout: 60000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: process.env.PLAYWRIGHT_PRODUCTION
      ? 'http://127.0.0.1:5174'
      : 'http://127.0.0.1:5173',
    trace: 'retain-on-failure',
    launchOptions: chromePath ? { executablePath: chromePath } : {},
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 900 } } },
    { name: 'mobile', use: { viewport: { width: 375, height: 812 } } },
  ],
  webServer: {
    command: process.env.PLAYWRIGHT_PRODUCTION
      ? 'bun run preview --host 127.0.0.1 --port 5174 --strictPort'
      : 'bun run dev --host 127.0.0.1 --port 5173 --strictPort',
    url: process.env.PLAYWRIGHT_PRODUCTION
      ? 'http://127.0.0.1:5174'
      : 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
  },
})
