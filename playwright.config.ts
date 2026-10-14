import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  timeout: 60000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: process.env.PLAYWRIGHT_PRODUCTION
      ? 'http://127.0.0.1:5174'
      : 'http://127.0.0.1:5173',
    trace: 'retain-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : {},
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
