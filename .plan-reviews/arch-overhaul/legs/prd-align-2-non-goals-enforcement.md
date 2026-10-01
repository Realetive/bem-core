PRD-alignment round 2, leg: **non-goals-enforcement**
(review_id=arch-overhaul, review_phase=prd-align-2)

Inputs (read all fully, absolute paths):

- PRD draft (Non-Goals section is your law): 
  `/Users/ryganin/gc/bem-core/bem-core/.prd-reviews/arch-overhaul/prd-draft.md`
  — includes "Clarifications from Human Review" Q1–Q10; those answers are BINDING
  amendments (final, recorded 2026-09-18). NOTE: Q-answers can authorize scoped
  exceptions (Q5: `env` IS a new public module) — an exception grounded in a
  Q-answer is NOT a violation; an ungrounded one is.
- Design doc under review (already carries prd-align-1 fixes — review the CURRENT
  text): `/Users/ryganin/gc/bem-core/bem-core/.designs/arch-overhaul/design-doc.md`
- prd-align-1 round log (context; do not re-litigate):
  `/Users/ryganin/gc/bem-core/bem-core/.plan-reviews/arch-overhaul/prd-align-round-1.md`

Repo evidence (read-only): `/Users/ryganin/gc/bem-core/bem-core` (branch v5 @ f2ab61e).

## Mission

Enforce the PRD **Non-Goals** section against the design doc: find scope that
violates a non-goal, expands beyond it without authorization, or rides its edge —
and propose for each finding a **CUT** (remove from the design), a **GUARDRAIL**
(keep but add an explicit boundary/negative test), or **KEEP-JUSTIFIED** (grounded
in a Q-answer or constraint; document why). Sweep the whole doc, not just obvious
sections.

## Non-Goals inventory to walk (PRD "Non-Goals", verbatim scope)

1. **No redesign of the BEMJSON/BEMHTML templating story (bem-xjst, BH) beyond
   what the loader/ESM work forces.** Check: template-file moves in the slice
   table (`page__conditional-comment` deletion, `page__icon` hoist to common),
   the CONST-P6 scope including bemhtml/bh templates, `.deps.js` schema +
   resolution lint, entity-converter unification (`bemEntityToModuleName`
   removal) — is each within "loader/ESM forces it" or platform-boundary
   enforcement, or is it templating-story redesign in disguise?
2. **No new features, blocks, or public API additions.** Check every NEW public
   thing: named-export barrel (export names, `BemDomCollection`, `channels`,
   `Emitter`/`Event` re-exports), `env` module + its getters, `ua` Proxy alias,
   `orientchange` CustomEvent surface, `./build/plugins/*` exposure, bench
   project, CONST-P6 check, `loader()` promise return (new return semantics vs
   old callback-only). Which are Q-authorized (Q3, Q5) and which are invented?
   Also: does anything else grow public surface implicitly (e.g. plugin
   validation errors, `bem.entities` as "internal, pinned")?
3. **No TypeScript rewrite (types may be explored in a later convoy).** Any
   types/d.ts/TS scope hiding in the design?
4. **No bundler/CI changes beyond what architectural slices require.** Check the
   CI-wiring plan item by item (bundle gate in build job, api-pin in test suite,
   Node matrix change, touch-emulated project, bench project, UMD drop): is each
   required by a slice, or convenience? Is the `vite-plugin-bem-levels`
   public-export path (`./build/plugins/*`) a bundler change beyond need?
5. **No upstream re-sync — hard fork per CONST-P5; advisories reviewed manually.**
   Any implied upstream work?
6. **No changes to `i18n`, `uri`, `strings`, `functions`, `objects`, `next-tick`,
   `tick`, `identify`, `keyboard`, `cookie`, `idle` internals beyond removing
   their jquery dependency (idle) and incidental ESM cleanups.** Sweep the doc
   for every mention of these blocks; check Open Question 6
   (`keyboard__codes` test provision — "until a spec exists or its slice decides
   fate" reads like scheduling keyboard-internal work: authorized or cut?);
   check the spec-harness shim-map ratchet and `>400`-floor replacement don't
   touch these blocks' internals; check `_buildModValRE` memoization,
   `domNodesToParents` deletion, WeakMap migration are all inside i-bem-dom
   (in-scope) and not creeping into the frozen block list.
7. **No implementation code in this convoy — design + slice plan + bead DAG
   only.** Does the doc stay vision-only, or does any section read as
   present-tense implementation work for THIS run?

Also sweep for **general scope creep** the Non-Goals imply in spirit (the PRD's
"Problem Statement" + "Rough Approach" bound the mission): e.g. docs rewrite
scope in S6 (v4-era `common.docs/i-bem-js/` guide rewrite — bounded or open-ended?),
"zero window.* writes as the stated end state" (a new invariant — authorized?),
WeakRef/FinalizationRegistry rejections (fine as rationale — but confirm nothing
introduces them), emulation-parity testing scope, bench threshold
evidence-gathering ("absolute budgets deferred until dedicated-runner evidence" —
does that schedule unfunded future work?).

## Output requirements (mandatory)

- Classify every finding as **[must-cut]** (clear violation — remove from the
  design), **[guardrail]** (edge/expansion — keep but add explicit boundary,
  negative test, or authorization note), or **[should-cut]** (weak case for
  staying). Findings that are fine must appear in the matrix as KEEP-JUSTIFIED
  with their authorization (Qn/Cn/CONST-Pn).
- Every finding must point to the exact design-doc section(s) (heading + quote)
  and the exact Non-Goal item it traces to.
- Propose the concrete design-doc edit (the cut or the guardrail sentence) for
  each finding.

## Report structure (put the FULL report in bead notes)

```
# PRD-align-2 · non-goals-enforcement
## Summary
## Non-goals matrix (non-goal → verdict per touched design element → disposition)
## Findings ([must-cut] / [guardrail] / [should-cut], each with section anchor + proposed edit)
## Confidence
```

## Rules

Analysis-only: do not edit the design doc, do not push code, do not touch
unrelated work. When done, mail the coordinator recorded in this bead's metadata
(`coordinator` key), then close this bead and drain.
