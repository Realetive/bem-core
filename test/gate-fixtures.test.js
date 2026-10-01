/**
 * Staged-gate meta-test (spec REQ-5 / KC 10 / KC 13): proves the guard's
 * skip/bind/red paths with fixture repository trees BEFORE any of them can be
 * load-bearing, so a green at S6's first binding distinguishes "clean repo"
 * from "broken guard".
 *
 * Fixture states (each a full mini repo run through build/check-bundle-size.mjs
 * via --root):
 *   skip-state        -> exit 0 + SKIP/PREVIEW output
 *   bind-state-clean  -> exit 0 + BINDING output
 *   bind-state-dirty  -> exit 1 (planted jquery byte in the artifact)
 *   red-stale         -> exit 1 (stale allowlist entry: forgotten shrink)
 *   red-addition      -> exit 1 (new jquery consumer without allowlist entry)
 *   red-over-cap      -> exit 1 (artifact gz bytes over the budget cap)
 *
 * The doc fence (build/check-doc-parity.mjs) carries the same first-landing
 * red proof: an anchor-mismatched fixture exits 1, a balanced pair exits 0.
 *
 * NOTE: this file is excluded from the CONST-P1 final predicate's include-set
 * (specs/check-jquery-ratchet.sh) — the planted jquery strings below are
 * fixture payload, not repo imports.
 */

import { describe, it, before, after } from 'node:test';
import { strict as assert } from 'node:assert';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import process from 'node:process';

const ROOT = resolve(import.meta.dirname, '..');

const CLEAN_ARTIFACT = [
    '// fixture artifact — no jquery inside',
    'export const fixture = true;',
].join('\n');

const DIRTY_ARTIFACT = [
    '// fixture artifact with a planted jquery byte',
    'export const marker = "jQuery requires a window with a document";',
    'export const fixture = true;',
].join('\n');

const BIG_ARTIFACT = `export const padding = "${'x'.repeat(4096)}";\n`;

function writeFixture(dir, state) {
    const {
        allowEntries = [],
        wrapper = false,
        pkgJquery = false,
        depsConsumer = false,
        artifact = CLEAN_ARTIFACT,
        artifactGzCap = 4096,
    } = state;

    mkdirSync(join(dir, 'specs'), { recursive: true });
    mkdirSync(join(dir, 'dist'), { recursive: true });
    mkdirSync(join(dir, 'common.blocks'), { recursive: true });

    writeFileSync(join(dir, 'package.json'), JSON.stringify({
        name: 'bem-core-fixture',
        type: 'module',
        ...(pkgJquery ? { peerDependencies: { jquery: '^4.0.0' } } : {}),
    }, null, 2));

    const allowBlock = allowEntries.length > 0
        ? `ALLOW="${allowEntries.join('\n')}"`
        : 'ALLOW=""';
    writeFileSync(join(dir, 'CONSTITUTION.md'), `# fixture constitution\n\n${allowBlock}\n`);

    writeFileSync(join(dir, 'specs', 'bundle-budget.json'), JSON.stringify({
        artifacts: {
            'dist/index.mjs': { gzipCapBytes: artifactGzCap },
        },
    }, null, 2));

    writeFileSync(join(dir, 'specs', 'platform-baseline.txt'), '# fixture baseline (empty)\n');

    writeFileSync(join(dir, 'dist', 'index.mjs'), artifact);

    if (wrapper) {
        mkdirSync(join(dir, 'common.blocks', 'jquery'), { recursive: true });
        writeFileSync(join(dir, 'common.blocks', 'jquery', 'jquery.js'),
            'export default null;\n');
    }
    if (depsConsumer) {
        mkdirSync(join(dir, 'common.blocks', 'dom'), { recursive: true });
        writeFileSync(join(dir, 'common.blocks', 'dom', 'dom.deps.js'),
            '({ shouldDeps: \'jquery\' })\n');
    }
}

function runGate(fixtureDir, script = 'build/check-bundle-size.mjs') {
    try {
        const stdout = execFileSync(
            process.execPath,
            [resolve(ROOT, script), '--root', fixtureDir],
            { encoding: 'utf8' }
        );
        return { code: 0, stdout };
    } catch (error) {
        return { code: error.status ?? 1, stdout: (error.stdout || '') + (error.stderr || '') };
    }
}

