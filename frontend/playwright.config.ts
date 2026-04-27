/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/specs',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }]
  ],
  use: {
    baseURL: process.env['PW_BASE_URL'] ?? 'http://localhost:4200',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1440, height: 900 }
  },
  webServer: [
    {
      command: 'mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=e2e"',
      url: 'http://localhost:8080/api/auth/login',
      cwd: '../backend',
      reuseExistingServer: !process.env['CI'],
      timeout: 240_000
    },
    {
      command: 'npm start -- --host localhost --port 4200',
      url: 'http://localhost:4200',
      cwd: '.',
      reuseExistingServer: !process.env['CI'],
      timeout: 180_000
    }
  ],
  expect: {
    timeout: 10_000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
