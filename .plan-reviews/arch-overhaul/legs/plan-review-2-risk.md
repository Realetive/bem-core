Plan self-review round 2, leg: **risk** (review_id=arch-overhaul, review_phase=plan-review-2)

Inputs (read all fully, absolute paths):

• Design doc under review — THE SUBJECT (already carries prd-align-1/2/3 +
  plan-review-1 fixes; review the CURRENT text):
  /Users/ryganin/gc/bem-core/bem-core/.designs/arch-overhaul/design-doc.md
• Prior round logs (context for what was already fixed — do not re-litigate
  PRD alignment or plan-review-1 findings; this round reviews RISK):
  /Users/ryganin/gc/bem-core/bem-core/.plan-reviews/arch-overhaul/prd-align-round-1.md
  /Users/ryganin/gc/bem-core/bem-core/.plan-reviews/arch-overhaul/prd-align-round-2.md
  /Users/ryganin/gc/bem-core/bem-core/.plan-reviews/arch-overhaul/prd-align-round-3.md
  /Users/ryganin/gc/bem-core/bem-core/.plan-reviews/arch-overhaul/review-round-1.md
• Requirements source (context only):
  /Users/ryganin/gc/bem-core/bem-core/.prd-reviews/arch-overhaul/prd-draft.md
• Project constitution (binding):
  /Users/ryganin/gc/bem-core/bem-core/CONSTITUTION.md

Repo evidence (read-only): /Users/ryganin/gc/bem-core/bem-core (branch v5 @ f2ab61e).

## Mission

The design doc's slice plan (S0–S6) and Implementation Plan are about to be
converted into a beads DAG (create-beads step). Audit the PLAN for **RISK**:
things that can go wrong during execution and are not adequately mitigated,
owned, or pre-decided. The Risks and Mitigations table exists — your job is to
find what it misses, what it understates, and where a mitigation itself is
risky or unscheduled.

Walk these lenses (minimum):

1. **Technical risk.** For each slice's core technical bet (S0 generated
   platform entries + exports narrowing; S1 env/orientchange native CustomEvent
   + ua Proxy alias; S2 parseHtml scripts-inert decision; S3 import()-based
   loader semantics; S4 native delegation engine composedPath walk + interop
   with jQuery-bem-events; S5 pure-registry BEM events with four parity
   caveats; S6 wholesale wrapper deletion + staged-gate binding), ask: what is
   the failure mode if the bet is wrong or harder than estimated? Is the
   failure detected by a named verifier, or does it silently corrupt? Which
   risks have no mitigation, a mitigation with no owner, or a mitigation that
   only exists as prose (no slice cell carries it)?
2. **Dependency risk.** External and cross-slice dependencies: Node >=20
   import() semantics, Vite plugin behavior (barrel generation, scan registry),
   Playwright projects (touch-emulated, bench), jquery@4 peer behavior mid-series,
   the single-consumer assumption (9 frozen consumers + "unknown external
   consumers" rated Low), the v5-base parity anchor (f2ab61e as proxy for
   7a9e932). For each: what breaks if the assumption is false? Which
   dependencies have no fallback or spike scheduled? Flag any dependency the
   plan discovers LATE (mid-series) that a cheap S0/S1 spike would retire now.
3. **Rollback risk.** Slices merge to v5 unreleased (D-12) with one 6.0.0 at
   the end — so "rollback" = reverting slice commits mid-series. Walk each
   slice's revert story: do ratchet/baseline/ledger edits ride the slice commit?
   Do staged gates (skip/preview short-circuit keyed on wrapper existence +
   package.json cleanliness + allowlist) stay consistent when slice N is
   reverted but slice N+1 already landed? What about reverting S0 itself
   (generated entries replace deleted hand lists — is the hand-list content
   recoverable)? Partial-series states (some slices merged, branch v5 diverged)
   are the real exposure — name any slice whose revert wedges CI or corrupts a
   ledger.
4. **Unknown-unknowns.** Where is the plan most likely surprised? Look for:
   work sized optimistically (S3 4–6 REQ loader rewrite with semantic-shift
   documentation + barrel switch + audit; S6 8–10 REQ carrying deletion +
   enforcement + release prep + README/docs passes), interleaving hazards
   (S1/S3 parallel branches both touching barrel/exports/inventory), spec
   corpus gaps (idle has no spec corpus; browser spec >400 floor mechanics),
   and any place the plan says "ratify at spec-craft" / "working position" —
   each is a deferred decision that could force rework; rank them by blast
   radius. Recommend a spike (timeboxed investigation bead) where cheap
   early evidence retires a fat risk.

## Output requirements (mandatory)

• Classify every finding as **[must-fix]** (risk unmitigated + likely +
  high-impact, or mitigation missing/unscheduled) or **[should-fix]**
  (mitigation weak, ambiguous, or late).
• Every finding must point to the exact design-doc section(s) (heading +
  quote) and name the slice(s) involved.
• Suggest the concrete design-doc edit for each finding (which cell/section
  gains what line — a Risks row, a spike REQ in a slice cell, a fallback
  clause, a re-ordering).
• If a lens yields no findings, say so explicitly with one sentence of what
  you checked.

## Report structure (put the FULL report in bead notes)

  # Plan-review-2 · risk
  ## Summary
  ## Risk matrix (risk → likelihood → impact → existing mitigation verdict → findings)
  ## Findings ([must-fix] / [should-fix], each with section anchor + suggested fix)
  ## Confidence

## Rules

Analysis-only: do not edit the design doc, do not push code, do not execute
plan steps, do not touch unrelated work. The plan text is the subject being
reviewed. When done, mail the coordinator recorded in this bead's metadata
(coordinator key), then close this bead and drain.
