# Spec Review: bc-cah4 (S1 env/ua)

## Executive Summary

All three legs pass. The spec's 34 evidence citations were independently
re-derived as byte-verbatim (factual leg, worktree polecat/bc-4izq @
cdd5f75); every count claim (CONST-P1 9→8, CONST-P6 19→16, payload deltas
37→39 desktop / 37→38 touch, barrel 6→8 names) re-derives from today's
artifacts; all 10 ACCs are command-form conformant; all 13 constitution
clauses across the three layers attest complies. No must-fix items. Five
should-fix observations from the testability leg and the constitution leg's
baseline-comment nit were folded into the spec draft before the human gate
(listener-count reclassified as self-review attested; symbol-read no-warn
unit added; node-side SSR unit `test/env-ssr.test.js` added to REQ-10;
ua__dom parity mod set enumerated; doc-parity fence file set stated in
REQ-11; ACC-4/7 exit phrasing and ACC-9/10 assertion anchoring hardened;
standalone-list comment pinned as "touch ua__dom remains deps-only").
verify-citations: 34/34 green; sdd-done-gate --pre-approve green; spec is
289 lines, 11 REQs, 10 ACCs.

## Leg Verdicts (factual / testability / constitution)

- factual (bc-rbs6): **pass** — all citations verified; 3 cosmetic quote
  deviations noted (trailing semicolon, multiline-string rendering, JSON
  indent) that the citation gate itself accepts; env.browser detection
  forms documented as deliberate extension (F5).
- testability (bc-q2f6): **pass** — 10/10 ACCs form-conformant; every REQ
  maps to a checkable carrier; F1-F8 non-blocking, folded in as above.
- constitution (bc-a5wh): **pass** — CONST-D1..D4, CONST-P1..P6,
  CONST-U1..U3 all `complies`; both ratchet arithmetic recomputations match
  the spec (19→16 files, 9→8 entries); F1 (standalone-comment wording)
  folded in; F2 (desktop gains bem:ua__dom visibility with touch-only
  deps manifest) recorded as an accepted consequence; F3 notes the
  constitution file itself appears in the S1 diff — expected, the slice PR
  is the review vehicle.

## Must-Fix Items

None.

## Non-Blocking Observations

- env.browser opera/chrome detection is deliberately broader than the old
  touch fork (`OPR/`/`Chrome/` UA forms in addition to legacy
  `window.opera`/`CrMo/`) — documented in REQ-1, carried into MIGRATION.
- Post-S1 `bem:ua__dom` becomes desktop-visible via the generated entry;
  its `.deps.js` manifest stays touch-only (deps.js is a documented
  manifest, never a build input — zero mechanical effect).
- The alias's once-per-field warn will fire once on desktop pages still
  holding the frozen `winresize` consumer (`ua.msie` read) until S2
  deletes it — verified harmless.

## Next Steps

Human approval gate (bead bc-2lff, assignee=human): the spec at
specs/bc-cah4.md with this review is presented in the coordinator
conversation; explicit approval (or the human closing bc-2lff) unblocks
the stamp step, after which bc-4izq implements REQ-1..REQ-11 and runs the
done-gate (ACC-1..ACC-10 + sdd checks).
