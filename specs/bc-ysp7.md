---
id: specs/bc-ysp7.md
title: "S0 verification fence and public contracts (arch-overhaul strangler slice 0)"
status: approved
approved_at: 2026-10-01T06:04:27Z
source: .designs/arch-overhaul/design-doc.md
---

# Intent

The fork's architecture is still the 2016 design — a jQuery wrapper as DOM substrate behind a 9-entry CONST-P1
ratchet, unenforced platform-layer boundaries, and no machine-checkable public-API contract — while the toolchain
is already Vite 8/ESM. This spec is slice S0 of the strangler series (design doc, slice table S0 row): it lands
the verification fence and public contracts every later slice's done-gate depends on, with zero behavior change
beyond the two enumerated export-surface breaks; S1–S6 are out of scope, appearing only as S0 artifacts they
consume.

# Behavior

## REQ-1 (add): v5-base anchor tag on origin

- Evidence: `CONSTITUTION.md:55 :: CONST-P5 :: "### CONST-P5: Hard fork anchored at tag v5-base"`

Create the annotated tag `v5-base` = `7a9e932` on origin, only if absent (Q1); the target commit exists in
history as the parent of f2ab61e. Remote verification and creation are implementation-time work.

## REQ-2 (add): pinned deep-import inventory + api-pin test

- Evidence: `package.json:22 :: exports :: "    "./*": "./*""`
- Evidence: `common.blocks/i-bem-dom/i-bem-dom.js:1220 :: bemDom :: "export default bemDom"`
- Evidence: `desktop.blocks/ua/ua.js:2 :: ua :: " * @module ua"`
- Evidence: `build/platforms/desktop.js:53 :: keyboard__codes :: "import 'bem:keyboard__codes';"`

Inventory pins what exists @ f2ab61e (`env` is an S1 artifact, `ua` JS is platform-only, root `loader.js` is the
S3 canonical form — today only `_type` mods exist). Pin test at `test/api-pin.test.js` joins the node corpus,
includes the D-6 deleted-path negative tests, records `bem.entities` mutation as internal (OQ-7).

## REQ-3 (change): exports-map narrowing + named-export barrel v1 + repo metadata + MIGRATION ledger

- Evidence: `package.json:20 :: exports :: "    ".": "./dist/desktop/bem-core.mjs","`
- Evidence: `package.json:22 :: exports :: "    "./*": "./*""`
- Evidence: `package.json:8 :: url :: "    "url": "git://github.com/bem/bem-core.git""`
- Evidence: `common.blocks/i-bem-dom/__collection/i-bem-dom__collection.js:160 :: BemDomCollection :: "export default BemDomCollection"`
- Evidence: `common.blocks/events/__channels/events__channels.vanilla.js:9 :: channels :: "export default"`
- Evidence: `MIGRATION.md:5 :: "### ym → ES modules"`

Root `.` becomes `./dist/index.mjs` (OQ-9 as written); payloads at `./dist/{desktop,touch}`; `"./*"` narrows to
`"./common.blocks/*"` + enumerated entries; `repository.url` fixed (Q9). Barrel v1 re-exports existing modules
with plain DOM-flavor names only (D-7): bemDom, BemDomCollection, dom, Emitter, Event, channels. The bilingual
MIGRATION cell (same commit) carries the root-export line AND the exports-narrowing line; CHANGELOG(.ru) gains
`## Unreleased`.

## REQ-4 (add): bundle-budget gate with staged guard

- Evidence: `build/vite.config.js:32 :: outDir :: "            outDir: resolve(rootDir, 'dist', platform),"`
- Evidence: `build/vite.config.js:37 :: external :: "                external: ['jquery'],"`
- Evidence: `package.json:25 :: peerDependencies :: "    "jquery": "^4.0.0""`
- Evidence: `common.blocks/jquery/jquery.js:11 :: jQuery :: "export default jQuery"`
- Evidence: `CONSTITUTION.md:28-36 :: ALLOW :: "ALLOW="common.blocks/dom/dom.deps.js"`

