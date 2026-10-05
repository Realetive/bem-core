---
id: specs/bc-bs7z.md
title: "gc autonomy: upstream 1.4.2/1.5.0 audit, stall-patrol gap analysis, upgrade-vs-patch decision"
status: proposed
date: 2026-10-05
source: bead bc-bs7z
---

# Intent

The SDD pipeline (mol-spec-craft) requires constant manual intervention:
coordinator sessions go zombie, workflow steps need manual slinging to the
pool, and the human-gate loop-back is not automatic. This document answers
the three questions of bead bc-bs7z with repo-verified evidence: (1) what
gascity >1.4.1 actually fixes; (2) where our local stall-patrol
(`~/.gc/scripts/sdd/stall-patrol.sh`, detects 1-9) has gaps; (3) whether to
upgrade gc or keep patching the patrol. Deliverable of this bead is this
decision document plus the runbooks in Part 3.

# Context — verified inventory (2026-10-05)

| Component | State | Evidence |
|---|---|---|
| gc | 1.4.1, installed via nix profile | `gc version` |
| bd | 1.2.2, nix — matches the 1.4.1 pin | `bd --version` |
| provider | opencode over ACP; `XDG_CONFIG_HOME` override already documents an OmO-plugin layer that hangs ACP `session/new` | `city.toml [providers.opencode]` |
| packs | gastown pack sha `33d3a43…`, bd/core sha `f895c0f…`, both fetched 2026-09-14 | `packs.lock` |
| stall-patrol | mode=enforce, but **dead since 2026-10-02 13:22**: one `FATAL: session list недоступен` (cwd outside city), then zero invocations logged; the plugin lane cannot record runs at all (`gt` binary absent) | `~/.gc/scripts/sdd/stall-patrol.log` |
| observed stalls | 2026-10-01 storm: findings=30, reslings=3, and the report mail failed (`gc mail send: unknown flag: --human` in the then-current script); `bem-core/gastown.refinery` asleep+quarantined for 4 days as of today | patrol log; `gc session list` |

Upstream releases beyond 1.4.1: **v1.4.2** (2026-09-18, beads-1.3.0
compat + graph-container close fixes) and **v1.5.0** (2026-10-05). All
citations below are from the v1.5.0 `CHANGELOG.md` and
`docs/reference/specs/formula-spec-v2.md` at tag v1.5.0.

# Part 1 — Upstream audit (question 1)

## 1.1 ACP reliability — verdict: mostly fixed at the root

- **Cross-process ACP activity** (1.5.0): `session/update` timestamps are
  published through an atomic coalesced sidecar, so any process can report
  `last_active`; ACP declares the activity capability, enabling timed idle
  policies, the opt-in `[session] progress_stall_timeout`, config-drift
  reset of a drifted named ACP session after the 2-minute activity
  threshold, and nudge-delivery quiescence for ACP. Honest upstream limit:
  activity age records only the last protocol update — it does not prove a
  session is dead; `progress_stall_timeout` ships disabled by default.
