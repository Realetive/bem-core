PRD-alignment round 2, leg: **constraints-compliance**
(review_id=arch-overhaul, review_phase=prd-align-2)

Inputs (read all fully, absolute paths):

- PRD draft: `/Users/ryganin/gc/bem-core/bem-core/.prd-reviews/arch-overhaul/prd-draft.md`
  — includes "Clarifications from Human Review" Q1–Q10; those answers are BINDING
  amendments to the PRD (final, recorded 2026-09-18).
- Design doc under review (already carries prd-align-1 fixes — review the CURRENT
  text): `/Users/ryganin/gc/bem-core/bem-core/.designs/arch-overhaul/design-doc.md`
- Project constitution (binding, machine-checked):
  `/Users/ryganin/gc/bem-core/bem-core/CONSTITUTION.md`
- prd-align-1 round log (context for what was already fixed — do not re-litigate):
  `/Users/ryganin/gc/bem-core/bem-core/.plan-reviews/arch-overhaul/prd-align-round-1.md`

Repo evidence (read-only): `/Users/ryganin/gc/bem-core/bem-core` (branch v5 @ f2ab61e).

## Mission

Verify that **every technical and business constraint is respected by the design
doc as written** — nothing in the design violates, works around, or silently
amends a constraint; every constraint is either satisfied or explicitly
reconciled. Build a constraint-by-constraint compliance matrix.

## Constraint inventory to walk

1. **CONSTITUTION.md CONST-P1 (jquery ratchet)**: consumers only removed, never
   added; allowlist touches only in migration-slice PRs. Check the design's
   allowlist arithmetic (9 → −1 S1, −3 S2, −2 S4, −3 S5 = ∅) entry-for-entry
   against the CONSTITUTION.md sdd-check allowlist; check the staged final
   predicate (skip/preview until ∅, binding at S6) cannot let a NEW consumer
   slip in during S1–S5; check per-slice "edits the constitution allowlist in
   the same commit" discipline.
2. **CONST-P2 (ESM-first)**: no new UMD/CJS anywhere — including new tooling
   (`build/check-bundle-size.mjs`, specs JSONs, plugin changes) and the UMD
   format drop (D-14).
3. **CONST-P3 (platform override-only)**: the CONST-P6 ancestor-existence
   design, S1 ua collapse (common base + touch delta), S6 enforcement, the
   normative override glossary (Data Model 2) — do they over- or under-enforce
   relative to the constraint?
4. **CONST-P4 (public API shrinks only with documented migration)**: API-pinning
   test + MIGRATION ledger. NOTE: the design ADDS public surface (named-export
   barrel, `env`, `ua` alias, `./build/plugins/*`) — verify every addition is
   grounded in a binding Q-answer (Q3, Q5 exception) and nothing else is invented.
5. **CONST-P5 (hard fork @ v5-base, MPL-2.0 notices intact)**: no upstream
   re-sync anywhere; notices-preservation + notices-intact grep; LICENSE.txt.
6. **PRD C1** (constitution is law): the design introduces CONST-P6 and modifies
   CONST-P1's predicate — constitution changes require a PR per its header; does
   the design schedule/document that correctly (which slice, what process)?
7. **PRD C2 (strangler discipline)**: periphery-first, ~6–8 slices, ≤12 REQ each
   (check the REQ-est column), no big-bang, every slice leaves v5 buildable +
   tests green — including the S4×S5 interim and the pre-authorized S4+S5 merge
   fallback.
8. **PRD C3 (machine-checkable done-criteria)**: grep predicates, bundle-budget
   JSON, pin test, bench ratios — is every slice's done-gate mechanically
   checkable as claimed?
9. **PRD C4 (behavior parity by default, documented breaks)**: enumerate every
   documented break (parseHtml scripts-inert D-11, loader ES-only shift, ua
   removed fields, `bemDom.scope` explicit throw vs silent null, `$(node).bem()`
   deletion, loader `file:` fix removal) — is each grounded in a CONST-P4-style
   MIGRATION entry in the same slice? Is any UNdocumented behavior change
   implied by the design?
10. **PRD C5 (Node ≥20 / evergreen only, no IE/legacy polyfills)**: Node floor
    [20,24]; `page__conditional-comment` deleted as IE relic — any residual
    polyfill or legacy-browser accommodation anywhere in the design?
11. **PRD C6 (vision-only convoy)**: no implementation code lands from THIS
    planning run — check the design doc keeps all checks/scripts/specs as
    future-slice content, not present-tense work.
12. **Business constraints via Q-answers**: Q8 (chromium-only + desktop-parity
    verification matrix — declared in the design (D-15); also verify the PRD's
    own C-sections vs the design's matrix are consistent), Q9 (one human-cut
    6.0.0, version stays 5.0.0, `repository.url` fixed in S0), Q1 (anchor
    tag v5-base@7a9e932 created in S0 — consistent everywhere the anchor is
    cited; note the design doc's repo-evidence baseline is f2ab61e — is the
    f2ab61e-vs-7a9e932 relationship handled coherently?), Q6 (benchmarks kept
    and migrated inside the jquery-removal slice).

For each constraint: mark **RESPECTED / VIOLATED / TENSION** with the exact
design-doc section(s) (heading + short quote) as evidence. Cross-check numbers
(allowlist deltas, bundle caps ~13 kB gz desktop / ~14 touch, 38.5 kB → 12–13 kB)
for internal consistency across sections.

## Output requirements (mandatory)

- Classify every finding as **[must-fix]** (a constraint is violated, worked
  around, or silently amended) or **[should-fix]** (respected but weakly,
  implicitly, or inconsistently documented).
- Every finding must point to the exact design-doc section(s) (heading + quote)
  and the exact constraint item (CONST-Pn / Cn / Qn) it traces to.
- Suggest the concrete design-doc edit for each finding.

## Report structure (put the FULL report in bead notes)

```
# PRD-align-2 · constraints-compliance
## Summary
## Compliance matrix (constraint → RESPECTED/VIOLATED/TENSION → design-doc section)
## Findings ([must-fix] / [should-fix], each with section anchor + suggested fix)
## Confidence
```

## Rules

Analysis-only: do not edit the design doc, do not push code, do not touch
unrelated work. When done, mail the coordinator recorded in this bead's metadata
(`coordinator` key), then close this bead and drain.
