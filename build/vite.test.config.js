import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import bemLevels from './plugins/vite-plugin-bem-levels.js';

const rootDir = resolve(import.meta.dirname, '..');

export default defineConfig({
    root: rootDir,

    plugins: [
        bemLevels({
            // Use desktop platform for browser tests
            platform: 'desktop',
            levels: {
                common: ['common.blocks'],
                desktop: ['common.blocks', 'desktop.blocks'],
                touch: ['common.blocks', 'touch.blocks'],
            },
            rootDir,
        }),
    ],

    // NOTE: jQuery is NOT external here — it must be bundled into the test page.
    // (In the production build it's a peerDependency / external.)
    resolve: {
        alias: {},
    },

    server: {
        port: 5174,
        open: false,
        // Dual-stack loopback: the loader CORS spec loads the same fixture
        // through the other loopback literal (localhost <-> 127.0.0.1),
        // which is a different origin that the dev server must reject —
        // needs both families bound to reject for CORS rather than for an
        // unreachable target.
        host: '::',
        // No CORS headers: the dev server would otherwise reflect loopback
        // origins, and the loader's cross-origin rejection spec could never
        // fire. Same-origin page operation is unaffected.
        cors: false,
    },

    // Polyfill Node.js globals used by mocha's browser-entry.js
    define: {
        'process.env.NODE_ENV': JSON.stringify('test'),
        'process.env': JSON.stringify({ NODE_ENV: 'test' }),
        'process.stdout': 'null',
        'process.version': JSON.stringify('v22.0.0'),
        global: 'globalThis',
    },

    optimizeDeps: {
        include: ['chai', 'sinon', 'sinon-chai', 'jquery'],
    },
});
