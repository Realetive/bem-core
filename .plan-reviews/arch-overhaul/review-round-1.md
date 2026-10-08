# Plan self-review round 1 — completeness and sequencing (plan-review-1)

- Step bead: bc-ge0 (mol-idea-to-plan.plan-review-1), root bc-4ii
- Dispatched by: bem-core/opencode-1 (session gc-8imsd) on 2026-09-24
- Inputs read by legs: .designs/arch-overhaul/design-doc.md @ prd-align-3 state,
  .plan-reviews/arch-overhaul/prd-align-round-{1,2,3}.md,
  .prd-reviews/arch-overhaul/prd-draft.md, CONSTITUTION.md, repo @ f2ab61e (v5)
- Coordinator re-verified the load-bearing new repo facts before applying:
  `build/platforms/{desktop,touch}.js` import `bem:jquery` (+ `bem:jquery__config`)
  directly (jquery stays in the payload after S5's allowlist-∅); desktop-only
  `bem:jquery__event_type_winresize`; both lists import `bem:loader_type_bundle`;
  package.json peer+dev jquery ^4.0.0, engines >=20, exports `"./*": "./*"`
  (narrowing is a real break); `common.blocks/loader/` contains only
  `_type/loader_type_{js,bundle}.js` + loader.{en,ru}.md (no `loader/loader.js`);
  CONSTITUTION.md CONST-P1 check is `comm -23` (additions-only direction);
  `touch.blocks/ua/ua.js` fires `$win.trigger('orientchange', {...})`;
  `dom.js`/`idle.js` contain zero ua/env references;
  `build/plugins/vite-plugin-bem-levels.test.js` exists; block-level docs sit
  beside every touched block (jquery/loader pair verified; coordinator recount:
  22 en + 29 ru .md under the three level dirs — the completeness leg's 51/29
  tally counted a wider net; the qualitative fact, not the count, is load-bearing).
  All confirmed @ f2ab61e (branch v5).

## Legs

| leg | bead | workflow | report | verdict |
|---|---|---|---|---|
| completeness | bc-kxjm | bc-podi | legs/report-plan-review-1-completeness.txt | 6 lenses: 2 STRONG/complete, 4 PARTIAL; 4 must-fix, 7 should-fix |
| sequencing | bc-wkbs | bc-i7tc | legs/report-plan-review-1-sequencing.txt | edge table: all stated edges real, all omitted edges correctly omitted; 2 must-fix, 6 should-fix |

Both reports fully accepted — **0 rejections**. Four findings were found
independently by both legs (final-gate activation, entry-generation ownership,
plugin-validation timing, "S1 soft" edge) — merged below as single fixes; the
legs' suggested shapes were compatible and the stronger form was taken in each
case.

## Applied changes to .designs/arch-overhaul/design-doc.md

### MUST-FIX

1. **C-F1/SQ-MF-1 (merged): staged final gates' auto-activation keyed on
   allowlist-emptiness would bind one slice early and redden S5→S6** (allowlist
   is ∅ *after S5* while jquery legitimately remains in the payload until S6's
   deletion commit — both platform entry lists import `bem:jquery` directly;
   also a revert hazard: reverting S6 alone would wedge the gates binding-red).
   Applied (Exec Summary bullet, KC 10, KC 13): activation re-keyed to the
   conjunction — allowlist ∅ **and** wrapper block deleted **and** package.json
   carries no jquery; guard short-circuits to preview + exit 0 while any
   disjunct fails; first possible binding-green commit = S6's deletion commit.
2. **C-F2/SQ-MF-2 (merged): entry-generation machinery had no owning slice
   ("S0–S1 tooling") while S2/S3 delete entries today's hand lists import**
   (winresize desktop, loader_type_bundle both — deletion with live hand lists
   breaks the build on an unresolvable `bem:` specifier; parallel hand-edits
   race; OQ-6's payload-parity baseline drifts). Applied: generation + hand-list
   deletion + payload-parity assertion pinned to S0 (KC 8 rewritten with the
   mechanical rationale; S0 outcome cell; OQ-6 "S0/S1 generation REQ" → "S0").
3. **C-F3: block-level doc surface (22 en + 29 ru .md beside blocks) had no
   owner, and the new public `env` module had no doc carrier.** Applied: TESTS
   checklist gains item 5 "Docs Δ" (block .md/.ru.md updated/deleted with the
   block; new public modules ship en+ru docs; fence-extension-to-block-docs
   ratified at S0 spec-craft) + carriers in the S1/S2/S3/S6 outcome cells.
4. **C-F4: Data Model 1's `.deps.js` schema+resolution lint and
   entity-converter unification were scheduled nowhere.** Applied: both added to
   the S0 outcome cell.

### SHOULD-FIX (all applied)

5. **C-F5/SQ-SF-2 (merged): plugin transformer-form validation "(S0/S6)"
   ambiguous** — the High-risk mitigation had no named landing slice; if it only
   bound at S6, S1's first override-heavy restructuring and S4/S5's transformer
   barrels ship unvalidated. Applied: hard error live from S0 (KC 9 + Risks row
   + S0 cell; plugin's existing test corpus is the verifier; S6 adds no new
   validation).
6. **C-F6: doc-parity fence created in S0 but not wired into CI.** Applied: CI
   wiring S0 sentence — fence rides the `build` job from S0 (per-commit
   enforcement needs a named runner).
7. **C-F7: exports-map narrowing (a C4-visible break — today `"./*": "./*"`
   resolves every root-relative path) had no MIGRATION line.** Applied: Design
   position 3 — S0's MIGRATION cell carries both the root-export switch and the
   narrowing line.
8. **C-F8: orientchange transport change (jQuery synthetic → native CustomEvent)
   not enumerated as a break** (listeners/payload move: jQuery-bound handlers +
   trigger args → addEventListener + `event.detail`). Applied: KC 1 names the
   break and the S1 MIGRATION migration line.
9. **C-F9: bench v5-base reference capture unscheduled** — ratio thresholds have
   no denominator. Applied: S2 outcome cell gains the capture step (build @ tag
   v5-base, baselines recorded into the bench config).
10. **C-F10: bundle gate's capped-artifact set and re-measure policy
    unspecified** (barrel uncapped; per-slice re-measure ambiguity). Applied:
    KC 10 — capped artifacts enumerated at S0 spec-craft (both payloads +
    `dist/index.mjs`; payloads-only needs recorded rationale); caps re-measured
    only at S6 (mid-series payload composition unchanged while the wrapper
    remains in the entries).
11. **C-F11/SQ-SF-1 (merged): S2's "S1 soft" dep unsupported by evidence and
    absent from the DAG line anyway** (no S2 outcome reads env/ua; dom/idle
    verified zero env/ua refs; winresize *reads* ua.msie but S2 deletes it).
    Applied: "S1 soft" dropped from the S2 row; one merge-order tolerance note
    added (if S1 lands first, undefined `msie` silently no-ops winresize's IE8
    guard until S2 deletes it — verified harmless, zero in-repo consumers).
12. **SQ-SF-3: S1 mutates the S0 api-pin contract but the verifier update was
    implicit.** Applied: S1 row + TESTS — api-pin/inventory update (+env/+ua,
    pin test green in the same commit).
13. **SQ-SF-4: final budget caps "at S6" named but never scheduled.** Applied:
    S6 outcome cell gains the bundle-budget final-cap amendment (~13/~14 kB gz).
14. **SQ-SF-5: loader canonical path inconsistent across three sections** (KC 7
    named a nonexistent `loader/loader.js`; barrel imported `bem:loader_type_js`;
    S3's own closure predicate presupposes a path change). Applied: option (a)
    — new canonical root module `common.blocks/loader/loader.js`; old mod path =
    one-release deprecated re-export (once-warn); barrel + pinned inventory
    switch to `bem:loader` in S3's own commit (KC 7, Interface barrel, deep-import
    inventory, S3 row, TESTS S3). Coordinator decision: chose (a) over
    rewrite-in-place because S3's closure predicate ("deprecated re-export
    present with once-warn") already presupposes the path change.
15. **SQ-SF-6: CONST-P1/P6 ratchets one-directional** (CONSTITUTION check is
    `comm -23` additions-only; a forgotten shrink is invisible until S6).
    Applied: KC 10 staging — ratchets are two-directional (gate fails when
    ALLOW−JQ ≠ ∅) and each slice's done-gate grep pins the exact expected
    allowlist/baseline contents after its Δ.

### Also applied (lens notes)

- TESTS S0 "New" ties D-6's deleted-path negative tests to the api-pin test by
  name, and adds payload-parity + deps-lint + plugin-transformer-form verifiers.
- S6's MIGRATION cell naming: `page__icon` hoist entry named like
  conditional-comment's (elem + files).
- Header note: plan-review-1 provenance block (date, legs, findings folded in,
  round-log pointer).

## Rejections

None. All 19 merged findings applied in full (4 must-fix + 15 should-fix;
4 double-counted pairs merged as above). Coordinator judgment calls, recorded:
loader canonical path = option (a) (see #14); "S1 soft" dropped rather than
promoted (sequencing leg's evidence is repo-verified; the bench-baseline
rationale would have been the only reason to keep it and none is stated);
S0's REQ estimate stays "11–12" with the new S0 items folded into existing
fence REQs where possible — S0 lands at-cap (12) and spec-craft consolidates;
if S0 spec-craft finds >12 REQs, the natural split-out is the
generation+lint tooling cluster, which must still land before S1/S2/S3 fan-out.

## Disposition state after this round

Execution-level completeness closed: every tooling artifact, migration line,
test carrier, doc surface, and ratchet maintenance item now has an owning slice
+ verifier; the DAG is single-sourced (slice-table deps = DAG-shape line); the
final-gate activation predicate is self-consistent with the allowlist
arithmetic and safe under slice revert. Ready for plan-review-2 (bc-4us, risk
and scope-creep).
