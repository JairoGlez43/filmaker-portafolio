---
name: architect
description: >
  Plan a feature or scene before writing any code. Use this whenever the user asks to
  build anything that touches more than one file (a scene, a motion wrapper, a media
  primitive, a data-model change, a new route), or says "architect", "plan", or
  "think before building". ALWAYS use this before starting a numbered feature from
  context/build-plan.md instead of jumping into code — planning first prevents drift
  and throwaway work.
---

# Architect — plan before building

Produce a short, concrete plan and get approval BEFORE writing implementation code.
Do not write feature code while in this skill.

## When to use

- Any numbered feature in `context/build-plan.md`.
- Any change to `src/types/content.ts`, `src/lib/constants.ts`, `MotionProvider`, or the `@theme` block.
- Any time the path forward is not obvious.

## Steps

1. **Re-read the relevant context.** For the feature at hand: its entry in
   `build-plan.md`, its scene(s) in `experience-script.md`, `ui-registry.md` (what
   already exists), `motion-rules.md` (which pattern applies), and `asset-pipeline.md`
   if media is involved. Note what you will reuse.

2. **Restate the goal in one or two sentences** — including the _feel_ the scene must
   have, not just the markup. If anything is ambiguous, ask up to 3 short questions,
   then stop and wait.

3. **Produce the plan.** Keep it tight:
   - **Approach:** 2–4 sentences.
   - **Files to add/change:** one bullet per file, what changes, which folder boundary it respects.
   - **Data / types / constants:** anything new in `types/`, `data/`, `constants.ts`, `motion.ts`, `@theme`.
   - **Reuse:** components from `ui-registry.md` and patterns from `motion-rules.md` you'll use.
   - **Motion:** which pattern (triggered vs scrubbed vs pinned), easing/duration tokens, the reduced-motion variant.
   - **Assets:** what's needed, whether it exists, and the fallback if it doesn't.
   - **Steps:** ordered, small, each verifiable in the browser. UI with mock data first.
   - **Risks / unknowns:** and how you'll de-risk (e.g. "verify `params` shape in Next docs first").
   - **Definition of done:** copy the Done line from `build-plan.md`, add anything specific.

4. **Record the decision.** If the plan makes a durable choice (new pattern, new
   dependency, deviation from a context file), append it to `context/architecture.md`
   → Key architectural decisions, and to `memory.md` → Decisions log.

5. **Get approval.** Present the plan and ask the user to approve or adjust. Do not
   start building until they say go.

## Rules

- Prefer the smallest plan that satisfies the goal. No speculative extras.
- Never introduce a new component if an entry in `ui-registry.md` fits.
- Never introduce a new motion pattern if `motion-rules.md` has one for the job.
- If the plan needs a package not in `code-standards.md` → Approved dependencies, say so explicitly and stop.
- If the plan reveals the feature is too big, propose splitting it into two numbered features and updating `build-plan.md`.
