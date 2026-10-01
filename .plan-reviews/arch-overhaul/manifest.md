# Plan-Review Manifest — arch-overhaul

- review_id: arch-overhaul
- repo_root: /Users/ryganin/gc/bem-core/bem-core
- coordinator: bem-core/opencode-1
- review_target: bem-core/gastown.polecat
- problem: Global architecture overhaul of bem-core fork (Realetive/bem-core, v5, tag v5-base): ESM-first core, removal of the jquery wrapper (9 frozen consumers, ratchet in project CONSTITUTION.md), modern module boundaries, platform layers override-only
- context: Hard fork (CONST-P5). Project constitution CONSTITUTION.md defines machine-checked invariants: CONST-P1 jquery-consumer ratchet, P2 ESM-first, P3 platform override-only, P4 public-API shrink with documented migration. Expected output: design doc with target architecture + strangler slice plan (periphery→core, ~6-8 slices, each ≤12 REQ): ua→env, jquery wrapper removal, loader→ESM dynamic import, inherit decision, i-bem-dom core rework, platform layers cleanup. Slice convoys become beads DAG. Vision only — no implementation code in this convoy.

## Artifacts
- PRD draft: .prd-reviews/arch-overhaul/prd-draft.md
- PRD review synthesis: .prd-reviews/arch-overhaul/prd-review.md (pending)
- Design doc: .designs/arch-overhaul/design-doc.md (pending)
- Round logs: .plan-reviews/arch-overhaul/*.md (pending)
- State: .plan-reviews/arch-overhaul/state.env
