/**
 * API pin test (spec REQ-2): pins the supported deep-import inventory
 * (design doc "Supported deep-import inventory") so CONST-P4 is mechanically
 * enforceable — any export-surface change that isn't accompanied by a pin
 * update + MIGRATION entry reddens here.
 *
 * Notes recorded by this test (OQ dispositions):
 *  - `env` is an S1 artifact: not part of the pinned set until S1 lands.
 *  - `ua` JS is platform-only (desktop.blocks/touch.blocks): never pinned.
 *  - `loader` root module (`common.blocks/loader/loader.js`) is the S3
 *    canonical form — the pin flipped from the deleted `_type` mod path to
 *    the root module in S3's own commit (bc-ilml).
 *  - `inherit` is internal-but-tolerated under the `./common.blocks/*`
 *    wildcard (frozen internal per Q4/D-2): NOT part of the public contract;
 *    a future narrowing that removes it needs a CONST-P4 migration note.
 *  - `jquery` paths resolve via the wildcard while the wrapper exists
 *    (tolerated, unpinned); at S6 this test asserts the import rejects.
 *  - `bem.entities` runtime mutation is internal (OQ-7): written by `decl*`
 *    import side effects, never a public export.
 *  - D-6 deleted-path negative tests: expectations flipped in the S0
 *    narrowing commit — root paths beyond `./common.blocks/*` + the
 *    enumerated entries no longer resolve.
 */

import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');

const PINNED_PUBLIC_DEEP_IMPORTS = [
    // i-bem
    'bem-core/common.blocks/i-bem/i-bem.vanilla.js',
    'bem-core/common.blocks/i-bem/__internal/i-bem__internal.vanilla.js',
    'bem-core/common.blocks/i-bem/__collection/i-bem__collection.vanilla.js',
    // i-bem-dom
    'bem-core/common.blocks/i-bem-dom/i-bem-dom.js',
    'bem-core/common.blocks/i-bem-dom/__collection/i-bem-dom__collection.js',
    'bem-core/common.blocks/i-bem-dom/__events/i-bem-dom__events.js',
    'bem-core/common.blocks/i-bem-dom/__events/_type/i-bem-dom__events_type_dom.js',
    'bem-core/common.blocks/i-bem-dom/__events/_type/i-bem-dom__events_type_bem.js',
    'bem-core/common.blocks/i-bem-dom/__init/i-bem-dom__init.js',
    'bem-core/common.blocks/i-bem-dom/__init/_auto/i-bem-dom__init_auto.js',
    // events
    'bem-core/common.blocks/events/events.vanilla.js',
    'bem-core/common.blocks/events/__channels/events__channels.vanilla.js',
    'bem-core/common.blocks/events/__observable/events__observable.js',
    'bem-core/common.blocks/events/__observable/_type/events__observable_type_bem-dom.js',
    // dom
    'bem-core/common.blocks/dom/dom.js',
    'bem-core/common.blocks/env/env.js',
    'bem-core/common.blocks/ua/ua.js',
    // loader (S3 canonical root-module form)
    'bem-core/common.blocks/loader/loader.js',
];

const ENUMERATED_EXPORTS = [
    'bem-core',
    'bem-core/dist/desktop',
    'bem-core/dist/touch',
    'bem-core/build/plugins/vite-plugin-bem-levels.js',
];

const TOLERATED_INTERNAL = [
    // resolves via the ./common.blocks/* wildcard; frozen internal (Q4/D-2)
    'bem-core/common.blocks/inherit/inherit.vanilla.js',
    // resolves while the wrapper exists; S6 asserts the import rejects
    'bem-core/common.blocks/jquery/jquery.js',
];

const DELETED_PATHS = [
    // platform-only JS — never exported
    'bem-core/desktop.blocks/ua/ua.js',
    'bem-core/touch.blocks/ua/ua.js',
    // root paths beyond the exported set (D-6 narrowing)
    'bem-core/test/browser/entry.js',
    'bem-core/eslint.config.js',
    'bem-core/build/platforms/desktop.gen.js',
    'bem-core/build/barrel.js',
    'bem-core/dist/index.mjs',
];

function resolves(specifier) {
    try {
        import.meta.resolve(specifier);
        return true;
    } catch {
        return false;
    }
}

describe('api-pin: supported deep-import inventory', function() {
    for (const specifier of PINNED_PUBLIC_DEEP_IMPORTS) {
        it(`public deep import resolves: ${specifier}`, function() {
            assert.ok(resolves(specifier), `${specifier} must stay resolvable`);
        });
    }

    for (const specifier of ENUMERATED_EXPORTS) {
        it(`enumerated export resolves: ${specifier}`, function() {
            assert.ok(resolves(specifier), `${specifier} must stay resolvable`);
        });
    }

    for (const specifier of TOLERATED_INTERNAL) {
        it(`tolerated-internal path resolves via the wildcard (unpinned): ${specifier}`, function() {
            assert.ok(resolves(specifier),
                `${specifier} is internal-but-tolerated; if this breaks, record a CONST-P4 migration note`);
        });
    }

    for (const specifier of DELETED_PATHS) {
        it(`deleted path rejects (D-6): ${specifier}`, function() {
            assert.ok(!resolves(specifier),
                `${specifier} must NOT resolve after the S0 exports narrowing`);
        });
    }

    it('exports map is narrowed: wildcard is ./common.blocks/*, not ./*', function() {
        const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));
        assert.ok(!('./*' in pkg.exports), 'the "./*" wildcard must be gone');
        assert.ok('./common.blocks/*' in pkg.exports);
        assert.strictEqual(pkg.exports['.'], './dist/index.mjs');
        assert.strictEqual(pkg.exports['./dist/desktop'], './dist/desktop/bem-core.mjs');
        assert.strictEqual(pkg.exports['./dist/touch'], './dist/touch/bem-core.mjs');
    });

    it('barrel exports the six plain DOM-flavor names (D-7) + loader (S3)', function() {
        const barrel = readFileSync(resolve(ROOT, 'build/barrel.js'), 'utf8');
        for (const name of ['bemDom', 'BemDomCollection', 'dom', 'Emitter', 'Event', 'channels', 'env', 'ua']) {
            assert.ok(barrel.includes(name), `barrel must export ${name}`);
        }
        assert.ok(barrel.includes("export { default as loader } from 'bem:loader';"),
            'S3 switched the barrel to the bem:loader root module');
        assert.ok(!barrel.includes('entities'),
            'bem.entities is internal (OQ-7) — never a barrel export');
    });
});
