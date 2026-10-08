---
id: specs/bc-cah4.md
title: "S1 env/ua: capability env module, ua alias, platform fork collapse (arch-overhaul strangler slice 1)"
status: approved
approved_at: 2026-10-05T11:53:25Z
source: .designs/arch-overhaul/design-doc.md
---

# Intent

The `ua` surface is two disjoint platform forks — a desktop jQuery-1.8-style
browser sniff and a touch module that grabs features at module-eval time over a
jquery resize binding — with no public `env` module, no emulation path, and the
touch fork carrying the last jquery edge in the ua family. Slice S1 replaces
both forks with one public capability module `env` plus a one-release
live-forwarding `ua` Proxy alias, moves `ua__dom` to common with a touch
transformer delta, and verifies the G2 "tests" leg through a touch-emulated
Playwright project with its own serving path.

# Behavior

## REQ-1 (add): env public module (getters only, no module-eval DOM reads)

`common.blocks/env/env.js` (new, ESM per CONST-P2) default-exports a
getter-only object. Lazy memoized getters — memoized per distinct observed
`navigator.userAgent` string so detection is compute-once in production while
units may exercise fixture UAs: `ua` (raw string, diagnostic), `platform`
(object: `ios`/`android`/`bada`/`wp` version strings, `other: true` when no
mobile platform matches — detection regexes carried verbatim from
`touch.blocks/ua/ua.js` incl. the HTC fake-desktop Android 2.3 fallback),
`ios`, `android` (convenience version getters), `browser` (object with
`opera`/`chrome` version strings, kept one release per OQ-8; opera detects
legacy `window.opera.version()` or `OPR/`-form UA, chrome `CrMo/`- or
`Chrome/`-form UA), `screenSize` (`'large'|'normal'|'small'` by
`screen.width`), `svg` (createElementNS probe). Live getters:
`width`/`height` (`window.innerWidth`/`innerHeight`), `landscape`
(`width > height`). UA-derived getters (`platform`/`ios`/`android`/`browser`)
are G2-justified: the audited consumer (`ua__dom` platform/browser modifiers)
reads them and platform identity is not a capability question; each carries a
dedicated unit (REQ-10). Capability probes (`svg`/`screenSize`) and live
probes (`width`/`height`/`landscape`) are distinguished as such. No getter
reads the DOM before first access; a `typeof window === 'undefined'`
environment yields `ua: ''`, `platform: { other: true }`, falsy probes, and
0-valued live probes without throwing.

- Evidence: `touch.blocks/ua/ua.js:16 :: platform :: "    platform.android = match[1];"`
- Evidence: `touch.blocks/ua/ua.js:55 :: support :: "support.svg = !!(doc.createElementNS && doc.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect);"`
- Evidence: `touch.blocks/ua/ua.js:155 :: screenSize :: "    screenSize : screen.width > 320? 'large' : screen.width < 320? 'small' : 'normal',"`
- Evidence: `build/barrel.js:19 :: channels :: "export { default as channels } from 'bem:events__channels';"`

## REQ-2 (add): native orientchange CustomEvent with Android shrink-guard

`env` registers one native `resize` listener on `window` (guarded by
`typeof window !== 'undefined'`; listener count is an implementation detail,
self-review attested) that dispatches
`new CustomEvent('orientchange', { detail: { landscape, width, height } })`
on `window` **only when both landscape and width changed** relative to the
last dispatch (today's Android shrink-guard heuristic, preserved: the guard
state — today `lastOrient`/`lastWidth`, renamed `lastLandscape`/`lastWidth` —
updates only on dispatch). MIGRATION carries the
transport change: `$(win).on('orientchange', (e, data) => …)` →
`window.addEventListener('orientchange', e => … e.detail.landscape …)`.
The guard is pinned by emulation-parity tests (REQ-10).

- Evidence: `touch.blocks/ua/ua.js:69 :: lastOrient :: "let lastOrient = win.innerWidth > win.innerHeight,"`
- Evidence: `touch.blocks/ua/ua.js:78 :: landscape :: "        if(landscape !== lastOrient && width !== lastWidth) {"`
- Evidence: `touch.blocks/ua/ua.js:79 :: orientchange :: "            $win.trigger('orientchange', {"`

## REQ-3 (add): ua deprecated alias — one-release live-forwarding Proxy (D-13)

