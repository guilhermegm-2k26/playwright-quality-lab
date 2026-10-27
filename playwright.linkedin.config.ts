import { defineConfig } from '@playwright/test';
import config from './playwright.config';

export default defineConfig({
  ...config,
  testMatch: '**/LinkedIn.spec.ts',
  testIgnore: [],
  workers: 1,
  outputDir: 'artifacts/linkedin/media',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'artifacts/linkedin/report', open: 'never' }]
  ]
});
