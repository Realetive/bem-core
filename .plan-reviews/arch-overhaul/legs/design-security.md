You are one leg of a parallel design exploration for the bem-core v5 architecture overhaul.

Repo root: /Users/ryganin/gc/bem-core/bem-core (branch v5, already cloned).
PRD (authoritative, includes human clarifications): /Users/ryganin/gc/bem-core/bem-core/.prd-reviews/arch-overhaul/prd-draft.md
PRD review synthesis (structural fixes, slice arithmetic, parity traps): /Users/ryganin/gc/bem-core/bem-core/.prd-reviews/arch-overhaul/prd-review.md
Project constitution (binding constraints): /Users/ryganin/gc/bem-core/bem-core/CONSTITUTION.md

Standard instructions:
- Read the PRD draft (especially "Clarifications from Human Review" — decisions are final),
  the PRD review synthesis, and CONSTITUTION.md first.
- Explore the repo as needed to ground your design (grep parseHTML, innerHTML, eval,
  Function(, insertAdjacentHTML across common.blocks; test harness; build/).
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

Leg focus: security — trust boundaries, attack surface, validation, permissions.

Design questions for you:
- parseHTML/keepScripts: the review flags `$.parseHTML(html, null, true)` (keepScripts)
  as a parity trap — where is HTML-from-string parsed in i-bem-dom/events/jquery
  wrapper today, and what is the native replacement's script-execution posture?
  Design the replacement (DOMParser? template element? Range.createContextualFragment?)
  and state the security delta of each option (DOMParser never executes scripts;
  innerHTML/fragment APIs execute in some contexts). Recommend with rationale and
  note where the behavioral change must be documented (CONST-P4 migration note).
- XSS surfaces inventory: enumerate every place the library turns strings into DOM
  (selectors, html injection, bemTarget outerHTML in error paths, template usage),
  and every place user data flows into them. What validation/sanitization duties
  belong to the library vs the consumer? Where should the design doc draw the line?
- CSP compatibility: loader_type_js hand-rolled script injection + global callbacks
  vs import()-based loader — what does each require of a Content-Security-Policy
  (script-src 'self'? unsafe-eval? dynamic import caveats in CSP3)? Does modulepreload
  need CSP treatment? Any document.write or inline-script survivors to eliminate?
- Globals and UMD residue: UMD dist format fate is an open relic question with
  CONST-P2 tension — what is the attack/deprecation surface of keeping a UMD global
  vs deleting it? Any other window.* writes the design should catalog and gate?
- Supply chain: jquery peer-dep removal (Q2) removes a dependency; what's the full
  dependency delta of the overhaul (jquery dev-dep in test harness, ym shim remnants,
  ENB-era stale test/dist requiring removed packages)? Policy for new deps
  (delegations-events libs? query-selector engines?) — recommend a "no new runtime
  deps without constitution amendment" style rule if appropriate.
- Trust boundaries between levels: a touch.blocks override is trusted code (in-repo),
  but the redefinition chaining (generateBarrel calling exports as functions) means
  a mis-authored override can execute arbitrary code with base-module rights. Is
  there a validation duty at build time (isRedefinition check the review proposes)?
  Design that check's failure mode (build error message).
- Permissions: nothing in this library asks for permissions, but the Playwright
  matrix (chromium-only + new touch-emulated project per Q8) runs in CI — note any
  secrets/credential exposure risks in the test harness worth a design guard.

Keep this proportionate: this is a UI library, not a service. Where the answer is
"no meaningful surface, document the reasoning", say so and move on.
