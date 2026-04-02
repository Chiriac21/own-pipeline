import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/client',

  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },

  webServer: {
    command: 'npm run dev:test',
    url: 'http://localhost:5173',
    reuseExistingServer: false,
    timeout: 120 * 1000,
  },
})