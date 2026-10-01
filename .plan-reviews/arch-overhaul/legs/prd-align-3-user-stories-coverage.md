PRD-alignment round 3, leg: **user-stories-coverage**
(review_id=arch-overhaul, review_phase=prd-align-3)

Inputs (read all fully, absolute paths):

- PRD draft: `/Users/ryganin/gc/bem-core/bem-core/.prd-reviews/arch-overhaul/prd-draft.md`
  — "User Stories / Scenarios" US1–US6 is the walk inventory; "Clarifications from
  Human Review" Q1–Q10 are BINDING amendments (final, recorded 2026-09-18).
- Design doc under review (already carries prd-align-1 + prd-align-2 fixes — review
  the CURRENT text): `/Users/ryganin/gc/bem-core/bem-core/.designs/arch-overhaul/design-doc.md`
- Prior alignment logs (context for what was already fixed — do not re-litigate):
  `/Users/ryganin/gc/bem-core/bem-core/.plan-reviews/arch-overhaul/prd-align-round-1.md`
  `/Users/ryganin/gc/bem-core/bem-core/.plan-reviews/arch-overhaul/prd-align-round-2.md`
- Project constitution (binding): `/Users/ryganin/gc/bem-core/bem-core/CONSTITUTION.md`

Repo evidence (read-only): `/Users/ryganin/gc/bem-core/bem-core` (branch v5 @ f2ab61e).

## Mission

Walk **each user story US1–US6 end to end** and verify the design doc concretely
covers it. For every story, decompose it into its individual clauses/claims (e.g.
US1 = import-name + no-jQuery-in-bundle + tree-shaking + behavior parity), then for
each clause trace exactly where the design supports it: the slice(s) that deliver
it, the Key Components / Interface / Implementation Plan text that specifies it,
and the test/check that verifies it. A clause with no design carrier, a vague
carrier, or a carrier that contradicts the story is a finding.

## Story-by-story walk checklist (minimum)

1. **US1 — Library consumer on modern stack.** `import { BemDom } from 'bem-core'`:
   does the barrel's actual export name match the story's (design names it
   `bemDom` — is the story's casing handled as a documentation/migration item or a
   mismatch)? "Bundle contains no jQuery": which gate enforces it and WHEN does it
   become binding (staged S6 activation — is the interim state honest for this
   user)? "Tree-shaking works": design position 5 scopes this to the plugin story
   and US1 is re-scoped to "no jQuery in bundle" — is that re-scoping visible and
   coherent, or does the design quietly drop a PRD promise? "Nothing regresses vs
   v5-base": parity machinery (C4, MIGRATION ledger, pin test, emulation-parity,
   bench ratios) — does the story's end-to-end verification exist per slice?
2. **US2 — Frozen-consumer maintainer.** Pick all 9 allowlisted consumers: for each,
   which slice migrates it and to what (native DOM API / env module / registry)?
   Does the allowlist arithmetic (9 → −1 S1, −3 S2, −2 S4, −3 S5 = ∅) account for
   every consumer exactly once? "Tests (Playwright) stay green": is the browser-test
   story per consumer identified (existing specs cited, harness ratchet)?
3. **US3 — Platform contributor.** "CI rejects any touch.blocks file without a
   common ancestor": CONST-P6 check — is rejection machine-checked at build/CI (not
   just a shrinking baseline ledger)? "Docs tell me where shared behaviour goes":
   where does the design schedule/document this (S6 docs pass is API-accuracy
   bounded — does contributor guidance land anywhere, or is it cut without
   replacement)? Override authoring ergonomics (transformer form) — discoverable
   error message specified?
4. **US4 — Slicing engineer.** Each slice: ≤12 REQ (check REQ-est column), explicit
   deps (DAG shape), done-criteria incl. MIGRATION cells, mechanically verifiable
   (grep predicates, bundle gate, constitution sdd-checks). Would an engineer
   picking up slice N from the bead DAG (create-beads step, S0–S6 convoys) have
   everything the story promises? Flag any slice whose outcome cell underspecifies
   its done-gate.
5. **US5 — Architect/reviewer.** "Diff behavior before/after against v5-base using
   documented per-slice verification, including the 9 frozen consumers' scenarios":
   where is the per-slice verification recipe documented in the design? v5-base
   anchor 7a9e932 vs working baseline f2ab61e reconciliation — is it coherent for
   a reviewer reproducing the diff? Bench ratio-to-v5-base as parity evidence?
6. **US6 — Legacy loader user.** `loader_type_js.get(url)` keeps working via the new
   implementation OR follows a documented one-line migration: does the design
   satisfy the "keeps working" arm (deprecated one-release re-export) and the
   migration arm (`import(url)` line, bilingual note, ES-only semantic shift
   documented)? Deep-import path still public?

Also cross-check the stories against Non-Goals (a story clause that is actually a
Non-Goal must be explicitly reconciled, like US1 tree-shaking was — find any
others) and against the Q1–Q10 answers (a story clause amended by a Q answer must
reflect the amended form).

## Output requirements (mandatory)

- Classify every finding as **[must-fix]** (a story clause is uncovered,
  contradicted, or silently cut) or **[should-fix]** (covered but weakly,
  implicitly, or inconsistently).
- Every finding must point to the exact design-doc section(s) (heading + quote)
  and the exact story clause it traces to.
- Suggest the concrete design-doc edit for each finding.

## Report structure (put the FULL report in bead notes)

```
# PRD-align-3 · user-stories-coverage
## Summary
## Coverage matrix (story clause → design-doc section → COVERED/PARTIAL/MISSING)
## Findings ([must-fix] / [should-fix], each with section anchor + suggested fix)
## Confidence
```

## Rules

Analysis-only: do not edit the design doc, do not push code, do not touch
unrelated work. When done, mail the coordinator recorded in this bead's metadata
(`coordinator` key), then close this bead and drain.
