/**
 * Doc-parity fence (spec REQ-11): asserts en↔ru anchor-count equality on
 * `^#{2,3} ` headings for the MIGRATION(.ru) and CHANGELOG(.ru) pairs.
 * Bilingual drift reddens here per commit (CI build job from S0).
 *
 * Usage: node build/check-doc-parity.mjs [--root <dir>]
 *   --root runs the fence against another (fixture) repository tree.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
let root = resolve(import.meta.dirname, '..');
{
    const rootIndex = args.indexOf('--root');
    if (rootIndex !== -1 && args[rootIndex + 1]) {
        root = resolve(args[rootIndex + 1]);
    }
}

const PAIRS = [
    ['MIGRATION.md', 'MIGRATION.ru.md'],
    ['CHANGELOG.md', 'CHANGELOG.ru.md'],
];

function anchorCount(text) {
    return (text.match(/^#{2,3} /gm) || []).length;
}

const problems = [];
let checked = 0;

for (const [enFile, ruFile] of PAIRS) {
    const enPath = join(root, enFile);
    const ruPath = join(root, ruFile);
    const enExists = existsSync(enPath);
    const ruExists = existsSync(ruPath);
    if (!enExists && !ruExists) continue; // pair absent in fixture trees
    if (!enExists || !ruExists) {
        problems.push(`doc-parity: ${enExists ? ruFile : enFile} is missing its ${enExists ? 'en' : 'ru'} counterpart`);
        continue;
    }
    const enCount = anchorCount(readFileSync(enPath, 'utf8'));
    const ruCount = anchorCount(readFileSync(ruPath, 'utf8'));
    checked++;
    if (enCount !== ruCount) {
        problems.push(`doc-parity: ${enFile} (${enCount} anchors) != ${ruFile} (${ruCount} anchors)`);
    } else {
        console.log(`[doc-parity] ok: ${enFile} <-> ${ruFile} (${enCount} anchors each)`);
    }
}

if (checked === 0) {
    console.log('[doc-parity] no fenced pairs found (nothing to check)');
}

if (problems.length > 0) {
    console.error('[doc-parity] FAIL');
    for (const problem of problems) console.error(`[doc-parity] - ${problem}`);
    process.exit(1);
}
console.log('[doc-parity] OK');
process.exit(0);