`specs/bundle-budget.json` carries gz caps measured+10%; capped artifacts = both payloads AND `dist/index.mjs`
(ratified — no payloads-only rationale recorded); OQ-2: caps stay in JSON + CI, not the constitution.
`build/check-bundle-size.mjs` ratchets gz caps + the CONST-P1 allowlist + the CONST-P6 baseline,
two-directionally; the final assertions (no-jquery-in-artifact, jquery peer/dev removal) short-circuit to
skip/preview exit 0 while allowlist ≠ ∅ OR the wrapper exists OR package.json lists jquery — binding at S6,
never keyed on allowlist emptiness alone.

## REQ-5 (add): staged-gate meta-test (guard proof)

- Evidence: `package.json:44 :: test :: "    "test": "node --test build/plugins/vite-plugin-bem-levels.test.js common.blocks/i18n/i18n.test.js","`
- Evidence: `.github/workflows/ci.yml:33 :: "      - run: npm test"`

Fixture repo trees at `test/gate-fixtures.test.js`: skip-state → exit 0 + preview; bind-state-clean → exit 0 +
binding; bind-state-dirty (planted jquery import / artifact byte) → exit 1; plus a bidirectional-ratchet red
fixture (stale allowlist entry → exit 1). `check-bundle-size.mjs` and the doc fence carry the same
first-landing red proof.

## REQ-6 (change): generated platform entries + payload parity

- Evidence: `build/platforms/desktop.js:10 :: identify :: "import 'bem:identify';"`
- Evidence: `build/platforms/desktop.js:53 :: keyboard__codes :: "import 'bem:keyboard__codes';"`
- Evidence: `build/plugins/vite-plugin-bem-levels.js:395 :: buildRegistry :: "function buildRegistry(levels, rootDir) {"`

Entries are generated from the plugin scan registry by `build/generate-platform-entries.mjs`, committed at
`build/platforms/*.gen.js`, imports in canonical sorted order (sound via static `bem:` edges); CI re-runs the
generator and diffs (freshness); hand lists `build/platforms/{desktop,touch}.js` deleted in-slice.
Payload-parity assertion vs `specs/pre-s0-platforms-{desktop,touch}.txt`, captured in-slice from the hand
lists' `bem:` import sets before that deletion; `keyboard__codes` survives verbatim —
silent drop via generation is forbidden (OQ-6).

## REQ-7 (change): plugin transformer-form hard error

- Evidence: `build/plugins/vite-plugin-bem-levels.js:185 :: isRedefinition :: "    const isRedefinition = /export\s+default\s+function\s*\([^)]+\)\s*\{/.test(source)"`
- Evidence: `build/plugins/vite-plugin-bem-levels.js:503 :: generateBarrel :: "function generateBarrel(name, entries, rootDir) {"`

`buildRegistry`/`generateBarrel` error when a chain entry at index ≥ 1 is not transformer-form
`export default function(prev)` — a build error naming both files; live in S0; the plugin's existing test
corpus is the verifier.

## REQ-8 (add): timeboxed dynamic-import spike + dated decision record

- Evidence: `playwright.config.js:17 :: webServer :: "        command: 'node node_modules/.bin/vite --config build/vite.test.config.js --port 5174',"`
- Evidence: `build/vite.test.config.js:13 :: platform :: "            platform: 'desktop',"`
- Evidence: `common.blocks/loader/_type/loader_type_js.js:33 :: "    (path, success, error) => {"`

`import(variable)` is exercised through the dev-server test config + the lib build; Vite 8/rolldown behavior is
recorded as a dated `Decision record` section of this spec (cited by S3). Smoke: the generated entry resolves
through both build paths; one narrowed deep-import fails to resolve through the dev-server test config (the
Vite half of the exports tripwire) — or Node-only scope is recorded as the deliberate bound.

