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

var expect = chai.expect;

function stubProp(obj, name, value) {
    Object.defineProperty(obj, name, { value : value, configurable : true });
}

afterEach(function() {
    delete window.innerWidth;
    delete window.innerHeight;
});

describe('ua (deprecated alias, design D-13)', function() {
    describe('live forwarding (property-read contract)', function() {
        it('should forward reads to the env module', function() {
            expect(ua.ua).to.equal(env.ua);
            expect(ua.platform).to.equal(env.platform);
            expect(ua.ios).to.equal(env.ios);
            expect(ua.android).to.equal(env.android);
            expect(ua.bada).to.equal(env.platform.bada);
            expect(ua.wp).to.equal(env.platform.wp);
            expect(ua.other).to.equal(env.platform.other);
            expect(ua.browser).to.equal(env.browser);
            expect(ua.opera).to.equal(env.browser.opera);
            expect(ua.chrome).to.equal(env.browser.chrome);
            expect(ua.screenSize).to.equal(env.screenSize);
            expect(ua.svg).to.equal(env.svg);
            expect(ua.height).to.equal(env.height);
            expect(ua.landscape).to.equal(env.landscape);
        });

        it('should forward live probes as reads happen (not a snapshot)', function() {
            stubProp(window, 'innerWidth', 777);
            stubProp(window, 'innerHeight', 333);

            expect(ua.width).to.equal(777);
            expect(ua.width).to.equal(env.width);
            expect(ua.landscape).to.be.true;
        });
    });

    describe('removed fields warn once per field and return undefined', function() {
        it('should warn once per removed field', function() {
            var warn = sinon.spy(console, 'warn');

            try {
                expect(ua.msie).to.be.undefined;
                expect(ua.msie).to.be.undefined;
                expect(ua.msie).to.be.undefined;
                expect(warn.withArgs(sinon.match(/msie/))).to.have.been.calledOnce;

                expect(ua.iphone).to.be.undefined;
                expect(warn.withArgs(sinon.match(/iphone/))).to.have.been.calledOnce;
                expect(warn.callCount).to.equal(2);
            } finally {
                warn.restore();
            }
        });
    });

    describe('assignments warn once and no-op', function() {
        it('should warn once and not change the forwarded value', function() {
            stubProp(window, 'innerWidth', 777);

            var warn = sinon.spy(console, 'warn');

            try {
                ua.width = 12345;
                ua.width = 67890;

                expect(warn.withArgs(sinon.match(/width/))).to.have.been.calledOnce;
                expect(ua.width).to.equal(777);
                expect(env.width).to.equal(777);
            } finally {
                warn.restore();
            }
        });
    });

    describe('symbol-keyed reads never warn', function() {
        it('should return undefined for symbols without warning', function() {
            var warn = sinon.spy(console, 'warn');

            try {
                expect(ua[Symbol.iterator]).to.be.undefined;
                expect(ua[Symbol.toPrimitive]).to.be.undefined;
                expect(warn).to.not.have.been.called;
            } finally {
                warn.restore();
            }
        });
    });
});

provide();

});
