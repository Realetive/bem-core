You are one leg of a parallel design exploration for the bem-core v5 architecture overhaul.

Repo root: /Users/ryganin/gc/bem-core/bem-core (branch v5, already cloned).
PRD (authoritative, includes human clarifications): /Users/ryganin/gc/bem-core/bem-core/.prd-reviews/arch-overhaul/prd-draft.md
PRD review synthesis (structural fixes, slice arithmetic, parity traps): /Users/ryganin/gc/bem-core/bem-core/.prd-reviews/arch-overhaul/prd-review.md
Project constitution (binding constraints): /Users/ryganin/gc/bem-core/bem-core/CONSTITUTION.md

Standard instructions:
- Read the PRD draft (especially "Clarifications from Human Review" — decisions are final),
  the PRD review synthesis, and CONSTITUTION.md first.
- Explore the repo as needed to ground your design (common.blocks/*/*.en.md|ru.md,
  common.docs/, MIGRATION.md, README*, test/).
- Produce your FULL report in the bead notes of this bead using the report structure below.
- Mail the coordinator bem-core/opencode-1 when complete:
  gc mail send bem-core/opencode-1 -s "Design leg <leg> complete" -m "<bead-id> closed".
- Do NOT push code, do NOT modify repo files, do NOT touch unrelated work. Design only.
- Be specific: cite PRD/review sections and repo paths. Concrete doc sketches beat prose.

Report structure (markdown):
# <Leg Title>
## Summary
## Key Considerations
## Options Explored
## Recommendation
## Constraints Identified
## Open Questions
## Integration Points

Leg focus: ux — mental model, workflow fit, error experience, docs examples.

The "users" here are: library consumers on a modern stack (US1), frozen-consumer
maintainers migrating blocks (US2), platform contributors (US3), slice engineers
picking up bead specs (US4), and legacy loader users migrating (US6).

Design questions for you:
- Mental model after the overhaul: what does the one-paragraph story look like
  ("bem-core v6 is an ESM library of BEM entities over the native DOM; import what
  you need; platforms override common")? Where does it live (README rewrite scope)?
  How do the three platform layers + export map fit into a contributor's head?
- Migration experience per slice: every slice updates MIGRATION.md + MIGRATION.ru.md
  (bilingual parity is a known historical failure mode — budget it). Draft the
  MIGRATION.md section skeleton for the two most disruptive migrations:
  (a) jQuery removal — including the $(node).bem() plugin and jquery peer-dep removal
  (Q2), DOM type contract change Element/Element[] (Q3); (b) loader_type_bundle
  deletion with the en/ru one-liner (Q7) and loader_type_js -> import() story (US6).
- Error experience: enumerate the new failure modes a consumer hits (importing a
  non-public path, reading a dead ua field through the deprecated alias, env query
  before DOM ready, redefinition authored wrong so generateBarrel calls a non-function,
  importing desktop-only block into touch build). For each: what is the observable
  error today, what should it be, and where is it produced?
- Docs examples: which block docs need rewritten examples as signatures drop jQuery
  collections (dom, i-bem-dom events on*, getFocused...)? Sketch one before/after
  example pair (jquery-free) suitable for i-bem-dom.en.md. Where do env module docs
  live and what do their examples show (touch ua__dom modifiers)?
- Workflow fit for slice engineers (US4): what does a slice spec look like so an
  agent/human can verify completion mechanically — done-criteria format, REQ counting
  rule (≤12), MIGRATION.md note requirement, allowlist-shrink evidence?
- Debuggability: how does someone trace "which events are delegated where" or
  "which entity class got composed from which levels" after decomposition — do we
  promise any introspection, or document "use tests"?
