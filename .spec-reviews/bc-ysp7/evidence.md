# Evidence harvest — RID bc-ysp7 (spec-craft for slice S0, task bead bc-gdk9)

Harvested read-only at repo `/Users/ryganin/gc/bem-core/bem-core`, HEAD `f2ab61e`
("SDD: project constitution + specs dir"), parent `7a9e932` ("feat: upgrade to
Vite 8, Node 24"). Every quote below is a single line copied verbatim from the
cited file at that commit. Analysis only — no code was edited.

Task bead served by every REQ below: **bc-gdk9** (S0, convoy bc-ysp7).
Slice numbers refer to the scope.md task-slice table.

## Verified non-file facts (git/fs state @ f2ab61e)

- `git tag -l` is **empty** — no `v5-base` tag exists locally; origin is
  `https://github.com/Realetive/bem-core.git` (fetch+push). Commit `7a9e932`
  exists in history as HEAD~1 — the tag target is real. Verifying the tag on
  origin and creating it only-if-absent (Q1) is implementation-time work.
- `specs/` exists and is empty (created by commit f2ab61e). `dist/` does not
  exist (gitignored via `/dist`).
- **MPL notices**: `grep -rl 'MPL' --include='*.js'` over common.blocks,
  desktop.blocks, touch.blocks, build, test returns **0 files**. The license
  lives only in `LICENSE.txt` and package.json:15. CONST-P5's "file-level MPL
  notices" currently hold vacuously; the S0 notices baseline must record the
  **empty** JS notice list (or the spec must decide notices get re-added —
  ratify at spec-craft).
- **Standalone platform modules recount — CORRECTED 2026-09-30 (spec-review
  F-1).** The original harvest below read "7 groups / 12 files", but it applied
  an undocumented standalone filter (no same-basename file in common.blocks)
  that REQ-10's include-set prose never states. Under REQ-10's include-set as
  written ({.js,.deps.js,.bemhtml.js,.bh.js,.css} under desktop.blocks/ +
  touch.blocks/, excluding *.bemjson.js and *.examples/), the verified baseline
  @ f2ab61e = **19 files (8 desktop + 11 touch)**, independently re-verified by
  the review coordinator and the draft fix. The spec pins the file count alone
  (files are the only unit; no group/entity counting). Original reading kept
  for the record: desktop = `jquery__config` (deps variant only),
  `jquery__event_type_winresize` (2 files), `page__conditional-comment` (2),
  `ua` (ua.js); touch = `page__icon` (2), `ua` (ua.js + ua.deps.js), `ua__dom`
  (2) — a 7-group/12-file subset under the standalone filter.
- `common.blocks/ua` has **no ua.js and no ua.deps.js** — the ua JS module is
  platform-level only (desktop.blocks/ua/ua.js, touch.blocks/ua/ua.js).
- `common.blocks/loader` has **no root loader.js** today — only `_type/`
  mods (`loader_type_js.js`, `loader_type_bundle.js`). The design's
  "loader (root loader.js, canonical from S3)" names the S3 target, not current
  state.
- `common.blocks/env` **does not exist** (S1 artifact). The design inventory's
  "…`env`, `ua` — all under common.blocks/" describes the post-S1/S3 surface;
  the S0 pinned inventory must pin what exists @ f2ab61e.
- CONST-P1 allowlist = **9 entries** (CONSTITUTION.md:28-36), matching the
  "9-entry ratchet" claim.
- CHANGELOG.md / CHANGELOG.ru.md have **no `## Unreleased` section** (top
  heading is `## 5.0.0`); MIGRATION(.ru) similarly starts at `## 5.0.0`.
- CI Node matrix is `[20, 22]` (ci.yml:25) — matches C5.

---

## REQ candidates (work REQs; 11 — within the 10–11 budget)

### R1 · v5-base anchor verification — type: **add** (slice 1)

Creates the annotated tag `v5-base` = `7a9e932` on origin only if absent (Q1).

Evidence:
- CONSTITUTION.md:55 :: CONST-P5 :: "### CONST-P5: Hard fork anchored at tag v5-base"
- CONSTITUTION.md:56 :: CONST-P5 :: "This fork diverges globally; tag `v5-base` is the comparison point for"

ACC candidates:
- `git rev-parse v5-base^{commit}` → contains `7a9e932`

### R2 · Pinned deep-import inventory + api-pin test — type: **add** (slice 2)

New inventory artifact pinning today's supported deep-imports + a Node test
that fails on inventory drift (makes CONST-P4 mechanically enforceable; D-6
deleted-path negative tests included).

Evidence (integration anchors — the wildcard that admits deep imports today,
plus the inventory's actual module surfaces):
- package.json:22 :: exports :: `    "./*": "./*"`
- common.blocks/i-bem/i-bem.vanilla.js:530 :: i-bem :: "export default {"
- common.blocks/i-bem-dom/i-bem-dom.js:1220 :: bemDom :: "export default bemDom"
- common.blocks/events/events.vanilla.js:242 :: Emitter :: "export default { Emitter, Event }"
- common.blocks/dom/dom.js:22 :: dom :: "export default {"
- common.blocks/loader/_type/loader_type_js.js:33 :: loader :: `    (path, success, error) => {`
- desktop.blocks/ua/ua.js:2 :: ua :: " * @module ua"
- build/platforms/desktop.js:53 :: keyboard__codes :: "import 'bem:keyboard__codes';"

Factual corrections for the spec (see non-file facts): inventory must record
that `env` does not exist yet, `ua` JS is platform-only, and root `loader.js`
is the S3 canonical form (today only `_type` mods exist).

ACC candidates:
- `npm test` → contains `api-pin` (pin test joins the node --test corpus; exact path fixed by spec, e.g. test/api-pin.test.js)

### R3 · Exports-map narrowing + named-export barrel v1 + repository.url + MIGRATION cells — type: **change** (slices 3+4+15, merged)

Modifies package.json exports (`"./*"` → `./common.blocks/*` + enumerated
entries; root `.` → `dist/index.mjs`; `./dist/{desktop,touch}` payloads), fixes
`repository.url`, lands barrel `dist/index.mjs` re-exporting existing modules
(bemDom, BemDomCollection, dom, Emitter, Event, channels — plain names, D-7),
and carries the bilingual MIGRATION cell + CHANGELOG Unreleased.

Evidence (current code being modified):
- package.json:20 :: exports :: `    ".": "./dist/desktop/bem-core.mjs",`
- package.json:21 :: exports :: `    "./build/plugins/*": "./build/plugins/*",`
- package.json:22 :: exports :: `    "./*": "./*"`
- package.json:8 :: repository.url :: `    "url": "git://github.com/bem/bem-core.git"`
- build/vite.config.js:32 :: outDir :: `            outDir: resolve(rootDir, 'dist', platform),`

Evidence (barrel's existing module anchors — all default-export today):
- common.blocks/i-bem-dom/i-bem-dom.js:1220 :: bemDom :: "export default bemDom"
- common.blocks/i-bem-dom/__collection/i-bem-dom__collection.js:160 :: BemDomCollection :: "export default BemDomCollection"
- common.blocks/dom/dom.js:22 :: dom :: "export default {"
- common.blocks/events/events.vanilla.js:242 :: Emitter :: "export default { Emitter, Event }"
- common.blocks/events/__channels/events__channels.vanilla.js:7 :: channels :: "const channels = new Map()"
- common.blocks/events/__channels/events__channels.vanilla.js:9 :: channels :: "export default"

Evidence (ledger substrate):
- MIGRATION.md:5 :: ym migration section :: "### ym → ES modules"
- MIGRATION.ru.md:5 :: ym migration section :: "### ym → ES-модули"
- CHANGELOG.md:3 :: version heading :: "## 5.0.0"

ACC candidates:
- `node -p "JSON.stringify(require('./package.json').exports)"` → contains `./common.blocks/*`
- `node -p "require('./package.json').repository.url"` → contains `Realetive/bem-core`
- `npm run build:desktop && node --input-type=module -e "const m = await import('./dist/index.mjs'); ['bemDom','BemDomCollection','dom','Emitter','Event','channels'].forEach(k => { if(!(k in m)) process.exit(1) })"` → contains `undefined` absent / exit 0
- `grep -c '^## Unreleased' CHANGELOG.md CHANGELOG.ru.md` → contains `:1` on both

### R4 · Bundle-budget gate + staged guard — type: **add** (slice 5)

New `specs/bundle-budget.json` (gz caps measured+10%; capped artifacts
enumerated: both payloads AND `dist/index.mjs` unless rationale recorded —
ratify) + `build/check-bundle-size.mjs` with ratchet semantics and a staged
guard (skip/preview exit 0 while allowlist ≠ ∅ OR wrapper exists OR package.json
lists jquery; no-jquery-in-artifact + jquery-dep-removal assertions activate
at S6).

Evidence (build producing the capped artifacts; jquery deps keyed by the guard):
- build/vite.config.js:27 :: entry :: `                entry: resolve(import.meta.dirname, 'platforms', \`${platform}.js\`),`
- build/vite.config.js:32 :: outDir :: `            outDir: resolve(rootDir, 'dist', platform),`
- build/vite.config.js:37 :: external :: `                external: ['jquery'],`
- package.json:25 :: peerDependencies :: `    "jquery": "^4.0.0"`
- package.json:34 :: devDependencies :: `    "jquery": "^4.0.0",`
- common.blocks/jquery/jquery.js:11 :: jquery wrapper :: "export default jQuery"
- package.json:49 :: build:desktop :: `    "build:desktop": "BEM_PLATFORM=desktop vite build --config build/vite.config.js",`
- .github/workflows/ci.yml:56 :: build job :: "      - run: npm run build"
- CONSTITUTION.md:28 :: CONST-P1 allowlist :: `ALLOW="common.blocks/dom/dom.deps.js"`

ACC candidates:
- `npm run build && node build/check-bundle-size.mjs` → exit 0 with binding output
- `node build/check-bundle-size.mjs --preview` → exit 0 with skip/preview output

### R5 · Staged-gate meta-test — type: **add** (slice 6)

Fixture-repo meta-test proving guard semantics: skip-state → exit 0 + preview;
bind-state-clean → exit 0 + binding; bind-state-dirty (planted jquery import /
artifact byte) → exit 1; bidirectional-ratchet red fixture (stale allowlist
entry → exit 1). Same first-landing red proof carried by check-bundle-size.mjs
and the doc fence.

Evidence (test corpus registration point the meta-test joins):
- package.json:44 :: test :: `    "test": "node --test build/plugins/vite-plugin-bem-levels.test.js common.blocks/i18n/i18n.test.js",`
- build/plugins/vite-plugin-bem-levels.test.js:13 :: test imports :: "} from './vite-plugin-bem-levels.js';"
- .github/workflows/ci.yml:33 :: test job :: "      - run: npm test"

ACC candidates:
- `npm test` → contains `pass` (meta-test file joins the node --test corpus; exact path fixed by spec, e.g. test/gate-fixtures.test.js)

### R6 · Generated platform entries + payload parity — type: **change** (slice 7)

Replaces the hand-maintained `build/platforms/{desktop,touch}.js` with entries
generated from the plugin scan registry (committed `build/platforms/*.gen.js`,
canonical sorted imports, static `bem:` edges); CI re-runs generator + diffs
(freshness); payload-parity assertion vs checked-in pre-S0 lists incl.
`keyboard__codes` (silent drop forbidden, OQ-6).

Evidence (the hand lists being deleted; the registry the generator reads):
- build/platforms/desktop.js:10 :: hand list :: "import 'bem:identify';"
- build/platforms/desktop.js:53 :: keyboard__codes :: "import 'bem:keyboard__codes';"
- build/platforms/touch.js:52 :: keyboard__codes :: "import 'bem:keyboard__codes';"
- build/plugins/vite-plugin-bem-levels.js:395 :: buildRegistry :: "function buildRegistry(levels, rootDir) {"
- build/plugins/vite-plugin-bem-levels.js:579 :: resolveId :: `                return VIRTUAL_PREFIX + id.slice(BEM_PREFIX.length)`
- build/plugins/vite-plugin-bem-levels.js:671 :: named exports :: "    buildRegistry,"
- build/plugins/vite-plugin-bem-levels.js:648 :: api :: "            getRegistry() { return getRegistry(); },"
- common.blocks/keyboard/__codes/keyboard__codes.js:4 :: keyboard__codes :: "export default {"

ACC candidates:
- `node build/generate-platform-entries.mjs && git diff --exit-code -- build/platforms/` → exit 0 (freshness; generator path fixed by spec)
- `node build/generate-platform-entries.mjs && diff <(grep -oE "bem:[a-zA-Z_-]+" build/platforms/desktop.gen.js | sort -u) <(grep -oE "bem:[a-zA-Z_-]+" specs/pre-s0-platforms-desktop.txt | sort -u)` → exit 0 (payload parity incl. keyboard__codes)

### R7 · Plugin transformer-form hard error — type: **change** (slice 8)

`buildRegistry`/`generateBarrel` error when a chain index ≥ 1 is not
`export default function(prev)`; live in S0; plugin's existing test corpus is
the verifier.

Evidence (current code being modified — silently accepts any param shape):
- build/plugins/vite-plugin-bem-levels.js:185 :: parseEsModule :: `    const isRedefinition = /export\s+default\s+function\s*\([^)]+\)\s*\{/.test(source)`
- build/plugins/vite-plugin-bem-levels.js:503 :: generateBarrel :: "function generateBarrel(name, entries, rootDir) {"
- build/plugins/vite-plugin-bem-levels.js:612 :: load :: `                const barrel = generateBarrel(moduleName, entries, rootDir)`
- build/plugins/vite-plugin-bem-levels.test.js:11 :: test imports :: "    generateBarrel,"

ACC candidates:
- `node --test build/plugins/vite-plugin-bem-levels.test.js` → contains `pass` (corpus extended with transformer-form red cases)

### R8 · Timeboxed dynamic-import spike + dated decision record — type: **add** (slice 9)

`import(variable)` through the dev-server test config + lib build; record Vite
8/rolldown behavior as a dated decision-record section of the S0 spec (cited by
S3); smoke: generated entry resolves through both build paths; one narrowed
deep-import fails to resolve through the dev-server test config (Vite half of
the exports tripwire) or Node-only scope recorded as the deliberate bound.

Evidence (both build paths the spike exercises; the dynamic-import subject):
- playwright.config.js:16 :: webServer :: `        command: 'node node_modules/.bin/vite --config build/vite.test.config.js --port 5174',`
- build/vite.test.config.js:13 :: platform :: `            platform: 'desktop',`
- build/vite.config.js:27 :: entry :: `                entry: resolve(import.meta.dirname, 'platforms', \`${platform}.js\`),`
- common.blocks/loader/_type/loader_type_js.js:29 :: loader :: `     * @param {String} path resource link`
- common.blocks/loader/_type/loader_type_js.js:33 :: loader :: `    (path, success, error) => {`

ACC candidates:
- `grep -c "dynamic-import" specs/bc-ysp7.md` → contains a count ≥ 1 (decision record section exists; attested review of its content)
- `grep -n "Decision record" specs/bc-ysp7.md` → contains a dated heading

### R9 · test/dist purge — type: **change** (slice 10)

Checked-in build-fixture output deleted (`test/dist/fixtures/*`,
`test/dist/assets/`) + `.gitignore` entry; fixtures regenerate on demand via
`test/dist/build-fixtures.js`.

Evidence (checked-in generator output + regeneration path + gitignore gap):
- test/dist/build-fixtures.js:8 :: fixturesDir :: `    fixturesDir = path.join(__dirname, 'fixtures'),`
- test/dist/build-fixtures.js:27 :: borschik output :: `            output : path.join(fixturesDir, basename)`
- .gitignore:19 :: dist ignore :: "/dist"
- package.json:1 :: gitignore substrate :: ".project"

(Verified: `test/dist/fixtures/` contains checked-in chai.js, mocha.css,
mocha.js, sinon.js, sinon-chai.js, desktop.html, touch.html; `.gitignore` has
no `test/dist` entry — only `/*.tests` at line 27, which does not match.)

ACC candidates:
- `git ls-files test/dist/fixtures` → empty output
- `grep -n "test/dist" .gitignore` → contains `test/dist`

### R10 · Constitution amendments: CONST-P6 skeleton + CONST-P1 final predicate + bidirectional sdd-check + MPL notices baseline — type: **change** (slices 11+12+14, merged)

Same S0 PR: CONST-P6 ancestor-existence check (baseline = the 19 files
(8 desktop + 11 touch) corrected above, authored with its baseline file as
comparison substrate; the substrate is the full include-set file list —
standalone-ness is the check's outcome, not the baseline's filter);
CONST-P1 final multi-grep predicate (import-form patterns; sources + test/ +
build/; exclusions; skip/preview until conclusive S6); CONST-P1 sdd-check made
bidirectional + direction-2 red fixture + scripted per-slice allowlist pins;
MPL notices baseline (see the empty-list correction above).

Evidence (constitution being amended — current one-directional deps-only check):
- CONSTITUTION.md:18 :: CONST-P1 :: "### CONST-P1: No new consumers of the jquery wrapper — ratchet only in"
- CONSTITUTION.md:25 :: sdd-check :: `JQ=$(grep -rl 'jquery' --include='*.deps.js' . 2>/dev/null \`
- CONSTITUTION.md:37 :: sdd-check :: `BAD=$(printf '%s\n' "$JQ" | LC_ALL=C comm -23 - <(printf '%s\n' "$ALLOW" | LC_ALL=C sort))`
- CONSTITUTION.md:62 :: CONST-P5 check :: "test -f LICENSE.txt"
- CONSTITUTION.md:13 :: amendment process :: "Изменения в этот файл проходят PR — он и есть ревью архитектурных правил."

Evidence (CONST-P6 substrate — standalone platform modules without common ancestors):
- desktop.blocks/ua/ua.js:2 :: ua :: " * @module ua"
- desktop.blocks/jquery/__event/_type/jquery__event_type_winresize.js:6 :: jquery redef :: "import $ from 'bem:jquery';"
- touch.blocks/ua/__dom/ua__dom.js:2 :: ua__dom :: " * @module ua__dom"
- package.json:15 :: license :: `  "license": "MPL-2.0",`

ACC candidates:
- `test -f LICENSE.txt` → exit 0
- `bash specs/check-platform-baseline.sh` → exit 0 (path fixed by spec; asserts baseline = 19 files, 8 desktop + 11 touch)
- bidirectional CONST-P1 ACC (after amendment): run the clause's sdd-check body against a planted stale-allowlist fixture → exit 1; live repo → exit 0

### R11 · Doc-parity fence — type: **add** (slice 13)

en↔ru anchor-count equality on `^#{2,3} ` headings; file-set = MIGRATION(.ru) +
CHANGELOG(.ru) pairs per commit; whether it extends to block-doc pairs ratified
at this spec-craft.

Evidence (the paired ledgers + a block-doc pair that exists today):
- MIGRATION.md:3 :: ledger :: "## 5.0.0"
- MIGRATION.ru.md:3 :: ledger :: "## 5.0.0"
- CHANGELOG.md:3 :: ledger :: "## 5.0.0"
- CHANGELOG.ru.md:3 :: ledger :: "## 5.0.0"
- common.blocks/i-bem/i-bem.en.md:1 :: block doc :: "# i-bem"
- common.blocks/i-bem/i-bem.ru.md:1 :: block doc :: "# i-bem"

(Verified: MIGRATION.md has 63 `#`-headings; en/ru section headings match at
the top of file — e.g. `### ym → ES modules` / `### ym → ES-модули`.)

ACC candidates:
- `node build/check-doc-parity.mjs` → exit 0 (path fixed by spec)
- `grep -c '^## Unreleased' CHANGELOG.ru.md` → contains `:1`

---

## Constraint REQs (invariants; each cites its constitution clause ids)

### K1 · Approved spec precedes implementation — cites CONST-D1, CONST-U3

Evidence:
- ~/.gc/constitution.domain.md (CONST-D1): "Every implementation task requires an approved spec before any mutating work"
- scope constraint C1/governance: this harvest is read-only.

ACC candidates:
- attested: spec-gate-guard enforcement; no ACC command (process invariant).

### K2 · Spec lands at specs/bc-ysp7.md, committed with the code — cites CONST-D2

ACC candidates:
- `test -f specs/bc-ysp7.md` → exit 0

### K3 · Evidence anchored, never naked — cites CONST-D3

ACC candidates:
- attested: the machine gate (verify-citations step bc-v3h8) enforces the schema on this harvest's successor spec.

### K4 · No secrets in specs or artifacts — cites CONST-D4

ACC candidates:
- `! grep -rEn '(API_KEY|SECRET|PASSWORD)=[^ ]+' specs/ 2>/dev/null` → exit 0 (the clause's own sdd-check)

### K5 · CONST-P1 ratchet: S0 allowlist Δ = none; check becomes bidirectional — cites CONST-P1

Evidence:
- CONSTITUTION.md:19 :: CONST-P1 :: "Consumers of `common.blocks/jquery` may only be removed, never added. The"

ACC candidates:
- `git diff f2ab61e -- CONSTITUTION.md | grep -c '^-ALLOW\|^+common.blocks' ` → 0 allowlist additions (attested direction; exact form fixed by spec)

### K6 · ESM-first: all new S0 code (barrel, *.gen.js, check scripts) uses import/export — cites CONST-P2

Evidence:
- CONSTITUTION.md:41 :: CONST-P2 :: "### CONST-P2: ESM-first — new code uses import/export"

ACC candidates:
- `grep -L "import" build/check-bundle-size.mjs build/generate-platform-entries.mjs build/check-doc-parity.mjs` → empty output (files exist and import; paths fixed by spec)

### K7 · Platform layers override-only, machine-checked from S0 — cites CONST-P3

Evidence:
- CONSTITUTION.md:46 :: CONST-P3 :: "### CONST-P3: Platform layers are override-only"

ACC candidates:
- `bash specs/check-platform-baseline.sh` → exit 0 (shared with R10)

### K8 · Public API shrinks only with documented migration (the two enumerated breaks) — cites CONST-P4

Evidence:
- CONSTITUTION.md:50 :: CONST-P4 :: "### CONST-P4: Public API surface shrinks only with documented migration"

ACC candidates:
- `grep -c "S0" MIGRATION.md` → count ≥ 1 and same for MIGRATION.ru.md (bilingual cell, same commit)

### K9 · Hard fork + license intact — cites CONST-P5

Evidence:
- CONSTITUTION.md:55 :: CONST-P5 :: "### CONST-P5: Hard fork anchored at tag v5-base"

ACC candidates:
- `test -f LICENSE.txt` → exit 0 (the clause's own sdd-check)

### K10 · Decisions durable — OQ dispositions and the spike record live in the spec, not chat — cites CONST-U1

ACC candidates:
- `grep -c "OQ-" specs/bc-ysp7.md` → count ≥ 6 (OQ-2, OQ-5, OQ-6, OQ-7, OQ-9, OQ-11)

### K11 · No force-push, append-only history — cites CONST-U2

ACC candidates:
- attested: git history inspection at done-gate (tag creation + slice PR are append-only).

### K12 · Behavior parity by default; v5 buildable, lint/unit/browser green; Node matrix unchanged — cites CONST-U3 (spec-first on divergence), CONST-P4 (only the two enumerated export-surface breaks)

Evidence:
- .github/workflows/ci.yml:25 :: node matrix :: `          node-version: [20, 22]`

ACC candidates:
- `npm run test:all` → exit 0 (lint via separate `npm run lint` ACC)
- `npm run lint` → exit 0
- `grep -n "node-version: \[20, 22\]" .github/workflows/ci.yml` → contains `[20, 22]`

---

## Coverage matrix (slice → REQ)

| Slice | REQ |
|---|---|
| 1 v5-base anchor | R1 |
| 2 inventory + pin test | R2 |
| 3 exports narrowing | R3 |
| 4 barrel v1 | R3 |
| 5 bundle gate + staged guard | R4 |
| 6 staged-gate meta-test | R5 |
| 7 generated entries + parity | R6 |
| 8 transformer-form error | R7 |
| 9 dynamic-import spike | R8 |
| 10 test/dist purge | R9 |
| 11 CONST-P6 skeleton | R10 |
| 12 constitution amendments | R10 |
| 13 doc-parity fence | R11 |
| 14 MPL notices baseline | R10 |
| 15 repo metadata + inherit freeze | R3 (metadata) |

Inherit freeze (Q4-a, OQ-7) anchors for the R3/K-record — zero code change,
mutation recorded as internal:
- common.blocks/i-bem/i-bem.vanilla.js:26 :: entities :: "const entities = {}"
- common.blocks/i-bem/i-bem.vanilla.js:163 :: entities :: `        (entityCls = entities[entityName] = inherit(base, props, staticProps))`
- common.blocks/i-bem/i-bem.vanilla.js:547 :: entities :: "    entities,"
- common.blocks/inherit/inherit.vanilla.js:107 :: inherit.self :: "inherit.self = function() {"

Every slice in scope.md maps to ≥1 REQ; all 11 work REQs are change/add with
≥1 path citation each; all constraint REQs cite CONST ids. Ready for
spec drafting (bead bc-y56d).
