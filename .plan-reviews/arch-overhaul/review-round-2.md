# Plan self-review round 2 — risk and scope-creep (plan-review-2)

- Step bead: bc-4us (mol-idea-to-plan.plan-review-2), root bc-4ii
- Dispatched by: bem-core/opencode-1 (sessions: legs dispatched by gc-81mca's
  predecessor run; synthesis by gc-81mca) on 2026-09-24
- Inputs read by legs: .designs/arch-overhaul/design-doc.md @ plan-review-1 state
  (598L), .plan-reviews/arch-overhaul/prd-align-round-{1,2,3}.md +
  review-round-1.md, .prd-reviews/arch-overhaul/prd-draft.md, CONSTITUTION.md,
  repo @ f2ab61e (branch v5, read-only)
- Coordinator re-verified the load-bearing new repo facts before applying
  (risk leg's evidence): `test/browser/entry.js:42` imports jquery directly +
  shim-map `jquery: $` entry; `build/vite.test.config.js` `optimizeDeps.include`
  lists jquery and hardcodes `platform: 'desktop'`; 25/25 spec files
  ym-authored, 4 still consume jquery via the shim (`dom.spec.js` 159L,
  `i-bem-dom.spec.js` 1854L, `__events_type_dom.spec.js` 1069L,
  `__events_type_bem.spec.js` 1013L); CONST-P1 grep is `--include='*.deps.js'`
  (harness invisible to the ratchet); desktop `page.deps.js` declares
  `shouldDeps: {elems: ['conditional-comment']}` and
  `page.tmpl-specs/60-conditional-comments.{bemjson.js,html}` exists;
  `bemEntityToModuleName` defined+exported in
  `build/plugins/vite-plugin-bem-levels.js:280/:669` with zero production call
  sites; plugin scan registry is a Map in `readdirSync` order; cross-module
  deps are static `bem:` imports (`winresize`, `__init_auto`,
  `__events_type_dom` verified); `git diff 7a9e932..f2ab61e` touches only
  CONSTITUTION.md + specs/.gitkeep (v5-base parity proxy re-confirmed).
  All confirmed @ f2ab61e.

## Legs

| leg | bead | workflow | report | verdict |
|---|---|---|---|---|
| risk | bc-j0yf | bc-403b | legs/report-plan-review-2-risk.txt | 4 lenses walked; 10-row risk matrix; 2 must-fix, 8 should-fix; no rollback wedge found |
| scope-creep | bc-vdjh | bc-s3tp | legs/report-plan-review-2-scope-creep.txt | 4 lenses; 0 must-cut, 6 should-cut, 1 defer; ~30 explicit acquittals; over-engineering lens: zero findings |

Both reports fully accepted — **0 rejections**. The two legs are
complementary (one adds risk carriers, one trims unscheduled mass); the only
interaction points (F10's S3 fixture floor vs SC-4's bridge cut; F1's S5
harness exit vs SC-2's S6 ride-along) were merged as noted below.

## Applied changes to .designs/arch-overhaul/design-doc.md

### MUST-FIX (risk)

1. **F1: the test harness is a jquery consumer no slice owned** —
   `entry.js`'s `import $ from 'jquery'`, the shim-map `jquery: $` entry, and
   `vite.test.config`'s `optimizeDeps` jquery line are invisible to the
   CONST-P1 `*.deps.js` grep; the only detector (the final predicate's
   sources+harness conjunct) first binds at S6's own deletion commit — a
   mid-S6 discovery in the series' fattest slice. Applied: harness jquery exit
   pinned to S5 (S5 outcome cell: `__events_type_bem.spec.js` +
   `i-bem-dom.spec.js` converted AND all three harness sites deleted in the
   same commit); carriers named in S2 (`dom.spec.js`) and S4
   (`__events_type_dom.spec.js`); KC 12 extended; TESTS item 4 (Harness Δ)
   carries the full carrier list; CONST-P1 final predicate + S6 done-gate gain
   "sources+harness+build-configs ∅ / zero jquery imports repo-wide".
2. **F2: S0's entry-generation bet named the what, not the how** — artifact
   form, import ordering, and drift detection were unspecified in the slice
   the whole fan-out waits on. Applied: KC 8 + S0 outcome cell — generation
   output committed at `build/platforms/*.gen.js` (lockfile-style); imports
   emitted in canonical sorted order, sound because cross-module ordering
   rides static `bem:` import edges (verified — not list order); CI re-runs
   the generator and diffs (freshness); payload-parity assertion compares
   against the checked-in pre-S0 baseline.

### SHOULD-FIX risk (all applied)

3. **F3: loader semantics table omitted the cross-origin/CORS break** (classic
   script injection needs no CORS; `import()` does). Applied: semantics-table
   row + S3 row (audit clause + MIGRATION line).
4. **F4: S6 deletion list missed the conditional-comment dependents**
   (`page.deps.js` shouldDeps entry, `60-conditional-comments` tmpl-spec pair,
   `page.examples` relics). Applied: S6 outcome cell enumeration.
5. **F5: touch-emulated S1 acceptance had no serving path** (vite.test.config
   hardcodes `platform: 'desktop'`; single webServer). Applied: S1 row + TESTS
   S1 — second webServer/port or param'd config with `platform=touch`;
   entry/shim extended to ua/env.
6. **F6: destructuring silently defeats the ua Proxy's live-forwarding.**
   Applied: KC 2 + env/ua surface — alias contract is property-read access;
   destructuring/spread snapshots unsupported by design (pinned in S1 spec).
7. **F7: S0's at-cap split contingency lived only in round-1's log.** Applied:
   Implementation Plan Bead-DAG paragraph — S0 overflow pre-authorized to
   split into S0a (fence + contracts) / S0b (generation + plugin validation
   tooling), both before the S1/S2/S3 fan-out; mid-flight splits not
   authorized elsewhere. (Scope cuts below relieve S0 to 10–11; the
   pre-authorization remains as insurance.)
8. **F8: revert protocol was implicit.** Applied: Risks table row + one-line
   revert note in the Implementation Plan — mid-series reverts are stack
   reverts (N..M); gates re-key off git-tracked state, no wedge; red comes
   from code, not gates.
9. **F9: one timeboxed spike retires S3's bundler unknown now** — dynamic
   `import(variable)` through Vite 8/rolldown in both configs (dev-server
   harness + lib build) is the plan's only unexercised external-runtime bet.
   Applied: S0 outcome cell spike REQ (records rolldown behavior; doubles as
   a generated-entry smoke test through both build paths).
10. **F10: S3/S6 hidden REQ mass.** Applied via F1 (harness exit moves out of
    S6 into S5) + S3 TESTS fixture line (servable ES-module URL fixtures;
    floor 5–6) + the pre-authorized S6a/S6b split (deletion+enforcement+final
    gates vs release prep+docs+ledger consolidation) mirroring F7's S0
    language. Net: S3 stays 4–6 (bridge cut below offsets the fixtures).

### Scope cuts/defers (all applied)

11. **SC-1 [should-cut]: `.deps.js` schema+resolution lint (S0)** — no
    requirement carries a checker over a manifest the design itself excludes
    from the build (D-9); zero in-repo mechanical consumers beyond the
    CONST-P1 grep. Applied: removed from S0 cell, Data Model 1, D-9, TESTS
    item 2. *Supersedes round-1 C-F4's scheduling — recorded here.*
12. **SC-2 [defer]: entity-converter unification → S6 ride-along** —
    `bemEntityToModuleName` is dead plugin-internal code (verified); nothing
    downstream depends on it; S0 is the pinched slice. Applied: moved from S0
    to S6 release prep. *Also supersedes round-1 C-F4's scheduling.*
13. **SC-3 [should-cut]: stale "Node floor pinned" in the S0 cell** —
    contradicts the already-applied NG-F7 cut and the CI-wiring no-change
    sentence. Applied: deleted.
14. **SC-4 [should-cut]: loader one-release deprecated re-export bridge (S3)**
    — US6 is satisfied by the documented-migration half; CONST-P4 permits the
    shrink inside a slice whose spec documents the migration; the bridge
    served hypothetical external deep-importers Q2 declares empty; in-repo
    consumers are hand lists + harness (switched mechanically). Applied: old
    mod path deleted outright; bilingual MIGRATION entry names old/new paths;
    once-warn machinery + its test dropped; closure predicate becomes
    zero-`loader_type_js` references repo-wide; new decision row **D-16**
    records the rationale. *Refines round-1 SQ-SF-5's option (a): canonical
    switch kept, bridge dropped — the counterweight (upstream bridge culture)
    is documented in D-16; restoring a bridge at S3 spec-craft would be a
    recorded deliberate affordance, not a requirement.*
15. **SC-5 [should-cut]: bench scenario B6 "startup" (S2)** — payload bytes
    are already bundle-gated and init is B1; every remaining scenario measures
    a path a slice changes. Applied: B1–B5 in KC 11, S2 row, TESTS S2; a
    6.0.0 startup number, if wanted, rides the final bench run.
16. **SC-6 [should-cut]: bemDom lazy-getter explicit-throw polish** — an
    unrequested observable break on an edge path (C4 parity by default).
    Applied: DOM type contract keeps today's empty-body behavior; misuse
    section updated (lazy scope, no throw).
17. **SC-7 [should-cut]: `_buildModValRE` memoization mention (KC 6)** — perf
    mechanism with no requirement anchor and no bench scenario. Applied:
    phrase dropped; left to S5 implementation latitude.

The scope-creep leg's ~30 acquittals (incl. the full over-engineering lens —
zero findings across all nine named machines) required no edits; each is
recorded with its requirement anchor in the leg report.

## Rejections

None. All 17 merged findings applied in full (2 must-fix + 8 should-fix risk;
6 should-cut + 1 defer scope). Coordinator judgment calls, recorded: (a)
SC-1/SC-2 supersede round-1 C-F4 — risk of losing the lint is accepted on the
leg's evidence (doc-only artifact, single consumer, grep is the only
mechanical consumer); (b) SC-4's bridge cut is adopted despite the medium
confidence + bridge-culture counterweight — the hard-fork culture (D-1, Q2) is
the binding precedent, and D-16 documents the counterweight; (c) S3's REQ
estimate stays 4–6 rather than adopting F10's 5–6 floor — the bridge cut
offsets the fixture mass; (d) S0 estimate moves 11–12 → 10–11 (SC-1/SC-3 out,
spike + generation-mechanism detail in, net relief).

## REQ-budget state after this round

S0 10–11 · S1 8–12 · S2 6–8 · S3 4–6 · S4 8–12 · S5 8–10 (+ harness-exit
commit, inside existing conversion REQs) · S6 8–10 (+ bemEntityToModuleName
ride-along, ~0). Series shape unchanged: 7 slices, none exceeds the 12 cap,
S0 no longer at-cap. Overflow splits for S0 and S6 are pre-authorized (F7/F10).

## Disposition state after this round

Risk posture closed: every slice's core bet now names its failure mode,
detector, and owning carrier; the harness jquery exit is scheduled (S5) rather
than discovered (S6); the one unexercised external-runtime bet (dynamic import
through Vite 8/rolldown) has a timeboxed S0 spike; the revert protocol is
written down. Scope posture closed: zero must-cut violations, the two at-cap/
smallest slices relieved, every deferral re-checked for hidden load-bearing
couplings (none). Ready for plan-review-3 (bc-y0m, testability and coherence).
