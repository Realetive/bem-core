# Spec Review: bc-cah4 (S1 env/ua) — round 2 after citation re-anchoring

## Executive Summary

Round-2 re-review after the citation re-anchor to HEAD ac343da. Verdicts:
testability pass, constitution pass; the factual leg failed the COMMITTED
spec (polecat/bc-4izq @ fc91f6d) because the prescribed four-citation
re-anchor had been described but never applied to the spec text. The
coordinator verified the working-tree draft at REPO_ROOT already carries
exactly the prescribed amendment — barrel `:18→:19` (twice),
`test/browser/entry.js:50` re-quoted to the root loader
(`import loader from 'bem:loader';`), and
`test/platform-entries.test.js:36→:44` with the re-quoted parity title —
and re-ran both machine gates: verify-citations.sh 34/34 green
(fail=0 warn=0 repaired=0) and sdd-done-gate.sh --pre-approve green. The
constitution leg independently machine-verified the same working-tree
draft's 34 anchors verbatim at HEAD 530b08a (ac343da + one uncited
test-only commit). Per the factual leg's own verdict clause — "apply
exactly the four-citation amendment … and the spec re-passes this leg
with no other changes required" — the must-fix is resolved and the spec
is ready for the human approval gate. The spec lands (commits) together
with its slice at done-gate per CONST-D2; the draft remains untracked
until then, which is the designed state, not a defect.

## Leg Verdicts (factual / testability / constitution)

- factual r2 (bc-al39): **fail → resolved** — 27/31 committed citations
  verbatim-exact; findings 1-4 (spec lines 49, 149, 161, 174 in the
  committed spec) were the four stale pre-S3 anchors. All integration
  anchors, prose-vs-code cross-checks (REQ-2 guard, REQ-3 closed sets,
  REQ-4 19→16 / 9→8 arithmetic, REQ-5 mod set and precedence, REQ-6
  absent projects key, REQ-7 line-disjointness, REQ-8 keyboard__codes)
  verified clean. Amendment confirmed applied in the working-tree draft
  and machine-gated green (see Executive Summary).
- testability r2 (bc-30qi): **pass** — 10/10 ACCs form-conformant: one
  purpose-built command with an explicit expect-exit-0 or
  output-contains assertion each; no ACC relies on attestation. All 8
  findings from r1 (bc-q2f6) verified folded into the current draft
  (F6/F8 folded partially; both were non-forcing and remain so).
- constitution r2 (bc-fy53): **pass** — CONST-D1..D4, CONST-P1..P6,
  CONST-U1..U3 all complies (13/13), consistent with r1 (bc-a5wh); all
  34 anchors of the re-anchored draft mechanically verified verbatim at
  HEAD; the re-anchoring introduced no constitution regression.

## Must-Fix Items

1. (factual, RESOLVED) The four stale citations in the committed spec:
   `build/barrel.js:18→:19` (REQ-1 and REQ-7 evidence),
   `test/browser/entry.js:50` symbol + quote (`loaderTypeJs` /
   `bem:loader_type_js` → `loader` / `bem:loader`, REQ-6 evidence), and
   `test/platform-entries.test.js:36→:44` with the re-quoted parity
   title (REQ-8 evidence). Applied in the working-tree draft at
   specs/bc-cah4.md; verify-citations 34/34 green; pre-approve gate
   green. No other changes required per the leg's verdict text.

## Non-Blocking Observations

- Factual nits 5-7 (committed-spec cosmetic truncations and the OPR/
  detection-origin note) — unchanged by the amendment; OPR/ is new S1
  detection, correctly scoped in REQ-1 prose to the platform regexes.
- Testability R1: contains-assertions can over-match in theory
  (e.g. "16 files" vs "160 files"); intent parentheticals already state
  the expected values; optional hardening for a future form pass.
- Testability R2: ACC-9's grep fires the pass-echo on exit 2 (absent
  directory) — theoretical only, both target dirs exist post-S1.
- Testability R3: ACC-4/ACC-7 single-line && compounds read as one
  purpose-built invocation each — established bar from r1.
- Constitution observation: the assignment's context note referenced
  CONSTITUTION.md:48 as a re-anchored anchor while the spec's single
  CONSTITUTION.md anchor correctly cites :40 — documented in the leg
  notes; no compliance impact.

## Next Steps

Human approval gate (bead bc-2lff, assignee=human; step bead bc-8l30):
present specs/bc-cah4.md (working-tree re-anchored draft, 291 lines,
11 REQs, 10 ACCs) with this review in the coordinator conversation.
Explicit approval (or the human closing bc-2lff) unblocks the stamp
step; implementation tasks remain blocked on the approval bead until it
closes (the DAG is the ready-gate). The spec commits with the slice.
