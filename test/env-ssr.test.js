/**
 * env SSR unit (spec bc-cah4 REQ-10): importing the env capability module in
 * bare Node (no window/document globals) must not throw and must yield the
 * no-window clause of REQ-1 — `ua: ''`, `platform: { other: true }`, falsy
 * probes and 0-valued live probes.
 */

import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import env from '../common.blocks/env/env.js';

describe('env (SSR / bare Node, no window)', function() {
    it('should import without throwing in a window-less environment', function() {
        assert.equal(typeof window, 'undefined');
        assert.ok(env);
    });

    it('should yield ua === ""', function() {
        assert.equal(env.ua, '');
    });

    it('should yield platform.other === true with no platform versions', function() {
        assert.deepStrictEqual(env.platform, { other: true });
        assert.equal(env.ios, undefined);
        assert.equal(env.android, undefined);
    });

    it('should yield falsy capability probes', function() {
        assert.equal(env.svg, false);
        assert.ok(!env.screenSize);
    });

    it('should yield 0-valued live probes', function() {
        assert.equal(env.width, 0);
        assert.equal(env.height, 0);
        assert.equal(env.landscape, false);
    });
});
