import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: 'src/scenarios',
  timeout: 120000,
  globalTimeout: 10 * 60 * 1000,
  forbidOnly: !!process.env.CI,
  retries: 0,
  outputDir: 'artifacts/media',
  use: {
    trace: 'retain-on-failure',
    browserName: 'chromium',
    locale: 'pt-BR',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'off'
  },
  expect: {
    timeout: 30000
  },
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: 'artifacts/report',
        open: 'never'
      }
    ]
  ]
};
export default config;
