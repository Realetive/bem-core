import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASELINES_PATH = resolve(import.meta.dirname, '../specs/bench-baselines.json');
const baselines = JSON.parse(readFileSync(BASELINES_PATH, 'utf8'));

test('bench B1-B5 within ratio of v5-base', async ({ page }) => {
    await page.goto('/test/bench/index.html');

    await page.waitForFunction(
        () => window.__benchResults !== undefined,
        { timeout: 240_000 }
    );

    const results = await page.evaluate(() => window.__benchResults);

    const violations = [];
    const observed = {};
    for(const [metric, rule] of Object.entries(baselines.metrics)) {
        const current = results[metric];
        observed[metric] = current;
        if(typeof current !== 'number' || Number.isNaN(current)) {
            violations.push(`${metric}: no measurement (${current})`);
        } else if(rule.maxAbsoluteBytes !== undefined) {
            if(current > rule.maxAbsoluteBytes) {
                violations.push(`${metric}: ${current} bytes > absolute cap ${rule.maxAbsoluteBytes}`);
            }
        } else if(current / rule.baseline > rule.maxRatio) {
            violations.push(
                `${metric}: ${current} vs v5-base ${rule.baseline} ` +
                `(ratio ${(current / rule.baseline).toFixed(3)} > ${rule.maxRatio})`);
        }
    }

    console.log('[bench] observed:', JSON.stringify(observed));
    expect(violations, `bench ratio gate exceeded vs v5-base:\n  ${violations.join('\n  ')}`).toEqual([]);
});
