<!--
  Конституция SDD — проектный слой bem-core (fork Realetive/bem-core, ветка v5).

  Слои: domain (~/.gc/constitution.domain.md) → project (этот файл) →
  user (~/.gc/constitution.md). Инъекция в порядке domain→project→user,
  приоритет полномочий user > project > domain.

  Клозы: `### CONST-P<n>: <утверждение>`. Машинные проверки — fenced-блоки
  ```sdd-check (bash из корня репо, exit 0 = OK); исполняются на spec-craft
  (pre-approve) и done-gate каждого конвоя. Проза — аттестация
  constitution-веткой ревью.

  Изменения в этот файл проходят PR — он и есть ревью архитектурных правил.
-->

# bem-core project constitution (v6 refactor)

### CONST-P1: No new consumers of the jquery wrapper — ratchet only in
Consumers of `common.blocks/jquery` may only be removed, never added. The
allowlist below shrinks slice by slice; shrinking it is part of each
migration slice's done-criteria. Touching this allowlist in a PR requires
that PR to be a migration slice (or a fix of this check).

The ratchet is **bidirectional** (S0 amendment): additions fail AND stale
allowlist entries whose files no longer match reality fail (forgotten shrinks
surface in the slice that migrated the consumer, not at S6). The runnable
artifact is `specs/check-jquery-ratchet.sh` (CI): the bidirectional ratchet
above plus the final multi-grep predicate — import-form patterns only
(`from 'jquery'`, `import 'jquery'`, `require('jquery')`, `'jquery'` entries
in `.deps.js`, shim-map keys, optimizeDeps/config lists; include-set =
sources + `test/` + build configs; excludes `*.md`, `.git`, `node_modules`,
`dist`) in skip/preview mode while (allowlist ≠ ∅) OR the wrapper block
exists OR package.json lists jquery; conclusive (binding) at S6's deletion
commit, never on allowlist emptiness alone.

```sdd-check
JQ=$(grep -rl 'jquery' --include='*.deps.js' . 2>/dev/null \
  | grep -v -E '(^|/)(node_modules|dist|\.git)/|(^|/)jquery/' \
  | sed 's|^\./||' | LC_ALL=C sort)
ALLOW="common.blocks/i-bem-dom/__events/_type/i-bem-dom__events_type_bem.deps.js
common.blocks/i-bem-dom/__events/_type/i-bem-dom__events_type_dom.deps.js
common.blocks/i-bem-dom/__events/i-bem-dom__events.deps.js
common.blocks/i-bem-dom/__init/_auto/i-bem-dom__init_auto.deps.js
common.blocks/i-bem-dom/i-bem-dom.deps.js
common.blocks/i-bem-dom/i-bem-dom.tests/benchmarks.blocks/page/page.deps.js
common.blocks/idle/idle.deps.js"
BAD=$(printf '%s\n' "$JQ" | LC_ALL=C comm -23 - <(printf '%s\n' "$ALLOW" | LC_ALL=C sort))
STALE=$(printf '%s\n' "$ALLOW" | LC_ALL=C comm -13 - <(printf '%s\n' "$JQ" | LC_ALL=C sort))
[ -z "$BAD" ] || { echo "new jquery consumers: $BAD"; exit 1; }
[ -z "$STALE" ] || { echo "stale allowlist entries (forgotten shrinks): $STALE"; exit 1; }
```

### CONST-P2: ESM-first — new code uses import/export
The package is `"type": "module"` with an export map; new modules in
`common.blocks/` use ESM imports/exports only (no new UMD/CommonJS).
Legacy files convert as their slices touch them.

### CONST-P3: Platform layers are override-only
`desktop.blocks/` and `touch.blocks/` may only override/refine
`common.blocks/` — no logic duplication; shared behaviour lives in common.

### CONST-P4: Public API surface shrinks only with documented migration
Public API of `i-bem`, `i-bem-dom`, `events` may only change or shrink
inside a slice whose spec documents the migration for consumers
(cf. upstream MIGRATION.md culture; keep updating MIGRATION.md per slice).

### CONST-P7: Exploration budget — act, don't just read
Agents working on implementation tasks MUST start writing code within a
bounded exploration phase. Maximum 8 read-only tool calls (read, grep, glob)
before the first write. If more context is needed after writing has started,
read only the specific file being edited. Infinite exploration without
code generation is a failure mode, not thoroughness.

```sdd-check
# Heuristic: if the session's tool log shows >12 consecutive read-only
# calls with zero writes, flag it (manual review, not auto-block)
true
```

### CONST-P5: Hard fork anchored at tag v5-base
This fork diverges globally; tag `v5-base` is the comparison point for
"before/after". Upstream advisories are reviewed manually; merges from
upstream are not expected after the first architecture slice. Keep
LICENSE.txt and file-level MPL notices intact. The notice-bearing file list
is recorded as a checked-in baseline (`specs/mpl-notices-baseline.txt`,
S0); S6's done-gate asserts every surviving baseline file still carries its
MPL notice plus `LICENSE.txt` existing.

```sdd-check
test -f LICENSE.txt
```

### CONST-P6: Platform layers are override-only by construction
Every file in a platform level (`desktop.blocks/`, `touch.blocks/`) — JS,
`.deps.js`, bemhtml/bh templates, CSS — must have a `common.blocks` ancestor
at the same relative path, or be pinned in the shrinking baseline
(`specs/platform-baseline.txt`). Include-set: extensions
`{.js, .deps.js, .bemhtml.js, .bh.js, .css}` under `desktop.blocks/` /
`touch.blocks/`, excluding `*.bemjson.js` fixtures and `*.examples/`
directories. The check is a two-directional ratchet: additions fail (a
standalone file without a baseline amendment) and forgotten shrinks fail (a
baseline entry whose file no longer exists). Redefinition chains are
additionally validated at build time: a chain entry at index ≥ 1 must be
transformer-form `export default function(prev)` — `vite-plugin-bem-levels`
hard-errors, naming both files.

```sdd-check
bash specs/check-platform-baseline.sh
```