## REQ-9 (change): test/dist purge

- Evidence: `test/dist/build-fixtures.js:8 :: fixturesDir :: "    fixturesDir = path.join(__dirname, 'fixtures'),"`
- Evidence: `.gitignore:19 :: "/dist"`

Checked-in build-fixture output (`test/dist/fixtures/*`, `test/dist/assets/`) is deleted + a `.gitignore` entry
added; fixtures regenerate on demand via `test/dist/build-fixtures.js`.

## REQ-10 (change): constitution amendments — CONST-P6 skeleton, CONST-P1 final predicate, bidirectional sdd-check, MPL notices baseline

- Evidence: `CONSTITUTION.md:18 :: CONST-P1 :: "### CONST-P1: No new consumers of the jquery wrapper — ratchet only in"`
- Evidence: `CONSTITUTION.md:37 :: BAD :: "BAD=$(printf '%s\n' "$JQ" | LC_ALL=C comm -23 - <(printf '%s\n' "$ALLOW" | LC_ALL=C sort))"`
- Evidence: `desktop.blocks/ua/ua.js:2 :: ua :: " * @module ua"`
- Evidence: `touch.blocks/ua/__dom/ua__dom.js:2 :: ua__dom :: " * @module ua__dom"`

CONST-P6 ancestor-existence check (`specs/check-platform-baseline.sh` + `specs/platform-baseline.txt`):
include-set {.js, .deps.js, .bemhtml.js, .bh.js, .css} under desktop.blocks/ + touch.blocks/, excluding
`*.bemjson.js` fixtures and `*.examples/`; verified baseline @ f2ab61e = 19 files (8 desktop + 11 touch) —
the baseline pins the file count alone; files are the only unit, no entity/group counting. CONST-P1 gains
its final multi-grep predicate (import-form patterns only; sources + test/ + build/; exclude *.md, .git,
node_modules, dist) in skip/preview until S6; its sdd-check is made bidirectional
(`specs/check-jquery-ratchet.sh`) with a direction-2 red fixture + scripted per-slice pins; the MPL notices
baseline is recorded checked-in (`specs/mpl-notices-baseline.txt` — the verified empty JS notice list); all
amendments ride the S0 PR.

## REQ-11 (add): doc-parity fence

- Evidence: `MIGRATION.md:3 :: "## 5.0.0"`
- Evidence: `MIGRATION.ru.md:3 :: "## 5.0.0"`
- Evidence: `common.blocks/i-bem/i-bem.en.md:1 :: "# i-bem"`

`build/check-doc-parity.mjs` asserts en↔ru anchor-count equality on `^#{2,3} ` headings per commit; file-set =
MIGRATION(.ru) + CHANGELOG(.ru) pairs. Block-doc en↔ru pairs are NOT added to the fence at S0 (ratified:
deferred with the S6 docs pass; the i-bem pair above is context).

## REQ-12 (constraint): series invariants govern S0

- Evidence: `CONST-D1`
- Evidence: `CONST-D2`
- Evidence: `CONST-D3`
- Evidence: `CONST-D4`
- Evidence: `CONST-P1`
- Evidence: `CONST-P2`
- Evidence: `CONST-P3`
- Evidence: `CONST-P4`
- Evidence: `CONST-P5`
- Evidence: `CONST-P6`
- Evidence: `CONST-U1`
- Evidence: `CONST-U2`
- Evidence: `CONST-U3`

