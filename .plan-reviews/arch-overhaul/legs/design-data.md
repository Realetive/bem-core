You are one leg of a parallel design exploration for the bem-core v5 architecture overhaul.

Repo root: /Users/ryganin/gc/bem-core/bem-core (branch v5, already cloned).
PRD (authoritative, includes human clarifications): /Users/ryganin/gc/bem-core/bem-core/.prd-reviews/arch-overhaul/prd-draft.md
PRD review synthesis (structural fixes, slice arithmetic, parity traps): /Users/ryganin/gc/bem-core/bem-core/.prd-reviews/arch-overhaul/prd-review.md
Project constitution (binding constraints): /Users/ryganin/gc/bem-core/bem-core/CONSTITUTION.md

Standard instructions:
- Read the PRD draft (especially "Clarifications from Human Review" — decisions are final),
  the PRD review synthesis, and CONSTITUTION.md first.
- Explore the repo as needed to ground your design (package.json export map, build/,
  vite-plugin-bem-levels, common.blocks/*, desktop.blocks/*, touch.blocks/*, test/).
- Produce your FULL report in the bead notes of this bead using the report structure below.
- Mail the coordinator bem-core/opencode-1 when complete:
  gc mail send bem-core/opencode-1 -s "Design leg <leg> complete" -m "<bead-id> closed".
- Do NOT push code, do NOT modify repo files, do NOT touch unrelated work. Design only.
- Be specific: cite PRD/review sections and repo paths. Concrete data sketches beat prose.

Report structure (markdown):
# <Leg Title>
## Summary
## Key Considerations
## Options Explored
## Recommendation
## Constraints Identified
## Open Questions
## Integration Points

Leg focus: data — data model, storage, migrations, schema evolution.

For this library overhaul, "data" means the module-graph and runtime-state models:
deps.js dependency declarations, level/redefinition layering, generated transformer
barrels (vite-plugin-bem-levels generateBarrel), the i-bem-dom__init build-time barrel
scanning, live DOM collections/ranges inside i-bem-dom, and the ym-authored legacy
spec corpus running through a hand-maintained shim map (test/browser/entry.js).

Design questions for you:
- Deps model after jquery removal: what happens to *.deps.js data for the 9 frozen
  consumers as they migrate — do deps entries get deleted with the jquery dep, does
  the deps format itself need a schema (allowed keys) documented, how does CONST-P1's
  grep check evolve as the allowlist shrinks to zero and the check flips to
  "no bem:jquery imports anywhere, including desktop.blocks/jquery/* and test harness"?
- Redefinition/layering data model: the review flags the generateBarrel hazard
  (same-named modules across levels chained as function calls; redefinitions not
  authored as `export default function(prev)` break at runtime). Design the
  machine-checkable definition of "override" (transformer form vs side-effect redef
  vs standalone-when-no-common-base) and the CONST-P3/P6 enforcement data (sdd-check
  ancestor-existence check + shrinking legacy-exception allowlist + baseline list).
- Init registry: PRD OQ5 — build-time barrel scanning replaced the ym monkey-patch.
  Compare registry designs (generated barrel vs explicit registration API vs static
  analysis at build) and recommend one; specify its data (what registers: block
  classes, mods, init order) and how dynamic redefinition (i-bem-dom.spec.js:1813)
  keeps working.
- Live collection/range model inside i-bem-dom decomposition (G5): how do live
  collections track DOM mutation today (MutationObserver? point events?), what is
  the internal data structure for entity lookup by block name/mods, and what must
  the decomposition preserve (CONST-P4: internal structure invisible)?
- Spec-harness migration as schema evolution: ym-authored specs through the shim map,
  hand-maintained module map in test/browser/entry.js (ua, idle, loader_type_bundle,
  keyboard__codes absent), hard-coded >400 gate in browser.spec.js. Design the target
  state: authored-in-ESM specs? shim retirement plan? per-slice policy for the gate?
- Migrations bookkeeping: how each slice records its data-model deltas
  (MIGRATION.md/MIGRATION.ru.md entries, CHANGELOG pair, sdd-check baselines) so the
  6.0.0 release (Q9) has one coherent changelog.