`common.blocks/ua/ua.js` (new) default-exports a Proxy that live-forwards
property reads to `env`: `ua`, `platform`, `ios`, `android`, `bada`, `wp`,
`other` (from `env.platform`), `browser`, `opera`, `chrome` (from
`env.browser`), `screenSize`, `svg`, `width`, `height`, `landscape`. Reads of
removed fields — the closed set `msie`, `webkit`, `safari`, `mozilla`,
`version`, `iphone`, `ipad`, `dpr`, `flash`, `connection`, `video` (any
non-forwarded, non-symbol key) warn once per field via `console.warn` and
return `undefined`; assignments warn once and no-op. Symbol-keyed reads never
warn. Contract is property-read access only: destructuring/spread snapshots
are unsupported by design (plan-review-2 F6). The alias ships in 6.0.0; its
removal (with `env.browser` legacy keys, OQ-8) is the first post-series
release, owned by no slice here. Field-disposition completeness (OQ-10):
every field the audited consumer reads is forwarded (`ios`, `android`, `bada`,
`wp`, `opera`, `chrome`, `screenSize`, `svg`, `landscape`, `width`, `height`)
— `bada`/`wp` ride `env.platform` (ratified working position). The frozen
`winresize` consumer's `ua.msie` read silently no-ops until S2 deletes it.

- Evidence: `touch.blocks/ua/ua.js:107 :: iphone :: "    iphone : device.iphone,"`
- Evidence: `touch.blocks/ua/ua.js:161 :: dpr :: "    dpr : win.devicePixelRatio || 1,"`
- Evidence: `desktop.blocks/jquery/__event/_type/jquery__event_type_winresize.js:9 :: msie :: "if(ua.msie && document.documentMode < 9) {"`

## REQ-4 (change): platform fork collapse — CONST-P1 −1, CONST-P6 −3

Delete `desktop.blocks/ua/ua.js` (+ `desktop.blocks/ua/ua.ru.md`) and
`touch.blocks/ua/ua.js` (+ `touch.blocks/ua/ua.ru.md`) and
`touch.blocks/ua/ua.deps.js`; `bem:ua` resolves to the common alias on both
platforms. `common.blocks/ua/__dom/ua__dom.js` (new) is the elem ancestor;
`touch.blocks/ua/__dom/ua__dom.js` becomes its override delta in
transformer-form `export default function(prev)` (plugin chain rule). The
`CONSTITUTION.md` CONST-P1 ALLOW list drops `touch.blocks/ua/ua.deps.js`
(9 → 8 entries) and `specs/platform-baseline.txt` drops its 3 ua-family
entries (19 → 16 files; standalone-list comment updated: desktop `ua` and
touch `ua` leave the standalone set, touch `ua__dom` remains standalone
deps-only — `touch.blocks/ua/__dom/ua__dom.deps.js` stays pinned, mirroring
`jquery__config (deps-only)`) — both in the same commit,
satisfying the two-directional ratchets.

- Evidence: `desktop.blocks/ua/ua.js:34 :: browser :: "export default browser"`
- Evidence: `touch.blocks/ua/ua.deps.js:2 :: shouldDeps :: "    shouldDeps : 'jquery'"`
- Evidence: `CONSTITUTION.md:40 :: ALLOW :: "ALLOW="common.blocks/dom/dom.deps.js"`
- Evidence: `specs/platform-baseline.txt:18 :: ua :: "desktop.blocks/ua/ua.js"`
- Evidence: `build/plugins/vite-plugin-bem-levels.js:495 :: isTransformer :: "            const isTransformer = /export\s+default\s+function\s*\([^)]+\)\s*\{/.test(source)"`

## REQ-5 (change): ua__dom onto env — common base + touch delta, no jquery

The common base declares the `ua` block: at `js_inited` it sets mods from env
getters — `platform` (`ios`|`android`|`bada`|`wp`|`opera`|`other` precedence
preserved), `browser` (`opera`|`chrome`|`''`), `ios` (major digit),
`android` (major digit), `ios-subversion` (`\d\.\d` with dot stripped),
`screen-size` (`env.screenSize`), `svg` (`'yes'|'no'`). The touch delta
(transformer over the base) additionally sets `orient`
(`env.landscape ? 'landscape' : 'portrait'`) and subscribes to `orientchange`
on `bemDom.win` via `_domEvents`, updating the `orient` mod from
`e.detail.landscape`. The old `staticProps = ua` module binding is dropped
(ua fields as block-class statics were internal; env module getters replace
them — noted in MIGRATION). No `bem:jquery` import remains anywhere in the ua
family.

