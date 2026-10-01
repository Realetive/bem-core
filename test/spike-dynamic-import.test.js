/**
 * Timeboxed dynamic-import spike (spec REQ-8): exercises `import(variable)`
 * through the lib build (rolldown) and the dev-server test config, and pins
 * the smoke assertions:
 *   - the generated platform entry resolves through both build paths;
 *   - one narrowed deep-import fails to resolve through the dev-server test
 *     config (the Vite half of the exports-narrowing tripwire).
 * Findings are recorded in the dated Decision record section of
 * specs/bc-ysp7.md (cited by S3).
 */

import { describe, it, before, after } from 'node:test';
import { strict as assert } from 'node:assert';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { build } from 'vite';
import bemLevels from '../build/plugins/vite-plugin-bem-levels.js';

const ROOT = resolve(import.meta.dirname, '..');

function plugin() {
    return bemLevels({
        platform: 'desktop',
        levels: {
            common: ['common.blocks'],
            desktop: ['common.blocks', 'desktop.blocks'],
            touch: ['common.blocks', 'touch.blocks'],
        },
        rootDir: ROOT,
    });
}

async function buildFixture(entryFile, outDir) {
    const output = await build({
        root: ROOT,
        configFile: false,
        logLevel: 'warn',
        plugins: [plugin()],
        build: {
            lib: { entry: entryFile, name: 'spike', formats: ['es'], fileName: () => 'spike.mjs' },
            outDir,
            emptyOutDir: true,
            sourcemap: false,
            minify: false,
            rolldownOptions: { external: ['jquery'] },
        },
    });
    return output;
}