- **Session lifecycle races** (1.5.0): `gc session kill` no longer races
  the reconciler (kill-pending marker, #6749); killed/dormant sessions are
  no longer closed as `dead-runtime` (#6752) — this is the coordinator-
  zombie class; a pending create whose command drifted no longer holds its
  alias forever (#6744); controller tmux state-cache crash fixed (#6735);
  codex prompts swallowed during large pastes are resubmitted (#6739).
- **Orphan-sweep false kills** (1.5.0): a kill now needs store and tick
  snapshot to agree (#6649); a pool worker holding a live claim is not
  drained as orphaned (#6665/#6666) — these caused the churn our detects 1/2
  patched over.
- **Residual local root cause**: the resume-churn class (detect 4,
  `resuming session`/`session/new timeout`) is partly ours — the
  OmO-plugin config-merge hang documented in `city.toml`. The workaround
  stays; upstream fixes reduce the surrounding flakiness, not that hang.

## 1.2 Workflow loop-back — verdict: retry layer fixed; declarative loop-back still inert

Fixed root causes behind "steps need manual slinging to pool":

- Retry attempts that pass no longer abort their scope or fail their
  workflow — `gc.outcome=fail` was read as a terminal
  `on_fail=abort_scope` before the retry controller acted; retries were
  inert (#6534).
- graphv2 retry re-attempts for rig-scoped `lifecycle=one_shot` steps keep
  the rig qualifier and drop stale session pinning — previously the
  re-attempt's `gc.routed_to` landed unscoped and **no pool ever claimed
  it** (exactly the "sling it by hand" symptom).
- Retries inside ralph/review loops get correct attempt numbers and a full
  budget per iteration (`gc.retry_attempt`, #6548).
- A `lifecycle=one_shot` pool session that exits into a freeable sleep no
  longer blocks its runtime name forever (fresh creates failed on
  "session name already exists" until manual `gc session close`).
- Condition-triggered orders now dispatch on the tick that observes them,
  outside the per-tick budget (an 11 h merge-queue starvation case is
  documented upstream) — the auto-dispatch class.
- Control beads of relocated/scoped stores route to the right dispatcher;
  formula steps append to (not replace) work-bead notes.

**Not fixed natively** (formula-spec-v2 §4 "Accepted But Inert", verified
in the v1.5.0 tree): `until`-loop re-execution is written as a label no
runtime consumes (one iteration only); `[steps.gate]` type vocabulary
(`human`, `timer`, …) is doc-comment only — the gate bead blocks until
closed manually, no watcher; `waits_for` all/any-children modes have no
dispatcher logic; zero bundled formulas use `gate`/`waits_for`. The human
"changes requested → redo draft/verify/legs" loop therefore has **no
one-key upstream feature**. The implemented primitive for orchestrator-
driven re-execution is `[steps.check]` (§3.1): after each iteration the
orchestrator runs an exec script — exit 0 closes, exit 75 is an
attempt-free infrastructure outcome, any other nonzero spawns the next
iteration while budget remains. Part 3.3 shows the SDD loop-back built on
it.

## 1.3 Configurable timeouts — verdict: yes, broadly

Verified in v1.5.0 `docs/reference/config.md`:

| Knob | Default | Replaces patrol logic |
|---|---|---|
| `[session] progress_stall_timeout` | unset (≥5m clamp) | parked claim-less sessions |
| `[session] claim_holder_stall_timeout` | unset (≥5m clamp) | **alive session holding in-progress work but not progressing** — detects 2/3/5 in one controller knob |
| `[session] idle_timeout` + `assigned_work_defer_limit` | unset / built-in | wake/idle-kill treadmill backstop (ga-3ox7rk) |
| `handshake_timeout` / `nudge_busy_timeout` / `nudge_ready_timeout` / `startup_timeout` / `drain_timeout` / `drift_drain_timeout` | 30s/60s/10s/60s/5m/2m | pacing knobs for ACP sessions |
| orders `timeout` / `check_timeout` / `max_timeout` | 900s maintenance | order auto-dispatch bounds |

# Part 2 — stall-patrol gap audit (question 2)

Inventory (script header + code): 1 DEAD-PIN, 2 NUDGE-FAMINE,
3 ASLEEP-HOLDER, 4 RESUME-CHURN, 5 COORD-ZOMBIE, 6 CHANGES-LOOP,
7 EMPTY-CLOSE, 8 HOUSEKEEPING, 9 EMPTY-SPEC. Mode: enforce. Gaps:

- **G0 — the patrol itself is a dead detector.** Dead since 2026-10-02:
  the script ran outside a city dir → `session list` FATAL → silent
  `exit 0` every scheduled run; and since then nothing invokes it at all
  (the `gt` plugin lane it was wired to has no binary). A stall detector
  with no dead-man switch is a false green. Fix: `cd "$HOME/gc"` (or
  `--city`) at top; heartbeat file + a detect-the-detector check
  (deacon health-scan or supervisor order: heartbeat older than 2 h →
  mail human); re-wire scheduling to a `gc order` (cooldown cron) instead
  of the missing `gt` plugin lane.
- **G1 — detect 8 (housekeeping auto-commit) is declared in the header but
  not implemented.** Bead bc-cbeq is still open on exactly this. Preferred
  resolution: fold the commit into mol-spec-craft's stamp/digest steps
  (bc-cbeq option a) — keeps the patrol out of repo dirt entirely.
- **G2 — detect 5 (coordinator-zombie) is unscoped.** Trigger is
  *any* agent having pending nudges (`ANY_PENDING`), and treatment re-slings
  *all* open routed beads city-wide, not the stalled workflow's steps;
  the strike counter is global, not per-workflow. Needed: identify the
  owning workflow root (parent/`review_id`/convoy metadata), confirm its
  ready-but-undispatched step age, then re-sling only those steps.
- **G3 — detect 6 (changes-loop-back) is fragile.** It greps closed beads'
  notes for "changes requested" and reopens the **first** closed bead with
  "draft" in the title, store-wide — no linkage to the workflow whose gate
  returned changes, no idempotency marker (double-reopen risk), and it
  re-dispatches only the draft, not the verify/legs chain the formula
  requires. Needed: workflow-scoped linkage (same `review_id`/convoy),
  reopen the whole verify→legs→gate suffix, stamp a `loop_back=N` reason.
- **G4 — missing detect: ready-unrouted steps.** Step beads whose
  dependencies are satisfied but which sit unclaimed (empty/stale
  `gc.routed_to`, not in any pool's hook) for >2 patrols — the pure
  auto-dispatch gap. Today this is manual slinging by the human.
- **G5 — missing detect: human-gate SLA (report-only).** "Approve spec X"
  open with `specs/X.md` present but no verdict logged for N days (detect 9
  covers only the missing-file variant). Human pacing is legitimate, but a
  once-daily report-only notice closes the loop without nagging.
- **G6 — supervisor-log coupling.** Detects 1/3 (assignee map) and 4
  (resume-churn) `tail` `~/.gc/supervisor.log` with fixed regexes. v1.5.0
  changes identities (`GC_AGENT` becomes the session bead id; pool workers
  rename to `<template>-<beadID>`) and log phrasing — these regexes must be
  re-validated on upgrade, or better, replaced by `gc session list --json`
  / event-log reads that have a stable schema.

# Part 3 — Decision and plan (question 3)

**Decision: upgrade — gc 1.4.1 → v1.5.0 (1.4.2 is already superseded by
1.5.0), refresh the pinned packs, re-point stall-patrol as a thin safety
net, and move the SDD human-gate loop-back onto the v2 `check` primitive.
Patching the patrol alone keeps treating symptoms whose root causes are
already fixed upstream (inert retries, unscoped re-attempt routing, kill
races, orphan false-kills) and cannot deliver controller-native stall
recycling (`claim_holder_stall_timeout`).**

Class-by-class disposition:

| Stall class (detect) | 1.5.0 root-cause status | Patrol action after upgrade |
|---|---|---|
| dead-pin (1) | fixed layers: orphan-sweep double-read, claim-aware drain, CAS metadata, `hook --claim` re-stamp | keep, demote to observe 1 week |
| nudge-famine (2) | ACP activity + quiescence; enable `progress_stall_timeout` | drop once knob verified |
| asleep-holder (3) | freeable-sleep reuse, defer-limit backstop; enable `claim_holder_stall_timeout` | drop once knob verified |
| resume-churn (4) | partial — our OmO/XDG workaround remains | keep |
| coordinator-zombie (5) | retry route + condition-order + dispatcher-routing fixes; SDD restructure (3.3) removes the coordinator from the loop | keep G2-scoped variant |
| changes-loop-back (6) | not native — build on `check` (3.3) | superseded by 3.3; interim G3 fix |
| empty-close (7) | n/a (local degenerate-close guard) | keep |
| housekeeping (8) | n/a | fold into formula stamp step (G1) |
| empty-spec (9) | n/a | keep |
| ready-unrouted (G4) | condition-order dispatch fix reduces; pool hook remains source of truth | add after upgrade |

## 3.1 Upgrade runbook (ordered, each step verifiable)

1. **Preflight (no changes)**: `gc doctor` snapshot; `bd backup`/Dolt
   backup of `bc` and `hq`; copy `packs.lock`, `city.toml`; read the 1.5.0
   Upgrading Notes (bd 1.3.1 pin, compactor history protection,
   unaliased-identity change, `gc init` import-key rename — our
   `[imports.gastown]` key stays valid).
2. **Install bd 1.3.1**: our nix profile ships bd 1.2.2; check nixpkgs for
   1.3.1 first, else install out-of-band
   (`go install github.com/steveyegge/beads/cmd/bd@v1.3.1` into
   `~/go/bin`, ahead of the nix `bd` on PATH — gc 1.5.0 pins and tests
   against 1.3.1). Do **not** run `bd migrate schema` until all clients of
   the shared databases are on 1.3.x.
3. **Install gc 1.5.0**: `nix profile` source if current, else
   `brew install gascity` or release archive; verify `gc version` →
   1.5.0. On macOS the supervisor may need a manual
   `gc supervisor stop --wait && gc start` (binary-drift restart caveat).
4. **Converge the city**: `gc doctor --fix` (expect: bead-type merge incl.
   `startup-health-episode`, proxied-shared-server pinning, import-key
   advice only). Verify `gc hook --claim --json` still answers from a
   polecat identity.
5. **Refresh packs**: bump the gastown import to a current sha (upstream
   has since gained: polecat INBOX propulsion #339, "close claimed v2
   steps before drain-ack" #490 — both directly relevant to SDD stalls);
   `gc import install`, re-verify `gc formula show mol-polecat-work` and
   `mol-spec-craft` compile, then restart agent sessions so new prompts
   and identities (`GC_AGENT` = session bead id, workers named
   `<template>-<beadID>`) take effect.
6. **Enable stall recycling**: in `city.toml`
   `[session]`: `progress_stall_timeout = "30m"`,
   `claim_holder_stall_timeout = "45m"` (above the longest legitimate
   quiet period for spec legs); keep patrol in **observe** for one week
   comparing its findings against controller actions, then decide enforce.
7. **Dolt compaction note**: with backup remotes present the 1.5.0
   compactor stops flattening (history grows; `gc-compact-base` tags).
   Watch disk; the already-flagged 205 MB orphan `bc` database goes to
   `gc dolt cleanup`, not to flattening. Never run the experimental
   `gc storage migrate` (open correctness issues cited in the notes).
8. **Verify the pipeline end-to-end**: one polecat bead through
   hook→implement→refinery merge; one mol-spec-craft dry run through the
   gate; patrol heartbeat visible; `gc status` clean.

Rollback: nix profile keeps 1.4.1 (`nix profile rollback`), bd 1.2.2
remains on PATH behind `~/go/bin`; packs.lock restore; identities
re-stamped by the next `gc hook --claim`.

## 3.2 Patrol patch plan (do regardless of upgrade timing)

- P0 (G0): `cd "$HOME/gc"` at script top; heartbeat file; dead-man check
  wired into a cooldown `gc order`; delete the `gt plugin record-run`
  no-op or install `gt`.
- P1 (G6): replace supervisor-log `tail` parsing with
  `gc session list --json` and event reads.
- P2 (G2/G3): scope detect 5 to the owning workflow; link detect 6 through
  `review_id`/convoy metadata with an idempotent `loop_back` stamp.
- P3 (G4): add ready-unrouted-step detect (report-first, enforce later).
- P4 (G1): implement detect 8 only if bc-cbeq's formula-side option (stamp
  step commits artifacts) is rejected.

## 3.3 SDD loop-back on v2 `check` (after the upgrade is stable)

Restructure mol-spec-craft so the orchestrator owns the gate loop and the
coordinator session only produces artifacts:

- Keep `draft-spec → verify-citations → spec-review-legs` as pool-routed
  steps (`gc.run_target`) — dispatch stops depending on a coordinator.
- Wrap the `human-approve` presentation in a `[steps.check]` loop:
  `max_attempts` = gate-round budget; check script reads
  `.spec-reviews/$RID/human-clarifications.md` + spec-bead state —
  exit 0 = explicit approval (close, proceed to stamp); exit 75 = no
  verdict yet / infra (attempt-free wait); other nonzero = changes
  requested → next iteration re-runs the verify→legs suffix with the
  requested changes applied. Declarative `until` and `[steps.gate]`
  watchers stay out (inert per §4).
- Stamp step stays mechanical; digest unchanged.

This removes both the coordinator-zombie and changes-loop-back classes
from the runtime instead of detecting their symptoms.

# Non-goals

- Running `gc storage migrate` or any split-storage cutover (experimental).
- Rewriting stall-patrol in Go or folding it into the deacon formula —
  bash + orders is fine once scoped.
- Switching provider away from opencode/ACP; keeping the XDG_CONFIG_HOME
  isolation for the OmO-plugin hang.
- Changing mol-spec-craft's spec content rules (citations, constitution,
  ACCs) — only its control flow.

# Acceptance

- ACC-1: this document names the decision, the class-by-class disposition,
  and the ordered runbook (readable at `specs/bc-bs7z.md`).
- ACC-2: `bash ~/.gc/scripts/sdd/stall-patrol.sh` from a non-city cwd logs
  no FATAL and writes a fresh heartbeat (P0 applied).
- ACC-3 (upgrade done): `gc version` prints 1.5.0; `gc doctor` exits
  clean; a polecat bead merges through the refinery; patrol findings in
  observe mode show no controller-contradicting heals for 7 days.
- ACC-4 (loop-back native): a changes-requested verdict on a dry-run spec
  re-executes the verify suffix without any manual sling or bead reopen.
