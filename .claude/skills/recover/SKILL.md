---
name: recover
description: >
  Structured recovery when something is broken and ONE corrective attempt did not fix
  it. Use the moment you hit the STOP rule in CLAUDE.md — the same error or wrong
  behavior persists after one fix — or when the user says "recover", "it's still
  broken", or "stop guessing". Always switch to this instead of trying more
  variations; repeated blind attempts (especially with scroll/animation bugs) make
  things worse and waste the session.
---

# Recover — stop guessing, diagnose properly

You are here because a fix did not work. Do NOT try another quick variation. Slow
down and diagnose from evidence.

## When to use

- The same problem persists after ONE corrective attempt.
- You're about to try a third random change hoping it works.
- A scroll/pin/video behavior is "almost right" and you keep nudging numbers.

## Steps

1. **STOP editing.** No speculative changes until the cause is understood. If the
   working tree is messy, `git stash` or note the diff so you can revert cleanly.

2. **State the symptom precisely.** Exact error text (copy it), or exact wrong
   behavior ("pin releases 300 px early on mobile only"). Expected vs actual.
   Which browser/viewport/reduced-motion state.

3. **Gather evidence — don't assume:**
   - Read the full error/stack trace, including the Next.js overlay's file/line.
   - **Docs:** fetch the current official page for the API involved (`nextjs.org/docs/...md`, `gsap.com/docs/v3/...`, Lenis README, Tailwind v4 docs). You may be using a stale or wrong signature.
   - Re-read the relevant `context/` file (`architecture.md` integration patterns, `library-docs.md` gotchas, `motion-rules.md` scroll rules).
   - Check `memory.md` → Hard-won lessons; this may have happened before.
   - **Project-specific probes:**
     - ScrollTrigger: enable `markers: true` on the trigger; log `ScrollTrigger.getAll().length` before/after mount; check whether `refresh()` runs after fonts/images.
     - Lenis: temporarily disable it (reduced-motion emulation) — if the bug disappears, it's sync/`position: fixed`/anchor related.
     - Video: `ffprobe -show_streams` the file (audio track? codec profile?); check the `play()` promise rejection in console.
     - Tailwind: inspect the element — is the token utility generated at all? (typo in `@theme` name vs class).
     - Next: is the component accidentally a Client Component (imports) or is `params` unawaited?
   - Reproduce in the smallest case (a dev page with one element).

4. **Form 2–3 hypotheses** for the root cause, ranked by likelihood, each with the
   evidence for/against.

5. **Test the top hypothesis with ONE targeted change.** If it disproves the
   hypothesis, revert it and test the next. One variable at a time.

6. **If still stuck after this pass:** revert to the last known-good commit rather than
   layering more changes on a broken base. Present the situation, the evidence and the
   options to the user honestly.

7. **Record the fix.** Add cause → fix to `memory.md` → Hard-won lessons so it never
   costs a session again. If it revealed a wrong assumption in a context file, fix the
   context file too.

## Rules

- One change at a time. Always know what you're testing and why.
- Reverting is not failure; it is often the fastest path.
- Never claim it's fixed without reproducing the success in the browser, including under reduced motion if the bug was motion-related.
