# Plan self-review round 3 — testability + coherence (FINAL)

- Date applied: 2026-09-29
- Step bead: bc-y0m (mol-idea-to-plan.plan-review-3), executed by bem-core/gastown.furiosa (session gc-8ma1l)
- Legs (created by a prior session of this run; both closed; reports saved verbatim):
  - testability — bc-k36z (workflow bc-exah), closed 2026-09-24T12:07Z → `legs/report-plan-review-3-testability.txt` (brief: `legs/plan-review-3-testability.md`)
  - coherence — bc-5i66 (workflow bc-yqsw), closed 2026-09-24T16:57Z → `legs/report-plan-review-3-coherence.txt` (brief: `legs/plan-review-3-coherence.md`)
- Subject: `.designs/arch-overhaul/design-doc.md` @ plan-review-2 state (669L) → edited in place to 775L. Header provenance note added.

## Totals

- Testability: 2 must-fix + 12 should-fix → **all applied**
- Coherence: 2 must-fix + 13 should-fix → **12 applied, 1 rejected** (SF-12, mis-anchored)
- Rejections: 1 (below). Cross-leg reconciliation: 1 (C-SF-10 folded into T-MF-2).

## Must-fix applied

1. **T-MF-1 skip/preview guard both-modes test.** KC 10 now carries the S0
   meta-test fixture (skip-state → exit 0 + preview; bind-state-clean → exit 0 +
   binding; bind-state-dirty → exit 1), the same first-landing-red proof extended
   to `check-bundle-size.mjs` and the doc fence; KC 13's final predicate cites the
   same fixture; TESTS item 2 S0 gained the staged-gate meta-test entry. The bind
   branch is now provable six slices before S6.
2. **T-MF-2 two-directional ratchet artifact + direction-2 test.**
   (a) KC 13's S0 amendment list now names the CONST-P1 sdd-check amended
   bidirectional (`comm` both directions) + CONST-P6 authored with its baseline
   file as comparison substrate — the ratchet claim lives in a named runnable
   artifact riding spec-craft + done-gate + CI from S0;
   (b) TESTS item 2 S0 gained the direction-2 red fixture (allowlist entry whose
   file no longer matches reality → exit 1);
   (c) KC 10 + Implementation Plan done-gate line reworded from "grep pins the
   exact expected contents" to the scripted allowlist/baseline pin (expected
   contents embedded in the slice spec's sdd-check).
3. **C-MF-1 Deps column vs DAG-shape line.** S4 Deps `S0, S2` → `S2`; S6 Deps
   `S1–S5` → `S1, S3, S5`; a sentence after the DAG line states both carry the
   same transitively-reduced direct edge set and create-beads wires direct edges.
   Single-sourcing restored.
4. **C-MF-2 `>400` floor replacement owner.** S2 outcome cell: count-floor policy
   (magic `>400` → per-file registration accounting + loose liveness floor) lands
   in S2's harness commit; mirrored in TESTS item 4 (S2 lands, S4/S5 extend);
   pointers added in KC 12, Data Model 6, and the spec-silent-drop risk row;
   ledger mechanics themselves are OQ-11 (decided at S0 spec-craft) — see T-SF-7.

## Should-fix applied (testability)

- **T-SF-1** S5 harness-exit closure grep at S5's own done-gate (zero jquery refs
  across `test/browser/entry.js`, shim map, `build/vite.test.config.js`) → TESTS
  item 4 S5 clause.
- **T-SF-2** zero-jquery predicate shape (import-form patterns only; include =
  sources + `test/` + `build/` configs; exclude = `*.md`, `.git`, `node_modules`,
  `dist`) → KC 13.
- **T-SF-3** notices-intact predicate vs checked-in S0 baseline (notice-bearing
  file list; `grep -L 'MPL'` over list = ∅ + LICENSE.txt exists) → KC 13 + TESTS
  item 2 S6.
- **T-SF-4** ua alias units (once-per-field warn spy + undefined, assignment
  once-warn no-op, live property-read forwarding) → TESTS item 2 S1.
- **T-SF-5** Vite half of exports narrowing pinned into the S0 spike (one
  narrowed deep-import fails through the dev-server test config, or Node-only
  scope recorded as the bound) → S0 cell + TESTS item 2 S0; D-6 reworded
  (negative tests written pre-narrowing, expectations flipped in the narrowing
  commit so the diff enumerates the break).
- **T-SF-6** bench ratio gate's first firing = S2's own done-gate; every slice
  S2 onward (S3 exempt) → KC 11 + S2 cell + TESTS item 2 S2.
