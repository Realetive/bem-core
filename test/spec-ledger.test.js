import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');

function findSpecFiles(dir, acc) {
    for(const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if(statSync(full).isDirectory()) {
            findSpecFiles(full, acc);
        } else if(entry.endsWith('.spec.js')) {
            acc.push(full);
        }
    }
    return acc;
}

describe('spec-files ledger (OQ-11 per-file accounting)', function() {
    it('specs/spec-files.txt equals the live spec-file set', function() {
        const live = findSpecFiles(join(ROOT, 'common.blocks'), [])
            .map(p => p.slice(ROOT.length + 1))
            .sort();
        const ledgered = readFileSync(join(ROOT, 'specs/spec-files.txt'), 'utf8')
            .split('\n')
            .filter(line => line.length > 0);
        assert.deepStrictEqual(live, ledgered,
            'spec file set drifted — regenerate: find common.blocks -name "*.spec.js" | sort > specs/spec-files.txt');
    });
});
