<!-- ═══════════════════════════════════════════════════════════
     EDIT LEVEL: PROJECT — the motion system. On this site motion is half the
     product; these rules keep it feeling like one editor cut the whole thing.
     Values here mirror src/lib/motion.ts and the --ease/--dur tokens.
     ═══════════════════════════════════════════════════════════ -->

# Motion Rules

## Principles

1. **Motion is edit, not decoration.** Every animation is a cut, a push-in, or a
   reveal. If you can't name which one it is, delete it.
2. **Scroll is the timeline.** Long scenes are _scrubbed_ (position = scroll). Short
   reveals are _triggered_ (play once on entry). Nothing animates on a timer except the
   scroll cue breath and the marquee.
3. **One thing moves at a time.** Text or image, never both fighting. Stagger, don't
   overlap.
4. **Slow in, fast out.** Entrances are long (`expo.out`), exits are short. The eye
   should never wait for something to leave.
5. **Transform and opacity only.** Never animate `width`, `height`, `top`, `left`,
   `margin`, `filter: blur()` on large surfaces, or `box-shadow`. `clip-path` is
   allowed for reveals (GPU-composited in all targets).
6. **Reduced motion is a first-class variant**, not a fallback. Designed, checked,
   part of Done.

## Vocabulary (tokens — mirror `src/lib/motion.ts`)

```ts
export const EASE = {
  out: 'expo.out', // reveals, entrances
  inOut: 'expo.inOut', // curtain, page fades, anything symmetrical
  soft: 'power2.out', // small UI (hover, badges)
  none: 'none', // ALL scrubbed timelines
} as const;

export const DUR = {
  fast: 0.3, // hover, focus, small fades
  base: 0.6, // standard reveal
  slow: 1.1, // hero name, portrait, big clip-path reveals
  scene: 0.9, // curtain split, page transition
} as const;

export const STAGGER = { text: 0.08, list: 0.05 } as const;
export const SCRUB = { tight: 0.3, base: 0.6, loose: 1.2 } as const; // ScrollTrigger scrub smoothing
export const OPENING_EXIT = { scale: 1.08, dim: 0.4, parallax: 1.4 } as const; // scene 01 exit (§01)
```

