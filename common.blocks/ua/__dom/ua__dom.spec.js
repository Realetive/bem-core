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

var IOS_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) ' +
        'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
    ANDROID_UA = 'Mozilla/5.0 (Linux; Android 14.0; Pixel 8) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    CHROME_DESKTOP_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

describe('ua__dom', function() {
    var rootNode = null;

    // innerWidth/innerHeight are OWN properties of window — restore the
    // captured accessor descriptors instead of delete-after-stub
    var ORIG_INNER_W = Object.getOwnPropertyDescriptor(window, 'innerWidth'),
        ORIG_INNER_H = Object.getOwnPropertyDescriptor(window, 'innerHeight');

    function initBlock() {
        // sibling specs (e.g. i-bem-dom__collection) wipe bem.entities in
        // their afterEach; without re-registration bemDom.init can't find
        // the ua entity when this spec runs after them
        if(!bem.entities['ua']) bem.entities['ua'] = UaBlock;

        rootNode = bemDom.init(BEMHTML.apply({ block : 'ua', js : true }));
        return rootNode.bem(UaBlock);
    }

    afterEach(function() {
        if(rootNode) {
            bemDom.destruct(rootNode);
            rootNode = null;
        }
        delete navigator.userAgent;
        Object.defineProperty(window, 'innerWidth', ORIG_INNER_W);
        Object.defineProperty(window, 'innerHeight', ORIG_INNER_H);
    });

    it('ios fixture: platform / ios / ios-subversion / browser mods', function() {
        Object.defineProperty(navigator, 'userAgent', { value : IOS_UA, configurable : true });
        var block = initBlock();
        block.getMod('platform').should.be.equal('ios');
        block.getMod('ios').should.be.equal('17');
        block.getMod('ios-subversion').should.be.equal('71');
        block.getMod('browser').should.be.equal('');
    });

    it('android fixture: platform / android / browser mods', function() {
        Object.defineProperty(navigator, 'userAgent', { value : ANDROID_UA, configurable : true });
        var block = initBlock();
        block.getMod('platform').should.be.equal('android');
        block.getMod('android').should.be.equal('14');
        block.getMod('browser').should.be.equal('chrome');
        block.getMod('ios').should.be.equal('');
    });

    it('other fixture: platform / browser mods', function() {
        Object.defineProperty(navigator, 'userAgent', { value : CHROME_DESKTOP_UA, configurable : true });
        var block = initBlock();
        block.getMod('platform').should.be.equal('other');
        block.getMod('browser').should.be.equal('chrome');
        block.getMod('ios').should.be.equal('');
        block.getMod('android').should.be.equal('');
    });

    it('full mod set mirrors env getters (ambient userAgent)', function() {
        var block = initBlock(),
            p = env.platform,
            b = env.browser;
        block.getMod('platform').should.be.equal(
            p.ios? 'ios' :
            p.android? 'android' :
            p.bada? 'bada' :
            p.wp? 'wp' :
            b.opera? 'opera' : 'other');
        block.getMod('browser').should.be.equal(
            b.opera? 'opera' :
            b.chrome? 'chrome' : '');
        block.getMod('screen-size').should.be.equal(env.screenSize);
        block.getMod('svg').should.be.equal(env.svg? 'yes' : 'no');
    });

    it('sets orient mod at init (touch delta; skipped where delta absent)', function() {
        var block = initBlock();
        if(block.getMod('orient') === '') return this.skip();
        block.getMod('orient').should.be.equal(env.landscape? 'landscape' : 'portrait');
    });

    it('updates orient mod on native orientchange (touch delta; skipped where delta absent)', function() {
        var block = initBlock();
        if(block.getMod('orient') === '') return this.skip();

        window.dispatchEvent(new CustomEvent('orientchange', {
            detail : { landscape : true, width : 667, height : 375 }
        }));

        block.getMod('orient').should.be.equal('landscape');
    });
});

provide();
});
