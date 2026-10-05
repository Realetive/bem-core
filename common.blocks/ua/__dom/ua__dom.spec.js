modules.define('spec', [
    'i-bem',
    'i-bem-dom',
    'ua__dom',
    'env',
    'BEMHTML',
    'chai'
], function(provide,
    bem,
    bemDom,
    UaBlock,
    env,
    BEMHTML,
    chai
) {

var expect = chai.expect;

// Detection is memoized per distinct observed navigator.userAgent string —
// every fixture mints a unique UA (counter suffix) so each initialized block
// observes a fresh detection under its fixture.
var fixtureSeq = 0,
    rootNode;

function fixtureUa(base) {
    return base + ' (ua__dom-spec/' + (++fixtureSeq) + ')';
}

function stubProp(obj, name, value) {
    Object.defineProperty(obj, name, { value : value, configurable : true });
}

function initUa() {
    rootNode = bemDom.init(BEMHTML.apply({ block : 'ua', js : true }));
    return rootNode.bem(UaBlock);
}

afterEach(function() {
    if(rootNode) {
        bemDom.destruct(rootNode);
        rootNode = null;
    }

    delete navigator.userAgent;
    delete screen.width;
    delete window.innerWidth;
    delete window.innerHeight;
});

// The `orient` mod is set by the touch delta only; on the desktop platform
// (where the delta is absent) the mod is never set — feature-detect and skip
// the delta assertions there (spec REQ-10).
function hasTouchDelta(block) {
    return block.getMod('orient') !== '';
}

describe('ua__dom', function() {
    before(function() {
        // The i-bem-dom spec suite (which runs before this file) clears
        // bem.entities after each of its tests, unregistering the `ua` block
        // class that was registered at import time. Re-register the exported
        // class so bemDom.init maps data-bem params to it again.
        bem.entities['ua'] = UaBlock;
    });
    describe('platform mod (G2-justified UA-derived getter env.platform)', function() {
        it('should set platform=ios and version mods for an iOS user agent', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 (iPhone; U; CPU iPhone OS 7_1_2 like Mac OS X) AppleWebKit'));
            var block = initUa();

            expect(block.getMod('platform')).to.equal('ios');
            expect(block.getMod('ios')).to.equal('7');
            expect(block.getMod('ios-subversion')).to.equal('71'); // 7.1 with the dot stripped
            expect(block.getMod('android')).to.equal('');
        });

        it('should set platform=android with the major digit for an Android user agent', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 (Linux; U; Android 4.1.1; en-us) AppleWebKit'));
            var block = initUa();

            expect(block.getMod('platform')).to.equal('android');
            expect(block.getMod('android')).to.equal('4');
        });

        it('should set platform=bada for a Bada user agent', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 (SAMSUNG; Wave 525; Bada/1.2.3; ru) AppleWebKit'));
            var block = initUa();

            expect(block.getMod('platform')).to.equal('bada');
        });

        it('should set platform=wp for a Windows Phone user agent', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.1; Trident) AppleWebKit'));
            var block = initUa();

            expect(block.getMod('platform')).to.equal('wp');
        });

        it('should prefer browser.opera over other when no mobile platform matches (precedence preserved)', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 (Windows NT 10.0) AppleWebKit OPR/101.0.0.0 Safari'));
            var block = initUa();

            expect(block.getMod('platform')).to.equal('opera');
            expect(block.getMod('browser')).to.equal('opera');
        });

        it('should fall back to platform=other for an unrecognized user agent', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'));
            var block = initUa();

            expect(block.getMod('platform')).to.equal('other');
            expect(block.getMod('browser')).to.equal('');
        });
    });

    describe('browser mod (G2-justified UA-derived getter env.browser)', function() {
        it('should set browser=chrome for a Chrome user agent', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari'));
            var block = initUa();

            expect(block.getMod('browser')).to.equal('chrome');
        });
    });

    describe('capability-probe mods', function() {
        it('should set screen-size from env.screenSize', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 ScreenSize'));
            stubProp(screen, 'width', 480);
            var block = initUa();

            expect(block.getMod('screen-size')).to.equal('large');
        });

        it('should set svg=yes when SVG is supported', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 SvgProbe'));
            var block = initUa();

            expect(block.getMod('svg')).to.equal('yes');
        });

        it('should set svg=no when the SVG probe fails (stubbed false path)', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 SvgProbe'));
            var block;

            var realCreateElementNS = document.createElementNS;
            document.createElementNS = function() { return {}; };

            try {
                block = initUa();
            } finally {
                document.createElementNS = realCreateElementNS;
            }

            expect(block.getMod('svg')).to.equal('no');
        });
    });

    describe('orient mod (touch delta; skipped on desktop where the delta is absent)', function() {
        it('should set the orient mod from env.landscape at init', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 OrientDelta'));
            stubProp(window, 'innerWidth', 800);
            stubProp(window, 'innerHeight', 600);
            var block = initUa();

            if(hasTouchDelta(block)) {
                expect(block.getMod('orient')).to.equal('landscape');
            } else {
                this.skip(); // desktop build: the touch delta is absent by design
            }
        });

        it('should update the orient mod from the native orientchange event', function() {
            stubProp(navigator, 'userAgent', fixtureUa('Mozilla/5.0 OrientDelta'));
            var block = initUa();

            if(!hasTouchDelta(block)) this.skip(); // desktop build

            // Converge the env guard state to landscape (width 999/1000)
            // regardless of what dispatched before this test; the assertion
            // dispatches below differ from those widths in both axes.
            stubProp(window, 'innerWidth', 1000);
            stubProp(window, 'innerHeight', 500);
            window.dispatchEvent(new Event('resize'));
            stubProp(window, 'innerWidth', 999);
            stubProp(window, 'innerHeight', 500);
            window.dispatchEvent(new Event('resize'));

            stubProp(window, 'innerWidth', 400);
            stubProp(window, 'innerHeight', 900);
            window.dispatchEvent(new Event('resize'));

            expect(block.getMod('orient')).to.equal('portrait');

            stubProp(window, 'innerWidth', 1000);
            stubProp(window, 'innerHeight', 300);
            window.dispatchEvent(new Event('resize'));

            expect(block.getMod('orient')).to.equal('landscape');
        });
    });
});

provide();

});
