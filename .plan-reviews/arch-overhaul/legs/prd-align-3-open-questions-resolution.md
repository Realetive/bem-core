PRD-alignment round 3, leg: **open-questions-resolution**
(review_id=arch-overhaul, review_phase=prd-align-3)

Inputs (read all fully, absolute paths):

- PRD draft: `/Users/ryganin/gc/bem-core/bem-core/.prd-reviews/arch-overhaul/prd-draft.md`
  — "Open Questions" OQ1–OQ9 is one walk inventory; "Clarifications from Human
  Review" Q1–Q10 are BINDING final answers (recorded 2026-09-18).
- Design doc under review (already carries prd-align-1 + prd-align-2 fixes — review
  the CURRENT text): `/Users/ryganin/gc/bem-core/bem-core/.designs/arch-overhaul/design-doc.md`
  — its "Open Questions" section (items 1–9 + the "Retired during prd-align-1"
  subsection) is the second walk inventory.
- Prior alignment logs (context — do not re-litigate fixed items):
  `/Users/ryganin/gc/bem-core/bem-core/.plan-reviews/arch-overhaul/prd-align-round-1.md`
  `/Users/ryganin/gc/bem-core/bem-core/.plan-reviews/arch-overhaul/prd-align-round-2.md`
- Project constitution (binding): `/Users/ryganin/gc/bem-core/bem-core/CONSTITUTION.md`

Repo evidence (read-only): `/Users/ryganin/gc/bem-core/bem-core` (branch v5 @ f2ab61e).

## Mission

Ensure **every open question — in the PRD (OQ1–OQ9) and in the design doc
(design-OQ 1–9, plus any inline dangling question marks you encounter while
reading) — is either (a) answered with the answer visibly carried in the design
doc, or (b) explicitly deferred with a named decision point (which slice's
spec-craft decides, what the working position is in the meantime), or (c) retired
with evidence (like OQ3/G3 in prd-align-1).** A question that is dangling (no
disposition), half-answered (answer exists somewhere but the question still reads
open), double-answered (two sections disagree), or deferred without an owner/point
is a finding. By the end of the planning pipeline (this is the last PRD-alignment
round) the design doc's question inventory must be fully dispositioned — anything
left open past this round must justify why it belongs to slice spec-craft rather
than the design.

## Walk inventory (minimum)

1. **PRD OQ1–OQ9** one by one: map each to its Q1–Q10 human answer and to the
   design element that carries it (e.g. OQ1 wrapper fate → Q2 → D-1 + S6; OQ2 ua
   shape → Q5 → env module + ua alias; OQ4 inherit → Q4 → D-2; OQ5 init
   redefinition → D-8 generated entries; OQ6 loader_type_bundle → Q7 → S3
   deletion; OQ7 dom block fate → ? ; OQ8 public API inventory → Q3 → Interface
   section; OQ9 benchmarks → Q6 → bench project). Any OQ whose Q-answer is not
   visibly carried (or is carried contradictorily) is a finding. OQ3 and the G3
   timeout parenthetical are already retired — verify the retirement sections are
   still accurate, don't reopen them.
2. **Design-OQ 1–9** one by one: each has a stated working position and a decision
   point (e.g. 1 → S2 spec-craft; 2 → S6; 3 → S4 specs; 4 → S2 first REQ; 5 →
   "decide by whether non-owner agents may edit entry.js" — is that decision
   point concrete enough: who decides, when?; 6 → payload-parity assertion or
   fate decision; 7 → S0 pin test records; 8 → S1 spec ratify; 9 → S0 spec
   ratify). Flag any whose decision point lacks a slice/owner, or whose working
   position contradicts body text elsewhere.
3. **Inline dangling questions**: scan the whole design doc for question marks,
   "TBD", "decide", "ratify", "working position" phrasing in body sections —
   each such deferral must match one of the two inventories above or be added to
   them; orphan deferrals (in body but not in the Open Questions section) are
   findings.
4. **Cross-inventory consistency**: PRD OQ vs design-OQ numbering drift;
   questions answered by prd-align-1/2 findings but whose Open Questions entries
   weren't updated to say so; the "Retired" subsection's evidence claims vs
   current text.
5. **Deferral honesty**: for every deferred item, check the deferral doesn't
   defer a load-bearing decision past the slice that needs it (e.g. a decision
   required by S0 spec-craft cannot be deferred to "post-6.0.0").

## Output requirements (mandatory)

- Classify every finding as **[must-fix]** (dangling/half/double-answered question,
  or deferral with no concrete decision point, or decision deferred past its
  consumer) or **[should-fix]** (answered but unclear, inconsistently located, or
  numbering/pointer drift).
- Every finding must point to the exact design-doc section(s) (heading + quote)
  and the exact question (PRD OQn / design-OQ n / inline quote) it traces to.
- Suggest the concrete design-doc edit for each finding.

## Report structure (put the FULL report in bead notes)

```
# PRD-align-3 · open-questions-resolution
## Summary
## Resolution matrix (question → ANSWERED / DEFERRED-EXPLICIT / RETIRED / DANGLING → carrier section)
## Findings ([must-fix] / [should-fix], each with section anchor + suggested fix)
## Confidence
```

## Rules

Analysis-only: do not edit the design doc, do not push code, do not touch
unrelated work. When done, mail the coordinator recorded in this bead's metadata
(`coordinator` key), then close this bead and drain.
