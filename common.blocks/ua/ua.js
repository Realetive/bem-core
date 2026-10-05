/**
 * @module ua
 * @description Deprecated alias of the `env` module (design D-13): one-release
 * live-forwarding Proxy. Reads of the forwarded fields (`ua`, `platform`,
 * `ios`, `android`, `bada`, `wp`, `other`, `browser`, `opera`, `chrome`,
 * `screenSize`, `svg`, `width`, `height`, `landscape`) return the current
 * `env` values; reads of removed fields — `msie`, `webkit`, `safari`,
 * `mozilla`, `version`, `iphone`, `ipad`, `dpr`, `flash`, `connection`,
 * `video` (any non-forwarded, non-symbol key) — warn once per field and
 * return `undefined`; assignments warn once and no-op; symbol-keyed reads
 * never warn. The contract is property-read access only: destructuring and
 * spread snapshots are unsupported by design. The alias ships in 6.0.0 and is
 * removed in the first post-series release — migrate to `bem:env`.
 */

import env from 'bem:env';

const FORWARDED = {
    ua : () => env.ua,
    platform : () => env.platform,
    ios : () => env.ios,
    android : () => env.android,
    bada : () => env.platform.bada,
    wp : () => env.platform.wp,
    other : () => env.platform.other,
    browser : () => env.browser,
    opera : () => env.browser.opera,
    chrome : () => env.browser.chrome,
    screenSize : () => env.screenSize,
    svg : () => env.svg,
    width : () => env.width,
    height : () => env.height,
    landscape : () => env.landscape
};

const warned = new Set();

function warnOnce(key, action) {
    if(warned.has(key)) return;

    warned.add(key);
    console.warn(
        `ua.${key}: ${action} — the field is not forwarded by the deprecated ua alias; ` +
        'read the env module (bem:env) instead. The ua alias is removed in the next release.');
}

const hasOwn = Object.prototype.hasOwnProperty;

export default new Proxy({}, {
    get(target, key) {
        if(typeof key === 'symbol') return undefined;

        if(hasOwn.call(FORWARDED, key)) return FORWARDED[key]();

        warnOnce(String(key), 'read');
        return undefined;
    },

    set(target, key) {
        if(typeof key !== 'symbol') warnOnce(String(key), 'assignment ignored (read-only)');

        return true;
    }
});
