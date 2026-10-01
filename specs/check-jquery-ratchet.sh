#!/usr/bin/env bash
#
# CONST-P1 jquery ratchet (bidirectional) + final zero-jquery predicate
# (constitution, spec REQ-10 / KC 13).
#
# Part 1 — allowlist ratchet, binding since the clause exists:
#   JQ  = *.deps.js files referencing jquery (excluding node_modules/dist/.git
#         and the wrapper's own dirs) — must equal the CONSTITUTION.md ALLOW
#         list exactly. Additions fail; stale entries (forgotten shrinks) fail.
#
# Part 2 — final multi-grep predicate (import-form patterns only, so docs prose
#   can never redden it): `from 'jquery'`, `import 'jquery'`,
#   `require('jquery')`, quoted jquery entries in .deps.js, shim-map-style
#   object keys, quoted jquery anywhere in build/ configs (optimizeDeps /
#   external / globals lists). Include-set = sources + test/ + build/;
#   excludes *.md, .git, node_modules, dist, and the gate's own self-referential
#   files (this script's companion test/fixtures live outside the repo tree).
#   The predicate runs in skip/preview mode (preview output + exit 0) while
#   (allowlist non-empty) OR (common.blocks/jquery exists) OR (package.json
#   lists jquery); it binds otherwise — conclusive at S6's deletion commit,
#   never at allowlist-emptiness alone.
#
# Run from the repo root: bash specs/check-jquery-ratchet.sh  (exit 0 = OK)

set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

STATUS=0

# --- Part 1: bidirectional allowlist ratchet --------------------------------

JQ="$(grep -rl 'jquery' --include='*.deps.js' . 2>/dev/null \
    | grep -v -E '(^|/)(node_modules|dist|\.git)/|(^|/)jquery/' \
    | sed 's|^\./||' | LC_ALL=C sort)"

ALLOW="$(awk '
    /ALLOW="/ { inblock = 1 }
    inblock {
        line = $0
        sub(/^ALLOW="/, "", line)
        ended = sub(/"$/, "", line)
        if (line != "") print line
        if (ended) inblock = 0
    }
' CONSTITUTION.md | LC_ALL=C sort)"

if [ -z "$ALLOW" ]; then
    echo "CONST-P1: cannot parse the ALLOW list from CONSTITUTION.md"
    exit 1
fi

ADDED="$(printf '%s\n' "$JQ" | LC_ALL=C comm -23 - <(printf '%s\n' "$ALLOW"))"
if [ -n "$ADDED" ]; then
    echo "CONST-P1: new jquery consumers:"
    printf '%s\n' "$ADDED" | sed 's/^/  + /'
    STATUS=1
fi

STALE="$(printf '%s\n' "$ALLOW" | LC_ALL=C comm -13 - <(printf '%s\n' "$JQ"))"
if [ -n "$STALE" ]; then
    echo "CONST-P1: stale allowlist entries (forgotten shrinks):"
    printf '%s\n' "$STALE" | sed 's/^/  - /'
    STATUS=1
fi

echo "CONST-P1 allowlist: $(printf '%s\n' "$ALLOW" | grep -c .) entries, actual $(printf '%s\n' "$JQ" | grep -c .)"

# --- Part 2: final zero-jquery predicate (staged: skip/preview -> S6) -------

SELF_REFERENTIAL=(build/check-bundle-size.mjs test/gate-fixtures.test.js)

PREDICATE_ROOTS=(common.blocks desktop.blocks touch.blocks test build)

VIOLATIONS="$(
    find "${PREDICATE_ROOTS[@]}" -type f \
        \( -name '*.js' -o -name '*.mjs' -o -name '*.cjs' \) 2>/dev/null |
    LC_ALL=C sort |
    grep -v -F -f <(printf '%s\n' "${SELF_REFERENTIAL[@]}") |
    while IFS= read -r file; do
        # import-form patterns (docs prose can never match these)
        grep -nE "from[[:space:]]+['\"]jquery['\"]|import[[:space:]]+['\"]jquery['\"]|require\([[:space:]]*['\"]jquery['\"]" "$file" 2>/dev/null |
            sed "s|^|$file:|"
        # shim-map / globals key form
        grep -nE "^[[:space:]]*['\"]?jquery['\"]?[[:space:]]*:" "$file" 2>/dev/null |
            sed "s|^|$file:|"
        # quoted jquery entries in .deps.js manifests
        case "$file" in
            *.deps.js)
                grep -nF "jquery" "$file" 2>/dev/null | sed "s|^|$file:|"
                ;;
        esac
        # optimizeDeps / external / globals lists in build configs
        # (build/vite*.config.* — NOT plugin sources/tests, where 'jquery' is
        # scanned module-name data, not an import)
        case "$file" in
            build/vite*.config.*)
                grep -nE "['\"]jquery['\"]" "$file" 2>/dev/null | sed "s|^|$file:|"
                ;;
        esac
    done
)"

ALLOWLIST_NONEMPTY=$(printf '%s\n' "$ALLOW" | grep -c .)
WRAPPER_EXISTS=0
[ -d common.blocks/jquery ] && WRAPPER_EXISTS=1
PKG_LISTS_JQUERY=0
if grep -q '"jquery"' package.json 2>/dev/null; then
    PKG_LISTS_JQUERY=1
fi

VIOLATION_COUNT=$(printf '%s\n' "$VIOLATIONS" | grep -c . || true)

if [ "$ALLOWLIST_NONEMPTY" -gt 0 ] || [ "$WRAPPER_EXISTS" -eq 1 ] || [ "$PKG_LISTS_JQUERY" -eq 1 ]; then
    echo "CONST-P1 final predicate: SKIP/PREVIEW (allowlist=$ALLOWLIST_NONEMPTY entries, wrapper=$WRAPPER_EXISTS, package.json-jquery=$PKG_LISTS_JQUERY) — binding at S6"
    echo "CONST-P1 final predicate preview: $VIOLATION_COUNT import-form violations currently expected:"
    printf '%s\n' "$VIOLATIONS" | grep . | sed 's/^/    /'
else
    echo "CONST-P1 final predicate: BINDING (allowlist empty, wrapper gone, package.json clean)"
    if [ "$VIOLATION_COUNT" -gt 0 ]; then
        echo "CONST-P1 final predicate violations:"
        printf '%s\n' "$VIOLATIONS" | grep . | sed 's/^/  ! /'
        STATUS=1
    else
        echo "CONST-P1 final predicate: clean"
    fi
fi

exit $STATUS