CSS mirrors for non-GSAP transitions: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`,
`--ease-in-out: cubic-bezier(0.87, 0, 0.13, 1)`, `--dur-fast: 300ms`, `--dur-base: 600ms`.

## Patterns and when to use them

| Pattern                                              | Component                 | Use for                                 | Never for                             |
| ---------------------------------------------------- | ------------------------- | --------------------------------------- | ------------------------------------- |
| Clip-path wipe up (`inset(100% 0 0 0)` → `inset(0)`) | `Reveal`                  | Headings, portrait, cards' titles       | Body paragraphs (use fade+8px)        |
| Fade + `y: 16`                                       | `Reveal variant="soft"`   | Body copy, mono labels, lists           | Big display type                      |
| Scrubbed word opacity                                | `ScrubWords`              | Statement                               | Anything longer than 20 words         |
| Pin + scrub timeline                                 | `Pin`                     | Statement, Craft beats                  | Sections with variable height content |
| Stack-and-cover (`position: sticky` cards)           | `StickyStack`             | Selected Work                           | Lists > 8 items                       |
| Scale 1.1 → 1 on enter                               | `ScaleIn`                 | Full-bleed posters                      | Text                                  |
| Parallax (element speed ≠ scroll)                    | `Parallax factor`         | Hero text exit (1.4), section bg (0.85) | More than one layer per scene         |
| Infinite marquee                                     | `Marquee`                 | Clients                                 | Anything the user must read fully     |
| Scattered → grid → close (CSS 3D plates, scrubbed)   | `PlateField`              | Prologue v1                             | Any other scene (it's the signature)  |
| Canvas frame sequence, scrubbed                      | `FrameSequence`           | Prologue v2                             | Anything that must be interactive     |
| Hover un-dim (opacity 0.7 → 1)                       | CSS transition            | Work cards on pointer devices           | Touch (no hover state)                |
| Underline draw                                       | CSS `scaleX` on `::after` | Links                                   | Buttons                               |

## Scroll rules

- Trigger reveals at `start: 'top 85%'`; pins at `start: 'top top'`.
- Scrubbed timelines use `ease: 'none'` per tween and `scrub: SCRUB.base` on the trigger. Easing comes from scroll, not from the tween.
- Pin durations are in the constants (`PIN.*`), expressed as `end: '+=150%'`.
- `pinSpacing: true` always (no overlapping layout hacks). If a pin causes a jump, the cause is a missing `ScrollTrigger.refresh()` after images load, not pinSpacing.
- Call `ScrollTrigger.refresh()` once after fonts and hero poster are loaded (`MotionProvider` listens to `document.fonts.ready`).
- Never create a ScrollTrigger in a component that can unmount without `useGSAP` cleanup.
- Lenis owns wheel/touch; ScrollTrigger reads from it via `lenis.on('scroll', ScrollTrigger.update)`. Never add a second smooth-scroll mechanism or `scroll-behavior: smooth`.

## Video motion

- Loops play/pause via an IntersectionObserver band (enter at 80 % of the viewport, leave at
  20 %) inside `VideoLoop`, not via ScrollTrigger: video lifecycle is not an animation, and
  `gsap` stays out of `media/` (decided in feature 05; the lint guard enforces it).
- `play()` returns a promise — always `.catch()` it (autoplay may be blocked).
- Dim loops to 70% opacity behind text; un-dim on hover only for pointer devices (`@media (hover: hover)`).
- Never scrub video `currentTime` with scroll (janky on iOS, heavy decode). The grade wipe uses two stills, not video.

## Performance budget

- 60 fps target on mid-range Android; long tasks > 100 ms during scroll = bug.
- ≤ 2 videos decoding at once (`LIMITS.maxPlayingVideos`).
- `will-change: transform` only on elements that are _currently_ animating (GSAP sets it; don't add it in CSS globally).
- No `backdrop-filter` over video.
- Fonts loaded via `next/font` (no FOIT); reveals are safe to run at hydration because text is already sized.
- Check with Chrome Performance panel while scrolling the whole page once before marking any scene done.

## No flash on hydration (decided in feature 04)

The HTML arrives visible; if GSAP hides an element after hydration and then reveals it,
the visitor sees a flash. The fix is never `dynamic(..., { ssr: false })` — that removes
the content from the HTML (LCP, SEO, no-JS). Instead:

- A ~60-byte inline script in `layout.tsx` `<head>` sets `html[data-js]` **before first paint**.
  `<html>` carries `suppressHydrationWarning` for exactly this attribute (React would
  otherwise report a server/client attribute mismatch); it applies to that element only.
- Start states live in `globals.css` → `@layer components`, scoped to `html[data-js]`:
  `[data-reveal]` (opacity 0; `wipe` gets the clip-path, `soft` the 16 px offset under
  `no-preference`), `[data-scrub-word]` (opacity 0.3; 1 under `reduce`).
- GSAP animates **to** the final state (`fromTo` with the same start values, so the
  inline style matches the CSS). Without JS nothing is ever hidden.
- Every new motion wrapper with a hidden start state follows this: add its `data-*`
  attribute and CSS rule here first, then the tween.

## Pinned scenes compose through `usePin()` (decided in feature 04)

Scenes are Server Components and cannot hand callbacks to a client component, so `Pin`
does not receive "what to animate": it creates the scene's single scrubbed timeline,
attaches the one ScrollTrigger (`pin`, `pinSpacing: true`, `scrub: SCRUB.base`,
`end: +=PIN.*%`), and publishes the timeline via context. Client children in `motion/`
(`ScrubWords`, later `GradeWipe`, `StrokeDraw`) call `usePin()` and add their tweens with
`ease: 'none'` inside their own `useGSAP`. React runs child effects first, so the tweens
exist before the trigger is created. Under reduced motion `Pin` neither pins nor scrubs:
`timeline.progress(1)`.

## Reduced motion (`prefers-reduced-motion: reduce`)

- Lenis disabled → native scroll.
- All pins removed; sections flow naturally with normal height.
- Scrubs become single fades (`DUR.fast`).
- Autoplay loops replaced by posters; marquee static; scroll cue static.
- Prologue not mounted; page opens on scene 01 with the hero poster.
- Implemented via `gsap.matchMedia()` in every motion component, plus CSS
  `@media (prefers-reduced-motion: reduce) { .motion-only { animation: none } }`.

## Do nots

- No bounce, elastic, or back easings. Ever.
- No animation longer than `DUR.slow` except scrubbed timelines.
- No animated gradients, no blurred-in text, no typewriter effects, no cursor followers in v1.
- No horizontal scroll hijacking on desktop.
- No animation that delays access to content by more than 1.1 s.
- No `setTimeout`-driven sequencing; use GSAP timelines.
- Never animate on `window.scroll` listeners; ScrollTrigger only.
