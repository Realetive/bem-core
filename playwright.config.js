/* global process */
import { defineConfig } from '@playwright/test';

// Two named projects (S1, spec bc-cah4 REQ-6 / design D-15): `chromium` runs
// today's desktop-resolution suite against the desktop level set (port 5174);
// `chromium-touch` runs the same suite under Playwright touch-device emulation
// (hasTouch, mobile viewport, device UA) against the touch level set
// (port 5175). The touch project is emulation, not a separate engine —
// Chromium-only by design.
const DESKTOP_PORT = 5174;
const TOUCH_PORT = 5175;

// Emulated touch device: a mid-range Android phone profile. The device UA
// intentionally exercises the mobile detection paths (env.platform.android)
// under the touch project, while specs pin specific fixture UAs for the
// detection units themselves.
const TOUCH_DEVICE = {
    userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    viewport: { width: 412, height: 915 },
    isMobile: true,
    hasTouch: true,
};

export default defineConfig({
    testDir: './test',
    testMatch: ['browser.spec.js'],
    timeout: 60_000,
    retries: 1,

    use: {
        browserName: 'chromium',
        headless: true,
    },

    projects: [
        {
            name: 'chromium',
            use: {
                baseURL: `http://localhost:${DESKTOP_PORT}`,
            },
        },
        {
            name: 'chromium-touch',
            use: {
                baseURL: `http://localhost:${TOUCH_PORT}`,
                ...TOUCH_DEVICE,
            },
        },
    ],

    webServer: [
        {
            command: `node node_modules/.bin/vite --config build/vite.test.config.js --port ${DESKTOP_PORT}`,
            url: `http://localhost:${DESKTOP_PORT}/test/browser/index.html`,
            reuseExistingServer: !process.env.CI,
            timeout: 30_000,
        },
        {
            command: `BEM_TEST_PLATFORM=touch BEM_TEST_PORT=${TOUCH_PORT} node node_modules/.bin/vite --config build/vite.test.config.js`,
            url: `http://localhost:${TOUCH_PORT}/test/browser/index.html`,
            reuseExistingServer: !process.env.CI,
            timeout: 30_000,
        },
    ],
});