S0 allowlist Δ = none (CONST-P1); all new S0 code is ESM (CONST-P2); the two enumerated export-surface breaks
are the only observable API changes (CONST-P4); decisions are durable — OQ dispositions live here, not chat
(CONST-U1). CONST-P6 does not exist until REQ-10 creates it in this same slice — self-referential citation;
both land atomically. OQ-5: shim-map ratchet home = plugin-test assertion (earliest consumer S2). OQ-11:
registration-accounting ledger = checked-in JSON keyed by spec path, shrinking ratchet, asserted by the OQ-5
plugin-test home; loose floor and N% are fixed by S2's harness commit; update owner = the slice performing the
Harness Δ. `v5` stays buildable; lint/unit/browser green; Node matrix `[20, 22]` unchanged; append-only
history (CONST-U2); spec-first on divergence (CONST-U3).

# Acceptance

## ACC-1: v5-base tag resolves to the anchor commit

Run `git rev-parse v5-base^{commit}` and expect output contains `7a9e932`

## ACC-2: api-pin test is in the node test corpus

Run `npm test` and expect output contains `api-pin`

## ACC-3: exports map narrowed to common.blocks + enumerated entries

Run `node -p "JSON.stringify(require('./package.json').exports)"` and expect output contains `./common.blocks/*`

## ACC-4: repository.url points at the fork

Run `node -p "require('./package.json').repository.url"` and expect output contains `Realetive/bem-core`

## ACC-5: barrel exports the six plain names

```bash
npm run build && node --input-type=module -e "const m = await import('./dist/index.mjs'); ['bemDom','BemDomCollection','dom','Emitter','Event','channels'].forEach(k => { if (!(k in m)) process.exit(1); })"
```

## ACC-6: CHANGELOG Unreleased sections are bilingual

Run `grep -c "^## Unreleased" CHANGELOG.md CHANGELOG.ru.md` and expect output contains `:1`

## ACC-7: MIGRATION S0 cell is bilingual

Run `grep -c "^### S0" MIGRATION.md MIGRATION.ru.md` and expect output contains `:1`

## ACC-8: bundle gate green in staged mode

```bash
npm run build && node build/check-bundle-size.mjs
```

Must exit 0 in both skip/preview and binding modes (gz caps bind from S0).

## ACC-9: staged-gate meta-test is in the corpus

Run `npm test` and expect output contains `gate-fixtures`

## ACC-10: generated platform entries are fresh

Run `node build/generate-platform-entries.mjs && git diff --exit-code -- build/platforms/`

## ACC-11: payload parity vs pre-S0 lists, incl keyboard__codes

```bash
diff <(grep -oE "bem:[a-zA-Z_-]+" build/platforms/desktop.gen.js | sort -u) <(grep -oE "bem:[a-zA-Z_-]+" specs/pre-s0-platforms-desktop.txt | sort -u) && diff <(grep -oE "bem:[a-zA-Z_-]+" build/platforms/touch.gen.js | sort -u) <(grep -oE "bem:[a-zA-Z_-]+" specs/pre-s0-platforms-touch.txt | sort -u)
```

## ACC-12: transformer-form red cases in plugin corpus

Run `node --test build/plugins/vite-plugin-bem-levels.test.js` and expect exit 0

## ACC-13: dated decision record exists in this spec

Run `grep -E "^#{2,3} Decision record.*20[0-9]{2}-[0-9]{2}-[0-9]{2}" specs/bc-ysp7.md` and expect exit 0

## ACC-14: checked-in fixture output purged

Run `test -z "$(git ls-files test/dist/fixtures)" && echo fixtures-purged` and expect output contains `fixtures-purged`

## ACC-15: gitignore covers test/dist

Run `grep -n "test/dist" .gitignore` and expect output contains `test/dist`

## ACC-16: CONST-P6 baseline check passes

Run `bash specs/check-platform-baseline.sh`

Asserts the baseline = 19 files (8 desktop + 11 touch) against `specs/platform-baseline.txt`; expect exit 0.

## ACC-17: bidirectional CONST-P1 check passes on the live repo

Run `bash specs/check-jquery-ratchet.sh` and expect exit 0

Direction-2 red fixtures live in `test/gate-fixtures.test.js`.

## ACC-18: doc-parity fence passes

