# Scope — S1 env/ua (convoy bc-cah4, slice bead bc-4izq)

Goal (design doc, slice table S1 row + Key Components 1–2 + "env / ua surface"):
replace the two disjoint platform `ua` JS forks (desktop browser-sniff, touch
jquery-bound feature grab) with one public capability module `env` plus a
one-release deprecated `ua` Proxy alias, move `ua__dom` to common with a touch
transformer delta, and verify it all through a touch-emulated Playwright project
with its own serving path.

## Slice mapping

| task slice | bead | REQ candidates |
|---|---|---|
| env public module (lazy/live getters, native orientchange) | bc-4izq | REQ-1, REQ-2 |
| ua deprecated Proxy alias (D-13) | bc-4izq | REQ-3 |
| platform fork collapse + ua__dom ancestor/delta (CONST-P6 −3, CONST-P1 −1) | bc-4izq | REQ-4, REQ-5 |
| touch-emulated Playwright project + serving path (D-15, plan-review-2 F5) | bc-4izq | REQ-6 |
| barrel + api-pin/inventory update (same commit) | bc-4izq | REQ-7 |
| platform entries regenerated + payload-parity amendment (OQ-6) | bc-4izq | REQ-8 |
| constitution ALLOW/baseline/budget ratchet updates | bc-4izq | REQ-9 |
| env/ua units + emulation parity (G2 tests leg) | bc-4izq | REQ-10 |
| docs Δ (env en+ru, ua alias note, MIGRATION ### S1 bilingual) | bc-4izq | REQ-11 |

## Constitution clauses applying

- CONST-P1 (jquery ratchet — allowlist shrinks by `touch.blocks/ua/ua.deps.js`)
- CONST-P2 (ESM-first — new common.blocks modules ESM only)
- CONST-P3 (platform override-only — touch ua__dom becomes transformer delta)
- CONST-P4 (public API changes carry documented MIGRATION — removed ua fields,
  orientchange transport change, ua block statics)
- CONST-P6 (platform baseline two-directional ratchet — 3 entries removed)
- CONST-D1 (approved spec precedes implementation — spec-gate-guard; only
  read-only + spec-file work while specs/bc-cah4.md is draft)
- CONST-D2 (spec lives at `specs/bc-cah4.md`, committed with the code it describes)
- CONST-D3 (evidence anchored: `file:line-range` + verbatim quote, verify-citations.sh)
- CONST-D4 (no secrets in specs/artifacts)
- CONST-U1 (durable decisions — land in bead/spec, not chat), CONST-U3 (spec-first
  on divergence); CONST-U2 (no force-push) governs the slice branch.
- No other CONST-D/U clause constrains beyond the project layer.

## Constraints / non-goals carried over

- No S2 edge: `winresize`'s `ua.msie` read silently no-ops via the alias
  (undefined) until S2 deletes it — verified harmless by the design notes.
- RTL / passive listeners / input-modality: Non-Goals (Q5) until a consumer exists.
- Alias contract is property-read access; destructuring/spread snapshots
  unsupported by design (plan-review-2 F6).
- `env.browser` keeps `opera`/`chrome` one release (dies with the alias, OQ-8);
  alias removal (first post-series release) is owned by no slice of S0–S6.
- D-15: Chromium-only verification matrix; the touch project is emulation, not
  a separate engine.
- Barrel/pin edits are line-disjoint from S3's loader switch — merge order free
  (S1∥S3 coordination note).
- Field-disposition completeness (OQ-10): every field `ua__dom` reads gets an
  explicit disposition in this spec (see REQ-1/REQ-3 tables).

## Run provenance (recovery, 2026-10-02)

The planning artifacts (`.designs/arch-overhaul/`, `.plan-reviews/arch-overhaul/`,
`.prd-reviews/arch-overhaul/`) and this `.spec-reviews/bc-cah4/` directory were
recovered from branch `polecat/bc-4izq` (commits cdd5f75, fc91f6d) — the prior
spec-craft pass ran inside the S1 slice worktree, which has since been removed;
HEAD of the main checkout (ac343da, detached) never carried them. Prior-pass
outputs available for reuse by later steps: `.spec-reviews/bc-cah4/evidence.md`
(harvest), `specs/bc-cah4.md` on branch `polecat/bc-4izq` (11 REQs / 10 ACCs,
verify-citations 34/34 green, three review legs folded and passing per commit
fc91f6d), `.spec-reviews/bc-cah4/spec-review.md`, `spec-review-beads.tsv`
(legs bc-rbs6 factual / bc-q2f6 testability / bc-a5wh constitution — all pass).
Outstanding from the prior pass: the human approval gate (bead bc-2lff, assignee
human) and the approval stamp. Plan artifacts re-read and clause ids re-validated
against all three constitution layers this run; scope content unchanged.
