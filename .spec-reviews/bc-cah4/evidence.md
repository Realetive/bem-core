# Evidence — S1 env/ua (harvest, verbatim citations @ f048f32)

All quotes byte-for-byte from the working tree at the S1 branch point
(origin/v5 = f048f32).

## REQ-1 (add): env public module

Anchors that exist today (the probes/fields being centralized + the surfaces
the new module plugs into):

- `touch.blocks/ua/ua.js:15 :: platform :: "    platform.android = match[1];"` (Android detection moving into env)
- `touch.blocks/ua/ua.js:21 :: platform :: "    platform.ios = match[1].replace(/_/g, '.');"`
- `touch.blocks/ua/ua.js:55 :: support :: "support.svg = !!(doc.createElementNS && doc.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect);"`
- `touch.blocks/ua/ua.js:155 :: screenSize :: "    screenSize : screen.width > 320? 'large' : screen.width < 320? 'small' : 'normal',"`
- `build/barrel.js:18 :: channels :: "export { default as channels } from 'bem:events__channels';"` (barrel the env export joins)
- `test/api-pin.test.js:32 :: PINNED_PUBLIC_DEEP_IMPORTS :: "const PINNED_PUBLIC_DEEP_IMPORTS = ["` (pin inventory env joins)

## REQ-2 (add): native orientchange CustomEvent with Android shrink-guard

- `touch.blocks/ua/ua.js:69 :: lastOrient :: "let lastOrient = win.innerWidth > win.innerHeight,"`
- `touch.blocks/ua/ua.js:78 :: landscape :: "        if(landscape !== lastOrient && width !== lastWidth) {"` (firing guard preserved verbatim)
- `touch.blocks/ua/ua.js:79 :: orientchange :: "            $win.trigger('orientchange', {"` (jQuery synthetic transport being replaced)

## REQ-3 (add): ua deprecated Proxy alias (D-13)

- `touch.blocks/ua/ua.js:107 :: iphone :: "    iphone : device.iphone,"` (removed field)
- `touch.blocks/ua/ua.js:161 :: dpr :: "    dpr : win.devicePixelRatio || 1,"` (removed field)
- `touch.blocks/ua/ua.js:173 :: flash :: "    flash : support.flash,"` (removed field)
- `desktop.blocks/ua/ua.js:26 :: webkit :: "    browser.webkit = true;"` (removed field)
- `desktop.blocks/jquery/__event/_type/jquery__event_type_winresize.js:9 :: msie :: "if(ua.msie && document.documentMode < 9) {"` (frozen consumer whose read no-ops)

## REQ-4 (change): platform fork collapse (CONST-P1 −1, CONST-P6 −3)

- `desktop.blocks/ua/ua.js:34 :: browser :: "export default browser"` (fork being deleted)
- `touch.blocks/ua/ua.js:6 :: $ :: "import $ from 'bem:jquery';"` (jquery edge being deleted)
- `touch.blocks/ua/ua.deps.js:1 :: shouldDeps :: "    shouldDeps : 'jquery'"` (CONST-P1 −1)
- `CONSTITUTION.md:48 :: ALLOW :: "touch.blocks/ua/ua.deps.js\""` (allowlist entry removed)
- `specs/platform-baseline.txt:28 :: ua :: "touch.blocks/ua/ua.deps.js"` (baseline entry removed)
- `build/plugins/vite-plugin-bem-levels.js:495 :: isTransformer :: "            const isTransformer = /export\s+default\s+function\s*\([^)]+\)\s*\{/.test(source)"` (chain ≥1 transformer-form rule the touch delta must satisfy)

## REQ-5 (change): ua__dom rewritten onto env (off jquery)

- `touch.blocks/ua/__dom/ua__dom.js:7 :: ua :: "import ua from 'bem:ua';"`
- `touch.blocks/ua/__dom/ua__dom.js:9 :: declBlock :: "export default bemDom.declBlock('ua',"`
- `touch.blocks/ua/__dom/ua__dom.js:31 :: orient :: "                        .setMod('orient', ua.landscape? 'landscape' : 'portrait')"`
- `touch.blocks/ua/__dom/ua__dom.js:35 :: width :: "                                ua.width = data.width;"` (module mutation dying with live getters)

