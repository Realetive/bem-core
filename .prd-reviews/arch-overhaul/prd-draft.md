# PRD: bem-core v5 architecture overhaul — ESM-first core, jquery-free DOM layer, override-only platforms

## Problem Statement

The fork (Realetive/bem-core, branch v5, comparison point tag `v5-base`) has already
modernized its toolchain (Vite 8, Node 24, ESLint 10, Playwright, ESM sources — see
PLAN.md, landed). The **library architecture** is still the 2016 design:

- **jQuery wrapper** (`common.blocks/jquery`) is the DOM substrate for the whole
  `i-bem-dom` layer. jQuery 4 is a 30+ kB dependency used internally as a Swiss-army
  knife (selectors, events, ajax-free DOM ops). Production source imports it in
  exactly one file (the wrapper), but 9 `.deps.js` consumers are frozen by the
  CONST-P1 ratchet: `dom`, `i-bem-dom` (+ its `__events`, `__events_type_bem`,
  `__events_type_dom`, `__init_auto` deps), `idle`, `touch.blocks/ua`, and one
  benchmark page.
- **`ua` block** is user-agent sniffing with platform forks (`desktop.blocks/ua`,
  `touch.blocks/ua`) — fragile against modern browsers, wrong abstraction for the
  actual questions asked ("is touch input possible?", "which pointer events?").
- **`loader_type_js`** hand-rolls script injection + global callbacks; ESM dynamic
  `import()` and `link rel=modulepreload` supersede it. `loader_type_bundle`
  (ym bundle loader) may be dead weight in an ESM world.
- **`inherit`** (121-line classical-OOP helper) predates native classes. A decision
  is required: keep, wrap, or migrate `i-bem`'s declarative `mods`/`onSetMods` class
  model onto native `class` syntax internally.
- **`i-bem-dom`** is a 1220-line monolith mixing: live-range DOM collection
  management, pointerevent normalization, event delegation (`__events`),
  init/autobind lifecycle, and DOM api surface.
- **Platform layers** (`desktop.blocks/`, `touch.blocks/`) mix true overrides
  (ua, jquery config) with standalone logic; CONST-P3 mandates override-only but
  nothing enforces or documents the boundary.

Goal: a target architecture and a strangler-pattern slice plan (periphery → core,
~6–8 slices, each ≤12 requirements) that lands the overhaul incrementally, with the
CONST-P1 allowlist shrinking to zero jquery consumers by the final slice.

## Goals

1. **G1 — Zero internal jQuery.** Every one of the 9 frozen consumers migrates off
   the jquery wrapper; allowlist shrinks slice by slice and reaches zero; the
   wrapper block is deleted (or quarantined as an optional compat shim behind a
   documented escape hatch — open question).
2. **G2 — `ua` → environment detection.** Replace UA sniffing with
   capability/feature detection where feasible (`env`-style module: input modality,
   pointer events, passive listeners support, RTL…), preserving the few legitimate
   UA-driven branches with documented justification and tests.
3. **G3 — Loader on native ESM.** `loader_type_js` semantics (async script load,
   error reporting, timeout) provided via `import()`-based implementation;
   `loader_type_bundle` either reimplemented on dynamic import or removed with a
   documented migration.
4. **G4 — `inherit` decision made and executed.** Either (a) keep `inherit` as an
   internal implementation detail forever, (b) reimplement it on native classes
   preserving the declarative BEM class API (`decl`, `declMod`, static `onSetMods`
   semantics), or (c) expose native-class authoring alongside. Decision documented
   in the design doc with rationale + migration story for library users.
5. **G5 — `i-bem-dom` decomposed.** The monolith split into cohesive internal
   modules (live collection/ranges, event delegation, pointerevent normalization,
   init lifecycle) with explicit public surface; internal structure invisible to
   consumers (CONST-P4).
6. **G6 — Platform layers override-only in practice.** Every desktop.blocks /
   touch.blocks file is an override/refinement of common; shared behaviour lives in
   common; the boundary is checked (lint/rule) and documented.
7. **G7 — Each slice is shippable.** ~6–8 strangler slices, each ≤12 requirements,
   each independently mergeable, each updating MIGRATION.md and shrinking the
   CONST-P1 allowlist where applicable.

## Non-Goals

