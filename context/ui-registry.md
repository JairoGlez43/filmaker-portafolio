<!-- ═══════════════════════════════════════════════════════════
     EDIT LEVEL: ENGINE — never hand-edit per project. Starts EMPTY and fills
     itself as you build (the `imprint` skill writes here). By scene 04 it is the
     de-facto design system.
     ═══════════════════════════════════════════════════════════ -->

# UI Registry

Living inventory of every reusable component and pattern in `src/components/`.
Read this BEFORE building any UI — if something similar exists, match it exactly
instead of inventing a variant.

## How to use

1. Before building UI, search here for a similar component (by purpose, not name).
2. If it exists → import it and match its props. Do not fork it.
3. If not → build it per `ui-rules.md` + `ui-tokens.md` + `motion-rules.md`, then add a row here.
4. After building/changing UI → record it here (the `imprint` skill does this).

## Row format

```
| Name | Path | Purpose | Key props | Notes |
```

One line per component. Notes = the one thing a future session must know
(e.g. "client component", "needs `sizes`", "max 3 per card").

## Components — `ui/` (presentational)

| Name | Path | Purpose | Key props | Notes |
| --- | --- | --- | --- | --- |
| `ScrollCue` | `src/components/ui/ScrollCue.tsx` | 1 px line that breathes + vertical `SCROLL` eyebrow | `className` (position it) | `aria-hidden`. Uses the `animate-breathe` token; `motion-reduce:animate-none`. The only timer animation besides the marquee. |

## Components — `layout/`

| Name | Path | Purpose | Key props | Notes |
| --- | --- | --- | --- | --- |
| `Section` | `src/components/layout/Section.tsx` | Scene wrapper: `<section id>` + the scene's one `<h2>`, `px-gutter` full-bleed | `id`, `label`, `heading: 'eyebrow' \| 'hidden'` (default hidden), `contained` (About/Credits only), `className` | Server component. `aria-labelledby` wired to the h2. Anchor target for Nav links. |
| `Nav` | `src/components/layout/Nav.tsx` | Sticky primary nav: name left, `WORK · REEL · CONTACT` right | `name: string` | **Client** (IntersectionObserver on a 100 svh sentinel → `stuck`: `border-line` + `bg-bg`). Sticky from the top, not absolute→sticky. Links are hash anchors until Lenis (04) takes `scrollTo`. Needs `body.relative`. |
| `SkipLink` | `src/components/layout/SkipLink.tsx` | `SKIP TO WORK`, first focusable on every page | — | `sr-only` until `focus-visible`. Must stay the first child of `<body>`. |
| `Footer` | `src/components/layout/Footer.tsx` | Colophon: © year name · Site by dev · type credit | — | Server component; reads `getSite()`. Year computed at build. Links `text-muted` by default here (ui-rules). |

## Components — `media/` (video, embeds, images)

| Name | Path | Purpose | Key props | Notes |
| --- | --- | --- | --- | --- |
| `VideoLoop` | `src/components/media/VideoLoop.tsx` | Muted loop: `next/image` poster underneath, `<video>` cross-fades in when playing | `loop: Loop`, `slug`, `sizes` (always pass), `priority` (hero only), `dim` (70 %), `className` (give it an aspect ratio) | **Client.** Sources attach within `LIMITS.videoLoadMarginPx`; plays in the central 60 % band; ≤ `LIMITS.maxPlayingVideos` via `videoRegistry`. No `<video>` at all under reduced motion **or** reduced data. No GSAP. |
| `videoRegistry` | `src/components/media/videoRegistry.ts` | Decode budget: `requestPlay`, `release`, `usePlayingCount` | — | Module store + `useSyncExternalStore`. Pauses the oldest loop when the budget is full; logs `[media/VideoLoop] play failed: <slug>`. |
| `LazyVimeo` | `src/components/media/LazyVimeo.tsx` | Poster + 64 px play → Vimeo iframe only after click | `vimeoId` (`id` or `id?h=hash`), `title`, `source: 'home' \| 'work'`, `slug?`, `poster \| null`, `sizes`, `muted`, `label`, `className` | **Client.** `dnt=1` always; `Escape`/`CLOSE ×` unmount; focus returns to play. `poster: null` renders the `bg-surface` block (honest missing state). Fires `track('reel_play', { source, slug })` on click. |
| `Lightbox` | `src/components/media/Lightbox.tsx` | Native `<dialog>` for one still | `still: Still \| null`, `onClose` | **Client.** State lives in the gallery. `showModal()`; backdrop click + Escape close; browser restores focus; `lenis.stop()/start()` while open. `next/image` with the still's width/height, `sizes="90vw"`. |

## Components — `motion/` (client wrappers)