Run `node build/check-doc-parity.mjs` and expect exit 0

## ACC-19: no secrets in specs

Run `! grep -rEn "(API_KEY|SECRET|PASSWORD)=[^ ]+" specs/`

## ACC-20: lint green

Run `npm run lint` and expect exit 0

## ACC-21: OQ dispositions are durable

Run `test "$(grep -c "OQ-" specs/bc-ysp7.md)" -ge 6 && echo oq-dispositions-recorded` and expect output contains `oq-dispositions-recorded`

## ACC-22: license intact

Run `test -f LICENSE.txt` and expect exit 0

# Non-goals

- No tree-shaking beyond the plugin story; US1 scoped to "no jQuery in bundle".
- No TypeScript; no new blocks or public API additions in S0 (env is S1; barrel v1
  re-exports existing modules only).
- No template/BEMJSON redesign; no upstream re-sync (hard fork per CONST-P5).
- `inherit` frozen (Q4-a): zero code change in S0 and the whole series.
- `keyboard` internals Non-Goal-frozen: `keyboard__codes` must survive generation
  verbatim; fate decisions belong to a future convoy.
- No `.deps.js` schema lint; entity-converter unification deferred to S6
  ride-along; no bench work in S0 (bench project lands S2).
- S1–S6 outcomes are not this spec's scope; S0 delivers only the artifacts later
  slices consume.
- Mid-series reverts are stack reverts only (F8); gates re-key off git-tracked
  state.

## Decision record — 2026-10-01 (S0 implementation: dynamic-import spike + barrel verification bound)

Spike findings (Vite 8.0.1 / rolldown; cited by S3's loader spec):

- **`import(variable)` through the lib build (rolldown)**: preserved verbatim as a
  runtime dynamic import — the build succeeds, the variable specifier is not
  pre-resolved, inlined, or warned into an error, and the target is not bundled.
  S3's `loader(url) = import(url)` can therefore pass runtime URLs through a
  consumer's Vite build untouched.
- **`import("bem:x")` (static specifier) through the lib build**: fully resolved
  by vite-plugin-bem-levels and code-split into a chunk carrying the module
  payload — the `bem:` specifier never reaches the runtime.
- **Generated entry through both build paths**: `build/platforms/desktop.gen.js`
  resolves through the lib build (programmatic build asserted in
  `test/spike-dynamic-import.test.js`; the production form is `npm run build`,
  whose entry switch is itself CI-gated by the freshness diff + bundle gate) and
  through the dev-server test config (served 200 with `bem:` imports rewritten
  to plugin virtual-module URLs `/@id/__x00__bem:*`).
- **Vite half of the exports-narrowing tripwire**: verified, not Node-only — a
  module inside the package importing `bem-core/desktop.blocks/ua/ua.js` through
  `build/vite.test.config.js` fails at transform time with
  `"./desktop.blocks/ua/ua.js" is not exported under the conditions [...] from
  package bem-core` (HTTP 500 from the dev server). The Node half is pinned by
  the api-pin negative tests (`ERR_PACKAGE_PATH_NOT_EXPORTED`).
- **Barrel verification bound (ACC-5 amendment recommendation)**: bare-Node
  `import('./dist/index.mjs')` throws `jQuery requires a window with a document`
  — jquery@4's Node entry (and its `dist-module` wrapper) hard-errors without a
  DOM, and the DOM-flavor barrel graph statically imports jquery
  (`common.blocks/dom/dom.js:6`, `common.blocks/i-bem-dom/i-bem-dom.js:14`).
  This is equally true of the pre-S0 root export, so the barrel changes
  nothing observable here. The six-name shape is verified instead by (a) the
  api-pin source-shape pin and (b) a DOM-stubbed Node import exercised at
  done-gate time; the barrel remains a browser/bundler artifact by design.
  Recommendation: future specs verify barrel shape through a bundler or a DOM
  environment, not bare Node.