describe('staged-gate meta-test (fixture repo trees)', function() {
    let scratch;

    before(function() {
        scratch = mkdtempSync(join(tmpdir(), 'bem-gate-fixtures-'));
    });

    after(function() {
        rmSync(scratch, { recursive: true, force: true });
    });

    function fixtureDir(name) {
        const dir = join(scratch, name);
        mkdirSync(dir, { recursive: true });
        return dir;
    }

    it('skip-state: exit 0 + SKIP/PREVIEW output', function() {
        const dir = fixtureDir('skip');
        writeFixture(dir, {
            allowEntries: ['common.blocks/dom/dom.deps.js'],
            depsConsumer: true,
            wrapper: true,
            pkgJquery: true,
        });
        const result = runGate(dir);
        assert.strictEqual(result.code, 0, `expected exit 0, got:\n${result.stdout}`);
        assert.match(result.stdout, /SKIP\/PREVIEW/);
        assert.match(result.stdout, /OK/);
    });

    it('bind-state-clean: exit 0 + BINDING output', function() {
        const dir = fixtureDir('bind-clean');
        writeFixture(dir, {
            allowEntries: [],
            wrapper: false,
            pkgJquery: false,
        });
        const result = runGate(dir);
        assert.strictEqual(result.code, 0, `expected exit 0, got:\n${result.stdout}`);
        assert.match(result.stdout, /BINDING/);
        assert.match(result.stdout, /final assertions: clean/);
    });

    it('bind-state-dirty (planted jquery artifact byte): exit 1', function() {
        const dir = fixtureDir('bind-dirty');
        writeFixture(dir, {
            allowEntries: [],
            wrapper: false,
            pkgJquery: false,
            artifact: DIRTY_ARTIFACT,
        });
        const result = runGate(dir);
        assert.strictEqual(result.code, 1, `expected exit 1, got:\n${result.stdout}`);
        assert.match(result.stdout, /no-jquery-in-artifact/);
    });

    it('bidirectional-ratchet red: stale allowlist entry -> exit 1', function() {
        const dir = fixtureDir('red-stale');
        writeFixture(dir, {
            allowEntries: [
                'common.blocks/dom/dom.deps.js',
                'common.blocks/gone/gone.deps.js',
            ],
            depsConsumer: true,
            wrapper: true,
            pkgJquery: true,
        });
        const result = runGate(dir);
        assert.strictEqual(result.code, 1, `expected exit 1, got:\n${result.stdout}`);
        assert.match(result.stdout, /stale allowlist entries.*forgotten shrinks/);
    });

    it('ratchet red: new jquery consumer without an allowlist entry -> exit 1', function() {
        const dir = fixtureDir('red-addition');
        writeFixture(dir, {
            allowEntries: [],
            depsConsumer: true,
            wrapper: true,
            pkgJquery: true,
        });
        const result = runGate(dir);
        assert.strictEqual(result.code, 1, `expected exit 1, got:\n${result.stdout}`);
        assert.match(result.stdout, /new jquery consumers/);
    });

    it('first-landing red proof: artifact over the gz cap -> exit 1', function() {
        const dir = fixtureDir('red-over-cap');
        writeFixture(dir, {
            allowEntries: ['common.blocks/dom/dom.deps.js'],
            depsConsumer: true,
            wrapper: true,
            pkgJquery: true,
            artifact: BIG_ARTIFACT,
            artifactGzCap: 64,
        });
        const result = runGate(dir);
        assert.strictEqual(result.code, 1, `expected exit 1, got:\n${result.stdout}`);
        assert.match(result.stdout, /gz cap exceeded/);
    });
});

describe('doc fence first-landing red proof (fixture trees)', function() {
    let scratch;

    before(function() {
        scratch = mkdtempSync(join(tmpdir(), 'bem-doc-fence-'));
    });

    after(function() {
        rmSync(scratch, { recursive: true, force: true });
    });

    it('anchor-mismatched en/ru pair -> exit 1', function() {
        const dir = join(scratch, 'mismatch');
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, 'MIGRATION.md'), '# Migration\n\n## Unreleased\n\n### S0 one\n\n### S0 two\n');
        writeFileSync(join(dir, 'MIGRATION.ru.md'), '# Миграция\n\n## Unreleased\n\n### S0 один\n');
        const result = runGate(dir, 'build/check-doc-parity.mjs');
        assert.strictEqual(result.code, 1, `expected exit 1, got:\n${result.stdout}`);
        assert.match(result.stdout, /MIGRATION\.md .* != .*MIGRATION\.ru\.md/);
    });

    it('balanced en/ru pair -> exit 0', function() {
        const dir = join(scratch, 'balanced');
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, 'MIGRATION.md'), '# Migration\n\n## Unreleased\n\n### S0 one\n');
        writeFileSync(join(dir, 'MIGRATION.ru.md'), '# Миграция\n\n## Unreleased\n\n### S0 один\n');
        const result = runGate(dir, 'build/check-doc-parity.mjs');
        assert.strictEqual(result.code, 0, `expected exit 0, got:\n${result.stdout}`);
        assert.match(result.stdout, /OK/);
    });
});
