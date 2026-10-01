# PRD alignment round 1 — requirements and goals (prd-align-1)

- Step bead: bc-9qy (mol-idea-to-plan.prd-align-1), root bc-4ii
- Dispatched by: bem-core/gastown.furiosa (session gc-frpmr) on 2026-09-23
- Inputs read by legs: .prd-reviews/arch-overhaul/prd-draft.md (incl. Q1–Q10 answers),
  .designs/arch-overhaul/design-doc.md (baseline v1)
- Coordinator re-verified the load-bearing repo evidence for GA-F1 (standalone
  platform-module inventory) with an exact ancestor-existence pass @ f2ab61e before
  applying: confirmed and extended (12 standalone files / 7 module groups, including
  the deps-only standalones `touch.blocks/ua/ua.deps.js` and
  `desktop.blocks/jquery/__config/jquery__config.deps.js`).

## Legs

| leg | bead | workflow | report | verdict |
|---|---|---|---|---|
| requirements-coverage | bc-3x2 | bc-g4s | legs/report-prd-align-1-requirements-coverage.txt | 19 COVERED / 4 PARTIAL / 0 MISSING; 2 must-fix, 3 should-fix |
| goals-alignment | bc-e5n | bc-7gx | legs/report-prd-align-1-goals-alignment.txt | G1–G4 + goal statement achieved; G5/G6/G7 defects; 2 must-fix, 5 should-fix |

Both reports fully accepted — **0 rejections**. Overlapping findings merged below
(cross-referenced as RC-Fn / GA-Fn from the reports).

## Applied changes to .designs/arch-overhaul/design-doc.md

### MUST-FIX

1. **CONST-P6 baseline arithmetic contradicted the repo** (GA-F1; grep-verified).
   Baseline "{desktop ua, touch ua, desktop winresize} = 3" was wrong: the true
   standalone inventory @ f2ab61e is **7 module groups / 12 files** (missing were
   touch `ua__dom`, the deps-only `jquery__config` delta, and the two template-only
   page elems; as written the check fails at S0 or never reaches ∅).
   Applied:
   - Key Components 13: CONST-P6 scope declared (JS, `.deps.js`, bemhtml/bh, CSS),
     verified 7-group/12-file baseline enumerated, shrink path −3 (S1) −1 (S2)
     −3 (S6) → ∅.
   - Slice table S1 row: common ua base gains `__dom` elem ancestor; touch `ua__dom`
     becomes its override delta.
   - Slice table S6 row: `page__conditional-comment` deleted (IE relic),
     `page__icon` hoisted to common, `jquery__config` dies with
     `desktop.blocks/jquery/*` wholesale deletion.
   - Slice table S0 row + Executive Summary: baseline 3 → 7.

2. **S0 gate staging broke the per-slice green invariant (C2/G7)** (GA-F2).
   "No-jquery-in-artifact assertion + external/peer removal check landing in S0"
   was arithmetically impossible while jquery legitimately remains through S5 —
   S1–S5 CI would be red. Applied:
   - Executive Summary: staged-gate wording (per-slice binding = gz caps + ratchets;
     final assertions activate at S6 / when allowlist reaches ∅).
   - Key Components 10: full staging paragraph with rationale.
   - Key Components 13: CONST-P1 final predicate runs skip/preview until allowlist
     ∅, binding at S6.

3. **G5/OQ3 "pointerevent normalization" absent with no reconciliation** (RC-F1 +
   GA-F3; grep-verified: zero pointer code @ f2ab61e). Applied:
   - Key Components 6: reconciliation note (moot; future need = events-dom mapping
     table concern).
   - Open Questions → new "Retired during prd-align-1" subsection closing OQ3.

4. **G3 loader "timeout" sub-clause never dispositioned** (RC-F2 + GA-F4;
   repo-verified: `loader_type_js` never had a timeout). Applied:
   - Loader surface: full old→new semantics table (async ✓, error ✓, dedup/cache →
     native import() module map, `file:` hack removed, timeout void/dropped with
     S3-spec escape valve).
   - Open Questions → retired subsection closes the PRD parenthetical as stale.

### SHOULD-FIX

5. **G2 retained UA-driven branches lacked documented justification/tests**
   (RC-F3 + GA-F5). Applied: env/ua surface gains UA-derived vs capability-probe
   classification with the Q5 audited-consumer justification; S1 TESTS gains
   one unit per UA-derived getter; emulation-parity tests named as the G2 tests
   leg; slice table S1 row mentions it.

6. **CONST-P5/MPL-2.0 notice preservation unmentioned** (RC-F4). Applied: Key
   Components 13 gains CONST-P5 clause (notices preserved through S6
   deletions/rewrites + notices-intact grep in S6 done-gate); S6 row mentions it;
   TESTS S6 gains "MPL notices-intact".

7. **`./common.blocks/*` wildcard vs "pinned" inventory tension; `inherit`
   deep-import undispositioned** (RC-F5). Applied: Design position 2 + deep-import
   inventory state the wildcard is a compatibility superset policed by the pin
   test/CONST-P4, and `inherit` is internal-but-tolerated (not public contract;
   future narrowing needs a CONST-P4 migration note).

8. **S4 interim jquery carrier unstated** (GA-F6). Applied: S4 row names the
   remaining allowlisted trio (`i-bem-dom`, `__events_type_bem`, `__init_auto`)
   as the sole jquery carrier until S5 — makes the −2 delta's truthfulness
   auditable.

9. **TESTS "New" enumeration omitted S3** (GA-F7). Applied: S3 entries added
   (promise-return semantics, error-callback wiring, ES-only rejection, deprecated
   deep-import re-export once-warn).

### Also applied

- Header note: prd-align-1 provenance block (date, legs, findings folded in,
  round-log pointer).

## Rejections

None. All 9 merged findings applied in full.
