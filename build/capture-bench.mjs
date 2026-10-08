import { chromium } from '@playwright/test';

const url = process.argv[2] || 'http://localhost:5174/test/bench/index.html';

const browser = await chromium.launch({ args: ['--js-flags=--expose-gc'] });
const page = await browser.newPage();
page.on('pageerror', err => console.error('[pageerror]', err.message));
await page.goto(url);
await page.waitForFunction(() => window.__benchResults !== undefined, { timeout: 240_000 });
console.log(JSON.stringify(await page.evaluate(() => window.__benchResults), null, 2));
await browser.close();
