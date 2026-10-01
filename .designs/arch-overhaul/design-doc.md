# Design: Global architecture overhaul of bem-core fork (Realetive/bem-core, v5, tag v5-base): ESM-first core, removal of the jquery wrapper (9 frozen consumers, ratchet in project CONSTITUTION.md), modern module boundaries, platform layers override-only

> Baseline v1 — synthesized from 6 design legs (api bc-8zr, data bc-dts, ux bc-hjd,
> scale bc-fiv, security bc-6l5, integration bc-az3; full reports in
> `.plan-reviews/arch-overhaul/legs/report-design-*.txt`) against the corrected PRD
> (`.prd-reviews/arch-overhaul/prd-draft.md` incl. human answers Q1–Q10) and PRD
> review (`.prd-reviews/arch-overhaul/prd-review.md`). Later refinement rounds
> (prd-align 1–3, plan-review 1–3) edit this file in place.
>
> **prd-align-1 applied (2026-09-23):** requirements-coverage (bc-3x2) + goals-alignment
> (bc-e5n) findings folded in — CONST-P6 re-baselined to the verified standalone
> inventory, gate staging fixed (final assertions activate at S6), PRD pointerevent
> OQ3 (PRD OQ3, not design OQ-3) and
> loader timeout (PRD G3) retired with evidence, loader semantics table, G2 UA justification,
> S4 interim jquery carrier, S3 TESTS entries, CONST-P5 notices check, exports-wildcard
> clarification. Round log: `.plan-reviews/arch-overhaul/prd-align-round-1.md`.
>
> **prd-align-2 applied (2026-09-23):** constraints-compliance (bc-dip) +
> non-goals-enforcement (bc-lvq) findings folded in — 0 violations/cuts on the
> constraint side; guardrails added (S0 root-export migration line, skip/preview
> guard form, S4+S5 fallback REQ-cap clause, constitution-amendment ride-along,
> v5-base anchor reconciliation, bounded S6 docs pass, D-14 no-new-check note,
> bench-deferral no-schedule note, keyboard__codes payload-parity requirement,
> conditional-comment removal authorization, env bada/wp disposition,
> orientchange shrink-guard pin, Node-matrix change cut). Round log:
> `.plan-reviews/arch-overhaul/prd-align-round-2.md`.
>
> **prd-align-3 applied (2026-09-24):** user-stories-coverage (bc-1hn) +
> open-questions-resolution (bc-0pq) findings folded in — US3/G6 contributor-docs
> carrier restored (bounded README section), design-OQ 5 given a concrete decision
> point, `BemDom`→`bemDom` casing reconciled, CONST-P6/P1 CI wiring named, idle +
> `__init_auto` test carriers pinned, S5 −3 per-file disposition itemized, S3 closure
> predicates named, stale `loader_type_js.get` migration line fixed (repo-verified),
> parity-test count standardized to four, bada/wp deferral registered as OQ-10,
> inherit future phase named, design OQ-1/OQ-3 working positions labeled, design
> OQ-6 reworded,
> PRD OQ7 disposition made explicit, `$(node).bem()` removal label pinned to S5. Round
> log: `.plan-reviews/arch-overhaul/prd-align-round-3.md`.
>
> **plan-review-1 applied (2026-09-24):** completeness (bc-kxjm) + sequencing
> (bc-wkbs) findings folded in — final-gate activation re-keyed off wrapper
> existence + package.json cleanliness (allowlist ∅ alone binds one slice
> early); entry-generation switchover pinned to S0 (hand-list race with S2/S3
> deletions eliminated); block-level docs (Docs Δ) made a TESTS contract item
> with per-slice carriers; `.deps.js` lint + entity-converter unification
> scheduled in S0; plugin transformer-form hard error pinned to S0;
> loader canonical path reconciled (`bem:loader` barrel switch in S3);
> "S1 soft" edge dropped; S1 api-pin update, S2 v5-base bench capture, S6
> final-cap amendment scheduled; two-directional ratchet added; doc-parity
> fence wired into CI; exports-narrowing + orientchange MIGRATION lines
> enumerated. Round log: `.plan-reviews/arch-overhaul/review-round-1.md`.