- Evidence: `touch.blocks/ua/__dom/ua__dom.js:7 :: ua :: "import ua from 'bem:ua';"`
- Evidence: `touch.blocks/ua/__dom/ua__dom.js:9 :: declBlock :: "export default bemDom.declBlock('ua',"`
- Evidence: `touch.blocks/ua/__dom/ua__dom.js:31 :: orient :: "                        .setMod('orient', ua.landscape? 'landscape' : 'portrait')"`
- Evidence: `touch.blocks/ua/__dom/ua__dom.js:35 :: width :: "                                ua.width = data.width;"`

## REQ-6 (change): touch-emulated Playwright project with its serving path

`build/vite.test.config.js` parametrizes the platform (`BEM_TEST_PLATFORM`,
default `desktop`) and port (`BEM_TEST_PORT`, default 5174 desktop / 5175
touch). `playwright.config.js` defines two named projects: `chromium`
(today's desktop-resolution suite, port 5174) and `chromium-touch` (touch
resolution, port 5175, Playwright touch-device emulation — hasTouch, mobile
viewport, device UA). `test/browser/entry.js` imports `bem:env`, `bem:ua`,
`bem:ua__dom` and registers them in the modules shim. CI's `test-browser`
job runs the full config (both projects). D-15 scope: Chromium-only; the
touch project is emulation, not a separate engine.

- Evidence: `playwright.config.js:13 :: baseURL :: "        baseURL: 'http://localhost:5174',"`
- Evidence: `build/vite.test.config.js:13 :: platform :: "            platform: 'desktop',"`
- Evidence: `build/vite.test.config.js:30 :: port :: "        port: 5174,"`
- Evidence: `test/browser/entry.js:50 :: loader :: "import loader from 'bem:loader';"`

## REQ-7 (change): barrel + api-pin/inventory update (same commit)

`build/barrel.js` gains `env` and `ua` re-exports (plain names, DOM flavor
per D-7); `test/api-pin.test.js` adds `bem-core/common.blocks/env/env.js` and
`bem-core/common.blocks/ua/ua.js` to `PINNED_PUBLIC_DEEP_IMPORTS`, updates
the barrel-name assertion to the eight-name set, and keeps the
`desktop.blocks/ua/ua.js` / `touch.blocks/ua/ua.js` deleted-path negatives
(platform-only JS stays never-exported). Line-disjoint from S3's loader
switch — merge order free.

- Evidence: `build/barrel.js:19 :: channels :: "export { default as channels } from 'bem:events__channels';"`
- Evidence: `test/api-pin.test.js:51 :: dom :: "    'bem-core/common.blocks/dom/dom.js',"`
- Evidence: `test/api-pin.test.js:129 :: bemDom :: "        for (const name of ['bemDom', 'BemDomCollection', 'dom', 'Emitter', 'Event', 'channels']) {"`

## REQ-8 (change): platform entries regenerated + payload-parity amendment

Regenerate `build/platforms/*.gen.js` (desktop gains `bem:env`, `bem:ua__dom`;
touch gains `bem:env`; counts update). Amend `test/platform-entries.test.js`
payload-parity with an explicit per-slice additions ledger (S1: +env both
payloads, +ua__dom desktop) so expected sets = pre-S0 lists + declared
additions; drops remain unamendable (OQ-6 no-silent-drop) and
`keyboard__codes` survives verbatim.

- Evidence: `test/platform-entries.test.js:44 :: payload parity :: "payload parity: generated bem: set equals the pre-S0 hand-list set"`
- Evidence: `specs/pre-s0-platforms-touch.txt:35 :: ua__dom :: "bem:ua__dom"`

## REQ-9 (change): budget stays green; amend caps only with measurement

`npm run build && node build/check-bundle-size.mjs` exits 0. If S1's measured
gz growth exceeds a cap, `specs/bundle-budget.json` is amended in the same
commit with fresh measured+10% values (explicit amendment per ratchet
semantics); shrinking without amendment is fine.

- Evidence: `specs/bundle-budget.json:6 :: gzipCapBytes :: ""gzipCapBytes": 12055,"`

## REQ-10 (add): env units, alias units, emulation parity (G2 tests leg)

