modules.define('spec', [
    'env',
    'ua',
    'chai',
    'sinon'
], function(provide,
    env,
    ua,
    chai,
    sinon
) {

var should = chai.should();

// window.innerWidth/innerHeight are OWN properties — a stubbing
// defineProperty + delete leaves them missing forever (no prototype getter
// to fall back to); screen.width is prototype-backed. restoreProp handles
// both: re-define the captured descriptor, or delete the stub to unshadow.
var ORIG_INNER_W = Object.getOwnPropertyDescriptor(window, 'innerWidth'),
    ORIG_INNER_H = Object.getOwnPropertyDescriptor(window, 'innerHeight'),
    ORIG_SCREEN_W = Object.getOwnPropertyDescriptor(screen, 'width');

function restoreProp(obj, key, desc) {
    desc? Object.defineProperty(obj, key, desc) : delete obj[key];
}

var IOS_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) ' +
        'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
    ANDROID_UA = 'Mozilla/5.0 (Linux; Android 14.0; Pixel 8) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    CHROME_DESKTOP_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    OPERA_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 OPR/106.0.0.0',
    BADA_UA = 'Mozilla/5.0 (Bada/2.0; S8500) ' +
        'AppleWebKit/534.20 (KHTML, like Gecko) Version/2.0 Mobile Safari/534.20';

function stubUA(ua) {
    Object.defineProperty(navigator, 'userAgent', { value : ua, configurable : true });
}

function stubViewport(width, height) {
    Object.defineProperty(window, 'innerWidth', { value : width, configurable : true });
    Object.defineProperty(window, 'innerHeight', { value : height, configurable : true });
    window.dispatchEvent(new Event('resize'));
}

afterEach(function() {
    delete navigator.userAgent;
    restoreProp(window, 'innerWidth', ORIG_INNER_W);
    restoreProp(window, 'innerHeight', ORIG_INNER_H);
    restoreProp(screen, 'width', ORIG_SCREEN_W);
});

describe('env', function() {

    describe('ua-derived getters', function() {

        it('platform: android fixture', function() {
            stubUA(ANDROID_UA);
            env.platform.android.should.be.equal('14.0');
            should.not.exist(env.platform.ios);
            should.not.exist(env.platform.other);
        });

        it('platform: ios fixture (iPhone)', function() {
            stubUA(IOS_UA);
            env.platform.ios.should.be.equal('17.1');
            should.not.exist(env.platform.android);
        });

        it('platform: bada fixture', function() {
            stubUA(BADA_UA);
            env.platform.bada.should.be.equal('2.0');
        });

        it('platform: other fallback', function() {
            stubUA(CHROME_DESKTOP_UA);
            env.platform.other.should.be.true;
        });

        it('ios: version string or empty', function() {
            stubUA(IOS_UA);
            env.ios.should.be.equal('17.1');
            stubUA(CHROME_DESKTOP_UA);
            env.ios.should.be.equal('');
        });

        it('android: version string or empty', function() {
            stubUA(ANDROID_UA);
            env.android.should.be.equal('14.0');
            stubUA(IOS_UA);
            env.android.should.be.equal('');
        });

        it('browser: chrome fixture', function() {
            stubUA(CHROME_DESKTOP_UA);
            env.browser.chrome.should.be.equal('120.0.0.0');
            should.not.exist(env.browser.opera);
        });

        it('browser: opera fixture (OPR wins over Chrome)', function() {
            stubUA(OPERA_UA);
            env.browser.opera.should.be.equal('106.0.0.0');
            should.not.exist(env.browser.chrome);
        });

        it('memoizes per distinct userAgent and re-detects on change', function() {
            var p1 = env.platform;
            env.platform.should.be.equal(p1);
            stubUA(ANDROID_UA);
            env.platform.should.not.be.equal(p1);
            env.platform.android.should.be.equal('14.0');
        });
    });

    describe('capability probes', function() {

        it('screenSize: large / normal / small thresholds', function() {
            Object.defineProperty(screen, 'width', { value : 500, configurable : true });
            env.screenSize.should.be.equal('large');
            Object.defineProperty(screen, 'width', { value : 320, configurable : true });
            env.screenSize.should.be.equal('normal');
            Object.defineProperty(screen, 'width', { value : 300, configurable : true });
            env.screenSize.should.be.equal('small');
        });

        it('svg: false when createSVGRect is missing', function() {
            env.svg.should.be.a('boolean');
            document.createElementNS = function() { return {}; };
            env.svg.should.be.false;
            delete document.createElementNS;
        });
    });

    describe('live probes', function() {

        it('width / height / landscape read the live viewport', function() {
            stubViewport(800, 600);
            env.width.should.be.equal(800);
            env.height.should.be.equal(600);
            env.landscape.should.be.true;
            Object.defineProperty(window, 'innerHeight', { value : 900, configurable : true });
            env.landscape.should.be.false;
        });
    });

    describe('orientchange (native, shrink-guard)', function() {

        it('fires only when both landscape and width change; payload {landscape,width,height}', function() {
            var events = [],
                onOrient = function(e) { events.push(e.detail); };

            window.addEventListener('orientchange', onOrient);
            try {
                stubViewport(375, 667);
                var converged = events.length;

                stubViewport(400, 667);
                events.length.should.be.equal(converged);

                stubViewport(800, 667);
                events.length.should.be.equal(converged + 1);
                events[events.length - 1].should.be.deep.equal({
                    landscape : true,
                    width : 800,
                    height : 667
                });

                stubViewport(800, 900);
                events.length.should.be.equal(converged + 1);
            } finally {
                window.removeEventListener('orientchange', onOrient);
            }
        });
    });
});

describe('ua (deprecated alias)', function() {

    function withWarnSpy(fn) {
        var spy = sinon.spy(console, 'warn');
        try {
            return fn(spy);
        } finally {
            spy.restore();
        }
    }

    it('live-forwards reads to env', function() {
        ua.ua.should.be.equal(env.ua);
        ua.platform.should.be.equal(env.platform);
        ua.ios.should.be.equal(env.ios);
        ua.android.should.be.equal(env.android);
        ua.browser.should.be.equal(env.browser);
        ua.screenSize.should.be.equal(env.screenSize);
        ua.svg.should.be.equal(env.svg);
        Object.defineProperty(window, 'innerWidth', { value : 1234, configurable : true });
        ua.width.should.be.equal(1234);
        ua.height.should.be.equal(env.height);
        ua.landscape.should.be.equal(env.landscape);
    });

    it('forwards platform/browser sub-keys', function() {
        stubUA(CHROME_DESKTOP_UA);
        ua.other.should.be.equal(true);
        ua.chrome.should.be.equal('120.0.0.0');
        stubUA(OPERA_UA);
        ua.opera.should.be.equal('106.0.0.0');
        stubUA(BADA_UA);
        ua.bada.should.be.equal('2.0');
    });

    it('warns once per removed field and returns undefined', function() {
        withWarnSpy(function(spy) {
            should.equal(ua.msie, undefined);
            should.equal(ua.msie, undefined);
            spy.callCount.should.be.equal(1);
            spy.firstCall.args[0].should.contain('msie');

            should.equal(ua.dpr, undefined);
            spy.callCount.should.be.equal(2);
        });
    });

    it('assignment warns once and no-ops', function() {
        withWarnSpy(function(spy) {
            var before = ua.width;
            ua.width = 9999;
            ua.width.should.be.equal(before);
            spy.callCount.should.be.equal(1);
            spy.firstCall.args[0].should.contain('read-only');

            ua.width = 8888;
            spy.callCount.should.be.equal(1);
        });
    });

    it('symbol-keyed reads never warn', function() {
        withWarnSpy(function(spy) {
            should.equal(ua[Symbol.iterator], undefined);
            should.equal(ua[Symbol('probe')], undefined);
            spy.callCount.should.be.equal(0);
        });
    });
});

provide();
});
