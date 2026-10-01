# PRD alignment round 2 — constraints and non-goals (prd-align-2)

- Step bead: bc-av8 (mol-idea-to-plan.prd-align-2), root bc-4ii
- Dispatched by: bem-core/opencode-1 (session gc-2if1t) on 2026-09-23
- Inputs read by legs: .prd-reviews/arch-overhaul/prd-draft.md (incl. Q1–Q10),
  .designs/arch-overhaul/design-doc.md @ prd-align-1 state, CONSTITUTION.md,
  .plan-reviews/arch-overhaul/prd-align-round-1.md
- Coordinator re-verified the load-bearing new repo facts before applying:
  ci.yml Node matrix [20,22]; 43 (not 16) `BEMDOM.*` matches in
  common.docs/i-bem-js (en only, ru divergent); `ua__dom` reads `bada`/`wp`;
  touch ua orientchange fires only when landscape AND width both change
  (Android shrink-guard); `keyboard__codes` imported by both hand-maintained
  platform entry lists (build/platforms/{desktop,touch}.js:53/:52);
  package.json `exports."." = ./dist/desktop/bem-core.mjs` (root = side-effect
  payload today), engines >=20, version 5.0.0, repository.url still upstream,
  jquery in peer+devDeps. All confirmed.

## Legs

| leg | bead | workflow | report | verdict |
|---|---|---|---|---|
| constraints-compliance | bc-dip | bc-j7l | legs/report-prd-align-2-constraints-compliance.txt | CONST-P1..P5 + C1–C6 + Q-business all RESPECTED (re-verified); 0 must-fix, 7 should-fix |
| non-goals-enforcement | bc-lvq | bc-90g | legs/report-prd-align-2-non-goals-enforcement.txt | NG1–NG7 hold; 0 must-cut, 6 guardrail, 1 should-cut, 2 out-of-leg doc notes |

Both reports fully accepted — **0 rejections**. No overlapping conflicts
between legs (Data Model 5 stale "3" was independently found by both — merged
as one fix).

## Applied changes to .designs/arch-overhaul/design-doc.md

### From constraints-compliance (all should-fix, applied)

1. **CC-F1 (+NG out-of-leg 1): Data Model 5 ledger said "CONST-P6 baseline
   (3→∅)"** — stale pre-align-1 number; the ratchet substrate is material for
   S0. Applied: → "(7→∅)".
2. **CC-F2: S0 root-export repurpose had no consumer migration line.** The
   change (root `.` payload → never-auto-inits barrel, payloads →
   `./dist/{desktop,touch}`) was designed but not enumerated as a C4 break.
   Applied: Design position 3 gains the migration line
   (`import 'bem-core'` → `import 'bem-core/dist/desktop'` or `./dist/touch`;
   S0's MIGRATION cell carries it).
3. **CC-F3: skip/preview guard mechanism unspecified.** The staged final
   predicates needed a concrete guard to stay machine-checkable under the
   constitution's exit-0 = OK contract. Applied: guard form sentence in Key
   Components 10 and 13 (short-circuit to preview output + exit 0 while the
   allowlist ≠ ∅, binding otherwise).
4. **CC-F4: S4+S5 merge fallback could read as one ≤22-REQ convoy, breaching
   C2's ≤12-REQ cap.** Applied: Risks row now states the fallback preserves two
   separately-gated internal stages (each ≤12 REQ; convoy shippable only when
   both green).
5. **CC-F5: "v5-base/f2ab61e" conflation in the Retired subsection + no anchor
   reconciliation.** Applied: reworded to "@ f2ab61e (v5 head = v5-base@7a9e932
   + the constitution commit; …valid parity proxy)"; the same reconciliation
   added at the Exec Summary evidence note.
6. **CC-F6: S0 constitution amendments' process implicit.** Applied: Key
   Components 13 states CONST-P6 + the CONST-P1 final predicate are
   constitution amendments carried by the S0 slice PR (constitution-header
   review process).
7. **CC-F7 (PRD-side, no design edit): Q8 ordered the chromium-only +
   desktop-parity matrix declared in PRD Constraints (C4) "NOW"; prd-draft.md
   C-section text predates that.** Disposition recorded here: **D-15 is the
   operative C4 declaration** (substance satisfied; PRD text left untouched as
   a reviewed artifact). Noted for plan-review walkers.

### From non-goals-enforcement (guardrails + cut, applied)

8. **NG-F1 [guardrail]: S6 docs rewrite unbounded + stale evidence figure.**
   Applied: S6 row + Risks row bound the pass to API accuracy
   (BEMDOM.* → bemDom.* remap, deleted-API sections → MIGRATION entries,
   ru/en anchor parity via the doc fence; content redesign deferred post-6.0.0);
   "16" corrected to 43 (coordinator-verified).
9. **NG-F2 [guardrail]: "zero window.* writes" read as a new enforced
   invariant.** Applied: D-14 parenthetical — descriptive consequence of the
   UMD drop; no new check scheduled; S6's grep predicates unchanged.
10. **NG-F3 [guardrail]: bench absolute-budget deferral dangled unfunded
    work.** Applied: Risks row + Key Components 11 note — post-series and
    optional; dedicated-runner evidence gathering not scheduled by this plan;
    ratio thresholds are the shipped gate.
11. **NG-F4 [guardrail]: `keyboard__codes` provision's only carrier was the
    hand-maintained platform lists that D-8 deletes.** Applied: Key
    Components 8 + Open Question 6 — generation must reproduce the provision
    (payload-parity assertion) or record an explicit fate decision; silent drop
    via generation forbidden (keyboard is Non-Goal-frozen).
12. **NG-F5 [guardrail]: `page__conditional-comment` deletion (template-surface
    removal) lacked an authorization record.** Applied: S6 row + Key
    Components 13 — authorized template removal (C5 evergreen-only ⇒ IE-only
    elem is dead code; MIGRATION entry names elem + both template files;
    hoist-to-common rejected as dead-code-in-common).
13. **NG-F6 [guardrail]: env surface never dispositioned `bada`/`wp` — read by
    the audited consumer (`ua__dom`).** Applied: env/ua surface gains
    field-disposition completeness clause — every ua__dom-read field gets an
    explicit S1-spec disposition; `bada`/`wp` working position = encoded in
    `env.platform` (UA-derived, dedicated unit), ratified at S1 spec-craft.
14. **NG-F7 [should-cut, APPLIED]: Node matrix realignment [20,24] required by
    no slice** (current matrix [20,22] already pins the ≥20 floor). Applied:
    CI wiring now says Node matrix unchanged; revisit 24 only if a slice cites
    a Node-24-dependent behavior (none identified).
15. **NG out-of-leg 2: orientchange shrink-guard heuristic unpinned.** Applied:
    Key Components 1 — firing guard preserved (dispatch only when landscape AND
    width both change), pinned by the S1 emulation-parity tests.

### Also applied

- Header note: prd-align-2 provenance block (date, legs, summary of folded
  findings, round-log pointer).

## Rejections

None. All 15 merged findings applied in full (14 design-doc edits + 1 PRD-side
disposition recorded in this log per the leg's suggested handling).
