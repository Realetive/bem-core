# Scope — spec-craft RID bc-ysp7 (slice S0, task bead bc-gdk9)

## Goal

The fork's toolchain is modern (Vite 8, ESM sources) but the library architecture is
still the 2016 design — a jQuery wrapper as DOM substrate behind a 9-entry CONST-P1
ratchet, unenforced platform-layer boundaries, and no machine-checkable public-API
contract. S0 is the first strangler slice: it lands the verification fence (bundle
gate, constitution predicates, doc fence, entry generation) and the public contracts
(barrel, exports map, API pin) that every later slice's done-gate depends on, with
zero behavior change to library code and the series' MIGRATION ledger opened
bilingually.

## Plan artifacts loaded

- Design: `.designs/arch-overhaul/design-doc.md` (PLAN_ID=arch-overhaul; slice table
  S0 row, KC 8–13, Implementation Plan, D-6/D-8/D-12; prd-align 1–3 + plan-review 1–3
  applied)
- PRD: `.prd-reviews/arch-overhaul/prd-draft.md` (goals G1–G7, human answers Q1–Q10)
- Bead DAG: `.plan-reviews/arch-overhaul/beads-created.md`
- Convoy `bc-ysp7` ("input convoy for bc-gdk9"): children = **bc-gdk9** (S0, P1).
  Series context (not this spec's task beads): bc-4izq S1, bc-ogif S2, bc-ilml S3,
  bc-mrsq S4, bc-szuu S5, bc-vuju S6; DAG S0→{S1,S2,S3}, S2→S4→S5→S6, {S1,S3}→S6.

## Task slices → REQ candidates (from bc-gdk9 description; budget 10–11)

| # | Slice (one line) | REQ candidate |
|---|---|---|
| 1 | Verify tag `v5-base` = 7a9e932 on origin; create annotated tag only if absent (Q1) | REQ: v5-base anchor verification |
| 2 | Pinned deep-import inventory (design "Supported deep-import inventory") + api-pin test making CONST-P4 mechanically enforceable, incl. D-6 deleted-path negative tests | REQ: API inventory + pin test |
| 3 | Exports-map narrowing D-6: `"./*"` → `"./common.blocks/*"` + enumerated entries; root `.` = `dist/index.mjs`; payloads `./dist/{desktop,touch}`; MIGRATION cell carries root-export migration line AND exports-narrowing line | REQ: exports-map narrowing (documented break) |
| 4 | Named-export barrel v1 from existing modules (bemDom, BemDomCollection, dom, Emitter, Event, channels; plain names, D-7) | REQ: barrel v1 (may merge with 3 → one exports/REQ cluster) |
| 5 | Bundle gate KC 10: `specs/bundle-budget.json` (gz caps measured+10%; capped artifacts enumerated at spec-craft — both payloads AND `dist/index.mjs` unless rationale recorded) + `build/check-bundle-size.mjs`; ratchet semantics; per-slice binding = gz caps + CONST-P1 allowlist ratchet + CONST-P6 baseline ratchet, all two-directional; final assertions (no-jquery-in-artifact, jquery peer/dev removal) activate at S6 keyed on wrapper existence + package.json cleanliness, never allowlist emptiness; guard short-circuits to skip/preview exit 0 while (allowlist ≠ ∅) OR wrapper exists OR package.json lists jquery | REQ: bundle-budget gate + staged guard |
| 6 | Staged-gate meta-test (plan-review-3 must-fix): fixture repo trees — skip-state → exit 0 + preview; bind-state-clean → exit 0 + binding; bind-state-dirty (planted jquery import / artifact byte) → exit 1; + bidirectional-ratchet red fixture (allowlist entry no longer matching reality → exit 1); `check-bundle-size.mjs` and doc fence carry the same first-landing red proof | REQ: staged-gate meta-test (guard proof) |
| 7 | Platform entry generation KC 8: entries generated from plugin scan registry, committed `build/platforms/*.gen.js`, canonical sorted imports (sound via static `bem:` edges, verified @ f2ab61e); CI re-runs generator + diffs (freshness); hand lists `build/platforms/{desktop,touch}.js` deleted in-slice; payload-parity assertion vs checked-in pre-S0 lists incl. `keyboard__codes` (silent drop forbidden, OQ-6) | REQ: generated platform entries + payload parity |
| 8 | Plugin transformer-form hard error KC 9: buildRegistry/generateBarrel error when chain index ≥1 not `export default function(prev)`; live in S0; plugin + existing test corpus = verifier | REQ: transformer-form validation |
| 9 | Timeboxed dynamic-import spike: `import(variable)` through dev-server test config + lib build; record Vite 8/rolldown behavior into a dated decision-record section of the S0 spec (cited by S3); smoke: generated entry resolves through both build paths; one narrowed deep-import fails to resolve through the dev-server test config (Vite half of the exports tripwire) or Node-only scope recorded as the deliberate bound | REQ: dynamic-import spike (decision record) |
| 10 | `test/dist/` purge: checked-in build-fixture output deleted + `.gitignore` entry; fixtures regenerate via `test/dist/build-fixtures.js` | REQ: test-dist purge |
| 11 | CONST-P6 skeleton KC 13: ancestor-existence check; verified baseline @ f2ab61e = 7 standalone module groups (12 files); include-set extensions {.js,.deps.js,.bemhtml.js,.bh.js,.css} under desktop.blocks//touch.blocks/, excluding `*.bemjson.js` fixtures and `*.examples/`; baseline authored with its baseline file as comparison substrate; rides S0 PR as constitution amendment (const-header process) | REQ: CONST-P6 check + baseline |
| 12 | Constitution amendments (same S0 PR): CONST-P1 final multi-grep predicate (import-form patterns only: `from 'jquery'`, `import 'jquery'`, `require('jquery')`, `'jquery'` in `.deps.js`, shim-map keys, optimizeDeps; include sources + test/ + build/; exclude *.md, .git, node_modules, dist; skip/preview until conjuncts achievable, conclusive S6); CONST-P1 sdd-check made bidirectional (comm both directions) + direction-2 red fixture + scripted per-slice allowlist pins | REQ: constitution amendments (merge with 11 → one amendment REQ cluster) |
| 13 | Doc-parity fence: en↔ru anchor-count equality on `^#{2,3} ` headings; file-set = MIGRATION(.ru) + CHANGELOG(.ru) pairs per commit; whether it extends to block-doc pairs ratified at this spec-craft | REQ: doc-parity fence |
| 14 | MPL notices baseline (CONST-P5): record notice-bearing file list as checked-in baseline (S6 asserts survivors via `grep -L 'MPL'` = ∅ + LICENSE.txt exists) | REQ: notices baseline (small; may fold into 11/12) |
| 15 | `repository.url` fix in package.json (Q9); inherit freeze recorded (Q4-a: zero code change; `bem.entities` mutation recorded as internal, OQ-7) | REQ: repo metadata + inherit freeze record (small; may fold) |

REQ-count guidance: merge candidates are (3+4), (11+12+14), (15 into 3-cluster or
standalone), targeting the 10–11 budget; overflow >12 → pre-authorized split S0a
(fence + contracts: barrel, pin, exports narrowing, gates, doc fence, constitution
amendments) before S0b (generation + plugin transformer-form tooling) — both before
the S1/S2/S3 fan-out (plan-review-2 F7).

Every slice of bc-gdk9's description maps to ≥1 REQ candidate above; later series
slices (S1–S6) are NOT this spec's scope — their needs appear only as S0 artifacts
they consume (gates, barrel, pin, generation, decision record).

## Constitution clauses applicable per REQ cluster

- **CONST-D1** (approved spec precedes implementation): governs the whole convoy —
  spec must be approved before mutating work; evidence-gathering is read-only.
- **CONST-D2** (spec at `specs/<convoy-bead-id>.md`, committed with code): the S0
  spec lands at `specs/bc-ysp7.md` (RID = convoy id) — spec + code in the same PR.
- **CONST-D3** (evidence anchored `file:line-range` + verbatim quote): every REQ's
  evidence in harvest-evidence must cite anchored code.
- **CONST-D4** (no secrets in specs/artifacts; machine check greps specs/): applies
  to all artifacts (`specs/bundle-budget.json`, spec text).
- **CONST-P1** (jquery ratchet; S0: final predicate added, sdd-check made
  bidirectional; allowlist Δ = none this slice): REQs 5, 6, 12.
- **CONST-P2** (ESM-first; no new UMD/CJS): REQs 4, 7, 8 (barrel, *.gen.js,
  check scripts — all ESM).
- **CONST-P3** (platform override-only — S0 makes it machine-checked): REQs 11, 12.
- **CONST-P4** (public API shrinks only with documented migration): REQs 2, 3, 4 —
  root-export repurpose + exports narrowing are enumerated breaks; MIGRATION cell
  in the same slice.
- **CONST-P5** (hard fork @ v5-base; LICENSE + MPL notices intact): REQs 1, 14.
- **CONST-U1** (decisions durable): REQ 9 spike decision record; OQ dispositions
  (OQ-2/5/6/7/9/11) recorded in the spec, not chat.
- **CONST-U2** (never force-push shared branches): implementation-phase git work
  (tag creation, slice PRs) — append-only history.
- **CONST-U3** (spec first on divergence): governs the whole series.

## Constraints and non-goals carried over from the plan

Constraints:
- C2 strangler discipline: ≤12 REQ per slice; S0 leaves `v5` buildable, lint/unit/
  browser green; overflow split S0a/S0b pre-authorized (F7), nowhere else.
- C3 machine-checkable done-criteria (sdd-check style) — S0's output is largely the
  machinery that makes this true series-wide.
- C4 behavior parity by default; the only S0 observable breaks are the two
  enumerated export-surface lines (root repurpose + narrowing), both carried in the
  MIGRATION cell.
- C5 Node ≥20 / evergreen only; Node CI matrix unchanged ([20,22] stays).
- CI wiring: extend `.github/workflows/ci.yml` in place, no new jobs — bundle gate,
  api-pin, CONST-P6 baseline check, CONST-P1 final predicate (skip/preview),
  bidirectional sdd-check, doc fence appended to existing build/test jobs.
- MIGRATION ledger discipline: one `### S0 <title>` section bilingual (en+ru) in the
  same commit; CHANGELOG(.ru) under `## Unreleased`.
- Ratchets are two-directional from S0 (additions AND forgotten shrinks fail);
  each slice's done-gate runs a scripted allowlist/baseline pin.
- Revert protocol (F8): gates re-key off git-tracked state; stack reverts only.

Non-goals (carried over; S0 must not creep):
- No tree-shaking beyond the plugin story; US1 scoped to "no jQuery in bundle".
- No TypeScript, no new blocks/public API additions in S0 (env is S1; barrel v1
  re-exports existing modules only).
- No template/BEMJSON redesign; no upstream re-sync (hard fork per CONST-P5).
- `inherit` frozen (Q4-a) — zero code change in S0 and the whole series.
- `keyboard` internals Non-Goal-frozen — `keyboard__codes` must survive generation
  verbatim (OQ-6), fate decisions belong to a future convoy.
- No `.deps.js` schema lint (cut plan-review-2 SC-1); entity-converter unification
  deferred to S6 ride-along (SC-2); no bench work in S0 (project lands S2).
- Scope of this spec-craft run: slice S0 only (convoy bc-ysp7 / bead bc-gdk9).

## Spec-craft decision points to ratify (from bc-gdk9 Notes)

- OQ-2: final caps stay in `specs/bundle-budget.json` + CI vs promoted to a
  constitution sdd-check at S6 (working position: JSON + CI).
- OQ-5: shim-map ratchet home (working position: plugin-test assertion).
- OQ-6: `keyboard__codes` payload-parity mechanics (generation must reproduce it).
- OQ-7: `inherit.self`/`bem.entities` pin test records the mutation as internal.
- OQ-9: barrel naming `dist/index.mjs` + `./dist/{desktop,touch}` (working position:
  as written).
- OQ-11: registration-accounting ledger mechanics (ledger home, loose-floor
  definition, update owner) — decided here, policy lands in S2's harness commit.
- Doc fence: whether file-set extends to block-doc en↔ru pairs (ratify here).
- Bundle caps enumeration: both payloads AND `dist/index.mjs` unless rationale
  recorded (ratify here).
