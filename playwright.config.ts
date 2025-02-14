import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  timeout: 150000,
  workers: process.env.CI ? 2 : 8, 

  use: {
    actionTimeout: 15000,
    headless: false,
    browserName: 'chromium',
    baseURL: process.env.BASE_URL || 'https://computracedevweb.thermon.com/', 
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    trace: 'on'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  reporter: [
    ['list'],
    ['html', { outputFolder: 'html-report' }], 
    ['junit', { outputFile: 'test-results/junit-results.xml' }],
  ],

  outputDir: 'test-results',
});