- No redesign of the BEMJSON/BEMHTML templating story (bem-xjst, BH) beyond what
  the loader/ESM work forces.
- No new features, blocks, or public API additions.
- No TypeScript rewrite (types may be explored in a later convoy).
- No bundler/CI changes beyond what architectural slices require.
- No upstream re-sync — hard fork per CONST-P5; advisories reviewed manually.
- No changes to `i18n`, `uri`, `strings`, `functions`, `objects`, `next-tick`,
  `tick`, `identify`, `keyboard`, `cookie`, `idle` internals beyond removing their
  jquery dependency (idle) and incidental ESM cleanups.
- No implementation code in this convoy — design + slice plan + bead DAG only.

## User Stories / Scenarios

- **US1 — Library consumer on modern stack:** "I `import { BemDom } from
  'bem-core'` in a Vite app; my bundle contains no jQuery; tree-shaking works;
  nothing regresses vs v5-base behavior."
- **US2 — Frozen-consumer maintainer (internal):** "My block (e.g. `dom`) now uses
  the native DOM/event API or the new env module; the CONST-P1 check no longer
  lists it; tests (Playwright) stay green."
- **US3 — Platform contributor:** "I add a touch-specific override; CI rejects any
  file in touch.blocks that doesn't correspond to a common.blocks ancestor; docs
  tell me where shared behaviour goes."
- **US4 — Slicing engineer (agent or human):** "I pick up slice N from the bead DAG;
  its spec has ≤12 requirements, explicit deps on earlier slices, done-criteria
  including MIGRATION.md notes; I can verify completion mechanically."
- **US5 — Architect/reviewer:** "I can diff behavior before/after against tag
  `v5-base` (CONST-P5) using the documented per-slice verification, including the
  9 frozen consumers' scenarios."
- **US6 — Legacy loader user:** "My runtime code that did
  `loader_type_js.get(url)` keeps working via the new implementation, or follows a
  documented one-line migration to `import()`."

## Constraints

- **C1 — CONSTITUTION.md is law:** CONST-P1 ratchet (allowlist only shrinks),
  CONST-P2 ESM-first (no new UMD/CJS), CONST-P3 platform override-only, CONST-P4
  public API shrinks only with documented migration, CONST-P5 hard fork at
  `v5-base` (MPL-2.0 notices intact).
- **C2 — Strangler discipline:** periphery-first, ~6–8 slices, ≤12 REQ each; no
  big-bang rewrite; every slice leaves `main` buildable and tests green.
- **C3 — Each slice's spec must carry machine-checkable done-criteria where
  possible (sdd-check style), like the CONST-P1 grep check.
- **C4 — Behavior parity by default:** observable behavior at the public API
  matches v5-base unless a slice's spec documents a migration (CONST-P4).
- **C5 — Node ≥20 / modern evergreen browsers only (already the engines field);
  no IE/legacy-browser polyfills in core.
- **C6 — Vision-only convoy:** no implementation code lands from this planning run;
  output is PRD → design doc → slice beads DAG.

## Open Questions

1. **jQuery escape hatch:** when the allowlist reaches zero, does the wrapper get
   deleted outright, or shipped as optional `bem-core/compat-jquery` for external
   consumers (peer dep jquery ^4 today) with an end-of-life date?
2. **`ua` API shape:** new `env` block as a separate module with `ua` as a thin
   deprecated alias, or in-place reimplementation keeping the `ua` export name?
   What exactly do real consumers read from `ua` today (ua.msie etc.)?
3. **Pointerevent normalization ownership:** currently spread across jquery
   `__event_type_*` redefs and i-bem-dom — after jquery removal, where does it
   live (dedicated internal module? part of `__events`?) and does it remain public?
4. **`inherit`:** native-class reimplementation risk vs. keeping it frozen. If
   reimplemented, do we keep `decl`/`declMod` sugar or move to a new authoring
   API (breaking, needs CONST-P4 migration doc)?
5. **`i-bem-dom__init` dynamic redefinition:** build-time barrel scanning replaced
   the ym monkey-patch — is that the final architecture, or should init become an
   explicit registry API?
6. **`loader_type_bundle`:** any real consumers left after ym removal? Delete or
   reimplement on dynamic import?
7. **`dom` block fate:** with jquery gone, does the tiny `dom` utility (111 lines)
   merge into `i-bem-dom` internals or stay public?
8. **Public API surface:** exact inventory of what v5-base exports publicly
   (dist entry `dist/desktop/bem-core.mjs`) — needed to police CONST-P4; where is
   it documented/tested?
9. **Benchmark page dependency on jquery deps:** does the benchmarks suite
   (i-bem-dom.tests/benchmarks.blocks) migrate or get deleted as pre-Vite relic?

## Rough Approach

Strangler order periphery → core (each = one slice convoy / bead cluster):

1. **Slice: env/ua** — capability-based env module; ua consumers migrate; platform
   ua forks collapse into common + override-only deltas.
2. **Slice: jquery periphery 1** — `dom`, `idle`, benchmark page off jquery
   (native DOM ops), allowlist shrinks by ~3 entries.
3. **Slice: loader** — `loader_type_js` on `import()`; decide `loader_type_bundle`.
4. **Slice: pointerevent normalization** — extract jquery `__event_type_*` redefs
   into a native normalization module; i-bem-dom consumes it.
5. **Slice: i-bem-dom events off jquery** — `__events` (bem/dom delegation) on
   native addEventListener + delegation engine; allowlist shrinks again.
6. **Slice: inherit decision executed** — per G4 outcome.
7. **Slice: i-bem-dom decomposition** — split monolith into internal modules,
   init registry; public surface frozen/pinned by API tests.
8. **Slice: platform cleanup + wrapper removal** — desktop/touch verified
   override-only with a lint rule; jquery wrapper deleted or quarantined;
   allowlist = ∅; MIGRATION.md finalized.

Design-exploration legs must validate/refute this ordering (e.g., whether events
extraction must precede pointerevents, whether inherit rework should come earlier).

## Clarifications from Human Review

Human decision on all 10 PRD questions (final; recorded 2026-09-18):

**Q1: v5-base anchor?**
A: Tag `v5-base` exists on origin at `7a9e932` (clean upstream snapshot BEFORE the
constitution commit — the exact divergence point; the review's "tag missing" came
from a stale clone). Use 7a9e932, not f2ab61e. Creation of the annotated tag +
public API inventory lives in slice-0.

**Q2: jQuery wrapper fate?**
A: Delete outright, no compat shim — hard fork, no known external consumers.
Document the removal in MIGRATION.md, including the `$(node).bem()` plugin and
the jquery peer-dep.

**Q3: Public API contract?**
A: Inventory goes into the design doc: root export `.`, deep-imports `./*`,
`./build/plugins/*`; public blocks: i-bem, i-bem-dom, events, dom, loader, ua/env.
DOM type contract = native `Element` / `Element[]`. Deep-imports stay public.

**Q4: inherit decision?**
A: Freeze `inherit` as an internal implementation detail (option a). Defer
native-class options to a named future phase.

**Q5: env API shape?**
A: Scope env strictly by the audited internal consumer inventory (touch `ua__dom`
platform modifiers; `ua.msie`/winresize legacy dies now). RTL / passive-listeners
/ input-modality wishlist goes to Non-Goals with the rule "added when a consumer
exists". Keep `ua` as a deprecated alias for one release. Explicit exception:
env IS a new public module.

**Q6: Benchmarks?**
A: Keep and migrate off jquery inside the jquery-removal slice — they are the
perf harness for the later i-bem-dom rework.

**Q7: loader_type_bundle?**
A: Delete, with a bilingual (en/ru) migration note (dead ym bundle format,
zero in-repo consumers).

**Q8: Verification matrix?**
A: Declare chromium-only + desktop-parity explicitly in Constraints (C4) NOW.
Additionally: add a minimal touch-device-emulated Playwright project as part of
slice 1 acceptance — slice 1 (touch ua work) must not ship unverifiable.

**Q9: Release & versioning?**
A: One `6.0.0` release at the end of the slice series (no intermediate
publishes; the fork has a single consumer). Releases are cut by the human.
Fix `repository.url` (still points at upstream bem/bem-core) in slice-0.

**Q10: BEM synthetic events architecture?**
A: Accept the pure-registry proposal (no `$.event.special`, walk entity
containment) as a design-exploration topic WITH the parity caveats: positional
trigger args, `flags.fns` dedup, cross-node propagation-stop.
