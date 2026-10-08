Plan self-review round 2, leg: **scope-creep** (review_id=arch-overhaul, review_phase=plan-review-2)

Inputs (read all fully, absolute paths):

• Design doc under review — THE SUBJECT (already carries prd-align-1/2/3 +
  plan-review-1 fixes; review the CURRENT text):
  /Users/ryganin/gc/bem-core/bem-core/.designs/arch-overhaul/design-doc.md
• Prior round logs (context for what was already fixed — do not re-litigate
  PRD alignment or plan-review-1 findings; this round reviews SCOPE):
  /Users/ryganin/gc/bem-core/bem-core/.plan-reviews/arch-overhaul/prd-align-round-1.md
  /Users/ryganin/gc/bem-core/bem-core/.plan-reviews/arch-overhaul/prd-align-round-2.md
  /Users/ryganin/gc/bem-core/bem-core/.plan-reviews/arch-overhaul/prd-align-round-3.md
  /Users/ryganin/gc/bem-core/bem-core/.plan-reviews/arch-overhaul/review-round-1.md
• Requirements source (the scope baseline — Non-Goals are binding):
  /Users/ryganin/gc/bem-core/bem-core/.prd-reviews/arch-overhaul/prd-draft.md
• Project constitution (binding):
  /Users/ryganin/gc/bem-core/bem-core/CONSTITUTION.md

Repo evidence (read-only): /Users/ryganin/gc/bem-core/bem-core (branch v5 @ f2ab61e).

## Mission

The design doc's slice plan (S0–S6) and Implementation Plan are about to be
converted into a beads DAG (create-beads step). Audit the PLAN for
**SCOPE-CREEP**: work the plan schedules that exceeds the PRD's requirements
or Non-Goals, polish that no requirement demands, machinery whose
sophistication outruns its need, and items that should be deferred or cut
outright. The inverse of completeness: anything an engineer would build that
the PRD never asked for — each such item burns slice-REQ budget (hard cap
12/slice), calendar time, review bandwidth, and risk surface. Vision only —
this convoy produces no implementation code, so every REQ of gold-plating is
pure waste in the later convoys that consume this plan.

Walk these lenses (minimum):

1. **Gold-plating.** Per slice, list deliverables that no PRD requirement,
   constraint, or user story demands. Candidates to scrutinize (accept or
   acquit each): S0's `.deps.js` schema+resolution lint + entity-converter
   unification (beyond "documented manifest"?), generated platform entries
   vs keeping hand lists one more release, two-directional ratchets +
   done-gate grep pins, doc-parity fence scope, capped-artifact set including
   the barrel; S1's Proxy alias with once-per-field warns vs a plain object,
   UA-derived-getter justification + dedicated units per getter; S2's bench
   project B1–B6 six scenarios; S3's deprecated re-export bridge; S4's
   focus-delegation coverage NEW tests; S5's four named parity tests; S6's
   README bounded contributor section + docs API-accuracy pass + notices
   grep. For each: which requirement carries it? If none — cut candidate.
2. **Over-engineering.** Machinery built stronger than the single-consumer
   reality warrants: the CONST-P6 ancestor-existence machine check + shrinking
   baseline (vs one-time cleanup), the bundle-budget gate with ratchet
   semantics + two-directional failure + spec JSON + check script, the
   per-slice TESTS checklist contract with five items, the MIGRATION ledger
   discipline per slice (vs one big 6.0.0 migration note), the staged
   skip/preview gate machinery (vs binding everything at S6), the shim-map
   ratchet + registration accounting (vs keeping the >400 floor), compile-once
   class-token matchers, WeakMap migration, the plugin transformer-form hard
   error. Which of these would a 9-consumer hard-fork with one human consumer
   actually need? Flag anything where the simpler alternative meets the same
   requirement with less machinery.
3. **Premature optimization.** Performance work scheduled before evidence:
   bench thresholds ≤1.10× (who needs them? what regressions would users
   notice?), compile-once matchers, one shared closest-walk per emit,
   memoized `_buildModValRE`, lazy memoized getters in env, native listener
   count O(scopes×types) claims. Which are justified by a requirement (C2,
   parity, bundle size) vs speculative? Flag any perf mechanism with no
   requirement anchor.
4. **Defer candidates.** Items schedulable later without harming the series'
   guarantees: S0's repository.url fix riding the fence slice, Node floor
   pinning, entity-converter unification, the exports-map narrowing timing
   (S0 vs S6), touch-emulated project timing (S1 vs when touch behavior
   actually changes), doc passes, README section, notice greps. For each
   candidate: what does doing it EARLY buy (risk retired, later slices depend
   on it) vs what does it cost (S0 is at-cap 11–12 REQ)? Recommend keep-early
   or defer-late with the dependency that decides it. Also check the plan's
   own deferrals for ones that should NOT be deferred (D-2 inherit future
   phase, absolute budgets, tree-shaking, content redesign, keyboard convoy —
   are any of these secretly load-bearing for a slice?).

## Output requirements (mandatory)

• Classify every finding as **[must-cut]** (work that violates or exceeds
  binding scope — Non-Goals, REQ caps, or vision-only) / **[should-cut]**
  (defensible but not required — cheaper to cut now than carry) /
  **[defer]** (right work, wrong slice) / **[keep]** acquittals where the
  lens suspected creep but a requirement verifiably carries the item — acquit
  explicitly, do not silently pass.
• Every finding must point to the exact design-doc section(s) (heading +
  quote), name the slice(s) involved, and cite the PRD item (requirement /
  constraint / Non-Goal / US) that decides it.
• Suggest the concrete design-doc edit for each finding (which cell/section
  loses or gains what line; where a deferred item lands instead).
• Net effect: state the REQ-budget delta per slice after your cuts/deferrals
  (S0 is at-cap 11–12 — does your list relieve it?).
• If a lens yields no findings, say so explicitly with one sentence of what
  you checked.

## Report structure (put the FULL report in bead notes)

  # Plan-review-2 · scope-creep
  ## Summary
  ## Scope matrix (lens → verdict → findings + acquittals)
  ## Findings ([must-cut] / [should-cut] / [defer], each with section anchor + suggested edit)
  ## Acquittals ([keep] items with their requirement anchors)
  ## REQ-budget delta
  ## Confidence

## Rules

Analysis-only: do not edit the design doc, do not push code, do not execute
plan steps, do not touch unrelated work. The plan text is the subject being
reviewed. When done, mail the coordinator recorded in this bead's metadata
(coordinator key), then close this bead and drain.
