/// <reference types="node" />
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4200'
  }
  ,
  webServer: [
    {
      command: 'mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=e2e"',
      url: 'http://localhost:8080/api/auth/login',
      cwd: '../backend',
      reuseExistingServer: true,
      timeout: 240000
    }
    ,
    {
      command: 'npm start -- --host localhost --port 4200',
      url: 'http://localhost:4200',
      cwd: '.',
      reuseExistingServer: true,
      timeout: 180000
    }
  ]
  ,
  globalTimeout: 300_000,
  projects: [
    {
      name: 'chromium',
      use: {}
    }
  ]
});
