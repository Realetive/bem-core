You are one leg of a parallel design exploration for the bem-core v5 architecture overhaul.

Repo root: /Users/ryganin/gc/bem-core/bem-core (branch v5, already cloned).
PRD (authoritative, includes human clarifications): /Users/ryganin/gc/bem-core/bem-core/.prd-reviews/arch-overhaul/prd-draft.md
PRD review synthesis (structural fixes, slice arithmetic, parity traps): /Users/ryganin/gc/bem-core/bem-core/.prd-reviews/arch-overhaul/prd-review.md
Project constitution (binding constraints): /Users/ryganin/gc/bem-core/bem-core/CONSTITUTION.md

Standard instructions:
- Read the PRD draft (especially "Clarifications from Human Review" — decisions are final),
  the PRD review synthesis, and CONSTITUTION.md first.
- Explore the repo as needed to ground your design (test/, build/, vite-plugin,
  .github workflows, package.json scripts).
- Produce your FULL report in the bead notes of this bead using the report structure below.
- Mail the coordinator bem-core/opencode-1 when complete:
  gc mail send bem-core/opencode-1 -s "Design leg <leg> complete" -m "<bead-id> closed".
- Do NOT push code, do NOT modify repo files, do NOT touch unrelated work. Design only.
- Be specific: cite PRD/review sections and repo paths.

Report structure (markdown):
# <Leg Title>
## Summary
## Key Considerations
## Options Explored
## Recommendation
## Constraints Identified
## Open Questions
## Integration Points

Leg focus: integration — code placement, rollout path, compatibility, testing strategy.

The review proposes a revised 7-slice arithmetic (S0 prerequisites · S1 env/ua ·
S2 periphery dom+idle+winresize+benchmarks · S3 loader · S4 events core native
delegation + dom-type · S5 bem-type events + $.fn.bem split · S6 inherit (a)-gate ·
S7 platform check + wrapper removal + allowlist=∅). Human answers fixed several
parameters (v5-base tag at 7a9e932 in S0; delete wrapper, no shim; delete
loader_type_bundle; benchmarks migrate in the jquery-removal slice; one 6.0.0
release at the end; chromium-only + desktop parity in C4 with a minimal
touch-emulated Playwright project added in slice-1 acceptance).

Design questions for you:
- Re-derive the slice DAG with the corrected facts: does pointerevents-before-events
  ordering still matter (pointer slice was phantom), does events-core (S4) really
  need dom-type contract first, where does winresize disposal fold, is S6
  (inherit keep-frozen gate) a real slice or a design-doc paragraph + CONST-P2
  note? Produce the final slice list with: goal, REQ count estimate (≤12), deps on
  earlier slices, allowlist delta, MIGRATION.md delta, done-criteria sketch.
- Slice-0 (prerequisites) contents: v5-base annotated tag at 7a9e932, public-API
  inventory + API-pinning test, stale test/dist purge, specs/ convention, G6
  sdd-check skeleton with baseline exception list, repository.url fix (Q9). Size
  it — does it fit ≤12 REQ or need splitting?
- Code placement: for each new module (env, native delegation engine, event
  normalization, DOM facade) decide level and name (common.blocks/env/? where do
  internal modules live — i-bem-dom/__events internals vs standalone blocks) and
  how CONST-P3 override-only interacts (touch ua collapses into common + deltas).
- Rollout/compatibility: every slice leaves v5 buildable + tests green (C2) and
  merges to v5 branch (not main). How do intermediate states stay coherent when
  wrapper consumers are partially migrated (allowlist mid-state), when ua is alias
  + env both present, when loader_type_js is import()-backed but wrapper still
  exists? Identify any slice pair that cannot be separated (atomicity hazards).
- Testing strategy per slice: map the existing assets (i-bem-dom.spec.js 1854L,
  events_type_dom 1069L, events_type_bem 1013L, ym shim corpus, >400 gate) to each
  slice — which specs pin which behavior; where do NEW tests come from (API-pinning
  test in S0, delegation-engine unit tests in S4, env tests + touch-emulated
  Playwright project in S1, benchmarks harness in the jquery-removal slice).
  Propose the per-slice "tests must exist before merge" checklist shape.
- CI wiring: what runs where (affected-packages logic, Playwright projects incl.
  the new touch-emulated one, bundle-size gate if the scale leg proposes it,
  sdd-checks on spec-craft/done-gate). Which CI changes land in which slice?
- The Q10 pure-registry BEM synthetic events proposal (no $.event.special, walk
  entity containment) with parity caveats (positional trigger args, flags.fns
  dedup, cross-node propagation-stop): assess its integration impact on S5 sizing
  and the spec corpus, and recommend adopt/traditional-bubbling for the design doc.
