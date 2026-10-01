# Beads created — arch-overhaul (create-beads, bc-mj2)

Date: 2026-09-29 · Coordinator: bem-core/opencode-1 (session gc-5gf75, step mol-idea-to-plan/create-beads)

## Convoy

- **bc-vhfp** — `arch-overhaul` (owned, target `integration/arch-overhaul`) — initiative convoy, 0/7 closed.
  Note: `gc convoy create` first produced `gc-pelpj` in the city store (gc- prefix routes
  to `..` per `.beads/routes.jsonl`) where cross-store tracking broke; recreated in the rig
  store as bc-vhfp via `gc bd create --type convoy`, gc-pelpj closed with a pointer.

## Slice beads (DAG: S0 → {S1,S2,S3}; S2 → S4 → S5 → S6; {S1,S3} → S6)

| Slice | Bead | Title | Priority | Depends on |
|---|---|---|---|---|
| S0 | **bc-gdk9** | prerequisites: verification fence + public contracts | P1 | — |
| S1 | **bc-4izq** | env/ua: capability env module; touch ua off jquery | P2 | bc-gdk9 |
| S2 | **bc-ogif** | periphery: dom + idle + winresize + benchmarks off jquery | P2 | bc-gdk9 |
| S3 | **bc-ilml** | loader: import()-based loader; bundle loader deleted | P2 | bc-gdk9 |
| S4 | **bc-mrsq** | events core: native delegation engine; dom-type events | P2 | bc-ogif |
| S5 | **bc-szuu** | bem events + plugin: pure-registry BEM events; $.fn.bem off | P2 | bc-mrsq |
| S6 | **bc-vuju** | platform + wrapper removal: delete wrapper; enforce override-only; release prep | P2 | bc-4izq, bc-ilml, bc-szuu |

All wired with `gc bd dep add` (blocks) + `gc convoy add`-equivalent tracks edges from
bc-vhfp; verified with `gc bd blocked` (exact direct-edge set of the design doc's DAG line).
S1 and S3 are parallel branches off S0 — not a serial queue.

## Dispatch first

**bc-gdk9 (S0)** — the only unblocked slice.

## Planning artifacts (referenced by the convoy + every slice bead)

- `.prd-reviews/arch-overhaul/prd-draft.md` (incl. human clarifications Q1–Q10)
- `.prd-reviews/arch-overhaul/prd-review.md`
- `.designs/arch-overhaul/design-doc.md` — final plan (prd-align 1–3 + plan-review 1–3 applied)
- `.plan-reviews/arch-overhaul/` — round logs, leg reports, HANDOFF.md, this file

Each slice bead carries: what changes, affected files/subsystems, acceptance criteria
(done-gate + TESTS checklist + CI wiring + MIGRATION cell), REQ budget, overflow
pre-authorizations (S0a/S0b, S6a/S6b), and spec-craft decision points (OQs).
