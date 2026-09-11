---
name: imprint
description: >
  Record a new or changed UI component, motion wrapper, media primitive or scene into
  context/ui-registry.md so it gets reused instead of rebuilt. Use this IMMEDIATELY
  after creating or modifying anything under src/components/, or when the user says
  "imprint" or "capture this pattern". Always run it after UI work — skipping it is
  how the codebase drifts into duplicated, inconsistent components.
---

# Imprint — capture the pattern

Keep `context/ui-registry.md` a truthful, current inventory of reusable UI, so future
sessions reuse instead of duplicating.

## When to use

- Right after adding a component in `ui/`, `layout/`, `media/`, `motion/` or `scenes/`.
- Right after changing a component's props or behavior.
- After establishing a reusable composition (e.g. "text in bottom band over dimmed video").

## Steps

1. **Identify what's reusable.** A one-off bit of markup inside a scene is not
   registry-worthy. A component another scene could import IS. Scenes themselves are
   always recorded (in the Scenes table) because they document which parts they compose.

2. **Update `context/ui-registry.md`** in the matching section:
   - `| Name | Path | Purpose | Key props | Notes |` — one line. Notes = the one thing
     a future session must know (client component? needs `sizes`? max per viewport?).
   - Scenes: `| Scene | Path | Composes | Assets | Notes |`.
   - Reusable compositions → **Patterns**, with a pointer to the first file using it.
   - If it replaces something → move the old row to **Deprecated** with "replaced by X".

3. **Verify consistency** (fix before recording, not after):
   - Uses only tokens from `context/ui-tokens.md` — `grep` the file for `#[0-9a-f]`, `text-gray`, `bg-white`, `bg-black`, raw `px` in inline styles.
   - Follows `context/ui-rules.md`: focus-visible ring, loading/empty/error state where relevant, no `position: fixed`, `aria-hidden` on decorative video.
   - Follows `context/motion-rules.md`: eases/durations from `@/lib/motion`, `gsap.matchMedia` reduced-motion branch, tweens inside `useGSAP`.
   - `'use client'` only if in `motion/`, `media/`, or explicitly allowed in `code-standards.md`.
   - If it needed a token that didn't exist, you added it to `ui-tokens.md` AND `globals.css`.

4. **Keep it short.** The registry is a lookup table, not documentation.

## Rules

- Record the component as it truly is — never props it doesn't have.
- If you discover you just built something that already existed: stop, delete the
  duplicate, use the existing one, and add a line under Notes in `progress-tracker.md`
  about the near-miss so it doesn't recur.
