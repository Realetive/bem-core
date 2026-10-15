import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import bemLevels from './plugins/vite-plugin-bem-levels.js';

const rootDir = resolve(import.meta.dirname, '..');

export default defineConfig(({ mode }) => {
    const platform = process.env.BEM_PLATFORM || 'desktop';

    return {
        root: rootDir,

        plugins: [
            bemLevels({
                platform,
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
                entry: resolve(import.meta.dirname, 'platforms', `${platform}.gen.js`),
                name: 'bemCore',
                formats: ['es'],
                fileName: (format) => `bem-core.mjs`,
            },
            outDir: resolve(rootDir, 'dist', platform),
            emptyOutDir: true,
            sourcemap: true,
            minify: mode === 'production',
        },

        server: {
            open: false,
        },
    };
});