> **plan-review-2 applied (2026-09-24):** risk (bc-j0yf) + scope-creep (bc-vdjh)
> findings folded in — 2 must-fix (harness jquery exit pinned to S5 with
> S2/S4/S5 carriers + repo-wide zero-jquery grep at S6; S0 entry-generation
> mechanism specified — committed `*.gen.js` artifact, sorted emission justified
> by static `bem:` import edges, CI freshness diff) + 8 should-fix risk items
> (loader CORS semantics row + audit clause, S6 conditional-comment dependents
> enumeration, S1 touch serving path, ua alias property-read contract, S0/S6
> overflow pre-authorized splits, mid-series revert protocol row, timeboxed
> dynamic-import spike in S0, S3 loader-spec ES-module URL fixtures); scope
> cuts: 6 should-cut + 1 defer (`.deps.js` lint cut, entity-converter unification
> deferred to S6 ride-along, stale "Node floor pinned" removed, loader
> one-release re-export bridge deleted outright with a MIGRATION line (D-16),
> bench B6 startup scenario cut to B1–B5, bemDom lazy-getter explicit-throw
> polish dropped for parity, `_buildModValRE` memoization mention dropped).
> REQ deltas: S0 11–12→10–11, S3 stays 4–6 (bridge cut offsets fixtures); no
> slice grows. Round log: `.plan-reviews/arch-overhaul/review-round-2.md`.
>
> **plan-review-3 applied (2026-09-29):** testability (bc-k36z) + coherence
> (bc-5i66) findings folded in — 4 must-fix (staged-gate guard meta-test:
> skip/bind/red fixture trees proving the bind branch before S6; two-directional
> ratchet given a named artifact — CONST-P1 sdd-check amended bidirectional at
> S0 — plus a direction-2 red fixture and scripted per-slice allowlist pins;
> slice-table Deps column reconciled to the DAG line's transitively-reduced
> direct edges, S4 → `S2` / S6 → `S1, S3, S5`; count-floor policy (`>400` →
> registration accounting + loose floor) owned by S2's harness commit) + 23
> should-fix (zero-jquery predicate shape, notices-intact baseline predicate,
> doc-fence anchor/file-set, CONST-P6 include-set vs bemjson fixtures, S5
> harness-exit closure grep, ua alias units, D-6/Vite narrowing clarification,
> bench gate first firing at S2, OQ-11 registration-ledger mechanics, CORS +
> parseHtml audits as named greps, page.examples relic disposition, spike
> decision-record home, specs/ convention, test/dist purge scope, scripts-inert
> wording, "Option B" label dropped, PRD-OQ header prefixes, env `ua` diagnostic
> getter in KC 1, S4/S5 Docs Δ carriers, S1∥S3 barrel/pin coordination note,
> ua-alias lifecycle boundary, D-16 stale noun, v5-base create-vs-verify); 1
> rejection (coherence SF-12 pointerevent parenthetical — mis-anchored: the
> clause lives in the PRD draft, not this doc's Problem Statement; the
> retirement is already recorded at the prd-align-1 note, KC 6, and the Retired
> section). Round log: `.plan-reviews/arch-overhaul/review-round-3.md`.
>
> **Numbering note:** the PRD review used S0–S7 with S6 = inherit micro-slice. This
> doc folds the inherit decision into S0 and renumbers wrapper removal to S6. Final
> slice series: **S0–S6 (7 slices)**. Mapping: review-S6 → S0 REQ; review-S7 → S6.

## Executive Summary

The overhaul lands as **7 strangler slices (S0–S6)**, each ≤12 requirements, each
independently mergeable to branch `v5` with lint/unit/browser tests green. The
critical path is **S0 (verification fence + contracts) → S2 (periphery + DOM facade)
→ S4 (native dom-event delegation) → S5 (pure-registry BEM events) → S6 (wrapper
deletion + platform enforcement)**; **S1 (env/ua)** and **S3 (loader)** run in
parallel off S0 and join at S6. The CONST-P1 allowlist arithmetic closes one slice
earlier than previously estimated: 9 entries → −1 (S1) −3 (S2) −2 (S4) −3 (S5) =
**∅ after S5**, making S6 purely deletion, enforcement, and release preparation.

Headline outcomes, all measured or grep-verified against the repo @ f2ab61e (v5
head = the v5-base anchor 7a9e932 plus the constitution commit; no blocks
touched between, so f2ab61e greps are a valid parity proxy for the anchor):

- **Consumer bundle drops ≈ 38.5 kB gz → ≈ 12–13 kB gz (−66%)** — one request, zero
  peer dependencies (jquery@4 peer = 27.53 kB gz measured; native replacement
  estimated +1–2 kB gz). Enforced by a **staged** bundle gate (S0): the per-slice
  binding checks are the gz-byte cap ratchet (+ allowlist ratchets); the
  no-jquery-in-artifact assertion and the jquery peer/dev-dep removal check
  **activate at S6** — keyed on wrapper existence + package.json cleanliness,
  not on allowlist emptiness (the allowlist is already ∅ after S5 while jquery
  legitimately remains in the payload until S6's deletion commit; keying on
  allowlist-∅ would bind the assertions one slice early and redden the S5→S6
  window — final-state assertions cannot pass earlier while jquery legitimately
  remains).
- **A real public API**: today's root export is a side-effect-only payload with zero
  named bindings. The design introduces a platform-neutral named-export barrel
  (`import { bemDom, env } from 'bem-core'`), a pinned deep-import inventory, a
  native `Element`/`Element[]` DOM type contract, and an API-pinning test that makes
  CONST-P4 mechanically enforceable.
- **Events without jQuery**: dom-type events move to a per-scope native delegation
  engine (per-scope anchors, composedPath walk, compile-once class-token matchers);
  BEM-type events become a **pure registry** walking entity containment (Q10) — no
  `$.event.special`, no synthetic bubbling emulation.
- **Platform layers become override-only by construction**: a new CONST-P6
  ancestor-existence check with a shrinking baseline (**7 standalone module groups →
  ∅**, verified inventory @ f2ab61e — see Key Components 13), plugin-enforced
  transformer-form validation for redefinition chains, and `ua` collapsed from two
  disjoint platform forks into a common base (incl. a `__dom` elem ancestor) + touch
  delta.
- **`inherit` stays frozen** (Q4=a) — zero code change, pinned by existing specs;
  native-class options are a named future phase: a post-6.0.0 exploration convoy,
  opened only by a future PRD.
- **One 6.0.0 release** at the end (Q9), bilingual MIGRATION sections accumulated
  per slice, `repository.url` fixed in S0.

## Problem Statement

Carried verbatim from the corrected PRD: the library architecture is still the 2016
design — a jQuery wrapper (30+ kB gz peer dep) as the DOM substrate for the whole
`i-bem-dom` layer with 9 frozen consumers on the CONST-P1 ratchet; UA-sniffing
platform forks answering the wrong questions; a hand-rolled script-injection loader;
an undecided classical-OOP `inherit`; a 1220-line `i-bem-dom` monolith; and platform
layers that mix overrides with standalone logic, unenforced. The goal is a target
architecture plus a strangler slice plan that removes internal jQuery entirely,
modernizes module boundaries, and makes the platform boundary machine-checked —
with observable behavior matching tag `v5-base` (7a9e932) wherever no slice
documents a migration.

## Proposed Design

### Slice series (the strangler plan)

| Slice | Goal | REQ est | Deps | CONST-P1 Δ | Shippable outcome |
|---|---|---|---|---|---|
| **S0 prerequisites** | Verification fence + public contracts | 10–11 | — | none (final predicate added) | verify tag `v5-base` = 7a9e932 on origin (create the annotated tag only if absent — Q1); API inventory + pin test; exports-map narrowing; named-export barrel v1 (existing modules); bundle gate; `test/dist/` purge (checked-in build-fixture output deleted + `.gitignore` entry; fixtures regenerate on demand via `test/dist/build-fixtures.js`); specs/ convention (machine-checkable gate artifacts live under `specs/` — `bundle-budget.json` first, later gate JSONs follow); CONST-P6 skeleton (baseline 7, verified); doc-parity fence; inherit freeze recorded; `repository.url` fix; platform entries **generated from the plugin scan registry** — output committed at `build/platforms/*.gen.js`, imports emitted in canonical sorted order (sound: cross-module ordering rides static `bem:` import edges, verified @ f2ab61e), CI re-runs the generator and diffs (freshness); hand-maintained lists deleted in-slice; payload-parity assertion vs the checked-in pre-S0 lists incl. `keyboard__codes`; plugin transformer-form hard error live (KC 9); timeboxed spike REQ — dynamic `import(variable)` through the dev-server test config + lib build, recording Vite 8/rolldown behavior into a dated decision-record section of the S0 spec — cited by the S3 spec (retires S3's bundler unknown); the spike's smoke assertion (generated entry resolves through both build paths) joins TESTS S0, and the spike also asserts one narrowed deep-import fails to resolve through the dev-server test config — the Vite half of the exports-narrowing tripwire (or the spec records Node-only scope as the deliberate bound) |
| **S1 env/ua** | Capability env module; touch ua off jquery | 8–12 | S0 | −1 (`touch.blocks/ua/ua.deps.js`) | `env` public module (lazy/live getters, CustomEvent orientchange); `ua` Proxy alias; desktop/touch ua JS forks deleted; common ua base gains `__dom` elem ancestor (touch `ua__dom` becomes its override delta — CONST-P6 −3 groups); UA-derived getters carry documented justification + dedicated units (G2); touch-emulated Playwright project **with its serving path** (second webServer/port or param'd `vite.test.config` with `platform=touch` — today's config hardcodes `platform: 'desktop'`; entry/shim extended to ua/env for the emulation suite); barrel gains env/ua **+ api-pin/inventory update in the same commit**; env docs (en+ru) + ua alias/removed-fields doc note |
| **S2 periphery** | dom + idle + winresize + benchmarks off jquery | 6–8 | S0 (no S1 edge: no S2 outcome reads env/ua — if S1 lands first, the alias's undefined `msie` silently no-ops winresize's IE8 guard until S2 deletes it, verified harmless) | −3 (`dom`, `idle`, benchmarks `page`) | internal DOM facade (incl. scripts-inert parseHtml — D-11; escape-hatch audit = first REQ of S2: named grep for script-execution dependents of `parseHtml`/`dom.parse` across sources + specs, pattern listed in the S2 spec, result quoted in the spec as the go/no-go); `dom`/`idle` native; winresize deleted; bench project B1–B5 on ratio thresholds **+ v5-base reference capture** (build @ tag `v5-base`, record B1–B5 baselines into the bench config); the ratio gate's first firing is this slice's own done-gate (KC 11); block docs ride the rewrite/deletion; Harness Δ: `dom.spec.js` (159L) exits the jquery shim — converted to ESM in-slice (jquery harness-exit carrier 1/3); count-floor policy: the magic `>400` floor is replaced by per-file registration accounting + a loose liveness floor in this slice's harness commit (ledger mechanics per OQ-11) |
| **S3 loader** | `import()`-based loader; bundle loader deleted | 4–6 | S0 | none | `loader(url, success?, error?)` on dynamic import returning promise; `loader_type_bundle` deleted (bilingual note); classic-script + cross-origin semantic shifts documented (`import()` requires CORS on the target — audit = named grep: zero `https?://` literals across loader call sites + spec fixtures, result quoted in the S3 spec notes and referenced from the MIGRATION line, confirming zero cross-origin loader URLs); internal-consumer audit; **barrel + pin-inventory switch to `bem:loader`** (new canonical root module; the `loader_type_js` mod path deleted outright — bilingual MIGRATION entry names old/new paths, callable shape preserved by the new root module; see KC 7 / D-16); block docs ride the rewrite/deletion; closure predicates: zero `loader_type_bundle` references repo-wide, zero `loader_type_js` references repo-wide (barrel, generated entries, harness `entry.js` switched; spec converted), loader source contains dynamic `import(` |
| **S4 events core** | Native delegation engine; dom-type events | 8–12 | S2 | −2 (`__events`, `__events_type_dom`) | per-scope native engine (D-4); events_type_dom 1069L spec green (converted off the jquery shim in-slice — harness-exit carrier 2/3); focus-delegation coverage NEW; bem-type interim interop REQ + mixed-flow test; interim: the remaining allowlisted trio (`i-bem-dom`, `__events_type_bem`, `__init_auto`) is the sole jquery carrier until S5; no block docs @ anchor (`__events*` carry no .md) — Docs Δ expected nil |
| **S5 bem events + plugin** | Pure-registry BEM events; `$.fn.bem` off | 8–10 | S4 | −3 (`i-bem-dom`, `__events_type_bem`, `__init_auto`) | registry containment-walk emit; four named parity tests (three Q10 caveats + #1525 nested-same-type skip); events_type_bem 1013L + i-bem-dom 1854L green; −3 disposition: `__events_type_bem` → pure registry, `i-bem-dom` → remaining jquery substrate replaced by S2 facade + S4 engine (KC 6 decomposition completes), `__init_auto` → native DOM-ready (DOMContentLoaded/readyState) + `nextTick(init)`; **allowlist = ∅**; **harness exits jquery in S5**: `__events_type_bem.spec.js` + `i-bem-dom.spec.js` converted to ESM (or re-authored against the S5 registry) AND the shim-map `jquery` entry, `entry.js`'s `import $ from 'jquery'`, and the `vite.test.config` `optimizeDeps` jquery line deleted in the same commit (the harness is a jquery consumer the CONST-P1 `*.deps.js` grep cannot see — its exit must not be discovered mid-S6); block docs ride the rewrite (`i-bem-dom.{en,ru}.md` accuracy pass rides the S5 conversion) |
| **S6 platform + wrapper removal** | Delete wrapper; enforce override-only; release prep | 8–10 | S1, S3, S5 | allowlist field empty; final multi-grep predicate conclusive | `common.blocks/jquery` + `desktop.blocks/jquery/*` deleted (takes `jquery__config` deps-only standalone with it); jquery dev+peer deps gone; bundle-budget final-cap amendment (~13 kB gz desktop / ~14 touch); UMD format dropped; dead plugin-internal `bemEntityToModuleName` deleted (release-prep ride-along, plan-review-2 SC-2); CONST-P6 baseline ∅ (`page__conditional-comment` deleted — authorized template removal: C5 evergreen-only ⇒ the IE-only elem is dead code, MIGRATION entry names the elem and both template files, **with its dependents** — `page.deps.js` `conditional-comment` `shouldDeps` entry removed, the `60-conditional-comments` tmpl-spec pair deleted, `page.examples` relics dispositioned: any example/tmpl-spec referencing `conditional-comment` deleted (named in the MIGRATION entry), others keep-listed with a one-line reason — done-gate grep: zero `conditional-comment` references outside MIGRATION/CHANGELOG text — hoist-to-common rejected as dead-code-in-common; `page__icon` hoisted to common — its MIGRATION entry names the hoist like conditional-comment's names the elem + both template files); jquery/__config/page block docs deleted with their blocks; README/README.ru rewrite scoped to include a bounded "Platform levels are override-only" contributor section (shared behaviour lives in common.blocks; overrides must be transformer-form `export default function(prev)`; CONST-P6 ancestor-existence check named with its baseline semantics; the plugin's build error names both files; en/ru, anchor-fenced, 1-REQ-equivalent bound — this IS G6's documented half / US3, bounded contributor guidance rather than the deferred content redesign) + docs bounded to an API-accuracy pass (BEMDOM.* → bemDom.* remap, deleted-API sections point at MIGRATION entries, ru/en anchor parity via the doc fence; content redesign out of scope, deferred post-6.0.0); MIGRATION/CHANGELOG consolidated for human-cut 6.0.0; MPL-2.0 LICENSE + file-level notices preserved (notices-intact grep + zero-jquery-imports grep repo-wide — sources, harness, configs — in done-gate) |

DAG shape: `S0 → {S1, S2, S3}`; `S2 → S4 → S5 → S6`; `S1, S3 → S6`. Create-beads
should model S1 and S3 as parallel branches, not a serial queue. The Deps column
and this line carry the same edge set — transitively-reduced direct edges
(S4 ← S2; S6 ← S1, S3, S5); create-beads wires the direct edges and lets the
closure fall out.

### Design positions (cross-cutting)

1. **Two products, two entry kinds.** The side-effect platform payload
   (`dist/{desktop,touch}/bem-core.mjs`, auto-init) and the platform-neutral
   named-export API barrel (`dist/index.mjs`, never auto-inits) are both public and
   explicitly not conflated. Root `.` becomes the API barrel; payloads move to
   `./dist/desktop` and `./dist/touch`.
2. **Public by inventory, internal by location.** The exports map narrows
   `"./*"` → `"./common.blocks/*"` (+ enumerated entries) in S0, making non-public
   paths unresolvable (`ERR_PACKAGE_PATH_NOT_EXPORTED` / Vite build-time) while all
   existing public deep-imports keep working. Internal modules then live inside
   consuming blocks' elem namespaces without becoming API. The wildcard is a
   deliberate compatibility superset, not the contract: the API-pinning test +
   CONST-P4 police the pinned inventory (Interface → deep-import set). `inherit`'s
   deep-import path is **internal-but-tolerated** under the wildcard (frozen internal
   per Q4/D-2) — not part of the public contract; a future narrowing that removes it
   requires a CONST-P4 migration note.
3. **Behavior parity by default, documented breaks allowed** (C4/CONST-P4): each
   signature change ships with a bilingual MIGRATION entry in the same slice; the
   API-pinning test is the tripwire. The S0 root-export repurpose is enumerated
   like every other break: today's root `.` is the side-effect desktop payload
   (`exports."." = "./dist/desktop/bem-core.mjs"`); side-effect consumers migrate
   `import 'bem-core'` → `import 'bem-core/dist/desktop'` (or `./dist/touch`) —
   S0's MIGRATION cell carries that line **and** the exports-narrowing line
   (today `"./*": "./*"` resolves every root-relative path — `desktop.blocks/…`,
   `touch.blocks/…`, `test/…`; after narrowing, root paths beyond
   `./common.blocks/*` + the enumerated entries no longer resolve).
4. **No MutationObserver, ever.** Live collections stay lazy-compute + explicit
   invalidation at the sanctioned mutation points (`bemDom.init/destruct/update/
   append/...`). Node-keyed state migrates to WeakMaps (leak classes die by
   construction); multi-node entity bookkeeping keeps explicit teardown.
5. **Selective consumption = the plugin.** Full tree-shaking is structurally
   impossible with decl/registration side effects and is out of scope. The official
   per-app story: consumers run `vite-plugin-bem-levels` (public at
   `./build/plugins/*`) in their own Vite config. US1 stays scoped to "no jQuery in
   bundle".
6. **Every slice leaves `v5` buildable and tests green** (C2); each slice PR edits
   the constitution allowlist in the same commit (CONST-P1 PR clause); each slice
   carries a TESTS checklist (see Implementation Plan).

## Key Components

1. **`env` module** (`common.blocks/env/env.js`, new public, S1) — scoped strictly
   to the audited consumer inventory (touch `ua__dom`): `platform/ios/android/
   browser/screenSize/svg` as lazy memoized getters; `width/height/landscape` as
   live getters; `ua` (raw string) as a diagnostic getter — the env/ua surface
   section below is the authoritative field list; one native `resize` listener dispatching
   `CustomEvent('orientchange', {detail:{landscape,width,height}})` — firing
    guard preserved (dispatch only when landscape AND width both change — today's
    Android shrink-guard heuristic), pinned by the S1 emulation-parity tests.
    Transport change is an enumerated break (S1 MIGRATION cell): today
    `touch.blocks/ua/ua.js` fires a jQuery synthetic event (`$win.trigger('orientchange', {...})`
    — reaches jQuery-bound handlers only, payload in trigger args); the native
    CustomEvent reaches `addEventListener` handlers with payload in `event.detail` —
    `$(win).on('orientchange', (e, data) => …)` → `window.addEventListener('orientchange', e => … e.detail.landscape …)`.
    No module-eval DOM reads → no import-order hazard. RTL/passive-listeners/
   input-modality: Non-Goals until a consumer exists (Q5).
2. **`ua` deprecated alias** (`common.blocks/ua/ua.js`, one-release Proxy, S1) —
    live-forwarding to env; removed fields warn once per field and return
    `undefined`; assignments warn once and no-op. Alias contract is property-read
     access — destructuring/spread snapshots are unsupported by design (pinned in
     the S1 spec). Alias lifecycle boundary: the alias ships in 6.0.0; its removal
     (with the `env.browser` legacy keys, OQ-8) is the first post-series release —
     owned by no slice of S0–S6. Common ua ancestor + touch delta
    replaces the two disjoint platform forks (the worked CONST-P3 example).
3. **DOM facade** (internal, S2) — node helpers + `parseHtml(str)`; surfaces
    through the `bem:dom` module graph; the only sanctioned HTML-string entry
    point. OQ7 disposition: `dom` stays public (Q3 inventory, root barrel);
    internal `i-bem-dom` helpers use this facade inside the `bem:dom` module
    graph — no merge into `i-bem-dom` internals. Script-execution decision below
    (Trade-offs D-11).
4. **Dom-event delegation engine** (`i-bem-dom/__events` internals, S4) —
   per-scope native anchors (scope = instance `domElem` or `bemDom.scope`, never
   document-global), `composedPath()` walk with compile-once class-token matchers
   (BEM selectors are single-class), focus/blur → focusin/focusout mapping table.
   Native listener count O(scopes × types) — identical to today's jQuery anchoring.
   Absorbs the delegated self-match quirk by design (inclusive path walk).
5. **BEM-event registry** (internal, S5) — `Map<entityName, Set<binding>>`; `emit`
   walks entity containment (one shared closest-walk per emit, replacing today's
per-handler walk), no DOM event objects, no `$.event.special`. Parity contract
    (**four named parity tests** — the three Q10 caveats plus the #1525 skip):
    positional trigger args, `flags.fns` per-emit dedup,
    `propagationStoppedDomNode` containment rule, #1525 nested-same-type skip.
6. **i-bem-dom decomposition** (internal, progressive across S2/S4/S5) —
   `params-store / entity-index / collection-cache / dom-facade / find-engine /
   events-dom / events-bem / init-lifecycle` behind the frozen public surface;
    node-keyed Maps → WeakMaps; dead `domNodesToParents` wholesale-clear path
    deleted (`_buildModValRE` memoization left to S5 implementation latitude —
    unscheduled, plan-review-2 SC-7). **PRD G5/OQ3 "pointerevent normalization"
   is moot**: grep-verified absent from the fork @ f2ab61e (zero pointer code in
   `common.blocks/`/`desktop.blocks/`/`touch.blocks/`; only matches are prose in
   `functions.*.md`) — nothing to decompose; if pointer normalization is ever
   needed it is an events-dom engine mapping-table concern (cf. focus/blur →
   focusin/focusout).
7. **Loader** (new canonical root module `common.blocks/loader/loader.js`, S3;
     repo @ anchor has loader code only at `loader/_type/loader_type_js.js`) —
     `loader(url, success?, error?)` = `import(url)` + callback shim, returning
     the module-namespace promise; the old `loader_type_js` mod path is deleted
     outright — no one-release bridge (D-16): the new root module preserves the
     callable shape, the bilingual MIGRATION entry names old/new paths, and the
     root barrel + pinned inventory switch to `bem:loader` in S3's own commit;
     `loader_type_bundle` deleted (dead ym format, Q7).
8. **Init registry** (S0) — platform entry modules **generated from the
     plugin's scan registry**; the hand-maintained lists
     (`build/platforms/{desktop,touch}.js`) are deleted in the same S0 commit,
     with the payload-parity assertion against the pre-S0 lists (incl.
     `keyboard__codes`, per OQ6 — silent drop via generation is forbidden;
     keyboard is Non-Goal-frozen) running in S0 against a fixed pre-parallel
     baseline. Generation mechanism (plan-review-2 F2): output committed at
     `build/platforms/*.gen.js` (lockfile-style); imports emitted in canonical
     sorted order — sound because cross-module ordering is carried by static
     `bem:` import edges (verified @ f2ab61e: `winresize`, `__init_auto`,
     `__events_type_dom` all import their deps), not list order; CI re-runs the
     generator and diffs the committed files (freshness — the artifact cannot
     rot the way the hand lists did, D-8); the payload-parity assertion compares
     the emitted set against the checked-in pre-S0 baseline. Pinning the
     switchover to S0 (not a "S0–S1" window) is
     mechanical: today's hand lists import `bem:jquery__event_type_winresize`
     (desktop) and `bem:loader_type_bundle` (both) — entries S2/S3 delete — so a
     deletion landing while the hand lists are live breaks the build on an
     unresolvable `bem:` specifier, and parallel hand-edits of the same two
     files would race; with generation in S0, S2/S3 deletions simply flow
     through regeneration. Runtime registration stays `decl*` side effects into
     `bem.entities`; dynamic redefinition parity pinned by
     `i-bem-dom.spec.js:1813` (the `inherit.self` path is preserved verbatim).
9. **vite-plugin-bem-levels validation** (S0) — `buildRegistry`/`generateBarrel`
    hard-error when a chain entry at index ≥1 is not transformer-form
    (`export default function(prev)`); within-level barrel ordering sorted by path;
    same-level duplicate names treated as chains. The hard error lands live in
    S0 (plugin + its existing test corpus are the verifier) so S1's first
    override-heavy restructuring and S4/S5's transformer barrels ship validated;
    S6 adds no new validation, only the final-state grep predicates.
10. **Bundle-budget gate** (S0) — `specs/bundle-budget.json` (gz-byte caps,
     measured+10% headroom today; final caps ~13 kB gz desktop / ~14 touch —
     amended in S6's own commit) + `build/check-bundle-size.mjs`; ratchet
     semantics (grow only with explicit amendment). Capped artifacts are
     enumerated at S0 spec-craft: both payloads **and** `dist/index.mjs`
     (barrel bloat guarded; a payloads-only choice needs recorded rationale);
     caps re-measured only at S6 — mid-series payload composition is unchanged
     while the wrapper remains in the platform entries. **Staging:** per-slice
     binding from S0 = gz-byte caps + the CONST-P1 allowlist ratchet + CONST-P6
     baseline ratchet — and the ratchets are **two-directional**: the gate
     fails not only on a new jquery consumer/standalone (additions) but also
     when an allowlist/baseline entry's file no longer matches reality
      (ALLOW−JQ ≠ ∅ — forgotten shrinks surface in the slice that migrated the
      consumer, not at S6), and each slice's done-gate runs a scripted
      allowlist/baseline pin — the slice's expected contents embedded in its
      own spec's sdd-check (see Implementation Plan done-gate line). The
     no-jquery-in-artifact assertion and the jquery external/peer removal check
     are final-state assertions that **activate at S6** — auto-activating once
     the allowlist is ∅ **and** the wrapper block is deleted **and** package.json
     carries no jquery (first possible binding-green commit = S6's deletion
     commit; the allowlist alone hits ∅ after S5 while jquery legitimately
     remains in the payload, so allowlist-emptiness alone must never bind
     them). Guard form: the final assertions short-circuit to preview output +
     exit 0 while (allowlist ≠ ∅) OR the wrapper block still exists OR
      package.json still lists jquery, binding otherwise — the exit-0 = OK
      contract is preserved in both modes. The guard's skip/bind/red paths are
      proven by an S0 meta-test fixture before any of them can bind for real
      (this gate and KC 13's final predicate alike): three fixture repo states —
      skip-state → exit 0 + preview output; bind-state-clean → exit 0 + binding
      output; bind-state-dirty (one planted jquery import / artifact byte) →
      exit 1 — so a green at S6's first binding distinguishes "clean repo" from
      "broken guard", and the bind branch is exercised six slices before it is
      load-bearing. `check-bundle-size.mjs` (fixture artifact over cap →
      exit 1) and the doc fence (anchor-mismatched fixture → exit 1) carry the
      same first-landing red proof.
11. **Bench project** (S2) — Playwright `--project=bench`, five scenarios B1–B5
     (init throughput, delegated dispatch, BEM emit, live-collection, destruct
     no-leak via heap delta — each measures a path a slice changes; the B6
     "startup" scenario was cut in plan-review-2 SC-5: payload bytes are already
     bundle-gated and init is B1; a startup number for 6.0.0, if wanted, rides
     the final bench run — not a scenario); ratio-to-v5-base thresholds ≤1.10× until
      absolute budgets are evidence-based; the done-gate for every slice from S2
      onward — baselines are captured in-slice, so the gate's first firing is
      S2's own done-gate (S2 rewrites dom/idle/winresize, i.e. the B1/B4 paths;
      an S2-caused regression must red at S2, not first at S4); S3 is exempt
      (no scenario touches the loader). (Absolute
     budgets are post-series and optional — dedicated-runner evidence gathering is
     not scheduled by this plan; the ratio thresholds are the shipped gate.)
12. **Spec harness ratchet** (per-slice) — ym-authored specs convert block-by-block
     as slices touch them; `entry.js` shim map becomes a checked-in shrinking
      allowlist; magic `>400` floor replaced by per-file registration accounting +
      loose liveness floor — the policy change is owned by S2's harness commit
      (S4/S5 extend the accounting per conversion; ledger home + loose-floor
      definition decided at S0 spec-craft, OQ-11); shim deleted when zero `modules.define` remain.
     The harness's own jquery consumers (invisible to the CONST-P1 `*.deps.js`
     grep: `entry.js`'s `import $ from 'jquery'` + shim-map `jquery: $` +
     `vite.test.config`'s `optimizeDeps.include: ['jquery']`) exit with their
     slices — S2: `dom.spec.js`; S4: `__events_type_dom.spec.js`; S5:
     `__events_type_bem.spec.js` + `i-bem-dom.spec.js` + all three harness
     sites deleted in the same commit (plan-review-2 F1) — completing the
     harness jquery exit in S5, not discovered mid-S6.
13. **Constitution checks** — CONST-P1 gains its final multi-grep predicate
     (deps manifests ∅, sources+harness+build-configs ∅ — zero jquery imports
      repo-wide, wrapper dirs gone, package.json clean) in S0. "Zero jquery
      imports repo-wide" has pinned semantics (authored mechanically at S0 so
      the predicate cannot red on docs prose): import-form patterns only —
      `from 'jquery'`, `import 'jquery'`, `require('jquery')`, `'jquery'`
      string entries in `.deps.js`, shim-map keys, `optimizeDeps` entries;
      include set = sources + `test/` + `build/` configs; exclude set =
      `*.md`, `.git`, `node_modules`, `dist` (MIGRATION/CHANGELOG/README prose
      legitimately names jquery); like the bundle gate's final assertions it runs in skip/preview mode
     (short-circuits to preview output + exit 0 while (allowlist ≠ ∅) OR the
     wrapper block still exists OR package.json still lists jquery, binding
     otherwise — the exit-0 = OK contract holds in both modes) until every
     conjunct of its own predicate is achievable — conclusive (binding) at S6's
      deletion commit, never at S5's allowlist-∅ alone. Its skip/bind/red
     paths are covered by the same S0 meta-test fixture as KC 10's guard
     (skip-state / bind-state-clean / bind-state-dirty). The S0 constitution
     amendments — the new CONST-P6 clause, the CONST-P1 final predicate, the
     CONST-P1 sdd-check made **bidirectional** (`comm` compared in both
     directions: additions AND forgotten shrinks — the two-directional ratchet
     of KC 10 thus lives in a named, runnable artifact riding spec-craft +
     done-gate + CI from S0), and the CONST-P6 check authored with its
     baseline file as the comparison substrate — are carried by the S0 slice
     PR (the constitution-header review
     process). New
     **CONST-P6** ancestor-existence check (every file in a platform level — JS,
     `.deps.js`, bemhtml/bh templates, CSS — must have a `common.blocks` ancestor
     at the same relative path; include-set pinned mechanically: extensions
     `{.js, .deps.js, .bemhtml.js, .bh.js, .css}` under `desktop.blocks/`/
     `touch.blocks/`, explicitly excluding `*.bemjson.js` fixtures and
     `*.examples/` directories — the five standalone `.bemjson.js` fixtures
     @ f2ab61e are out of scope, not silently baseline-red) with the **verified baseline @ f2ab61e: 7 standalone
    module groups (12 files)** — desktop `ua` (`ua.js`), touch `ua` (`ua.js`,
    `ua.deps.js`), touch `ua__dom` (`ua__dom.js`, `ua__dom.deps.js`), desktop
    `jquery__event_type_winresize` (`.js`, `.deps.js`), desktop `jquery__config`
    (deps-only), desktop `page__conditional-comment` (bemhtml+bh), touch
    `page__icon` (bemhtml+bh) — shrinking −3 (S1 ua family, via the common ua base
    + `__dom` ancestor), −1 (S2 winresize deletion), −3 (S6: `jquery__config` dies
    with `desktop.blocks/jquery/*` wholesale deletion; `page__conditional-comment`
    deleted — authorized template removal: C5 evergreen-only ⇒ IE-only elem is
    dead code, MIGRATION entry names it and both template files, hoist-to-common
    rejected as dead-code-in-common; `page__icon` hoisted to common) → **∅**.
    CONST-P5:
    LICENSE.txt + file-level MPL-2.0 notices preserved through S6 deletions and
    README/doc rewrites; the notices-intact grep is defined against a baseline:
    S0 records the notice-bearing file list as a checked-in baseline, and S6's
    done-gate asserts every surviving baseline file still carries its MPL
    notice (`grep -L 'MPL'` over the list = ∅) plus `LICENSE.txt` exists (the
    bare `test -f` alone cannot detect notice loss through rewrites).
    Doc-parity
    fence in S0 — anchor = `^#{2,3} ` headings; file-set at S0 =
    MIGRATION(.ru) + CHANGELOG(.ru) pairs, each en/ru pair anchor-count-equal
    per commit; at S6 the fence extends to the touched common.docs guides
    (enumerated in S6's spec), so the S6 docs-pass parity clause has a verifier.

## Interface

### package.json exports (target state, reached progressively)

```jsonc
"exports": {
  ".": "./dist/index.mjs",                          // S0: barrel v1; S1: +env/ua
  "./dist/desktop": "./dist/desktop/bem-core.mjs",  // side-effect payload
  "./dist/touch":   "./dist/touch/bem-core.mjs",    // side-effect payload
  "./build/plugins/*": "./build/plugins/*",
  "./common.blocks/*": "./common.blocks/*"          // narrowed from "./*" in S0
}
```

### Root barrel (platform-neutral, never auto-inits)

```js
export { default as bemDom } from 'bem:i-bem-dom';        // Block, Elem, declBlock,
                                                          // declElem, declMixin,
                                                          // entities, init, destruct,
                                                          // detach, update, replace,
                                                          // append, prepend, before,
                                                          // after, getFromDom,
                                                          // initOnDom, scope, doc, win
export { default as BemDomCollection } from 'bem:i-bem-dom__collection';
export { default as dom } from 'bem:dom';
export { Emitter, Event } from 'bem:events';
export { default as channels } from 'bem:events__channels';
export { default as loader } from 'bem:loader';             // callable; S3 barrel
                                                           // switch (the
                                                           // loader_type_js mod
                                                           // path deleted — KC 7)
export { default as env } from 'bem:env';                 // S1 (Q5 exception)
export { default as ua } from 'bem:ua';                   // S1, deprecated alias
```

Plain names = DOM flavor (the dominant authoring surface); vanilla-only `i-bem`
authoring stays a documented deep-import. No invented/prefixed exports. PRD
US1's illustrative `BemDom` casing resolves to `bemDom` (D-7: plain unprefixed
DOM-flavor names, no invented casing); legacy `BEMDOM.*` → `bemDom.*` is the S6
docs remap.

### Supported deep-import inventory (the pinned set)

i-bem (`.vanilla.js`, `__internal`, `__collection`), i-bem-dom (main,
`__collection`, `__events`(+`_type/{dom,bem}`), `__init`(+`_auto`)), events
(`.vanilla.js`, `__channels`, `__observable`(+`_type/bem-dom`)), `dom`, `loader`
(root `loader.js`, canonical from S3 — the `loader_type_js` mod path is deleted
in S3's commit, D-16), `env`, `ua` — all under `common.blocks/`. `inherit` is NOT in the pinned
set: internal-but-tolerated under the `./common.blocks/*` wildcard (frozen
internal per Q4/D-2); removing it later needs a CONST-P4 migration note.
`jquery` paths vanish at S6 (the pin test then asserts the import rejects).
`./build/plugins/*`: the plugin's default export
`bemLevels({platform, levels, rootDir?}) → Vite Plugin`.

### DOM type contract (CONST-P4 migration table, condensed)

> Public DOM-typed values are native `Element` or `Element[]`. Multi values are
> plain arrays, document-ordered, deduplicated, **static snapshots** — treat as
> immutable; re-read after DOM changes. No live collections in the public API.

- `entity.domElem` → frozen `Element[]` snapshot getter (internal storage private).
- `bemDom.scope/doc/win` → lazy getters (`body`/`document`/`window`), never
  null; empty-body behavior preserved (the lazy getter resolves an empty set
  until body exists — parity with today; the explicit-throw polish was dropped
  in plan-review-2 SC-6: an unrequested observable break on an edge path).
- `bemDom.init(ctx?)` accepts `Element | Element[] | string-selector`, returns
  `Element[]`; `destruct/detach/update/replace/append/...` take
  `Element | Element[]`; content: `string(html) | Element | Element[] | entity`;
  inserts return `Element[]`.
- `dom.getFocused()` → `Element`; `dom.contains(ctx, node)` any-in-any semantics;
  `isFocusable/isEditable` accept `Element`.
- `e.bemTarget` → `BemDomEntity | null`; `$(node).bem()` plugin DELETED at S5
  (off with the last jquery consumer; the wrapper itself is deleted at S6) —
  migrate to `bemDom.initOnDom(node, Block, params)`.

### env / ua surface

`env`: getters only (`ua` raw string as diagnostic; `platform`, `ios`, `android`,
`browser`, `screenSize`, `svg` memoized; `width`, `height`, `landscape` live) +
`orientchange` CustomEvent on window. **UA-derived vs capability-probed (G2
justification):** `platform`/`ios`/`android`/`browser` are UA-string-derived and
retained deliberately — the audited consumer inventory (Q5: touch `ua__dom`
platform modifiers) reads them, and platform identity is not a capability
question; each carries its justification in the S1 spec + a dedicated unit, and
the S1 emulation-parity tests are the G2 "tests" leg. `svg`/`screenSize`/
`width`/`height`/`landscape` are capability/live probes. **Field-disposition
completeness (Q5 strictness cuts both ways):** every field the audited consumer
reads gets an explicit disposition in the S1 spec — `ua__dom` also reads
`bada`/`wp` for its platform modifiers; working position is they are encoded in
`env.platform` (UA-derived, dedicated unit), ratified at S1 spec-craft — no
silent gaps inside a frozen consumer's rewrite. `ua`: Proxy alias,
live-forwarding, removed fields (`msie`, `dpr`, `flash`, `iphone`, `ipad`,
`webkit`, …) warn once and return `undefined`. The alias contract is
property-read access; destructuring/spread snapshots are unsupported by design
(noted in the S1 spec — plan-review-2 F6). `env.browser` keeps
`opera`/`chrome` keys one release (parity), dies with the alias.

### Loader surface

`loader(url, success?, error?)` → promise of module namespace; US6 migration line:
`loader(url, …)` → `import(url)` — PRD US6's `.get` form is stale @ the anchor
(repo-verified: `loader_type_js` default-exports the callable
`(path, success, error)`; no `.get` method exists in the loader, its spec, or any
consumer — retired like the G3 timeout parenthetical); the new root module
preserves the callable shape (the old mod path is deleted outright — the
bilingual MIGRATION entry carries old/new paths; no one-release bridge, D-16),
and the promise return is additive. Documented semantic shift: **ES modules
only** — classic scripts defining globals no longer execute.

Semantics mapping (old `loader_type_js` @ f2ab61e → new):

| old behavior | disposition |
|---|---|
| async load | ✓ `import()` |
| error reporting (`error` cb) | ✓ rejection → callback |
| in-flight dedup + loaded-once cache (`loading`/`loaded` Maps) | native `import()` module-map semantics |
| `file:`-protocol `'http:'` prefix fix | removed (Vite/Node resolve `file:` natively) |
| cross-origin script URLs (classic script injection loads them with no CORS today) | behavior change — dynamic `import()` requires CORS headers on the target; S3's internal-consumer audit confirms zero cross-origin loader URLs; MIGRATION line (plan-review-2 F3) |
| timeout | **never existed** — PRD G3's "timeout" parenthetical is stale (repo-verified: no timeout in `loader_type_js`); dropped. A timeout would be a new feature (Non-Goal) or a one-line `Promise.race` wrapper — S3 spec's call |

### Misuse error experience

Non-public path → `ERR_PACKAGE_PATH_NOT_EXPORTED` (Node) / unresolved import
(Vite), early and greppable · removed ua field → `undefined` + once-warn · pre-DOM
`bemDom.init` → lazy scope (empty until body exists — parity) · non-module loader URL → import()
rejection + bilingual note · override mis-authored → **build error** naming both
files (plugin validation).

## Data Model

1. **Module graph**: `bem:` virtual specifiers resolved by vite-plugin-bem-levels
   through level scanning; redefinitions compose via generated transformer barrels
   (`_module = redefN(_module)`); platform entries generated from the scan registry
   (data leg D3-c). `.deps.js` stays a **documented manifest, never a build input**
   — no schema+resolution lint scheduled (cut in plan-review-2 SC-1: the manifest
   has zero in-repo mechanical consumers beyond the CONST-P1 grep, which already
   consumes it as ratchet substrate); dead plugin-internal
   `bemEntityToModuleName` removed as an S6 release-prep ride-along
   (deferred from S0 in plan-review-2 SC-2 — nothing downstream depends on it).
2. **Override model (normative glossary)**: *base* (chain index 0), *transformer
   override* (index ≥1, MUST be `export default function(prev)` — build error
   otherwise), *side-effect refinement* (no default export, index 0 only),
   *standalone platform module* (no common ancestor — CONST-P6 baseline only).
3. **Runtime registries**: `bem.entities` (name → class, written by `decl*` import
   side effects — internal, pinned), `initFns` deferred queue, `_processInit` guard,
   `inherit.self` live-class mutation path preserved (spec:1813).
4. **Live-index stores** (post-decomposition): `WeakMap<Node, params>`,
   `WeakMap<Node, entity>` + explicit `Map<uniqId, Set<Node>>` for multi-node
   entities; per-entity elem caches + `_findBackRefs` invalidation unchanged in
   semantics.
5. **Ledgers**: CONST-P1 allowlist (9→∅), CONST-P6 baseline (7→∅), shim-map
   allowlist (shrinks), bundle/bench budget JSONs (ratchet), MIGRATION/CHANGELOG
   bilingual pairs (anchor-parity fenced). Ratchet diffs across the series ARE the
   machine-readable migration history.
6. **Spec-harness bridge**: ESM→ym shim map (ratcheted) until zero
    `modules.define` remain in specs; registration accounting replaces the `>400`
    floor (policy change owned by S2's harness commit — KC 12; mechanics per
    OQ-11).

## Trade-offs and Decisions

| # | Decision | Rationale / rejected alternatives |
|---|---|---|
| D-1 | Delete the jquery wrapper outright; no compat shim; peer dep removed (Q2) | Hard fork, single consumer, no telemetry-driven external population; `$(node).bem()` removal documented |
| D-2 | `inherit` frozen (Q4-a); native-class options a named future phase — a post-6.0.0 exploration convoy, opened only by a future PRD | (b)/(c) are research-scale (dynamic `__base` detection, `inherit.self` semantics); spec:1813 already pins required behavior |
| D-3 | Pure-registry BEM events (Q10), four named parity tests (the three Q10 caveats — positional trigger args, `flags.fns` dedup, `propagationStoppedDomNode` containment — plus the #1525 nested-same-type skip) | Kills last `$.event.special` use; composes with the D-4 engine; native-bubbling emulation re-imports DOM semantics BEM events don't have; S5 sized 8–10 REQ accordingly |
| D-4 | Delegation engine = per-scope anchors + composedPath walk + compiled class-token matchers | Preserves anchoring semantics; O(path) dispatch with O(1) checks; document-global listener rejected (cross-scope noise); per-binding listeners rejected (needs MutationObserver) |
| D-5 | WeakMaps for node-keyed state; keep lazy-compute + explicit invalidation | Leak classes die by construction; MutationObserver rejected (timing semantics change, observer storms); WeakRef/FinalizationRegistry rejected (nondeterministic teardown) |
| D-6 | Exports narrowing in S0 (not S6) | Earliest mechanical boundary; deleted-path negative tests are written against the pre-narrowing behavior and their expectations flip in the narrowing commit, so that commit's diff enumerates the break; the S0 spike pins the Vite half (one narrowed deep-import fails to resolve through the dev-server test config, or Node-only scope recorded as the deliberate bound); hardening per security leg |
| D-7 | Named-export barrel at root; plain names = DOM flavor | Default-only namespace rejected (hostile to pin test + tree-shaking analysis); prefixed vanilla names rejected (invents API); vanilla stays deep-import |
| D-8 | Platform entries generated from scan registry | Hand lists already drifted (desktop-only winresize, touch-only `ua__dom`); explicit runtime `register()` API rejected (duplicate truth, spec:1813 parity needs `entities` mutation anyway) |
| D-9 | `.deps.js` = documented manifest, never a build input | Plugin consumption would couple two divergent data models and re-introduce implicit ordering; wholesale deletion loses the ratchet substrate. The schema+resolution lint was cut in plan-review-2 (SC-1): no requirement carries a checker over a doc artifact with zero in-repo mechanical consumers; the CONST-P1 grep is the manifest's only load-bearing consumer |
| D-10 | Bundle gate + bench as plain scripts + Playwright project | `size-limit` package rejected (new dep/config surface); standalone manual benchmarks rejected (unenforceable); node microbench rejected (needs real DOM) |
| D-11 | **parseHtml is scripts-inert, with bilingual MIGRATION note** (documented C4 break) | Security leg: keepScripts is a footgun; scale leg found no positive script-execution test or in-repo dependent; single consumer + Q2 momentum. **Escape hatch:** S2 must run the named grep audit — script-execution dependents of `parseHtml`/`dom.parse` across sources + specs, pattern listed in the S2 spec, result quoted in the spec as the go/no-go; if a dependent exists, revert to parity (template parse + script re-creation) inside S2 |
| D-12 | One 6.0.0 at the end; version stays 5.0.0 through the series (Q9) | Single consumer; slices merge to `v5` unreleased; human cuts the release |
| D-13 | ua alias = one-release Proxy with once-per-field warns | Silent undefined (worst failure mode) and throwing getters (breaks page load) both rejected |
| D-14 | drop UMD dist format with the wrapper (S6) | CONST-P2 alignment; UMD's global-jquery dependency dies with it; zero window.* writes as the stated end state (descriptive consequence of the UMD drop — no new check is scheduled by this plan; S6's grep predicates remain: no-jquery-in-artifact, CONST-P1 ∅, CONST-P6 ∅, notices-intact) |
| D-15 | Chromium-only + desktop-parity verification matrix; touch-emulated Playwright project from S1 (Q8) | Full touch/webkit harness unfunded; slice-1 must not ship unverifiable |
| D-16 | S3 deletes the `loader_type_js` mod path outright — no one-release deprecated re-export; bilingual MIGRATION entry names old/new paths (plan-review-2 SC-4) | US6 is satisfied by the documented-migration half; CONST-P4 allows the shrink inside a slice whose spec documents the migration; Q2/D-1 hard-fork delete-outright culture — the bridge served hypothetical external deep-importers Q2 declares empty; bridge + once-warn machinery + a dedicated once-warn test would bloat the series' smallest slice; in-repo consumers verified = generated platform entries + spec harness only (switched mechanically / regenerated at S3) |

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| S4×S5 interim: native dom-events while bem-events still ride jQuery (cross-system trigger/stop interplay) | High | S4 carries explicit interop REQ + mixed-flow integration test; pre-authorized fallback: merge S4+S5 beads into one convoy with two internal stages if interop exceeds ~2 REQ of shim work — the fallback preserves two separately-gated internal stages (each ≤12 REQ; convoy shippable only when both are green), so C2's per-slice cap holds |
| Override-barrel runtime TypeErrors (mis-authored redefinitions) — desktop builds while touch breaks | High | Plugin transformer-form hard error, live from S0 (KC 9); CONST-P6 baseline; error names both files |
| Bench noise on shared CI runners | Medium | Ratio-to-v5-base thresholds only (≤1.10×); absolute budgets deferred until dedicated-runner evidence (post-series and optional — dedicated-runner evidence gathering is not scheduled by this plan; the ratio thresholds are the shipped gate) |
| ru-rot of bilingual docs | Medium | Doc-parity fence in S0 (anchor-count check en↔ru per commit); 1-REQ-equivalent budget per slice |
| Touch behavior unverifiable before S1 | Medium | Touch-emulated Playwright project is S1 acceptance (Q8); env API deliberately emulation-testable |
| WeakMap lookup cost on hot paths (~1.5–2× string Map) | Medium | B2/B4 bench pins before/after; `uniqId` path retained for multi-node entities |
| Spec silent-drop (shim swallows factory errors) | Medium | Registration accounting + loose floor (data leg D5-c; policy owned by S2's harness commit — KC 12, mechanics OQ-11); per-slice ratchet |
| Unknown external consumers of wrapper/bundle-loader/ua fields | Low (hard fork, single consumer) | Durable-recorded decision (Q2/Q5/Q7); MIGRATION notes name every removal |
| v4-era `common.docs/i-bem-js/` guide rot (43 v4-era `BEMDOM.*` matches, en guides; ru counterparts divergent) | Medium | Docs pass scoped in S6 as an API-accuracy pass (ux leg K2): BEMDOM.* → bemDom.* remap, sections for deleted APIs (loader semantics, ua fields, `$(node).bem()`, UMD) point at MIGRATION entries, ru/en anchor parity via the doc fence — content redesign out of scope, deferred post-6.0.0; not a jQuery-swap; G6's "documented" half is carried by the bounded README contributor section (US3), not the deferred redesign |
| Scope creep into tree-shaking/TS/types | Medium | Explicit Non-Goals; US1 scoped to "no jQuery in bundle" |
| Mid-series revert of a non-tip slice whose outputs a landed successor consumes (S2 → S4's engine; S5 → S6's deletions) | Medium | Reverts are stack reverts: reverting slice N with N+1 landed requires reverting N..M. Ledgers/ratchets/budgets/staged gates ride slice commits and re-key off git-tracked state (allowlist ≠ ∅ after a revert → skip/preview mode rebinds; hand lists and generated entries recoverable from git history — no one-way doors, no CI wedge). A red after a partial revert comes from code (build/test), not from the gates (plan-review-2 F8) |

## Implementation Plan

**Per-slice TESTS checklist contract** (every slice spec carries it):

1. **Pinned-green** — existing specs cited by path that must pass (S4:
   `i-bem-dom__events_type_dom.spec.js` 1069L; S5: `..._type_bem.spec.js` 1013L +
   `i-bem-dom.spec.js` 1854L incl. `:1813` — `__init_auto` pinned via its
   auto-init suites; S3: `loader_type_js.spec.js`; S2: `dom.spec.js` 159L; idle
   has no spec corpus @ the anchor — pin transitively via `i-bem-dom.spec.js`
   init flows or add a minimal idle unit (decide at S2 spec-craft)).
2. **New** — tests the slice adds and what each pins (S0: api-pin (incl. the D-6
   deleted-path negative tests), bundle gate, payload-parity assertion,
   plugin transformer-form tests, staged-gate meta-test (KC 10/KC 13 guard
   fixture trees: skip-state → exit 0 + preview output, bind-state-clean →
   exit 0 + binding output, bind-state-dirty → exit 1; plus the
   bidirectional-ratchet red fixture — an allowlist entry whose file no longer
   matches reality → exit 1; `check-bundle-size.mjs` and the doc fence carry
   the same first-landing red proof), spike assertions (generated entry
   resolves through both build paths; one narrowed deep-import fails to
   resolve through the dev-server test config, or Node-only scope recorded as
   the deliberate bound); S1: env units incl. one unit
   per UA-derived getter, ua alias units (removed-field once-per-field warn
   via spy + `undefined` return; assignment once-warn no-op; live
   property-read forwarding — the alias tracks env getter changes),
   emulation parity **with its serving path** (second
   webServer/port or param'd `vite.test.config` `platform=touch`; entry/shim
   extended to ua/env — plan-review-2 F5), api-pin/inventory update (+env/+ua,
   pin test green in the same commit); S2: parseHtml policy test, bench B1–B5
   (the ratio gate's first firing is S2's own done-gate — KC 11);
   S3: promise-return semantics, error-callback wiring, ES-only rejection
   (non-module URL) + cross-origin rejection (CORS row, F3) — servable
   ES-module URL fixtures provided for the loader spec corpus (F10),
   barrel/pin switch to `bem:loader`, zero-`loader_type_js` grep;
   S4: engine units, focus-delegation, mixed-flow
   interop; S5: four caveat tests (three Q10 caveats + #1525 skip); S6:
   no-jquery artifact, CONST-P6 ∅, MPL notices-intact vs the S0
   notice-bearing baseline list (`grep -L 'MPL'` over the list = ∅ +
   `LICENSE.txt` exists), zero `conditional-comment` references outside
   MIGRATION/CHANGELOG text).
3. **Deleted** — specs removed with their blocks, with reason.
4. **Harness Δ** — shim-map ratchet entries, count-floor policy changes (S2
   lands the policy: magic `>400` → per-file registration accounting + loose
   liveness floor in S2's harness commit; S4/S5 extend the accounting per
   conversion — KC 12/OQ-11), entry.js
   map edits; the harness's jquery consumers convert with their slices (S2:
   `dom.spec.js`; S4: `__events_type_dom.spec.js`; S5: `__events_type_bem.spec.js`
   + `i-bem-dom.spec.js` + the shim-map `jquery` entry + `entry.js`'s jquery
   import + the `vite.test.config` `optimizeDeps` jquery line, all in one commit —
   the harness jquery exit completes in S5, plan-review-2 F1 — and S5's own
   done-gate carries the closure grep: zero `jquery` references across
   `test/browser/entry.js`, the shim map, and `build/vite.test.config.js`
   (pattern per KC 13's zero-jquery predicate), so the exit is mechanically
   detected at S5, not first at S6).
5. **Docs Δ** — block-level `.md`/`.ru.md` updated or deleted with the block
   (S1: env docs en+ru + ua alias/removed-fields note; S2/S3: docs ride the
   rewrites/deletions; S6: jquery/__config/page docs deleted with their
   blocks); new public modules ship docs in both languages; whether the S0
   doc-parity fence extends to block-doc en↔ru pairs is ratified at S0
   spec-craft.

**Done-gate (machine-checkable, per slice)**: `npm run lint && npm test && npm run
test:browser -- --project=chromium[,touch-emulated][,bench]` + the slice's
scripted allowlist/baseline pin (the slice's expected contents embedded in its
own spec's sdd-check) + budget green + constitution sdd-checks
(spec-craft + done-gate per CONSTITUTION.md header).

**CI wiring (extend `.github/workflows/ci.yml` in place, no new jobs)**:
S0 — bundle gate appended to `build` job; api-pin joins the `test` node suite;
the CONST-P6 baseline check and the CONST-P1 final predicate (in its
skip/preview form) — and the S0-amended bidirectional CONST-P1 sdd-check
(additions + forgotten shrinks, KC 13) — ride the same `build` job from S0, so US3's "CI rejects" is
wired at repo CI, not only at slice done-gates; the doc-parity fence rides the
same `build` job from S0 too (per-commit enforcement needs a named runner);
Node matrix unchanged — the existing [20] entry already pins the ≥20 floor
(current matrix [20,22]); revisit 24 only if a slice cites a Node-24-dependent
behavior (none identified). S1 — touch-emulated project to
`test-browser`. S2 — bench project. S3–S5 — no CI change (specs auto-collect).
S6 — jquery devDep removal keeps `npm ci` green; UMD dropped from `build`.

**MIGRATION ledger discipline**: one `### <slice-id> <title>` section per slice in
MIGRATION.md + MIGRATION.ru.md in the same commit; CHANGELOG(.ru) under
`## Unreleased`; human collapses to `## 6.0.0`.

**Bead DAG for create-beads**: 7 slice convoys with deps `S0→{S1,S2,S3}`,
`S2→S4→S5→S6`, `{S1,S3}→S6`; each convoy ≤12 REQ beads; allowlist deltas, TESTS
checklist, and MIGRATION cells from the slice table above become per-slice
done-criteria; S1 and S3 mutate the barrel/pin inventory on disjoint export
lines (S1 +env/+ua; S3's loader switch) — merge order between them is free,
rebase tolerance recorded in both specs (the KC 8 hand-edit-race rationale
applies to generation, not to these line-disjoint edits); S4 spec pre-authorizes the S4+S5 merge fallback. **Overflow
pre-authorization (plan-review-2 F7/F10):** S0 at >12 REQs at spec-craft splits
into S0a (fence + contracts: barrel, pin, exports narrowing, gates, doc fence,
constitution amendments) and S0b (generation + plugin transformer-form
validation tooling) — both land before the S1/S2/S3 fan-out (S2/S3 strictly
need S0b's generation; S1 needs S0a's barrel/pin). S6 at >12 REQs splits into
S6a (deletion + enforcement + final gates) and S6b (release prep + docs/README +
ledger consolidation) — S6a before S6b; mid-flight splits are not authorized
anywhere else. **Revert protocol (F8):** mid-series reverts are stack reverts —
reverting slice N with N+1 landed requires reverting N..M; gates re-key off
git-tracked state and stay self-consistent; a red after a partial revert comes
from code, not from the gates.

## Open Questions

1. Bench project: per-push CI vs scheduled job (cost vs regression latency) —
   decide at S2 spec-craft. Working position: per-push (the CI wiring line); a
   scheduled job is adopted only on runner-cost evidence.
2. Final bundle caps: stay in `specs/bundle-budget.json` (CI-enforced) vs promoted
   to a constitution sdd-check at S6. Working position: JSON + CI; constitution
   keeps only the no-jquery predicate.
3. `bemDom.scope` anchor for class-level bindings post-ESM: `body` (today) vs
    `document.documentElement` (catches pre-body focus via focusin). Working
    position: `body` (parity with today — see DOM type contract); pick + pin in
    S4 specs.
4. parseHTML evidence check (D-11 escape hatch): targeted grep/spec audit result
   decides parity vs scripts-inert — first REQ of S2.
5. Shim-map ratchet home: working position — plugin-test assertion (lives with
   vite-plugin-bem-levels tests; any slice may extend). Promote to a constitution
   sdd-check only if non-owner agents must be barred from editing entry.js.
   Decide at S0 spec-craft, before the first Harness Δ ratchet entry lands
   (earliest S2).
6. `keyboard__codes` test provision: stays; the S0 generation REQ must either
     reproduce it (payload-parity assertion vs the pre-S0 hand lists) or record
     the explicit fate decision (Key Components 8); silent drop via generation
     is forbidden; long-term fate revisited only by a future keyboard-spec
     convoy (keyboard internals are Non-Goal-frozen — no slice of this series
     owns them).
7. Does anything outside the spec corpus rely on runtime re-declaration
   (`inherit.self`)? S0 pin test records `bem.entities` mutation as internal.
8. `env.browser` legacy keys (`opera`/`chrome`): confirmed one-release lifetime
   (die with the ua alias) — ratify in S1 spec.
9. Barrel `dist/index.mjs` naming and payload-entry paths (`./dist/desktop` vs
   `./desktop`): cosmetic, ratify in S0 spec.
10. `env.platform` encoding for `bada`/`wp` (the `ua__dom` platform-modifier
    fields): working position — encoded in `env.platform` (UA-derived, dedicated
    unit); ratify at S1 spec-craft (see "env / ua surface"). Registered here so
    the body-text deferral has an inventory entry.
11. Registration-accounting ledger mechanics (the `>400`-floor replacement,
    KC 12 — plan-review-3 T-SF-7/C-MF-2): ledger home — working position:
    checked-in JSON keyed by spec path, shrinking ratchet, asserted by the
    plugin-test home chosen for the shim map (OQ-5); definition of the loose
    liveness floor — working position: total registered ≥ N% of the ledger at
    spec start; update owner — the slice performing the Harness Δ. Decide at
    S0 spec-craft; the policy change itself lands in S2's harness commit
    (S4/S5 extend the accounting per conversion).

### Retired during prd-align-1 (2026-09-23, evidence-closed)

- **PRD OQ3 pointerevent normalization ownership** — moot: grep-verified zero pointer
  code @ f2ab61e (v5 head = v5-base@7a9e932 + the constitution commit; no blocks
  touched between — a valid parity proxy for the anchor; see Key Components 6);
  PRD Problem Statement item and OQ3 retired.
- **PRD G3 loader "timeout"** — stale premise: `loader_type_js` never exposed a
  timeout (repo-verified); requirement is void, see Loader surface semantics
  table.