New browser-suite specs (modules.define convention), loaded in BOTH projects,
plus one node-suite unit: one dedicated unit per UA-derived getter
(`platform`, `ios`, `android`, `browser` — fixture UAs via
`Object.defineProperty(navigator, 'userAgent')`,
justification comments), capability-probe units (`screenSize`, `svg` with
stubbed false path), live-probe units, the orientchange firing-guard pin
(stubbed `innerWidth`/`innerHeight` + dispatched `resize`: no dispatch on
orientation-only or width-only change; dispatch payload `{landscape, width,
height}`), alias units (once-per-field `console.warn` via sinon spy +
`undefined`; assignment once-warn no-op; symbol-keyed read asserts zero
warns; live forwarding of `width` after a stubbed resize), a node-side
`env` unit (`test/env-ssr.test.js` joining the npm-test corpus: importing
`common.blocks/env/env.js` in bare Node asserts the no-window clause of
REQ-1 — no throw, `ua === ''`, `platform.other === true`, falsy probes,
0-valued live probes), and `ua__dom` parity (block init asserts the full
REQ-5 mod set — platform precedence `ios|android|bada|wp|opera|other`,
`browser` `opera|chrome|''`, `ios`/`android` major digit, `ios-subversion`
dot-stripped `\d\.\d`, `screen-size`, `svg` `yes|no` — under both
resolutions; touch-delta `orient` mod + orientchange update — skipped by
feature-detect on desktop where the delta is absent).

- Evidence: `common.blocks/identify/identify.spec.js:1 :: spec :: "modules.define('spec', ["`
- Evidence: `test/browser/entry.js:99 :: sinon :: "    sinon,"`

## REQ-11 (change): docs Δ + MIGRATION ### S1 bilingual

`common.blocks/env/env.en.md` + `env.ru.md` (getter table: derived vs
capability vs live, orientchange contract); `common.blocks/ua/ua.en.md` +
`ua.ru.md` gain the alias note (live forwarding, removed-field list with
one-release warns, property-read-only contract, migration pointer to `env`).
`MIGRATION.md` + `MIGRATION.ru.md` gain `### S1 …` after the S0 section:
env introduction, orientchange transport change (code before/after), removed
ua fields, ua block statics note. `CHANGELOG.md` + `CHANGELOG.ru.md`
Unreleased entries appended. The doc-parity fence
(`build/check-doc-parity.mjs`) covers the MIGRATION and CHANGELOG pairs —
both stay green.

- Evidence: `MIGRATION.md:1571 :: S0 :: "### S0 Verification fence + public contracts"`
- Evidence: `MIGRATION.ru.md:1589 :: S0 :: "### S0 Проверочный каркас и публичные контракты"`
- Evidence: `common.blocks/ua/ua.ru.md:1 :: ua :: "# ua"`

# Acceptance

## ACC-1: lint green

Run `npm run lint` and expect exit 0

## ACC-2: node suite green (api-pin + amended parity pin)

Run `npm test` and expect exit 0

## ACC-3: browser suite green on both resolutions

Run `npm run test:browser` and expect exit 0

## ACC-4: build + bundle gate green

```bash
npm run build && node build/check-bundle-size.mjs
```

Expect exit 0

## ACC-5: CONST-P6 baseline ratchet at 16 files

Run `bash specs/check-platform-baseline.sh` and expect output contains `16 files`

## ACC-6: CONST-P1 allowlist at 8 entries

Run `bash specs/check-jquery-ratchet.sh` and expect output contains `8 entries`

## ACC-7: platform entries fresh

```bash
node build/generate-platform-entries.mjs && git diff --exit-code -- build/platforms/
```

Expect exit 0

## ACC-8: doc-parity fence green

Run `node build/check-doc-parity.mjs` and expect exit 0

## ACC-9: ua family carries no jquery edge

```bash
grep -rn "bem:jquery" -- common.blocks/ua common.blocks/env && exit 1 || echo UA_FAMILY_JQUERY_FREE
```

Expect output contains `UA_FAMILY_JQUERY_FREE`

## ACC-10: MIGRATION carries the bilingual S1 section

Run `grep -c "^### S1" MIGRATION.md MIGRATION.ru.md` and expect output contains `MIGRATION.md:1` and `MIGRATION.ru.md:1` (exactly one S1 section each)

# Non-goals

- RTL, passive listeners, input-modality (Q5) — no consumer exists.
- `winresize` rewrite/deletion — S2 scope; the alias's `undefined` msie
  silently no-ops its IE8 guard (verified harmless by the design notes).
- Alias removal and `env.browser` legacy-key death — first post-series
  release, owned by no slice of S0–S6.
- WebKit/Gecko touch harness — D-15 binds Chromium-only emulation.
- Benchmarks — S2 owns the bench project and v5-base reference capture.
