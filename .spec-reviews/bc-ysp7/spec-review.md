# Spec Review: bc-ysp7

Synthesized by the spec-review-legs coordinator (bead bc-bdts) from three
independent review legs dispatched to bem-core/gastown.polecat on 2026-09-30.
Round 1 leg beads: factual=bc-qa0j, testability=bc-svm6, constitution=bc-ptje.
Round 2 factual re-review (after the human-gate change request): bc-hi42.
Full leg reports live in those beads' notes; leg IDs in spec-review-beads.tsv.

## Executive Summary

All three legs pass. Round 1's factual leg failed on a single must-fix — the
REQ-10 CONST-P6 baseline count ("7 groups / 12 files" vs the actual 19) — and
the human gate returned CHANGES REQUESTED on exactly that. The spec and
evidence were corrected to "19 files (8 desktop + 11 touch); files are the
only unit, no entity/group counting", both machine gates re-run green
(35/35 citations, 0 fail/0 warn; pre-approve OK, 22 ACC, constitution pass),
and the factual leg was re-dispatched: round 2 independently re-derived the
full audit and CONFIRMED the corrected baseline by recomputation
(git ls-tree at f2ab61e, enumerated file-by-file, cross-checked by two
independent pipelines). Verdict pass, zero must-fix. The one advisory it
found (F-2r: REQ-4's CONSTITUTION.md:28 citation rendered a multi-line shell
string as if closed on line 28) was folded in pre-approval by extending the
citation to :28-36; both gates re-run green after that edit.

## Leg Verdicts (factual / testability / constitution)

### factual — PASS (round 2, bead bc-hi42; round-1 fail resolved)

Round 1 (bc-qa0j) failed on F-1: REQ-10/ACC-16 pinned the baseline as
"7 groups / 12 files"; actual count under REQ-10's own include-set is 19
files (8 desktop + 11 touch); "group" undefined. Fix applied; round 2 verdict:

- **F-1r RESOLVED:** baseline = 19 files (8 + 11) CONFIRMED by independent
  recomputation from the include-set as written; ACC-16 matches. Sensitivity
  load-bearing: the *.bemjson.js and *.examples/ exclusions account for 7 more
  files (26 without them); .css contributes 0 today; no entity/group counting
  remains anywhere in REQ-10/ACC-16.
- All 30 file-region Evidence quotes verbatim-exact at cited lines (the
  round-1 count of 35 included REQ-2..REQ-11 region cites + duplicates;
  round 2 reconciled to 30 unique + 13 clause citations). Parent commit
  7a9e932, barrel anchors (all six names), env/ua/loader inventory claims,
  and REQ-12 clause glosses all verified against f2ab61e.
- F-2r (advisory, folded in pre-approval): REQ-4's `CONSTITUTION.md:28`
  citation quoted a multi-line ALLOW string as if closed on line 28 —
  citation now spans :28-36; machine gates green after the edit.
- Round-1 advisories F-2 (CONST-P6 self-reference) and F-3 (pre-s0 snapshot
  step) were already folded into the spec text during the fix pass
  (REQ-12 discloses the intra-slice self-reference; REQ-6 says the snapshots
  are "captured in-slice ... before that deletion").

### testability — PASS (round 1, bead bc-svm6; domain unchanged by the fix)

All 22 ACCs carry exactly one runnable command (inline or single fenced
block, && chains count as one entry point); assertions present use the
explicit "expect output contains" form; no commandless/unattested ACCs; no
prose-embedded commands. Quality observations (non-blocking): ACC-16/17/18/
20/22 rely on implicit exit-0 (recommend explicit "expect exit 0");
ACC-12's "contains pass" can be satisfied by a partially-red node --test
run (use exit 0); ACC-13 greps a phrase already in REQ-8's body (use a
date-shaped pattern); ACC-8 names two repo states one run can't both
certify (key mode to repo state).

### constitution — PASS (round 1, bead bc-ptje; domain unchanged by the fix)

All 12 clauses across the three layers (D1–D4, P1–P5, U1–U3) attest
**complies**; zero violates, zero N/A. Machine-checked read-only against the
live repo: verify-citations.sh 35/35 ok, D4 secrets grep clean, P1 ratchet
bidirectionally clean (9=9), P5 LICENSE.txt present. Advisories: REQ-12↔REQ-10
P6 coupling must land atomically; spec sits at schema ceilings (12/12 REQs,
~287/300 lines — no scope growth possible in-spec); today's P1 check is
direction-1 only (upgrade encodes present reality, no migration hazard).

## Must-Fix Items

None remaining. Round-1 must-fix #1 (REQ-10/ACC-16 baseline count) is applied
and independently confirmed by the round-2 factual leg.

## Non-Blocking Observations

- F-2r citation-range polish applied pre-approval (CONSTITUTION.md:28-36).
- Testability polish (deferred to implementation review): explicit
  "expect exit 0" on ACC-16/17/18/20/22; stronger signals for ACC-12
  (exit 0) and ACC-13 (dated pattern); state-keyed wording for ACC-8.
- Spec is at both schema ceilings (12 REQs, ~287/300 lines): any additions
  beyond the must-fix require trimming elsewhere or a follow-up spec.

## Next Steps

1. Human gate: re-present the amended spec for explicit approval (bead
   bc-6vfx; closing it IS approval).
2. On approval: stamp (status flip, nsha, spec.state=approved on convoy +
   task beads), close the spec bead to unblock the task DAG, notify mayor.
3. Implementation (bc-gdk9, S0) dispatches after the DAG unblocks.
