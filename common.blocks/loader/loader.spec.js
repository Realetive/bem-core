modules.define('spec', [
    'loader',
    'sinon'
], function(provide,
    loader,
    sinon
) {

describe('loader', function() {
    var FIXTURE = '/test/browser/fixtures/loader/es-module.mjs';
    var NOT_A_MODULE = '/test/browser/fixtures/loader/broken-syntax.mjs';

    var crossOriginFixture = function() {
        // Same server, different origin (localhost <-> 127.0.0.1): the
        // dev server sends no CORS headers, so the import must be rejected.
        var host = location.hostname === 'localhost'? '127.0.0.1' : 'localhost';
        return location.protocol + '//' + host + ':' + location.port + FIXTURE;
    };

    it('should resolve to the module namespace (promise-return semantics)', function() {
        return loader(FIXTURE).then(function(module) {
            module.default.should.equal('loader-es-module-fixture-default');
            module.marker.should.equal('loader-es-module-fixture');
        });
    });

    it('should call success callback', function(done) {
        var spyError = sinon.spy();

        loader(FIXTURE, function(module) {
            spyError.should.not.have.been.called;

            module.default.should.equal('loader-es-module-fixture-default');

            done();
        }, spyError);
    });

    it('should call error callback', function(done) {
        var spySuccess = sinon.spy();

        loader(NOT_A_MODULE, spySuccess, function() {
            spySuccess.should.not.have.been.called;

            done();
        }).catch(function() { /* rejection is expected here */ });
    });

    it('should reject a non-module URL (ES modules only)', function() {
        var spySuccess = sinon.spy();

        return loader(NOT_A_MODULE, spySuccess).then(function() {
            throw new Error('non-module URL must not load');
        }, function() {
            spySuccess.should.not.have.been.called;
        });
    });

    it('should reject a cross-origin URL without CORS headers', function() {
        var spySuccess = sinon.spy();

        return loader(crossOriginFixture(), spySuccess).then(function() {
            throw new Error('cross-origin URL without CORS must not load');
        }, function() {
            spySuccess.should.not.have.been.called;
        });
    });
});

provide();

});