describe('spike: dynamic import(variable) through the lib build (rolldown)', function() {
    let scratch;

    before(function() { scratch = mkdtempSync(join(tmpdir(), 'bem-spike-build-')); });
    after(function() { rmSync(scratch, { recursive: true, force: true }); });

    it('builds and preserves import(variable) verbatim for runtime URLs', async function() {
        const entry = join(scratch, 'dyn-variable.mjs');
        writeFileSync(entry, [
            'const url = "./dyn-target.js";',
            'const mod = await import(url);',
            'export default mod;',
            '',
        ].join('\n'));
        writeFileSync(join(scratch, 'dyn-target.js'), 'export const marker = "dyn-ok";\n');
        await buildFixture(entry, join(scratch, 'out-variable'));
        const artifact = join(scratch, 'out-variable', 'spike.mjs');
        const { readFileSync } = await import('node:fs');
        const code = readFileSync(artifact, 'utf8');
        assert.match(code, /import\(/, 'rolldown must preserve the dynamic import');
        // The runtime-only specifier is NOT pre-resolved/inlined.
        assert.ok(!code.includes('dyn-ok'),
            'runtime-only dynamic import must not be pre-bundled/inlined');
    });

    it('dynamic import with a static bem: specifier resolves through the build', async function() {
        const entry = join(scratch, 'dyn-bem.mjs');
        writeFileSync(entry, [
            'const events = await import("bem:events");',
            'export default events;',
            '',
        ].join('\n'));
        await buildFixture(entry, join(scratch, 'out-bem'));
        const { readFileSync } = await import('node:fs');
        const code = readFileSync(join(scratch, 'out-bem', 'spike.mjs'), 'utf8');
        assert.ok(!code.includes('"bem:events"'),
            'the bem: specifier must be resolved away, not left for the runtime');
        // rolldown code-splits the dynamic import into a chunk — the chunk
        // carries the resolved module payload.
        const chunkMatch = code.match(/import\("(\.\/[^"]+\.js)"\)/);
        assert.ok(chunkMatch, 'dynamic import must reference a resolved chunk');
        const chunkCode = readFileSync(join(scratch, 'out-bem', chunkMatch[1]), 'utf8');
        assert.match(chunkCode, /Emitter/, 'the resolved chunk must carry bem:events');
    });

    it('the generated platform entry resolves through the lib build', async function() {
        const outDir = join(scratch, 'out-gen-entry');
        await buildFixture(resolve(ROOT, 'build/platforms/desktop.gen.js'), outDir);
        const { readFileSync, existsSync } = await import('node:fs');
        assert.ok(existsSync(join(outDir, 'spike.mjs')), 'entry artifact must be emitted');
        assert.match(readFileSync(join(outDir, 'spike.mjs'), 'utf8'), /declBlock|BEMDOM|provide/,
            'the generated entry graph must carry the block registration payload');
    });
});

describe('spike: dev-server test config', function() {
    let scratch;
    let server;
    let port;
    let probeDir;

    before(function() { scratch = mkdtempSync(join(tmpdir(), 'bem-spike-dev-')); });

    after(function() {
        if (server) {
            try { server.kill('SIGTERM'); } catch { /* already gone */ }
        }
        rmSync(scratch, { recursive: true, force: true });
        if (probeDir) rmSync(probeDir, { recursive: true, force: true });
    });

    async function startServer() {
        server = spawn(process.execPath,
            [join(ROOT, 'node_modules', '.bin', 'vite'), '--config', 'build/vite.test.config.js', '--port', '5273'],
            { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
        await new Promise((resolveReady, rejectReady) => {
            const timer = setTimeout(() => rejectReady(new Error('dev server did not start in 30s')), 30000);
            const onData = (chunk) => {
                const match = String(chunk).match(/Local:\s+http:\/\/(?:localhost|127\.0\.0\.1):(\d+)/);
                if (match) {
                    port = Number(match[1]);
                    clearTimeout(timer);
                    resolveReady();
                }
            };
            server.stdout.on('data', onData);
            server.stderr.on('data', onData);
            server.on('exit', (code) => rejectReady(new Error(`dev server exited early: ${code}`)));
        });
    }

    async function fetchStatus(pathname) {
        const response = await fetch(`http://localhost:${port}${pathname}`);
        const body = await response.text();
        return { status: response.status, body };
    }

    it('the generated entry resolves through the dev-server test config', async function() {
        await startServer();
        const result = await fetchStatus('/build/platforms/desktop.gen.js');
        assert.strictEqual(result.status, 200,
            `generated entry must be served; got ${result.status}: ${result.body.slice(0, 400)}`);
        assert.match(result.body, /import\s+"\/@id\/__x00__bem:/,
            'bem: imports must be rewritten to plugin virtual-module URLs');
    });

    it('one narrowed deep-import fails to resolve through the dev-server (Vite tripwire half)', async function() {
        // A transient probe module inside the package (self-reference lookup
        // hits the narrowed exports map) — removed in after().
        probeDir = join(ROOT, 'test', '.spike-tmp');
        mkdirSync(probeDir, { recursive: true });
        const probe = join(probeDir, 'deep-import-probe.js');
        writeFileSync(probe, "import 'bem-core/desktop.blocks/ua/ua.js';\nexport const probe = true;\n");

        const result = await fetchStatus('/test/.spike-tmp/deep-import-probe.js');
        assert.notStrictEqual(result.status, 200,
            'the narrowed deep-import must NOT resolve through the dev server');
        assert.match(result.body, /ERR_PACKAGE_PATH_NOT_EXPORTED|is not exported|Failed to resolve import/,
            `expected an exports-map rejection, got ${result.status}: ${result.body.slice(0, 400)}`);
    });

    it('import(variable) survives transform through the dev server', async function() {
        const probe = join(probeDir, 'dyn-import-probe.js');
        writeFileSync(probe, [
            'const url = "./deep-import-probe.js";',
            'const mod = await import(url);',
            'export default mod;',
            '',
        ].join('\n'));
        const result = await fetchStatus('/test/.spike-tmp/dyn-import-probe.js');
        assert.strictEqual(result.status, 200,
            `probe must be served; got ${result.status}: ${result.body.slice(0, 400)}`);
        assert.match(result.body, /import\(/, 'dynamic import must be preserved by the dev transform');
    });
});
