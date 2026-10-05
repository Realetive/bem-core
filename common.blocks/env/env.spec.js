modules.define('spec', [
    'env',
    'chai',
    'sinon'
], function(provide,
    env,
    chai,
    sinon
) {

var expect = chai.expect;

// Detection is memoized per distinct observed navigator.userAgent string, so
// every fixture mints a unique UA (counter suffix) to guarantee a fresh
// detection under its stubs — this is the designed unit-test seam (spec
// bc-cah4 REQ-1), not a hack around the memoization.
var fixtureSeq = 0;

function fixtureUa(base) {
    return base + ' (env-spec/' + (++fixtureSeq) + ')';
}

// navigator/screen/viewport props live on prototypes; own-property stubs
// shadow them and `delete` restores the inherited accessors.
function stubProp(obj, name, value) {
    Object.defineProperty(obj, name, { value : value, configurable : true });
}

function unstub(obj, name) {
    delete obj[name];
}

var realCreateElementNS = document.createElementNS;

afterEach(function() {
    unstub(navigator, 'userAgent');
    unstub(screen, 'width');
    unstub(window, 'innerWidth');
    unstub(window, 'innerHeight');
    unstub(window, 'opera');
    document.createElementNS = realCreateElementNS;
});

function dispatchResize() {
    window.dispatchEvent(new Event('resize'));
}

describe('env', function() {
    describe('platform (UA-derived, G2-justified: the audited consumer ua__dom reads it)', function() {
        // Justification: `ua__dom` sets its `platform` mod from this getter;
        // platform identity is not a capability question (spec REQ-1).
        it('should detect android', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 (Linux; U; Android 4.1.1; en-us) AppleWebKit/534.30'));

            expect(env.platform.android).to.equal('4.1.1');
            expect(env.android).to.equal('4.1.1');
            expect(env.platform.ios).to.be.undefined;
            expect(env.platform.other).to.be.undefined;
        });

        it('should detect android via the HTC fake-desktop fallback (verbatim from the former touch ua)', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 (Linux; U; HTC_X515m Build/GRJ22) AppleWebKit/534.30'));

            expect(env.platform.android).to.equal('2.3');
        });

        it('should detect ios on iPhone with underscores replaced by dots', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 (iPhone; U; CPU iPhone OS 7_1_2 like Mac OS X) AppleWebKit'));

            expect(env.platform.ios).to.equal('7.1.2');
            expect(env.ios).to.equal('7.1.2');
            expect(env.platform.android).to.be.undefined;
        });

        it('should detect ios on iPad', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 (iPad; CPU OS 8_1 like Mac OS X) AppleWebKit'));

            expect(env.platform.ios).to.equal('8.1');
        });

        it('should detect bada', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 (SAMSUNG; Wave 525; Bada/1.2.3; ru) AppleWebKit'));

            expect(env.platform.bada).to.equal('1.2.3');
        });

        it('should detect windows phone', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.1; Trident) AppleWebKit'));

            expect(env.platform.wp).to.equal('8.1');
        });

        it('should set other when no mobile platform matches', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari'));

            expect(env.platform.other).to.be.true;
        });

        it('should memoize detection per distinct user agent string', function() {
            var uaAndroid = fixtureUa('Mozilla/5.0 (Linux; U; Android 4.1.1) AppleWebKit');
            stubProp(navigator, 'userAgent', uaAndroid);
            var platform1 = env.platform;

            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit'));
            env.platform; // different ua -> fresh detection

            stubProp(navigator, 'userAgent', uaAndroid);
            // back to the first ua -> same memoized bundle object
            expect(env.platform).to.equal(platform1);
        });
    });

    describe('browser (UA-derived, G2-justified: the audited consumer ua__dom reads it)', function() {
        // Justification: `ua__dom` sets its `browser` mod from this getter
        // (spec REQ-1); opera/chrome keys are kept one release (OQ-8).
        it('should detect opera by OPR/-form user agents', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 OPR/101.0.0.0'));

            expect(env.browser.opera).to.equal('101.0.0.0');
            expect(env.browser.chrome).to.be.undefined;
        });

        it('should detect legacy opera via window.opera.version()', function() {
            stubProp(window, 'opera', { version : function() { return '12.16'; } });
            stubProp(navigator, 'userAgent', fixtureUa('Opera/9.80 (Windows NT 6.1) Presto/2.12.388'));

            expect(env.browser.opera).to.equal('12.16');
        });

        it('should detect chrome by CrMo/-form user agents', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 (Linux; U; Android 4.0.4) AppleWebKit/535.19 CrMo/18.0.1025.166 Mobile Safari'));

            expect(env.browser.chrome).to.equal('18.0.1025.166');
            expect(env.browser.opera).to.be.undefined;
        });

        it('should detect chrome by Chrome/-form user agents', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari'));

            expect(env.browser.chrome).to.equal('120.0.0.0');
        });
    });

    describe('screenSize (capability probe)', function() {
        it('should classify screen width as large / normal / small', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 ScreenSize'));
            stubProp(screen, 'width', 480);
            expect(env.screenSize).to.equal('large');

            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 ScreenSize'));
            stubProp(screen, 'width', 320);
            expect(env.screenSize).to.equal('normal');

            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 ScreenSize'));
            stubProp(screen, 'width', 240);
            expect(env.screenSize).to.equal('small');
        });
    });

    describe('svg (capability probe)', function() {
        it('should probe SVG support with createElementNS', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 SvgProbe'));

            expect(env.svg).to.be.true;
        });

        it('should report no svg when createElementNS lacks createSVGRect (stubbed false path)', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 SvgProbe'));
            document.createElementNS = function() { return {}; };

            expect(env.svg).to.be.false;
        });
    });

    describe('live probes', function() {
        it('width/height/landscape should read the current viewport', function() {
            stubProp(window, 'innerWidth', 320);
            stubProp(window, 'innerHeight', 480);

            expect(env.width).to.equal(320);
            expect(env.height).to.equal(480);
            expect(env.landscape).to.be.false;

            stubProp(window, 'innerWidth', 480);
            stubProp(window, 'innerHeight', 320);

            expect(env.width).to.equal(480);
            expect(env.landscape).to.be.true;
        });
    });

    describe('orientchange (native transport, Android shrink-guard preserved)', function() {
        // REQ-2: dispatch only when landscape AND width both change; payload
        // carries { landscape, width, height }; guard state updates only on
        // dispatch. This test owns the page's resize-dispatch sequence —
        // env.spec.js is the first spec file to dispatch resizes, so the
        // first observation below seeds the guard.
        it('should dispatch only when landscape and width both change', function() {
            var events = [],
                onOrient = function(e) { events.push(e.detail); };

            // Converge the guard state to a known point (landscape, width
            // 900) regardless of any earlier observation: alternating
            // configs differing in both axes lock the state onto the last
            // dispatched config. Events from this prelude are not observed.
            stubProp(window, 'innerWidth', 400);
            stubProp(window, 'innerHeight', 800);
            dispatchResize();
            stubProp(window, 'innerWidth', 900);
            stubProp(window, 'innerHeight', 300);
            dispatchResize();
            stubProp(window, 'innerWidth', 400);
            stubProp(window, 'innerHeight', 800);
            dispatchResize();
            stubProp(window, 'innerWidth', 900);
            stubProp(window, 'innerHeight', 300);
            dispatchResize();

            window.addEventListener('orientchange', onOrient);

            try {
                stubProp(window, 'innerWidth', 700); // width-only change
                dispatchResize();
                expect(events).to.have.length(0);

                // orientation-only change: landscape flips but width stays at
                // the last DISPATCHED width (900) — the guard state ignores
                // the non-dispatching 700 observation above
                stubProp(window, 'innerWidth', 900);
                stubProp(window, 'innerHeight', 800);
                dispatchResize();
                expect(events).to.have.length(0);

                stubProp(window, 'innerWidth', 600); // both change
                stubProp(window, 'innerHeight', 900);
                dispatchResize();
                expect(events).to.have.length(1);
                expect(events[0]).to.deep.equal({ landscape : false, width : 600, height : 900 });

                stubProp(window, 'innerHeight', 1400); // height-only change
                dispatchResize();
                expect(events).to.have.length(1);

                stubProp(window, 'innerWidth', 1000); // both change again
                stubProp(window, 'innerHeight', 400);
                dispatchResize();
                expect(events).to.have.length(2);
                expect(events[1]).to.deep.equal({ landscape : true, width : 1000, height : 400 });
            } finally {
                window.removeEventListener('orientchange', onOrient);
            }
        });
    });
});

provide();

});
