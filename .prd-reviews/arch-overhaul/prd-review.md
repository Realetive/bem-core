# PRD Review: bem-core v5 architecture overhaul (jquery-free, ESM-first, override-only platforms)

Sources: 6 parallel review legs (requirements bc-4qs, gaps bc-ic7, ambiguity bc-qmr,
feasibility bc-cj7, scope bc-d5y, stakeholders bc-4n5). Full leg reports:
`.plan-reviews/arch-overhaul/legs/report-*.txt`. All factual claims verified against
repo @ f2ab61e, branch v5.

## Executive Summary

The overhaul direction is sound and the strangler envelope (~6–8 slices, ≤12 REQ)
holds — but **only after corrections**. Six legs converge on four structural fixes:

1. **Slice 4 (pointerevent normalization) is phantom** — no pointer code exists in
   the fork (grep-verified across all levels). The only `__event_type_*` file is
   IE8-dead `winresize`. Delete slice 4; fold winresize disposal into the periphery
   or wrapper-removal slice. The real hidden cost is **jQuery event-normalization
   semantics** (delegation, `$.event.special`, `.bem()` plugin), which belongs to
   the events slice and is currently under-scoped there.
2. **The verification anchor is missing** — tag `v5-base` does not exist (zero tags
   local or on origin). Every parity claim (C4, US5, CONST-P5, G7) is unverifiable
   until a slice-0 creates it.