## REQ-6 (change): touch-emulated Playwright project + serving path

- `playwright.config.js:13 :: baseURL :: "        baseURL: 'http://localhost:5174',"`
- `build/vite.test.config.js:13 :: platform :: "            platform: 'desktop',"` (hardcode being parametrized)
- `build/vite.test.config.js:30 :: port :: "        port: 5174,"`
- `test/browser/entry.js:50 :: loaderTypeJs :: "import loaderTypeJs from 'bem:loader_type_js';"` (entry/shim pattern env/ua/ua__dom join)

## REQ-7 (change): barrel + api-pin/inventory update

- `build/barrel.js:18 :: channels :: "export { default as channels } from 'bem:events__channels';"`
- `test/api-pin.test.js:51 :: dom :: "    'bem-core/common.blocks/dom/dom.js',"`
- `test/api-pin.test.js:129 :: bemDom :: "        for (const name of ['bemDom', 'BemDomCollection', 'dom', 'Emitter', 'Event', 'channels']) {"`

## REQ-8 (change): platform entries regenerated + payload-parity amendment

- `test/platform-entries.test.js:36 :: payload parity :: "            it('payload parity: generated bem: set equals the pre-S0 hand-list set', function() {"`
- `test/platform-entries.test.js:45 :: keyboard__codes :: "            it('keyboard__codes survives generation (OQ-6: silent drop forbidden)', function() {"`
- `specs/pre-s0-platforms-touch.txt:35 :: ua__dom :: "bem:ua__dom"` (touch baseline already carries the token; desktop gains it via the common ancestor)

## REQ-9 (change): ratchet artifacts updated (ALLOW, baseline, budget)

- `CONSTITUTION.md:48 :: ALLOW :: "touch.blocks/ua/ua.deps.js\""`
- `specs/platform-baseline.txt:18 :: ua :: "desktop.blocks/ua/ua.js"` (removed entry)
- `specs/bundle-budget.json:8 :: dist/desktop/bem-core.mjs :: "    \"dist/desktop/bem-core.mjs\": {"` (caps amended only if measured growth exceeds them)

## REQ-10 (add): env/ua units + emulation parity (G2 tests leg)

- `common.blocks/identify/identify.spec.js:1 :: spec :: "modules.define('spec', ["` (spec-file convention the new units follow)
- `test/browser/entry.js:99 :: sinon :: "    sinon,"` (sinon available in the shim for warn spies)

## REQ-11 (change): docs Δ + MIGRATION ### S1 bilingual

- `MIGRATION.md:1571 :: S0 :: "### S0 Verification fence + public contracts"` (anchor the S1 section follows)
- `MIGRATION.ru.md:1589 :: S0 :: "### S0 Проверочный каркас и публичные контракты"`
- `common.blocks/ua/ua.ru.md:1 :: ua :: "# ua"`

## ACC candidates

- ACC: `npm run lint` exit 0
- ACC: `npm test` exit 0 (api-pin + platform-entries with amended expectations)
- ACC: `npm run test:browser` exit 0 (chromium + chromium-touch projects)
- ACC: `npm run build && node build/check-bundle-size.mjs` exit 0
- ACC: `bash specs/check-platform-baseline.sh` exit 0, output contains `16 files`
- ACC: `bash specs/check-jquery-ratchet.sh` exit 0, output contains `8 entries`
- ACC: `node build/generate-platform-entries.mjs && git diff --exit-code -- build/platforms/` exit 0
- ACC: `node build/check-doc-parity.mjs` exit 0
- ACC: grep pin: `! grep -rn "bem:jquery" common.blocks/ua touch.blocks desktop.blocks/ua` exit 1 (no jquery edges in the ua family)
