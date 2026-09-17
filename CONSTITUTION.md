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

```sdd-check
JQ=$(grep -rl 'jquery' --include='*.deps.js' . 2>/dev/null \
  | grep -v -E '(^|/)(node_modules|dist|\.git)/|(^|/)jquery/' \
  | sed 's|^\./||' | LC_ALL=C sort)
ALLOW="common.blocks/dom/dom.deps.js
common.blocks/i-bem-dom/__events/_type/i-bem-dom__events_type_bem.deps.js
common.blocks/i-bem-dom/__events/_type/i-bem-dom__events_type_dom.deps.js
common.blocks/i-bem-dom/__events/i-bem-dom__events.deps.js
common.blocks/i-bem-dom/__init/_auto/i-bem-dom__init_auto.deps.js
common.blocks/i-bem-dom/i-bem-dom.deps.js
common.blocks/i-bem-dom/i-bem-dom.tests/benchmarks.blocks/page/page.deps.js
common.blocks/idle/idle.deps.js
touch.blocks/ua/ua.deps.js"
BAD=$(printf '%s\n' "$JQ" | LC_ALL=C comm -23 - <(printf '%s\n' "$ALLOW" | LC_ALL=C sort))
[ -z "$BAD" ] || { echo "new jquery consumers: $BAD"; exit 1; }
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

### CONST-P5: Hard fork anchored at tag v5-base
This fork diverges globally; tag `v5-base` is the comparison point for
"before/after". Upstream advisories are reviewed manually; merges from
upstream are not expected after the first architecture slice. Keep
LICENSE.txt and file-level MPL notices intact.

```sdd-check
test -f LICENSE.txt
```