| Name | Path | Purpose | Key props | Notes |
| --- | --- | --- | --- | --- |
| `MotionProvider` + `useLenis()` | `src/components/motion/MotionProvider.tsx` | Registers GSAP plugins once; owns the single Lenis instance and the ticker sync; `ScrollTrigger.refresh()` on `fonts.ready` | `children` | Wrapped around the body in `layout.tsx`. No Lenis under reduced motion (watched live). `useLenis()` returns the instance or `null` — via `useSyncExternalStore`, not context. |
| `Reveal` | `src/components/motion/Reveal.tsx` | Triggered reveal at `top 85%`, once | `variant: 'wipe' \| 'soft'` (default wipe), `delay` (s, a `DUR.*`/`STAGGER.*` value), `className` | Start state is CSS (`[data-reveal]`), see motion-rules → No flash. Reduced: `DUR.fast` fade. |
| `OpeningExit` | `src/components/motion/OpeningExit.tsx` | Scene 01 exit: media push-in 1.08 + dim 0.4, text parallax 1.4 | `className`, children with `[data-opening-media]` and `[data-opening-text]` | Scene-specific by design: one scrubbed timeline, one ScrollTrigger (`top top` → `bottom top`). Reduced: nothing moves. Values in `OPENING_EXIT` (`lib/motion.ts`). |
| `Pin` + `usePin()` | `src/components/motion/Pin.tsx` | Pins a scene `vh`% and owns its one scrubbed timeline | `vh` (always `PIN.*`), `className` | Children in `motion/` add tweens via `usePin()` (null on server — guard). Reduced: no pin, `progress(1)`. |
| `ScrubWords` | `src/components/motion/ScrubWords.tsx` | Words faint → primary as the pin scrubs; last word `accent` in the final 10 % | `text` (≤ 20 words), `className` | Must be inside `<Pin>`. `aria-label` carries the sentence; spans are `aria-hidden`. Start state CSS (`[data-scrub-word]`). |
| `dev/TriggerCount` | `src/components/motion/dev/TriggerCount.tsx` | Live `ScrollTrigger.getAll().length` | — | Dev only (`/dev/motion`). Deleted in 21. |
| `readCssPx()` | `src/components/motion/cssVars.ts` | Read a px token from `:root` (e.g. `--nav-h`) in client code | `name` | Keeps layout numbers single-sourced in `@theme`. |
| `useMediaQuery()` | `src/components/motion/useMediaQuery.ts` | Live `matchMedia` as an external store | `query` | `true`/`false` on the client, `null` during SSR/hydration. Used by `MotionProvider` (reduced motion) and `VideoLoop` (reduced motion + reduced data). |

## Scenes — `scenes/`

| Scene | Path | Composes | Assets | Notes |
| --- | --- | --- | --- | --- |
| 02 Statement | `src/components/scenes/02-Statement.tsx` | `Section` (hidden h2) › `Pin` 150 vh › `ScrubWords` (`site.statement`, `text-display`, `max-w-[20ch]`) | none | No gap before/after (pinned). Reduced: no pin, sentence lit. Sentence is the script's placeholder until the developer writes his. |
| 01 Opening | `src/components/scenes/01-Opening.tsx` | `OpeningExit` › `VideoLoop` (hero, `priority`) + `Reveal` wipe (`h1` name) + `Reveal` soft (meta, `delay={DUR.base}`) + `ScrollCue` | `site.assets.heroLoop` (demo 576p — replace) | `<section id="opening">`, `-mt-(--nav-h)`, `overflow-hidden`. Text in the bottom band over a `from-scrim` gradient; cue bottom-right. Prologue (07) hands off into this section. |

## Patterns

_Reusable layouts and compositions (e.g. "text in bottom band over dimmed video",
"two-column mono table"). Added as they emerge, with a pointer to the first file that
uses them._

- **Eyebrow** (`font-mono text-mono-sm tracking-[0.12em] text-text-faint uppercase`) — first in `Section.tsx` (heading="eyebrow"); also `not-found.tsx`, `page.tsx`. Promote to `ui/Eyebrow.tsx` the moment scene 07/08 needs it a fourth time.
- **Mono label** (`font-mono text-mono tracking-[0.06em] text-text-muted uppercase`) — first in `Nav.tsx` links; also `Footer.tsx`, `SkipLink.tsx`, `not-found.tsx`. Same promotion rule → `ui/MonoLabel.tsx`.
- **Mono link hover** (`transition-colors duration-(--dur-fast) ease-out hover:text-text-primary focus-visible:text-text-primary motion-reduce:transition-none`) — `Nav.tsx`, `Footer.tsx`. Reduced motion handled by the Tailwind `motion-reduce:` variant, no custom class.
- **Missing-reel card** (`bg-surface rounded-sm p-8 md:p-12 max-w-[65ch]`) — `not-found.tsx`. The only card surface so far.

## Deprecated

_Anything replaced goes here with what replaced it, so the agent avoids it._
