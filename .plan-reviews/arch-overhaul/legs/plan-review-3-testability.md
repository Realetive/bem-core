Plan self-review round 3 (FINAL), leg: **testability** (review_id=arch-overhaul, review_phase=plan-review-3)

Inputs (read all fully, absolute paths):

• Design doc under review — THE SUBJECT (already carries prd-align-1/2/3 +
  plan-review-1/2 fixes; review the CURRENT text, 669L):
  /Users/ryganin/gc/bem-core/bem-core/.designs/arch-overhaul/design-doc.md
• Prior round logs (context for what was already fixed — do not re-litigate
  PRD alignment, plan-review-1 completeness/sequencing, or plan-review-2
  risk/scope findings; this round reviews TESTABILITY):
  /Users/ryganin/gc/bem-core/bem-core/.plan-reviews/arch-overhaul/prd-align-round-1.md
  /Users/ryganin/gc/bem-core/bem-core/.plan-reviews/arch-overhaul/prd-align-round-2.md
  /Users/ryganin/gc/bem-core/bem-core/.plan-reviews/arch-overhaul/prd-align-round-3.md
  /Users/ryganin/gc/bem-core/bem-core/.plan-reviews/arch-overhaul/review-round-1.md
  /Users/ryganin/gc/bem-core/bem-core/.plan-reviews/arch-overhaul/review-round-2.md
• Requirements source (context only):
  /Users/ryganin/gc/bem-core/bem-core/.prd-reviews/arch-overhaul/prd-draft.md
• Project constitution (binding):
  /Users/ryganin/gc/bem-core/bem-core/CONSTITUTION.md

Repo evidence (read-only): /Users/ryganin/gc/bem-core/bem-core (branch v5 @ f2ab61e).

## Mission

The design doc's slice plan (S0–S6) and Implementation Plan are about to be
converted into a beads DAG (create-beads step). This is the FINAL review
round. Audit the PLAN for **TESTABILITY**: whether the plan's claims can be
mechanically verified when the slices execute. The doc promises many
verifiers (pin test, bundle gate, grep predicates, ratchets, staged gates,
bench ratios, parity tests, payload-parity assertion, CI freshness diff).
Your job is to find where verification is missing, vague, unowned,
un-runnable, or unable to fail.

Walk these lenses (minimum):

1. **Acceptance criteria.** For each slice's "Shippable outcome" cell, ask:
   is every clause of the outcome verifiable at merge time, and by WHAT
   (a named test, a grep predicate, a ledger state, a CI job, human eyes)?
   Hunt for outcomes stated as prose that no done-gate item or TESTS item
   carries ("docs ride the rewrite", "internal-consumer audit confirms…",
   "decide at spec-craft", "checked", "1-REQ-equivalent bound", "loose
   liveness floor", "registration accounting"). Which outcome clauses would
   pass green even if the underlying work was done wrong?
2. **Missing tests.** Walk the TESTS checklist contract (items 1–5) against
   every load-bearing design claim: the four S5 parity tests, S4
   focus-delegation + mixed-flow interop, S1 emulation parity + per-getter
   units, S0 api-pin incl. deleted-path negative tests + payload-parity
   assertion + plugin transformer-form tests + generation freshness,
   S2 parseHtml policy test + bench B1–B5 + v5-base reference capture,
   S3 promise/error/cross-origin rejections + closure predicates, S6 final
   gates (notices-intact, zero-jquery repo-wide, CONST-P6 ∅, no-jquery
   artifact). Which design decisions have NO test named anywhere (e.g.
   two-directional ratchet failure direction, doc-parity fence, exports
   narrowing behavior in Vite, orientchange firing guard, alias once-warn,
   `inherit.self` spec:1813 pin, keyboard__codes parity)? Which existing
   spec corpora are cited — are the citations accurate @ f2ab61e?
3. **Vague verification.** Grep the doc for verification-words ("audit",
   "confirm", "check", "green", "pinned", "fenced", "verified",
   "assertion", "grep") and grade each: mechanical (a script/test with a
   defined failure), procedural-but-unnamed (someone must do something,
   no artifact), or decorative (no failure mode possible). Any predicate
   whose greps/set-comparison semantics are undefined (what set, what
   paths, what include/exclude, where does the baseline live, who runs
   it, in CI or done-gate only)? Any threshold without a measurement
   procedure (≤1.10× against WHAT baseline artifacts, captured when, by
   which script)?
4. **Phase gates.** The staged machinery: skip/preview guard form (KC 10,
   KC 13), S6 activation keyed on wrapper existence + package.json
   cleanliness, two-directional allowlist/baseline ratchets, per-slice
   done-gate grep pins, S0a/S0b + S6a/S6b pre-authorized splits, the
   done-gate command line, CI wiring (S0 bundle gate + api-pin + CONST-P6
   check + doc fence on `build` job). Ask: can each gate be exercised in
   BOTH modes before it binds (skip/preview mode tested?), can a gate be
   silently skipped (preview exit-0 forever = gate never binds), does
   every gate have a first-landing test proving it can go red (a gate
   that has never failed is unverified)? Is the S0→S6 binding keyed off
   git-tracked state only, or does anything key off untracked state?

## Output requirements (mandatory)

• Classify every finding as **[must-fix]** (verification missing for a
  load-bearing claim, or a gate that cannot fail / can be silently
  skipped) or **[should-fix]** (verification weak, vague, or late).
• Every finding must point to the exact design-doc section(s) (heading +
  quote) and name the slice(s) involved.
• Suggest the concrete design-doc edit for each finding (which cell/
  section gains what line — a TESTS item, a named script, a predicate
  definition, a CI line).
• If a lens yields no findings, say so explicitly with one sentence of what
  you checked.

## Report structure (put the FULL report in bead notes)

  # Plan-review-3 · testability
  ## Summary
  ## Verifier inventory (claim → named verifier → verdict: mechanical / procedural / decorative / missing)
  ## Findings ([must-fix] / [should-fix], each with section anchor + suggested fix)
  ## Confidence

## Rules

Analysis-only: do not edit the design doc, do not push code, do not execute
plan steps, do not touch unrelated work. The plan text is the subject being
reviewed. When done, mail the coordinator recorded in this bead's metadata
(coordinator key), then close this bead and drain.
