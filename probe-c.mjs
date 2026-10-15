import { chromium } from '@playwright/test'
const browser = await chromium.launch()
const page = await browser.newPage()
page.on('pageerror', e => console.log('[pageerror]', e.message.slice(0, 300)))
page.on('console', m => { if(m.type()==='error') console.log('[err]', m.text().slice(0, 300)) })
await page.goto('http://localhost:5174/test/browser/index.html')
try { await page.waitForFunction(() => window.__testResults !== undefined, { timeout: 40000 }) } catch {}
const r = await page.evaluate(() => window.__testResults)
console.log('results:', JSON.stringify(r))
const fails = await page.evaluate(() => window.__testFailures ?? [])
console.log('fails:', JSON.stringify(fails.slice(0, 8), null, 1))
await browser.close()
