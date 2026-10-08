/**
 * @module ua
 * @description Deprecated alias forwarding to env (one-release Proxy, removed in 6.1.0)
 * @deprecated Use `import env from 'bem:env'` instead
 */

import env from 'bem:env';

const FORWARDED = new Set([
    'ua', 'platform', 'ios', 'android', 'browser', 'screenSize', 'svg',
    'width', 'height', 'landscape'
]);

const PLATFORM_KEYS = new Set(['bada', 'wp', 'other']);
const BROWSER_KEYS = new Set(['opera', 'chrome']);

const warned = new Set();

const ua = new Proxy({}, {
    get(_target, prop) {
        if(typeof prop === 'symbol') return undefined;

        if(FORWARDED.has(prop)) return env[prop];

        if(PLATFORM_KEYS.has(prop)) return env.platform[prop];
        if(BROWSER_KEYS.has(prop)) return env.browser[prop];

        if(!warned.has(prop)) {
            warned.add(prop);
            console.warn(`ua.${prop} is removed; migrate to env (see MIGRATION.md S1)`);
        }
        return undefined;
    },

    set(_target, prop) {
        if(typeof prop !== 'symbol' && !warned.has(`set:${prop}`)) {
            warned.add(`set:${prop}`);
            console.warn(`ua.${prop} is read-only (deprecated alias); migrate to env`);
        }
        return true;
    }
});

export default ua;
