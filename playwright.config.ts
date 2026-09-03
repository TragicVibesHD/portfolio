import { defineConfig, devices } from '@playwright/test';

// Deliberately NOT 3000. `reuseExistingServer` would otherwise pick up a
// running `next dev` and silently run the whole suite against the dev
// server, where HMR keeps a socket open (so `networkidle` never settles)
// and the tests fail for reasons that have nothing to do with the code.
const PORT = 3100;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // A committed `.only` should fail CI rather than silently skip the suite.
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    baseURL,
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],

  // Tests run against a production build: dev-only warnings, unminified
  // bundles and on-demand compilation make dev-server timings meaningless.
  webServer: {
    command: 'npm run build && npm run start -- --port ' + PORT,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
