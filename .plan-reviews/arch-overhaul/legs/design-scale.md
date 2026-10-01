You are one leg of a parallel design exploration for the bem-core v5 architecture overhaul.

Repo root: /Users/ryganin/gc/bem-core/bem-core (branch v5, already cloned).
PRD (authoritative, includes human clarifications): /Users/ryganin/gc/bem-core/bem-core/.prd-reviews/arch-overhaul/prd-draft.md
PRD review synthesis (structural fixes, slice arithmetic, parity traps): /Users/ryganin/gc/bem-core/bem-core/.prd-reviews/arch-overhaul/prd-review.md
Project constitution (binding constraints): /Users/ryganin/gc/bem-core/bem-core/CONSTITUTION.md

Standard instructions:
- Read the PRD draft (especially "Clarifications from Human Review" — decisions are final),
  the PRD review synthesis, and CONSTITUTION.md first.
- Explore the repo as needed to ground your design (i-bem-dom.js live-collection code,
  __events delegation, benchmarks suite, vite-plugin-bem-levels, dist/ build).
- Produce your FULL report in the bead notes of this bead using the report structure below.
- Mail the coordinator bem-core/opencode-1 when complete:
  gc mail send bem-core/opencode-1 -s "Design leg <leg> complete" -m "<bead-id> closed".
- Do NOT push code, do NOT modify repo files, do NOT touch unrelated work. Design only.
- Be specific: cite PRD/review sections and repo paths. Quantify where you can.

Report structure (markdown):
# <Leg Title>
## Summary
## Key Considerations
## Options Explored
## Recommendation
## Constraints Identified
## Open Questions
## Integration Points

Leg focus: scale — bottlenecks, scale limits, degradation modes, caching.

Design questions for you:
- Bundle-size budget: jquery removal should cut ~30+ kB min+gz (plus Sizzle-class
  selector machinery). Estimate the per-entry (desktop/touch dist bundles) before/after
  sizes from the repo (what does dist contain today?), define a per-slice bundle-size
  regression gate, and decide where the budget lives (CI check? sdd-check?).
- Tree-shaking reality: the review notes side-effect platform entries + redefinition
  barrels force full evaluation. Design the side-effects model (pure annotations?
  `Object.freeze`? explicit sideEffect flags in export map?) and state honestly what
  is achievable — US1's "tree-shaking works" was scoped down to "no jQuery in bundle".
- Event delegation engine at scale: the native replacement for jquery delegation
  (S4/S5 slices) must handle deep DOMs with many delegated bindings. Compare designs:
  single listener per event type at document + selector matching walk vs per-scope
  listeners vs jquery-style bubbling simulation with root fallback. What are the
  complexity characteristics (add/remove binding, dispatch cost, memory) and which
  parity quirks (delegated self-match on(selector)+is(selector), focus/blur) constrain
  the choice?
- Live collection management at DOM scale: how i-bem-dom tracks entities today
  (grep live_, Collection, findBlockInstances), cost of large DOMs (mutation storms,
  detach/attach), degradation modes (does the live collection ever leak detached
  nodes?). Recommend the internal structure for the decomposed modules and what
  perf tests (benchmarks kept per Q6) must pin before/after the i-bem-dom slice.
- Caching/memoization: env computation caching (UA/capability results are invariant
  per page — memoize forever vs recompute), entity class composition caching
  (decl results per level-chain), selector compilation caching in the delegation
  engine (compile once per selector string), module graph caching at build time
  (vite plugin barrel generation).
- Benchmark strategy: benchmarks suite is kept and migrated off jquery inside the
  jquery-removal slice (Q6) as the perf harness for the i-bem-dom rework. Design
  what it measures (init time, delegation dispatch throughput, live-collection
  updates), how it runs (Playwright smoke? standalone page? CI job or manual?),
  and its acceptance thresholds so slice specs can cite it mechanically.
- Startup cost: import() loader semantics, modulepreload usage, init-on-DOM
  readiness — where are the boot-time bottlenecks after ESM-ification and what
  does the design promise?
