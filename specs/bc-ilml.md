---
id: specs/bc-ilml.md
title: "S3 loader slice — implementation notes and decision record (arch-overhaul strangler slice 3)"
status: implemented
date: 2026-10-01
source: bead bc-ilml (slice table S3 row, design doc `.designs/arch-overhaul/design-doc.md`)
---

# Scope

`bem:loader` becomes the canonical root module (`common.blocks/loader/loader.js`):
`loader(url, success?, error?)` = dynamic `import()` + callback shim, returning the
module-namespace promise. The `_type` mod paths are deleted outright — no one-release
bridge (D-16): `loader_type_js` (superseded by the root module) and `loader_type_bundle`
(dead ym format, Q7). In-repo consumers were verified to be the generated platform
entries, the spec harness, and the api-pin inventory only — all switched mechanically in
this slice's commit.

# Decision record — 2026-10-01 (S3 implementation)

## Timeout: not implemented (deliberate)

The pre-series PRD's `G3` timeout requirement is stale — repo-verified: neither the ym-era
`loader_type_js` (script injection, no timer) nor any caller ever imposed a load timeout;
only the deleted `loader_type_bundle` carried a 30 s timer, and it dies with the format.
Adding a timeout now would be a new feature (Non-Goal for this slice). The one-line escape
hatch if ever needed: `Promise.race([import(url), timeout])` at the call site.

## Bundler behavior: cites the S0 spike decision record

The dynamic-import spike recorded in `specs/bc-ysp7.md` ("Decision record — 2026-10-01 …
dynamic-import spike + barrel verification bound") retired this slice's bundler unknown:
`import(variable)` passes through Vite 8/rolldown builds verbatim as a runtime dynamic
import — not pre-resolved, inlined, or warned. `loader(url) = import(url)` therefore
passes runtime URLs through a consumer's Vite build untouched, and static `bem:` import
edges (generated entries, barrel) resolve at build time as usual.

## CORS audit (plan-review-2 F3) — result: zero

Named grep over the loader call sites + spec fixtures + block docs
(`common.blocks/loader/**` and `test/browser/**`, `https?://` literals):

```
$ grep -rnoE "https?://[^'\" ]+" common.blocks/loader/ test/browser/
(no output — zero matches)
```

Zero absolute-URL literals: every loader call site and fixture is same-origin/relative.
The audit is pinned mechanically by `test/loader-closure.test.js` so a future
cross-origin call site cannot land silently. The `file:`-protocol prefix fix from the
old script-injection loader was dropped with it — Vite/Node resolve `file:` URLs
natively through `import()`.

## Semantics table (rows mirrored in MIGRATION → S3)

| Aspect | Old `loader_type_js` (script injection) | New `bem:loader` (`import()`) |
| --- | --- | --- |
| Module format | any classic script (side effects, globals) | ES modules only (JS MIME enforced) |
| Cross-origin | no CORS needed (script tag) | CORS required on the target |
| In-flight dedup / loaded-once | loader-owned `loading`/`loaded` maps | browser module map (native) |
| Return value | none | `Promise` → module namespace |
| `file:`-protocol prefix fix | applied (`http:` rewrite) | removed (native resolution) |
| Timeout | none | none (see decision above) |

## Closure predicate scope

`loader_type_js` / `loader_type_bundle` are deleted outright; the mechanical closure
check (`test/loader-closure.test.js`) asserts zero references outside the record-keepers:
MIGRATION(.ru) and CHANGELOG(.ru) (append-only history — MIGRATION's S3 cell *must* name
the old paths, that is the documented-migration half of D-16), `specs/` (frozen
historical artifacts), `PLAN.md` (frozen pre-migration plan), and the two mechanical
exceptions (the checker itself; the platform-parity divergence map that names what it
subtracts from the pre-S0 baseline).
