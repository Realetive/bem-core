/**
 * @module env
 * @description Environment capability module: UA-derived platform/browser
 * detection, capability probes and live viewport state. Getters only — no DOM
 * is read at module evaluation. UA-derived and capability values are computed
 * lazily and memoized per distinct observed `navigator.userAgent` string
 * (compute-once in production, re-computable under fixture user agents in
 * tests); live probes always read the current viewport.
 */

const hasWindow = typeof window !== 'undefined',
    hasDocument = typeof document !== 'undefined';

/**
 * Current user agent string ('' when there is no window, e.g. SSR)
 * @returns {String}
 */
function readUa() {
    return hasWindow? navigator.userAgent : '';
}

/**
 * Detection bundle for a user agent string — platform and browser version
 * maps (regexes carried verbatim from the former touch ua module, incl. the
 * HTC fake-desktop Android 2.3 fallback) plus the environment-stable
 * capability probes (`screenSize`, `svg`), bundled so a distinct observed
 * user agent string re-runs them under fixtures.
 * @param {String} ua
 * @returns {{ platform : Object, browser : Object, screenSize : String, svg : Boolean }}
 */
function detect(ua) {
    const platform = {},
        browser = {};
    let match;

    if(match = ua.match(/Android\s+([\d.]+)/)) {
        platform.android = match[1];
    } else if(ua.match(/\sHTC[\s_].*AppleWebKit/)) {
        // фэйковый десктопный UA по умолчанию у некоторых HTC (например, HTC Sensation)
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

    if(hasWindow && window.opera) {
        browser.opera = window.opera.version();
    } else if(match = ua.match(/\sOPR\/([\d.]+)/)) {
        browser.opera = match[1];
    }

    if(!browser.opera) {
        if(match = ua.match(/\sCrMo\/([\d.]+)/)) {
            browser.chrome = match[1];
        } else if(match = ua.match(/\sChrome\/([\d.]+)/)) {
            browser.chrome = match[1];
        }
    }

    let screenSize = '';
    if(hasWindow) {
        const screenWidth = screen.width;
        screenSize = screenWidth > 320? 'large' : screenWidth < 320? 'small' : 'normal';
    }

    const svg = !!(
        hasDocument &&
        document.createElementNS &&
        document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect
    );

    return { platform, browser, screenSize, svg };
}

/**
 * Memoized detection for the currently observed user agent
 * @returns {{ platform : Object, browser : Object, screenSize : String, svg : Boolean }}
 */
function detection() {
    const ua = readUa();
    let result = detections.get(ua);

    if(!result) {
        result = detect(ua);
        detections.set(ua, result);
    }

    return result;
}

const detections = new Map();

/**
 * Live viewport width (0 when there is no window)
 * @returns {Number}
 */
function viewportWidth() {
    return hasWindow? window.innerWidth : 0;
}

/**
 * Live viewport height (0 when there is no window)
 * @returns {Number}
 */
function viewportHeight() {
    return hasWindow? window.innerHeight : 0;
}

// Android shrink-guard state for the native orientchange dispatch. Lazily
// seeded on the first observed resize (no module-eval DOM reads); after a
// dispatch it updates only on dispatch, preserving the former
// lastOrient/lastWidth heuristic (renamed lastLandscape/lastWidth).
let lastLandscape = null,
    lastWidth = null;

function onResize() {
    const width = viewportWidth(),
        height = viewportHeight(),
        landscape = width > height;

    if(lastLandscape === null || lastWidth === null) {
        lastLandscape = landscape;
        lastWidth = width;
        return;
    }

    if(landscape !== lastLandscape && width !== lastWidth) {
        window.dispatchEvent(new CustomEvent('orientchange', {
            detail : { landscape, width, height }
        }));

        lastLandscape = landscape;
        lastWidth = width;
    }
}

hasWindow && window.addEventListener('resize', onResize);

export default {
    /**
     * Raw user agent string (diagnostic; '' when there is no window)
     * @type String
     */
    get ua() {
        return readUa();
    },

    /**
     * Detected mobile platform: version strings keyed by `ios`/`android`/
     * `bada`/`wp`, `other: true` when no mobile platform matches.
     * UA-derived (G2-justified: the audited consumer `ua__dom` reads it);
     * detection regexes carried verbatim from the former touch ua module.
     * @type Object
     */
    get platform() {
        return detection().platform;
    },

    /**
     * iOS version string. UA-derived (G2-justified: `ua__dom` reads it)
     * @type String|undefined
     */
    get ios() {
        return detection().platform.ios;
    },

    /**
     * Android version string. UA-derived (G2-justified: `ua__dom` reads it)
     * @type String|undefined
     */
    get android() {
        return detection().platform.android;
    },

    /**
     * Detected browser: `opera`/`chrome` version strings (kept one release
     * per OQ-8). UA-derived (G2-justified: `ua__dom` reads it); opera
     * detects legacy `window.opera.version()` or `OPR/`-form user agents,
     * chrome `CrMo/`- or `Chrome/`-form user agents.
     * @type Object
     */
    get browser() {
        return detection().browser;
    },

    /**
     * Screen size, one of: large, normal, small (by `screen.width`).
     * Capability probe (no consumer identity involved)
     * @type String
     */
    get screenSize() {
        return detection().screenSize;
    },

    /**
     * Is SVG supported? (createElementNS probe)
     * Capability probe (no consumer identity involved)
     * @type Boolean
     */
    get svg() {
        return detection().svg;
    },

    /**
     * Live viewport width
     * @type Number
     */
    get width() {
        return viewportWidth();
    },

    /**
     * Live viewport height
     * @type Number
     */
    get height() {
        return viewportHeight();
    },

    /**
     * Is the viewport landscape oriented? (live: width > height)
     * @type Boolean
     */
    get landscape() {
        return viewportWidth() > viewportHeight();
    }
};