- **T-SF-7** registration-ledger mechanics → new OQ-11 (home/floor/owner working
  positions, decide at S0 spec-craft; policy lands in S2's harness commit).
- **T-SF-8** doc-fence anchor syntax (`^#{2,3} `) + per-phase file-set (S0 =
  MIGRATION/CHANGELOG pairs; S6 extends to touched common.docs guides enumerated
  in S6's spec) → KC 13.
- **T-SF-9** parseHtml + CORS audits as named greps with results quoted in the
  owning spec (go/no-go record) → S2 cell + D-11 + S3 cell.
- **T-SF-10** page.examples relic disposition + done-gate grep (zero
  `conditional-comment` refs outside MIGRATION/CHANGELOG) → S6 cell + TESTS
  item 2 S6.
- **T-SF-11** spike decision-record home (dated section of the S0 spec, cited by
  S3) + smoke assertion joins TESTS S0 → S0 cell.
- **T-SF-12** CONST-P6 include-set pinned mechanically (extensions
  `{.js, .deps.js, .bemhtml.js, .bh.js, .css}` under platform dirs; exclude
  `*.bemjson.js` fixtures + `*.examples/`) → KC 13.

## Should-fix applied (coherence)

- **C-SF-1** specs/ convention defined (machine-checkable gate artifacts under
  `specs/`, bundle-budget.json first) → S0 cell.
- **C-SF-2** test/dist purge scoped (delete checked-in output + .gitignore;
  regenerate on demand) → S0 cell.
- **C-SF-3** S2 cell wording aligned to D-11: "scripts-inert parseHtml".
- **C-SF-4** "(Option B)" dropped from S4 cell (→ D-4); D-3's "Option-B engine"
  → "the D-4 engine".
- **C-SF-5** header-note OQ prefixes disambiguated ("PRD OQ3, not design OQ-3";
  "design OQ-6 reworded").
- **C-SF-6** `ua` raw-string diagnostic getter added to KC 1; env/ua surface
  marked authoritative field list.
- **C-SF-7** Docs Δ carriers: S5 += i-bem-dom.{en,ru}.md accuracy pass; S4 +=
  "Docs Δ expected nil" note.
- **C-SF-8** S1∥S3 barrel/pin coordination clause (disjoint export lines, merge
  order free, rebase tolerance recorded) → Bead-DAG paragraph.
- **C-SF-9** ua-alias lifecycle boundary (ships in 6.0.0; removal + env.browser
  legacy keys = first post-series release, owned by no slice) → KC 2.
- **C-SF-10** two-directional ratchet mechanism home — folded into T-MF-2's
  stronger fix: the home IS the S0-amended bidirectional CONST-P1 sdd-check
  (constitution artifact) riding spec-craft + done-gate + the CI `build` job
  from S0 (CI-wiring line updated). The leg's alternative mechanism ("sdd-check
  stays additions-only until S6; CI riders carry direction-2") was NOT adopted
  verbatim — the must-fix (T-MF-2) requires a single named owner, and a separate
  rider script would leave KC 10's claim split across two artifacts. Recorded as
  reconciled, not rejected.
- **C-SF-11** D-16 stale noun: "hand lists" → "generated platform entries"
  (switched mechanically / regenerated at S3).
- **C-SF-13** S0 cell: v5-base tag create-vs-verify ambiguity → "verify = 7a9e932
  on origin (create the annotated tag only if absent — Q1)".

## Rejected (1)

- **C-SF-12** "Problem Statement's verbatim PRD carry includes a retired
  pointerevent clause" — **mis-anchored**. The quoted clause ("live-range DOM
  collection management, pointerevent normalization, event delegation") does not
  exist in the design doc's Problem Statement (verified by grep: zero
  pointerevent matches in that section); it lives in the PRD draft
  (`.prd-reviews/arch-overhaul/prd-draft.md` L26/L56/L125/L153), which is the
  frozen requirements source this formula does not edit in plan rounds. The
  design doc already asserts the retirement in three places (prd-align-1 header
  note, KC 6, Retired section) — the body does not "both assert and refute".
  No edit needed; the PRD-side stale text is out of scope for plan self-review.

## State after round 3

- design-doc.md: 775L, header provenance note "plan-review-3 applied (2026-09-29)".
- Slice REQ estimates unchanged (S0 10–11, S1 8–12, S2 6–8, S3 4–6, S4 8–12,
  S5 8–10, S6 8–10) — all fixes are cell/section tightenings, no scope added;
  the meta-test and fixtures ride the existing S0 TESTS/pin entries.
- Open Questions now 1–11 (OQ-11 added). Identifiers KC 1–13, D-1–16, OQ-1–11
  all resolve; both legs' verifier/coherence matrices otherwise clean.
- create-beads can proceed: 7 convoys (S0–S6), direct-edge deps per the DAG
  line, each spec derivable from the slice-table cells + TESTS contract without
  invention (both legs' lens-4 verdicts).
