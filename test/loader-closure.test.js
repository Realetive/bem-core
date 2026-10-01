/**
 * S3 closure predicates (bc-ilml) — loader slice, D-16 / Q7:
 *
 *  - `loader_type_js` mod path deleted outright (no one-release bridge):
 *    zero live references repo-wide.
 *  - `loader_type_bundle` deleted (dead ym format): zero live references.
 *  - loader source contains a dynamic `import(` — the import()-based loader.
 *  - CORS audit (plan-review-2 F3): zero `https?://` literals across loader
 *    call sites + spec fixtures — cross-origin callers would need CORS on
 *    the target and must be surfaced, not hidden in fixtures/docs.
 *
 * Scope: every repo file except the deliberate record-keepers — MIGRATION(.ru)
 * and CHANGELOG(.ru) are append-only history that must name old paths (the
 * documented-migration half of D-16); `specs/` carries frozen historical
 * artifacts (the approved S0 spec, the pre-S0 platform baselines); `PLAN.md`
 * is the frozen pre-migration planning document; and two mechanical
 * exceptions — this checker itself, plus `test/platform-entries.test.js`
 * whose S3 divergence map names what it subtracts from the frozen baseline.
 * Build output (dist/) and node_modules are out of scope.
 */

import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync, readdirSync, statSync, realpathSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');

const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'docs']);
const RECORD_KEEPERS = [
    'MIGRATION.md',
    'MIGRATION.ru.md',
    'CHANGELOG.md',
    'CHANGELOG.ru.md',
    'PLAN.md',
    'specs', // frozen historical artifacts (approved specs, pre-S0 baselines)
    'test/loader-closure.test.js', // this checker — names what it forbids
    'test/platform-entries.test.js', // S3 divergence map — names what it subtracts
];

function isRecordKeeper(relPath) {
    return RECORD_KEEPERS.some((keeper) =>
        keeper.includes('.') ? relPath === keeper : relPath.startsWith(keeper + '/')
    );
}

function collectFiles(dir, files = [], seen = new Set()) {
    for (const entry of readdirSync(dir)) {
        if (SKIP_DIRS.has(entry)) continue;
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath); // follows symlinks (common.docs/*)
        if (stat.isDirectory()) {
            collectFiles(fullPath, files, seen);
        } else if (stat.isFile()) {
            const real = realpathSync(fullPath);
            if (seen.has(real)) continue;
            seen.add(real);
            // Record-keeper status is decided on the real path, so the
            // common.docs/* symlinks to CHANGELOG/MIGRATION/README are
            // excluded together with their targets instead of double-read.
            const rel = relative(ROOT, real);
            if (!isRecordKeeper(rel)) files.push({ fullPath: real, rel });
        }
    }
    return files;
}

describe('S3 loader closure predicates', function() {
    const files = collectFiles(ROOT);

    it('zero live `loader_type_js` references repo-wide (D-16)', function() {
        const hits = files.filter(({ fullPath }) =>
            readFileSync(fullPath, 'utf8').includes('loader_type_js'));
        assert.deepStrictEqual(hits.map((f) => f.rel), [],
            'loader_type_js was deleted outright — only MIGRATION(.ru)/specs/ history may name it');
    });

    it('zero live `loader_type_bundle` references repo-wide (Q7)', function() {
        const hits = files.filter(({ fullPath }) =>
            readFileSync(fullPath, 'utf8').includes('loader_type_bundle'));
        assert.deepStrictEqual(hits.map((f) => f.rel), [],
            'loader_type_bundle was deleted — only MIGRATION(.ru)/specs/ history may name it');
    });

    it('loader source contains dynamic import(', function() {
        const source = readFileSync(resolve(ROOT, 'common.blocks/loader/loader.js'), 'utf8');
        assert.match(source, /import\s*\(/,
            'the loader must be import()-based');
    });

    it('CORS audit: zero absolute http(s) literals across loader call sites and fixtures', function() {
        const scope = files.filter(({ rel }) =>
            rel.startsWith('common.blocks/loader/') || rel.startsWith('test/browser/'));
        const hits = scope.filter(({ fullPath }) =>
            /https?:\/\//.test(readFileSync(fullPath, 'utf8')));
        assert.deepStrictEqual(hits.map((f) => f.rel), [],
            'cross-origin loader targets must be surfaced for a CORS audit, not embedded as literals');
    });
});
