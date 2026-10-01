# Human clarifications — spec bc-ysp7

## Decision 1 — 2026-09-30 (≈19:12Z)

Verdict: changes requested

Changes: REQ-10 CONST-P6 baseline count wrong — the spec pinned the verified
baseline @ f2ab61e as "7 groups / 12 files"; the verified count under REQ-10's
own include-set is 19 files (8 desktop + 11 touch). Fix the spec, re-run the
machine gate, re-dispatch the factual leg, then re-present for approval.

Notes: The factual leg round 1 (bead bc-qa0j) had independently found the same
error (finding F-1, verdict fail). The spec (REQ-10, ACC-16) and
evidence.md were corrected to "19 files (8 desktop + 11 touch), files are the
only unit, no entity/group counting"; machine gates re-run green; factual leg
round 2 dispatched as bead bc-hi42 before re-presenting.
