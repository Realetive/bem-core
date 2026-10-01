#!/usr/bin/env bash
#
# CONST-P6 ancestor-existence check (constitution skeleton, spec REQ-10).
#
# Include-set: {.js, .deps.js, .bemhtml.js, .bh.js, .css} under desktop.blocks/
# and touch.blocks/, excluding *.bemjson.js fixtures and *.examples/ dirs.
# The scanned set must match specs/platform-baseline.txt exactly —
# two-directional ratchet:
#   - a platform file without a baseline entry (addition; standalone files need
#     a common.blocks ancestor or an explicit baseline amendment) fails;
#   - a baseline entry whose file no longer exists (forgotten shrink) fails.
#
# Run from the repo root: bash specs/check-platform-baseline.sh  (exit 0 = OK)

set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASELINE="$ROOT/specs/platform-baseline.txt"

ACTUAL="$(
    cd "$ROOT" &&
    find desktop.blocks touch.blocks -type f \
        ! -name '*.bemjson.js' \
        \( -name '*.js' -o -name '*.deps.js' -o -name '*.bemhtml.js' \
           -o -name '*.bh.js' -o -name '*.css' \) 2>/dev/null |
    grep -v '\.examples/' | LC_ALL=C sort
)"

EXPECT="$(grep -v '^#' "$BASELINE" | grep -v '^$' | LC_ALL=C sort)"

STATUS=0

ADDED="$(printf '%s\n' "$ACTUAL" | LC_ALL=C comm -23 - <(printf '%s\n' "$EXPECT"))"
if [ -n "$ADDED" ]; then
    echo "CONST-P6: platform files missing from the baseline (additions; standalone files need a common.blocks ancestor or a baseline amendment):"
    printf '%s\n' "$ADDED" | sed 's/^/  + /'
    STATUS=1
fi

STALE="$(printf '%s\n' "$EXPECT" | LC_ALL=C comm -13 - <(printf '%s\n' "$ACTUAL"))"
if [ -n "$STALE" ]; then
    echo "CONST-P6: stale baseline entries (forgotten shrinks):"
    printf '%s\n' "$STALE" | sed 's/^/  - /'
    STATUS=1
fi

DESKTOP_COUNT="$(printf '%s\n' "$EXPECT" | grep -c '^desktop\.blocks/' || true)"
TOUCH_COUNT="$(printf '%s\n' "$EXPECT" | grep -c '^touch\.blocks/' || true)"
echo "CONST-P6 baseline: $(printf '%s\n' "$EXPECT" | grep -c . || true) files ($DESKTOP_COUNT desktop + $TOUCH_COUNT touch)"

exit $STATUS
