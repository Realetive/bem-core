/**
 * @module env
 * @description Capability-based environment detection (replaces platform ua forks)
 */

const hasWindow = typeof window !== 'undefined';

// ─── Lazy memoized getters (per distinct observed userAgent) ───

let _cachedUA = null;
let _cache = null;

function detect(ua) {
    const platform = {};
    const browser = {};
    let match;

    if(match = ua.match(/Android\s+([\d.]+)/)) {
        platform.android = match[1];
    } else if(ua.match(/\sHTC[\s_].*AppleWebKit/)) {
        platform.android = '2.3';
    } else if(match = ua.match(/iPhone\sOS\s([\d_]+)/)) {
        platform.ios = match[1].replace(/_/g, '.');
    } else if(match = ua.match(/iPad.*OS\s([\d_]+)/)) {
        platform.ios = match[1].replace(/_/g, '.');
    } else if(match = ua.match(/Bada\/([\d.]+)/)) {
        platform.bada = match[1];
    } else if(match = ua.match(/Windows\sPhone.*\s([\d.]+)/)) {
        platform.wp = match[1];
    } else {
        platform.other = true;
    }

    if(hasWindow && window.opera && typeof window.opera.version === 'function') {
        browser.opera = window.opera.version();
    } else if(match = ua.match(/\sOPR\/([\d.]+)/)) {
        browser.opera = match[1];
    } else if(match = ua.match(/\sCrMo\/([\d.]+)/)) {
        browser.chrome = match[1];
    } else if(match = ua.match(/\sChrome\/([\d.]+)/)) {
        browser.chrome = match[1];
    }

    return { platform, browser };
}

function uaCache() {
    if(!hasWindow) return detect('');
    const ua = navigator.userAgent;
    if(_cache && _cachedUA === ua) return _cache;
    _cachedUA = ua;
    _cache = detect(ua);
    return _cache;
}

// ─── Module export ───

const env = {
    get ua() {
        return hasWindow ? navigator.userAgent : '';
    },

    get platform() {
        return uaCache().platform;
    },

    get ios() {
        return uaCache().platform.ios || '';
    },

    get android() {
        return uaCache().platform.android || '';
    },

    get browser() {
        return uaCache().browser;
    },

    get screenSize() {
        if(!hasWindow || typeof screen === 'undefined') return '';
        return screen.width > 320 ? 'large' : screen.width < 320 ? 'small' : 'normal';
    },

    get svg() {
        if(!hasWindow || typeof document === 'undefined') return false;
        return !!(document.createElementNS &&
            document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect);
    },

    // Live probes (not memoized)
    get width() {
        return hasWindow ? window.innerWidth : 0;
    },

    get height() {
        return hasWindow ? window.innerHeight : 0;
    },

    get landscape() {
        return this.width > this.height;
    }
};

// ─── Native orientchange with Android shrink-guard ───

if(hasWindow) {
    let lastLandscape = window.innerWidth > window.innerHeight;
    let lastWidth = window.innerWidth;

    window.addEventListener('resize', () => {
        const landscape = window.innerWidth > window.innerHeight;
        const width = window.innerWidth;

        if(landscape !== lastLandscape && width !== lastWidth) {
            lastLandscape = landscape;
            lastWidth = width;
            window.dispatchEvent(new CustomEvent('orientchange', {
                detail : { landscape, width, height : window.innerHeight }
            }));
        }
    });
}

export default env;