3. **"Public API" is triple-undefined and jQuery-typed** — the root dist export has
   zero named bindings (US1's `import { BemDom }` is fictional), the `./*` exports
   wildcard makes every file deep-importable, public signatures (`domElem`,
   `scope`/`doc`/`win`, `dom.contains`, `.bem()` plugin) carry jQuery collections,
   and no export-inventory/API-pinning test exists. This must become a slice-0
   deliverable plus an explicit type-contract decision (CONST-P4).
4. **"Zero internal jQuery" needs a mechanical completion predicate** — the
   CONST-P1 grep has a blind spot (`(^|/)jquery/` filter hides `desktop.blocks/
   jquery/*`), the test harness imports npm jquery directly (`test/browser/entry.js`),
   and "allowlist = ∅" alone does not imply a jquery-free artifact or bundle.

Additional convergent findings: ua has **no common ancestor** (env/ua is greenfield
authoring, not a refactor; touch ua is itself a jquery consumer → slice ordering
coupling); the touch platform has **zero test coverage** (vite test config pins
desktop; Playwright is chromium-only); the **spec harness is a migration surface**
(ym-authored specs, hand-maintained shim map, hard-coded >400 test gate); `inherit`
options (b)/(c) are research-scale (dynamic `__base` via source-string detection,
`inherit.self` live-class mutation) — legs recommend deciding **keep-frozen (a)
early**; bilingual (ru/en) doc updates are unbudgeted per slice; versioning/release
of a semver-breaking overhaul is unowned.

Scope leg's revised arithmetic (7 slices, all ≤12 REQ): S0 prerequisites · S1 env/ua
(8–12) · S2 periphery: dom+idle+winresize+benchmarks (6–8) · S3 loader (4–6) ·
S4 events core: native delegation + dom-type (8–12) · S5 bem-type events + `$.fn.bem`
split (6–10) · S6 inherit decision, (a)-only gate (2–4) · S7 platform check +
wrapper removal + allowlist=∅ (8–10).

## Before You Build: Critical Questions

These gate the design doc and must go to the human:

1. **v5-base anchor:** create annotated tag `v5-base` at current v5 HEAD (f2ab61e)
   before slice 1, or pin a different SHA? Who pushes it?
2. **jQuery wrapper fate (OQ1):** delete outright (scope leg: hard fork, no known
   external consumers) vs optional compat shim + peer-dep retention + EOL date
   (stakeholders leg: wrapper is documented public API in README/jQuery docs,
   peer-dep jquery ^4, UMD global, `./*` deep-import path). Includes peer-dep
   removal and major-version decision.
3. **Public API contract (OQ8 promoted):** (a) define the public surface as an
   inventory (root named exports? touch entry? is `./*` deep-import public? which
   blocks fall under CONST-P4 policing — the constitution names i-bem/i-bem-dom/
   events but the PRD treats loader/ua/dom/inherit as public too) and (b) decide
   the **DOM type contract** replacing jQuery collections in signatures (`domElem`,
   `getFocused()`, `contains()`, `.bem()` plugin). Note US1's named-import story
   requires amending the "no public API additions" Non-Goal or scoping US1 to
   deep-imports.
4. **inherit decision (G4/OQ4):** accept recommendation to freeze `inherit` as an
   internal implementation detail now (option a) and defer native-class options to
   a named future phase? (b)/(c) conflict with dynamic `__base`, `inherit.self`
   re-open semantics, and CONST-P4.
5. **env API shape (G2/OQ2):** scope the new env module strictly by the audited
   internal consumer inventory (touch `ua__dom` fields, winresize's `ua.msie`
   dying with it) — dropping the RTL/passive-listeners/input-modality wishlist to
   Non-Goals ("added when a consumer exists")? Keep `ua` as a deprecated alias?
   Carve an explicit Non-Goal exception for env as a new public module?
6. **Benchmarks (OQ9):** delete as pre-Vite relic (scope leg) vs keep and migrate
   off jquery to preserve the only perf harness for the i-bem-dom work
   (stakeholders leg)? Recommend: keep one Playwright smoke benchmark through the
   core slices, decide deletion after.
7. **loader_type_bundle (OQ6):** delete with bilingual migration note (loads a dead
   ym bundle format; zero in-repo consumers beyond build entries and test harness;
   documented public in loader.{en,ru}.md) — confirm?
8. **Verification matrix:** declare chromium-only + desktop-only parity explicitly
   in C4, or fund a touch/webkit harness (vite test config platform pin, Playwright
   projects, touch-device emulation)? Touch ua work (slice 1) currently has no
   verification path.
9. **Release & versioning:** semver strategy across slices (intermediate publishes
   vs one 6.0 at the end), who cuts releases, fix `repository.url` (still points at
   upstream bem/bem-core).
10. **BEM synthetic events architecture:** feasibility leg proposes pure-registry
    BEM events (no `$.event.special`, walk entity containment) instead of native
    bubbling emulation — accept as a design-exploration topic with parity caveats
    (positional trigger args, `flags.fns` dedup, cross-node propagation-stop)?

## Important But Non-Blocking

- **PRD factual fixes:** remove pointerevent claims (Problem Statement bullet,
  G5 inventory, OQ3, slice 4); drop "timeout" from loader_type_js preserved
  semantics (it has none — only `loader_type_bundle` has a 30s timeout); reword
  "imports it in exactly one file" (wrapper is the only npm-jquery importer; 9
  production files import `bem:jquery`; plus test-harness + desktop redefs);
  slice 2 "shrinks by ~3 entries" → exactly 3; Non-Goal wording "loader and
  env/ua work" (ua templates are forced too).
- **US1 "tree-shaking works" is structurally hostile today** (side-effect platform
  entries + redefinition barrels force full evaluation). Scope US1 to "no jQuery
  in bundle" or make per-block exports a design topic.
- **G1 completion predicate (mechanical):** CONST-P1 with ALLOW=∅ AND repo-wide
  grep for `bem:jquery|from 'jquery'` = ∅ (incl. test harness and
  `desktop.blocks/jquery/*`) AND dist bundle contains no jQuery AND Playwright
  suite green without the jquery dev dep.
- **G6 enforcement:** prefer a constitution sdd-check (ancestor existence check
  with a CONST-P1-style shrinking allowlist for legacy exceptions) over a custom
  ESLint rule; needs the mechanical definition of "override" (transformer-form
  `export default function(base)` vs side-effect redef vs standalone-when-no-
  common-base) and a baseline exception list (conditional-comment, page/__icon…).
- **Design-doc glossary:** override, slice, requirement (≤12 counting rule), public
  API, quarantine/escape hatch, deprecated alias, env vs capability detection,
  live collection, periphery→core, API tests, slice-bead shape; specs/ location
  and template convention (specs/ is empty today).
- **Harness evolution requirements** attach to slices 1/5/7: spec corpus is
  ym-authored through the shim; `test/browser/entry.js` hand-maintains the module
  map (ua, idle, loader_type_bundle, keyboard__codes absent → no specs can exist);
  `browser.spec.js` hard-codes `>400` total — needs a policy; `i-bem-dom.spec.js:1813`
  tests dynamic redefinition.
- **Relic inventory for S2/S7:** delete stale `test/dist/` harness (CJS, requires
  removed ENB-era packages, references nonexistent pointer specs), decide
  `common.bundles/`, `es5-shims` example, conditional-comment specs, i18n logo
  test (dead `i-bem__dom` name), UMD dist format fate (CONST-P2 tension).
- **Vite-plugin barrel hazard:** `generateBarrel` chains any same-named module
  across levels and calls it as a function — redefinitions not authored as
  `export default function(prev)` break at runtime; platform-cleanup slice should
  validate `isRedefinition` or audit all cross-level chains.
- **Bilingual doc parity:** per-slice MIGRATION.md + MIGRATION.ru.md + block
  *.en.md/*.ru.md + CHANGELOG pair; budget 1 REQ per slice or Non-Goal to a final
  docs slice (ru-rot is this repo family's historical failure mode).
- **Sign-off matrix:** in practice all roles collapse to the fork owner (one human
  + agents); state it explicitly so agents know when to escalate vs approve.
- **Node floor:** engines says >=20, toolchain targets 24 — pick one story.
- **Integration branch:** slices merge to `v5` (not "main") — name it in slice specs.

## Observations and Suggestions

- Facts that check out: 9-entry allowlist matches reality exactly; i-bem-dom.js
  1220 lines; inherit 121; dom 111; loader_type_js 62; ~25 distinct jQuery APIs
  used in i-bem-dom alone; ESM sources with `bem:` virtual imports resolved by
  vite-plugin-bem-levels; redefinitions compose via generated transformer barrels.
- The events slice has excellent test-first material: i-bem-dom.spec.js (1854 L),
  events_type_dom (1069 L), events_type_bem (1013 L) — build the native engine
  against them.
- Delegated-binding self-match quirk (`on(selector)` + `is(selector)` double-bind),
  `this` = delegateTarget semantics, `e.bemTarget`, positional `trigger` args, and
  `$.parseHTML(html, null, true)` (keepScripts) are the parity traps to spec.
- Cheap wins: `idle` is 3 event names on `$(document)`; `__init_auto` is 8 lines;
  benchmark page deps is the easiest allowlist deletion; `dom`'s public API is
  where CONST-P4 bites early (fold OQ7 into the type-contract decision, Q3).
- Order-of-work suggestion from feasibility: specify the internal "DOM facade"
  (collection/traversal/event-facade contract) in the design doc **before** S2/S4
  — dom, __events, and i-bem-dom all consume it.

## Confidence Assessment

- **High:** all factual grounding (file paths, line counts, grep results, tag
  absence, exports map, docs inventory) — every leg verified directly @ f2ab61e;
  multiple legs independently confirmed the same four structural findings.
- **Medium-high:** jQuery event-normalization semantic inventory (read from
  source; corner cases like focus/blur delegation would surface in implementation).
- **Medium:** slice sizing/REQ arithmetic (estimates from code+spec volume);
  7-slice plan assumes OQ1=delete-shim-future and OQ6=delete-bundle.
- **Low/unknowable:** external consumer population (wrapper importers,
  loader_type_bundle users, ua field readers outside the fork) — no telemetry;
  only a consumer census (Q2) can raise this. Until then the two legs'
  recommendations legitimately diverge (delete vs shim).

## Next Steps

1. Human gate (next formula step): answer Q1–Q10; Q1–Q3 are blocking.
2. Apply PRD factual fixes + split G1 (migrate / delete / escape-hatch decision)
   and restate G5 ("finish seams + pin public surface", full decomposition
   deferred) per scope leg.
3. Design exploration legs (6) must take the corrected PRD as input and
   specifically: re-derive the slice DAG (7 slices + slice-0 prerequisites),
   specify the DOM-facade/event-facade contract, and draft the env API from the
   audited consumer inventory.
4. Slice-0 deliverables to plan for: v5-base tag, public-API inventory +
   API-pinning test, stale `test/dist/` purge, specs/ convention, G6 sdd-check
   skeleton with baseline allowlist.
