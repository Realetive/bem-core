import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const MAX_ALLOWED_FAILURES = 0;

const LEDGER_PATH = resolve(import.meta.dirname, '../specs/spec-files.txt');
const LEDGERED_FILES = readFileSync(LEDGER_PATH, 'utf8')
    .split('\n')
    .filter(line => line.length > 0);

test('bem-core browser spec tests', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', err => {
        pageErrors.push(`[pageerror] ${err.message}`);
    });
    page.on('console', msg => {
        if (msg.type() === 'warn' || msg.type() === 'error') {
            console.log(`[browser:${msg.type()}] ${msg.text()}`);
        }
    });

    await page.goto('/test/browser/index.html');

    // Wait for mocha to finish (window.__testResults is set in the run callback)
    await page.waitForFunction(
        () => window.__testResults !== undefined,
        { timeout: 50_000 }
    ).catch(async () => {
        const errors = await page.evaluate(() => window.__testFailures ?? []);
        const info = [
            ...pageErrors,
            ...errors.map(f => `FAIL: ${f.title}\n  ${f.err}`),
        ].join('\n');
        throw new Error(`Mocha did not finish within timeout.\n${info}`);
    });

    const [{ failures, total, passed, pending }, inventory] = await Promise.all([
        page.evaluate(() => window.__testResults),
        page.evaluate(() => window.__specInventory),
    ]);

    // Per-file registration accounting (OQ-11): every ledgered spec file must
    // load without error — a module-load failure must never silently shrink
    // the suite.
    expect(inventory.failed, 'spec module load failures').toEqual([]);
    const loaded = [...inventory.loaded].sort();
    const ledgered = LEDGERED_FILES.map(f => '/' + f).sort();
    expect(loaded, 'loaded spec files match the committed ledger').toEqual(ledgered);

    // Loose liveness floor (OQ-11): replaces the former magic >400 count.
    expect(total, 'mocha should have run tests').toBeGreaterThan(450);

    if (failures > MAX_ALLOWED_FAILURES) {
        const failDetails = await page.evaluate(() => window.__testFailures ?? []);
        const details = failDetails
            .map(f => `  ✗ ${f.title}\n    ${f.err}`)
            .join('\n');
        expect(
            failures,
            `Too many failures: ${failures}/${total} (max allowed: ${MAX_ALLOWED_FAILURES}).\n` +
            `Passed: ${passed}, pending: ${pending}\n${details}`
        ).toBeLessThanOrEqual(MAX_ALLOWED_FAILURES);
    }

    console.log(`Browser tests: ${passed} passed, ${failures} failed, ${total} total`);
    expect(failures).toBeLessThanOrEqual(MAX_ALLOWED_FAILURES);
});
