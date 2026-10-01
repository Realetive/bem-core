Plan self-review round 3 (FINAL), leg: **coherence** (review_id=arch-overhaul, review_phase=plan-review-3)

Inputs (read all fully, absolute paths):

• Design doc under review — THE SUBJECT (already carries prd-align-1/2/3 +
  plan-review-1/2 fixes; review the CURRENT text, 669L):
  /Users/ryganin/gc/bem-core/bem-core/.designs/arch-overhaul/design-doc.md
• Prior round logs (context for what was already fixed — do not re-litigate
  PRD alignment, plan-review-1 completeness/sequencing, or plan-review-2
  risk/scope findings; this round reviews COHERENCE):
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
round — after this, no more passes. Audit the doc for **COHERENCE**: after
six in-place editing rounds (prd-align 1–3, plan-review 1–2 plus the v1
synthesis), does the document still say one thing everywhere? Find the
contradictions, naming drift, dangling references, and missing glue that
survived the incremental edits, plus anything create-beads needs that no
cell provides.

Walk these lenses (minimum):

1. **Contradictions.** Cross-read every pair of sections that restate the
   same fact: slice-series table vs Key Components vs Interface vs Data
   Model vs Trade-offs vs Risks vs Implementation Plan vs Open Questions
   vs the header provenance notes. Hunt for: REQ estimates that disagree
   between sections; CONST-P1 allowlist arithmetic (9 → −1 −3 −2 −3 → ∅
   after S5) vs per-slice Δ cells vs KC 13; CONST-P6 baseline arithmetic
   (7 groups, 12 files → −3 −1 −3 → ∅) vs the inventory enumeration vs S1/
   S2/S6 cells; staging claims (what binds at S0 vs S6, keyed on what);
   deps edges (DAG shape line vs slice-table Deps column vs S4+S5 merge
   fallback vs overflow splits S0a/S0b, S6a/S6b); harness-exit carrier
   assignments across S2/S4/S5/S6; bench scenario set (B1–B5) wherever
   restated; loader canonical-path story (KC 7, D-16, Interface barrel,
   deep-import inventory, S3 cell); exports/target-path claims (Interface
   jsonc block vs S0 cell vs D-6); anything the header notes say was cut
   that later sections still describe as scheduled (or vice versa: cuts
   only in the header, not propagated to the body).
2. **Naming drift.** The doc was edited by many hands. Hunt for the same
   entity under different names: `bemDom` vs `BemDom` vs `BEMDOM` (and
   where each is intentional per D-7/docs remap); `i-bem-dom` vs `i-bem-js`
   (docs paths); slice ids (S0–S6 vs PRD-review S0–S7 numbering note);
   artifact paths (`build/platforms/{desktop,touch}.js` hand lists vs
   `build/platforms/*.gen.js` generated; `dist/index.mjs` vs `./dist/
   desktop` vs `dist/{desktop,touch}/bem-core.mjs`); module specifiers
   (`bem:loader` vs `loader_type_js` vs `loader/_type/loader_type_js.js`);
   `touch-emulated` Playwright project naming; `page__icon` /
   `page__conditional-comment` dispositions; allowlist vs baseline vs
   ratchet vs ledger terminology; `TESTS checklist` vs `Harness Δ` vs
   `Docs Δ` item references; KC/D/OQ/Q/US/G/C/CONST identifiers — every
   reference must resolve to a definition that exists in this doc or the
   PRD. Flag every identifier that dangles or collides.
3. **Missing glue.** For create-beads to build 7 slice convoys without
   invention, each slice needs: goal, REQ list derivable from the outcome
   cell, deps, allowlist Δ, gates, TESTS carriers, MIGRATION cells, docs
   carriers. Hunt for: any outcome clause with no owner slice; any gate
   named in one section but absent from its slice's done-gate enumeration;
   any cross-slice handoff where slice A produces something slice B
   consumes but neither cell says so (e.g. S2 facade → S4/S5 consumers,
   S0 generation → S2/S3 deletions, S1 barrel additions → S3 barrel
   switch, S5 registry → S6 deletions); Open Questions that a slice's
   spec-craft must answer but whose owning slice is unnamed or ambiguous;
   terms of art used before definition ("specs/ convention", "test/dist/
   purge", "registration accounting", "loose liveness floor", "doc-parity
   fence", "payload-parity assertion", "skip/preview mode", "exit-0 = OK
   contract").
4. **Final completeness pass.** Read the doc once end-to-end as the
   create-beads step would: could you write 7 convoy specs from this text
   alone, each ≤12 REQ, without inventing a single requirement, gate, or
   dependency? List anything you would have to invent. Also check the
   basics that six editing rounds can rot: the header provenance notes vs
   the body (any note claiming a fix the body doesn't carry, or body text
   contradicting a "cut"/"dropped"/"retired" note); markdown structure
   (table rows intact, no orphaned lines from cell edits); the truncated
   S6 row (the doc's own longest cell) — is anything promised there but
   never finished?

## Output requirements (mandatory)

• Classify every finding as **[must-fix]** (a contradiction that would
  produce two different bead DAGs / two different gates, or missing glue
  create-beads cannot proceed without) or **[should-fix]** (drift, dangling
  reference, or ambiguity that adds friction but has a safe default).
• Every finding must point to the exact design-doc section(s) (heading +
  quote, both sides for contradictions) and name the slice(s) involved.
• Suggest the concrete design-doc edit for each finding (which line/cell
  changes to what).
• If a lens yields no findings, say so explicitly with one sentence of what
  you checked.

## Report structure (put the FULL report in bead notes)

  # Plan-review-3 · coherence
  ## Summary
  ## Consistency matrix (section pair / identifier family → verdict)
  ## Findings ([must-fix] / [should-fix], each with section anchor + suggested fix)
  ## Confidence

## Rules

Analysis-only: do not edit the design doc, do not push code, do not execute
plan steps, do not touch unrelated work. The plan text is the subject being
reviewed. When done, mail the coordinator recorded in this bead's metadata
(coordinator key), then close this bead and drain.
