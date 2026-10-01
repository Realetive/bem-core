/**
 * Bundle-budget gate (design doc KC 10, spec REQ-4).
 *
 * Binding from S0:
 *   - gz-byte caps from specs/bundle-budget.json (growth fails; shrink is fine);
 *   - CONST-P1 allowlist ratchet (two-directional: new jquery consumers fail,
 *     stale allowlist entries whose files no longer match reality fail);
 *   - CONST-P6 platform-baseline ratchet (two-directional: additions and
 *     forgotten shrinks both fail).
 *
 * Final assertions (no-jquery-in-artifact, jquery peer/dev removal) activate at
 * S6 — they short-circuit to preview output + exit 0 while the allowlist is
 * non-empty OR the wrapper block (common.blocks/jquery) still exists OR
 * package.json still lists jquery; they bind otherwise. They are never keyed on
 * allowlist emptiness alone.
 *
 * Usage: node build/check-bundle-size.mjs [--root <dir>]
 *   --root runs the gate against another (fixture) repository tree.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { gzipSync } from 'node:zlib';
import process from 'node:process';

const args = process.argv.slice(2);
let root = resolve(import.meta.dirname, '..');
{
    const rootIndex = args.indexOf('--root');
    if (rootIndex !== -1 && args[rootIndex + 1]) {
        root = resolve(args[rootIndex + 1]);
    }
}

const problems = [];
const log = (line) => console.log(`[bundle-gate] ${line}`);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function walk(dir, predicate, acc = []) {
    let entries;
    try {
        entries = readdirSync(dir);
    } catch {
        return acc;
    }
    for (const entry of entries) {
        const fullPath = join(dir, entry);
        let stat;
        try {
            stat = statSync(fullPath);
        } catch {
            continue;
        }
        if (stat.isDirectory()) {
            if (entry === 'node_modules' || entry === 'dist' || entry === '.git') continue;
            walk(fullPath, predicate, acc);
        } else if (stat.isFile() && predicate(fullPath)) {
            acc.push(fullPath);
        }
    }
    return acc;
}

function readJson(filePath, what) {
    if (!existsSync(filePath)) {
        problems.push(`missing ${what}: ${relative(root, filePath) || filePath}`);
        return null;
    }
    try {
        return JSON.parse(readFileSync(filePath, 'utf8'));
    } catch (error) {
        problems.push(`unparseable ${what}: ${error.message}`);
        return null;
    }
}

// ---------------------------------------------------------------------------
// 1. gz-byte caps (binding from S0)
// ---------------------------------------------------------------------------

const budget = readJson(join(root, 'specs', 'bundle-budget.json'), 'specs/bundle-budget.json');
if (budget && budget.artifacts) {
    for (const [artifactPath, cap] of Object.entries(budget.artifacts)) {
        const fullPath = join(root, artifactPath);
        if (!existsSync(fullPath)) {
            problems.push(`budgeted artifact missing: ${artifactPath} (run the build first)`);
            continue;
        }
        const gzBytes = gzipSync(readFileSync(fullPath)).length;
        const capBytes = cap.gzipCapBytes;
        if (typeof capBytes !== 'number') {
            problems.push(`budget entry without gzipCapBytes: ${artifactPath}`);
            continue;
        }
        if (gzBytes > capBytes) {
            problems.push(
                `gz cap exceeded for ${artifactPath}: ${gzBytes} > ${capBytes} bytes ` +
                '(grow only with explicit amendment of specs/bundle-budget.json)');
        } else {
            log(`gz ok: ${artifactPath} ${gzBytes}/${capBytes} bytes`);
        }
    }
}

// ---------------------------------------------------------------------------
// 2. CONST-P1 allowlist ratchet (two-directional)
// ---------------------------------------------------------------------------

function readAllowlist() {
    const constitutionPath = join(root, 'CONSTITUTION.md');
    if (!existsSync(constitutionPath)) {
        return { entries: [], missing: !existsSync(constitutionPath) };
    }
    const source = readFileSync(constitutionPath, 'utf8');
    const match = source.match(/ALLOW="([^"]+)"/);
    if (!match) return { entries: [], missing: false };
    const entries = match[1].split('\n').map((line) => line.trim()).filter(Boolean);
    return { entries, missing: false };
}

function actualJqueryConsumers() {
    const depsFiles = walk(root, (p) => p.endsWith('.deps.js'), []);
    const consumers = new Set();
    for (const depsFile of depsFiles) {
        const rel = relative(root, depsFile).split('\\').join('/');
        if (/(^|\/)(node_modules|dist|\.git)(\/|$)/.test(rel)) continue;
        if (/(^|\/)jquery\//.test(rel)) continue;
        if (/^CONSTITUTION\.md$/.test(rel)) continue;
        let content;
        try {
            content = readFileSync(depsFile, 'utf8');
        } catch {
            continue;
        }
        if (content.includes('jquery')) consumers.add(rel);
    }
    return [...consumers].sort();
}

const allow = readAllowlist();
if (!allow.missing) {
    const actual = actualJqueryConsumers();
    const allowSet = [...allow.entries].sort();
    const additions = actual.filter((entry) => !allowSet.includes(entry));
    const stale = allowSet.filter((entry) => !actual.includes(entry));
    if (additions.length > 0) {
        problems.push(`CONST-P1: new jquery consumers (ratchet additions): ${additions.join(', ')}`);
    }
    if (stale.length > 0) {
        problems.push(
            `CONST-P1: stale allowlist entries — files no longer match reality ` +
            `(forgotten shrinks): ${stale.join(', ')}`);
    }
    log(`CONST-P1 allowlist ratchet: ${allowSet.length} entries, actual ${actual.length}`);
}

// ---------------------------------------------------------------------------
// 3. CONST-P6 platform-baseline ratchet (two-directional)
// ---------------------------------------------------------------------------

const P6_INCLUDE = /\.(js|deps\.js|bemhtml\.js|bh\.js|css)$/;

function platformFiles() {
    const files = [];
    for (const level of ['desktop.blocks', 'touch.blocks']) {
        const levelDir = join(root, level);
        if (!existsSync(levelDir)) continue;
        for (const filePath of walk(levelDir, () => true, [])) {
            const rel = relative(root, filePath).split('\\').join('/');
            if (rel.endsWith('.bemjson.js')) continue;
            if (/(^|\/)[^.]+\.examples\//.test(rel)) continue;
            if (!P6_INCLUDE.test(rel)) continue;
            files.push(rel);
        }
    }
    return files.sort();
}

const baselinePath = join(root, 'specs', 'platform-baseline.txt');
if (existsSync(baselinePath)) {
    const baseline = readFileSync(baselinePath, 'utf8')
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'));
    const actual = platformFiles();
    const additions = actual.filter((entry) => !baseline.includes(entry));
    const stale = baseline.filter((entry) => !actual.includes(entry));
    if (additions.length > 0) {
        problems.push(
            `CONST-P6: platform files without a baseline entry ` +
            `(standalone files need an ancestor or an amendment): ${additions.join(', ')}`);
    }
    if (stale.length > 0) {
        problems.push(`CONST-P6: stale baseline entries (forgotten shrinks): ${stale.join(', ')}`);
    }
    log(`CONST-P6 baseline ratchet: baseline ${baseline.length} files, actual ${actual.length}`);
}

// ---------------------------------------------------------------------------
// 4. Final assertions — activate at S6 (never on allowlist emptiness alone)
// ---------------------------------------------------------------------------

const JQUERY_ARTIFACT_MARKERS = [
    'jQuery requires a window',
    'jQuery JavaScript Library',
    'jquery.org/license',
];

const pkg = readJson(join(root, 'package.json'), 'package.json');
const wrapperExists = existsSync(join(root, 'common.blocks', 'jquery'));
const pkgListsJquery = Boolean(
    pkg && (
        (pkg.peerDependencies && 'jquery' in pkg.peerDependencies) ||
        (pkg.devDependencies && 'jquery' in pkg.devDependencies) ||
        (pkg.dependencies && 'jquery' in pkg.dependencies)
    )
);
const allowlistNonEmpty = allow.entries.length > 0;

const finalGuards = [];
if (allowlistNonEmpty) finalGuards.push('CONST-P1 allowlist non-empty');
if (wrapperExists) finalGuards.push('jquery wrapper block exists');
if (pkgListsJquery) finalGuards.push('package.json lists jquery');

if (finalGuards.length > 0) {
    log(`final assertions: SKIP/PREVIEW (guards: ${finalGuards.join('; ')}) — binding at S6`);
    log('final assertions preview:');
    for (const marker of JQUERY_ARTIFACT_MARKERS) {
        log(`  no-jquery-in-artifact: would scan budgeted artifacts for ${JSON.stringify(marker)}`);
    }
    log('  jquery-deps-removal: would assert package.json carries no jquery in peer/dev deps');
} else {
    log('final assertions: BINDING (allowlist empty, wrapper gone, package.json clean)');
    let artifactList = [];
    if (budget && budget.artifacts) artifactList = Object.keys(budget.artifacts);
    for (const artifactPath of artifactList) {
        const fullPath = join(root, artifactPath);
        if (!existsSync(fullPath)) continue;
        const content = readFileSync(fullPath, 'utf8');
        for (const marker of JQUERY_ARTIFACT_MARKERS) {
            if (content.includes(marker)) {
                problems.push(`no-jquery-in-artifact: ${artifactPath} contains ${JSON.stringify(marker)}`);
            }
        }
    }
    if (pkgListsJquery) {
        problems.push('jquery deps removal: package.json still lists jquery');
    }
    log('final assertions: clean');
}

// ---------------------------------------------------------------------------
// Exit
// ---------------------------------------------------------------------------

if (problems.length > 0) {
    console.error('[bundle-gate] FAIL');
    for (const problem of problems) console.error(`[bundle-gate] - ${problem}`);
    process.exit(1);
}
log('OK');
process.exit(0);
