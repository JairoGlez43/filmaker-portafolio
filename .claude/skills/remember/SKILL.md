---
name: remember
description: >
  Save or restore working context across sessions for a feature that spans more than
  one sitting. Use "remember save" before ending a session mid-feature; use "remember
  restore" when returning. Also trigger when the user says "remember", "save context",
  "where were we", or "pick up where we left off". Always save before stopping
  mid-feature so the next session resumes cleanly instead of re-deriving everything.
---

# Remember — cross-session continuity

Two modes: `save` (write a snapshot) and `restore` (read it and re-orient). The
snapshot lives in `memory.md` → "Snapshot for resuming a multi-session feature";
ongoing state lives in `context/progress-tracker.md`.

## remember save

Run before ending a session on an unfinished feature.

1. **Summarize the feature** in a few lines: number + name, goal, chosen approach
   (from the `architect` plan).
2. **Capture exact state:**
   - DONE: files changed, what visibly works in the browser.
   - IN PROGRESS: the very next concrete step (a file and an action).
   - Open questions, blockers (e.g. "grade pair asset missing"), decisions pending.
   - Branch and whether there is uncommitted work (`git status --short`).
   - Any temporary scaffolding that must be removed later (dev pages, `markers: true`).
3. **Write it** to the Snapshot section of `memory.md`, replacing the old one.
   Update `progress-tracker.md` → Current status (In progress / Next / Blockers).
4. **Record durable decisions** from this session in `memory.md` → Decisions log, and
   any lesson in Hard-won lessons.
5. Confirm to the user what was saved and what the first step will be next time.

## remember restore

Run when resuming.

1. **Read** the Snapshot in `memory.md` and `context/progress-tracker.md` → Current status.
2. **Read** the Decisions log entries relevant to this feature, and the feature's
   entries in `build-plan.md` and `experience-script.md`.
3. **Re-orient:** restate goal, what's done, the exact next step — in a few lines.
4. **Sanity-check reality vs notes:** `git status`, `git log -3`, open the files named
   in the snapshot. Run `pnpm typecheck`. Flag any drift between notes and code.
5. Propose resuming from the recorded next step and wait for the user's go-ahead.

## Rules

- Snapshots are short and factual — enough to resume, not a diary.
- The snapshot is single-slot: overwrite on every save so it never goes stale.
- If restore finds notes and code disagree, trust the code and say so.
