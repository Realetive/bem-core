import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import env from '../common.blocks/env/env.js';

describe('env SSR (bare Node, no window)', function() {
    it('imports without throwing and yields safe defaults', function() {
        assert.strictEqual(env.ua, '');
        assert.strictEqual(env.platform.other, true);
        assert.strictEqual(env.ios, '');
        assert.strictEqual(env.android, '');
        assert.deepStrictEqual(env.browser, {});
        assert.strictEqual(env.screenSize, '');
        assert.strictEqual(env.svg, false);
        assert.strictEqual(env.width, 0);
        assert.strictEqual(env.height, 0);
        assert.strictEqual(env.landscape, false);
    });
});
