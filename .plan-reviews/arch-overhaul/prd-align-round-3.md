# PRD alignment round 3 — user stories and open questions (prd-align-3)

- Step bead: bc-oz3 (mol-idea-to-plan.prd-align-3), root bc-4ii
- Dispatched by: bem-core/opencode-1 (session gc-oeh47) on 2026-09-24
- Inputs read by legs: .prd-reviews/arch-overhaul/prd-draft.md (US1–US6 walk
  inventory + OQ1–OQ9 + binding Q1–Q10), .designs/arch-overhaul/design-doc.md @
  prd-align-2 state, .plan-reviews/arch-overhaul/prd-align-round-{1,2}.md,
  CONSTITUTION.md
- Coordinator re-verified the load-bearing new repo facts before applying:
  `loader_type_js` default-exports the callable `(path, success, error)` — no
  `.get` method exists (all `.get(` hits in the loader are internal Map lookups:
  `loading`/`bundles`); `common.blocks/idle/` has no spec corpus (deps/md/js +
  `_start` only). Both confirmed @ f2ab61e (branch v5).

## Legs

| leg | bead | workflow | report | verdict |
|---|---|---|---|---|
| user-stories-coverage | bc-1hn | bc-7cn | legs/report-prd-align-3-user-stories-coverage.txt | 30 story clauses: 22 COVERED / 7 PARTIAL / 1 MISSING; 1 must-fix, 6 should-fix |
| open-questions-resolution | bc-0pq | bc-can1 | legs/report-prd-align-3-open-questions-resolution.txt | 17/18 dispositioned; 1 must-fix (dangling deferral), 8 should-fix; both retired items re-verified accurate |

Both reports fully accepted — **0 rejections**. No overlapping conflicts
(US-leg F7 loader `.get` and OQ-leg's G3-timeout parallel are the same
stale-premise class; applied independently in their own sections).

## Applied changes to .designs/arch-overhaul/design-doc.md

### MUST-FIX

1. **US-F2: US3/G6 "docs tell me where shared behaviour goes" had no concrete
   carrier** (squeezed out by the S6 docs-pass bound + unscoped "README
   rewrite"). Applied: S6 row scopes the README/README.ru rewrite to a bounded
   "Platform levels are override-only" contributor section (shared behaviour →
   common.blocks; transformer-form rule; CONST-P6 check + baseline semantics;
   plugin build-error behavior; en/ru anchor-fenced, 1-REQ-equivalent) — named
   as G6's documented half / US3 carrier; Risks docs row gains the same
   cross-reference.
2. **OQ-F1: design-OQ 5 (shim-map ratchet home) was a deferral without a
   concrete decision point** (a rule, no slice/owner/timing/working position —
   while the first Harness Δ ratchet entries can land as early as S2). Applied:
   OQ-5 rewritten with working position (plugin-test assertion) + decision
   point (S0 spec-craft, before the first Harness Δ entry lands).

### SHOULD-FIX (all applied)

3. **US-F1: PRD US1's illustrative `BemDom` casing unreconciled.** Applied:
   Root barrel block — casing resolves to `bemDom` (D-7), distinct from the
   legacy `BEMDOM.*` → `bemDom.*` docs remap.
4. **US-F3: US3 "CI rejects" clause — CONST-P6/P1 not wired into ci.yml.**
   Applied: CI wiring S0 sentence — CONST-P6 baseline check + CONST-P1 final
   predicate (skip/preview form) ride the `build` job from S0.
5. **US-F4: per-consumer test carriers missing for `idle` and `__init_auto`.**
   Applied: TESTS pinned-green — idle has no spec corpus @ the anchor (pin
   transitively via i-bem-dom init flows or minimal unit, decide at S2
   spec-craft); `__init_auto` pinned via the auto-init suites; `dom.spec.js`
   159L cited.
6. **US-F5: S5 trio per-file migration targets not itemized.** Applied: S5
   outcome cell −3 disposition (`__events_type_bem` → registry; `i-bem-dom` →
   S2 facade + S4 engine; `__init_auto` → native DOM-ready + nextTick(init)).
7. **US-F6: S3 closure predicate unnamed** (only slice with no allowlist
   delta). Applied: S3 outcome cell closure predicates (zero
   `loader_type_bundle` refs repo-wide; dynamic `import(` present; deprecated
   re-export with once-warn).
8. **US-F7: US6 migration line cited the stale `loader_type_js.get(url)` form**
   (repo-verified: no `.get` exists anywhere). Applied: Loader surface rewritten
   — `loader(url, …)` → `import(url)`, `.get` retired like the G3 timeout
   parenthetical; re-export preserves the callable shape; promise return
   additive.
9. **OQ-F2: orphan deferral — bada/wp env-field disposition lived only in body
   text.** Applied: registered as Open Question 10 (working position:
   `env.platform` encoding, ratified at S1 spec-craft).
10. **OQ-F3: "three Q10 parity caveats" disagreed with the four enumerated
    parity items.** Applied: standardized to "four named parity tests" (three
    Q10 caveats + #1525 nested-same-type skip) in D-3, KC-5, S5 row, TESTS.
11. **OQ-F4: inherit "named future phase" never named.** Applied: Exec Summary
    + D-2 — "a post-6.0.0 exploration convoy, opened only by a future PRD".
12. **OQ-F5: design-OQ 1 lacked a labeled working position.** Applied: per-push
    (CI wiring line); scheduled job only on runner-cost evidence.
13. **OQ-F6: design-OQ 3 lacked a labeled working position.** Applied: `body`
    (parity with today, per DOM type contract); documentElement is the
    candidate, pick + pin in S4 specs.
14. **OQ-F7: design-OQ 6's "its slice decides fate" names a decision point
    that never arrives** (keyboard is Non-Goal-frozen). Applied: OQ-6 reworded —
    S0/S1 generation REQ reproduces (payload-parity) or records the fate
    decision; long-term fate only via a future keyboard-spec convoy.
15. **OQ-F8: PRD OQ7 (dom block fate) disposition implicit-only.** Applied:
    KC-3 — dom stays public (Q3); internal i-bem-dom helpers use the facade; no
    merge into i-bem-dom internals.
16. **OQ-F9: `$(node).bem()` removal label drift "(S5/S6)".** Applied: DELETED
    at S5 (with the last jquery consumer); wrapper itself deleted at S6.

### Also applied

- Header note: prd-align-3 provenance block (date, legs, findings folded in,
  round-log pointer).

## Rejections

None. All 16 merged findings applied in full (2 must-fix + 14 should-fix;
leg-1 graded its F2 must-fix itself and the coordinator concurred — an
unscoped rewrite plus an explicit content-redesign deferral is not a carrier
for a G6 requirement).

## Disposition state after this round

The question inventory is fully dispositioned: PRD OQ1–OQ9 all ANSWERED/RETIRED
with visible carriers; design-OQ 1–10 all ANSWERED or DEFERRED-EXPLICIT with
named decision points + working positions; retired items (OQ3 pointer, G3
timeout) re-verified accurate @ f2ab61e. US1–US6 all covered (partial clauses
from this round tightened to covered-with-named-carrier). Ready for
plan-review-1 (bc-ge0).
