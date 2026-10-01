import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import bemLevels from './plugins/vite-plugin-bem-levels.js';

const rootDir = resolve(import.meta.dirname, '..');

export default defineConfig(({ mode }) => ({
    root: rootDir,

    plugins: [
        bemLevels({
            // The barrel is platform-neutral: resolve bem: modules against
            // common.blocks only — no platform overrides leak into it.
            platform: 'common',
            levels: {
                common: ['common.blocks'],
                desktop: ['common.blocks', 'desktop.blocks'],
                touch: ['common.blocks', 'touch.blocks'],
            },
            rootDir,
        }),
    ],

    build: {
        lib: {
            entry: resolve(import.meta.dirname, 'barrel.js'),
            name: 'bemCore',
            formats: ['es'],
            fileName: () => 'index.mjs',
        },
        outDir: resolve(rootDir, 'dist'),
        // dist/desktop and dist/touch are built first — do not wipe them.
        emptyOutDir: false,
        sourcemap: true,
        minify: mode === 'production',
        rolldownOptions: {
            external: ['jquery'],
        },
    },
}));
