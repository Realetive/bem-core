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
- Be specific: cite PRD/review sections and repo paths. Concrete API sketches beat prose.

Report structure (markdown):
# <Leg Title>
## Summary
## Key Considerations
## Options Explored
## Recommendation
## Constraints Identified
## Open Questions
## Integration Points

Leg focus: api — public API shape, ergonomics, discoverability.

Decisions already made by the human (do not relitigate, design within them):
- Public surface = root export `.`, deep-imports `./*`, `./build/plugins/*`; public blocks:
  i-bem, i-bem-dom, events, dom, loader, ua/env (Q3). Deep-imports stay public.
- DOM type contract = native Element / Element[] replacing jQuery collections (Q3).
- jQuery wrapper: deleted outright, no compat shim (Q2). env is a NEW public module,
  `ua` stays as a deprecated alias for one release (Q5).

Design questions for you:
- Shape the concrete export inventory: which named exports at root (per public block),
  how per-block deep-import paths look, what the deprecation-alias mechanics for `ua`
  are (runtime warning? console once? removal schedule?), how `./build/plugins/*`
  (vite-plugin-bem-levels) is documented as API.
- Design the native DOM type contract: how signatures that took/returned jQuery
  collections (domElem, scope/doc/win, getFocused(), dom.contains, findElem etc.)
  map to Element/Element[]; array-creation, single-vs-multi semantics, live vs static.
- Sketch the env module API surface from the audited consumer inventory (touch ua__dom
  platform modifiers; winresize ua.msie dies): what queries does env expose, how is
  it computed (lazy? memoized? event for change?), how does touch ua override consume it.
- Loader API after loader_type_js reimplementation on import() and loader_type_bundle
  deletion (Q7): what does the public loader surface look like, what is the one-line
  migration story for legacy loader_type_js.get(url) users (US6)?
- Ergonomics: how does a consumer discover what is public (API-pinning test as
  executable documentation? docs table? JSDoc?). Where do the CONST-P4 boundaries
  show up in the API tests?
- Error experience for misuse: what happens when a non-public path is imported,
  when ua deprecated fields are read, when env queries run before DOM ready.
