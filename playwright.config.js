/* global process */
import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './test',
    timeout: 60_000,
    retries: 1,

    projects: [
        {
            name: 'chromium',
            testMatch: 'browser.spec.js',
            use: {
                browserName: 'chromium',
                headless: true,
                baseURL: 'http://localhost:5174',
            },
        },
        {
            name: 'chromium-touch',
            testMatch: 'browser.spec.js',
            use: {
                browserName: 'chromium',
                headless: true,
                baseURL: 'http://localhost:5175',
                hasTouch: true,
                viewport: { width: 375, height: 667 },
                isMobile: true,
                userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
            },
        },
        {
            name: 'bench',
            testMatch: 'bench.spec.js',
            timeout: 300_000,
            retries: 2,
            use: {
                browserName: 'chromium',
                headless: true,
                baseURL: 'http://localhost:5174',
                launchOptions: { args: ['--js-flags=--expose-gc'] },
            },
        },
    ],

    webServer: [
        {
            command: 'node node_modules/.bin/vite --config build/vite.test.config.js --port 5174',
            url: 'http://localhost:5174/test/browser/index.html',
            reuseExistingServer: !process.env.CI,
            timeout: 30_000,
        },
        {
            command: 'BEM_TEST_PLATFORM=touch BEM_TEST_PORT=5175 node node_modules/.bin/vite --config build/vite.test.config.js --port 5175',
            url: 'http://localhost:5175/test/browser/index.html',
            reuseExistingServer: !process.env.CI,
            timeout: 30_000,
        },
    ],
});
