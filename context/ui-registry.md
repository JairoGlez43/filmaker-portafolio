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
| `Eyebrow` | `src/components/ui/Eyebrow.tsx` | Index / eyebrow type (`text-mono-sm`, faint, tracked) | `as` (`p` default, `h2`, `h3`, `span`, `li`, `figcaption`), `id`, `className` | Promoted in 10 (4th use). `Section` renders its eyebrow heading with it. Decorative color — never the only signal. |
| `MonoLabel` | `src/components/ui/MonoLabel.tsx` | Mono label (`text-mono`, muted, uppercase) | `as`, `id`, `className` | Promoted in 10. Not for sentences > ~6 words. Nav/Footer keep their own link classes (hover states). |
| `Badge` | `src/components/ui/Badge.tsx` | Outline role badge | `className` | `<span>`; wrap in `<li>` for lists. Max `LIMITS.maxRolesPerProject` (3) per card. Never filled. |
| `SocialIcon` + `toSocialTarget()` | `src/components/ui/SocialIcon.tsx` | Inline brand glyphs (Simple Icons, CC0) for Instagram / Vimeo / LinkedIn | `target: SocialTarget`, `className` | `aria-hidden`, `fill-current` (takes the link color). `toSocialTarget(label)` maps a social's label to its event target or `null`. No icon library. |
| `TrackLink` | `src/components/ui/TrackLink.tsx` | `next/link` that fires one analytics event on click | all `Link` props + `event`, `payload` (typed per event) | **Client leaf** (no state/effects) — the way Server Component scenes emit `work_open` / `contact_click`. |

## Components — `layout/`

| Name | Path | Purpose | Key props | Notes |
| --- | --- | --- | --- | --- |
| `Section` | `src/components/layout/Section.tsx` | Scene wrapper: `<section id>` + the scene's one `<h2>`, `px-gutter` full-bleed | `id`, `label`, `heading: 'eyebrow' \| 'hidden'` (default hidden), `contained` (About/Credits only), `bleed` (no gutter — full-bleed media scenes), `className` | Server component. `aria-labelledby` wired to the h2 (an `Eyebrow as="h2"` when visible). Anchor target for Nav links. |
| `Nav` | `src/components/layout/Nav.tsx` | Sticky primary nav: name left, `WORK · REEL · CONTACT` right | `name: string` | **Client** (IntersectionObserver on a 100 svh sentinel → `stuck`: `border-line` + `bg-bg`). Over the hero it floats on a top scrim (`before:` gradient `from-scrim` → transparent, 2.5 × `--nav-h`, fades out when stuck) with `text-primary` name and `text-primary/70` links, so it reads over a bright sky; stuck, links go back to muted → primary. Sticky from the top, not absolute→sticky. Anchors scroll through Lenis on `/`. Needs `body.relative`. |
| `SkipLink` | `src/components/layout/SkipLink.tsx` | `SKIP TO WORK`, first focusable on every page | — | `sr-only` until `focus-visible`. Must stay the first child of `<body>`. |
| `Footer` | `src/components/layout/Footer.tsx` | Colophon: © year name · Site by dev · type credit | — | Server component; reads `getSite()`. Year computed at build. Links `text-muted` by default here (ui-rules). |

## Components — `media/` (video, embeds, images)

| Name | Path | Purpose | Key props | Notes |
| --- | --- | --- | --- | --- |
| `VideoLoop` | `src/components/media/VideoLoop.tsx` | Muted loop: `next/image` poster underneath, `<video>` cross-fades in when playing | `loop: Loop`, `slug`, `sizes` (always pass), `priority` (hero only), `dim` (70 %), `className` (give it an aspect ratio) | **Client.** Sources attach within `LIMITS.videoLoadMarginPx`; plays in the central 60 % band; ≤ `LIMITS.maxPlayingVideos` via `videoRegistry`. No `<video>` at all under reduced motion **or** reduced data. No GSAP. |
| `videoRegistry` | `src/components/media/videoRegistry.ts` | Decode budget: `requestPlay`, `release`, `usePlayingCount` | — | Module store + `useSyncExternalStore`. Pauses the oldest loop when the budget is full; logs `[media/VideoLoop] play failed: <slug>`. |
| `LazyVimeo` | `src/components/media/LazyVimeo.tsx` | Poster + 64 px play → Vimeo iframe only after click | `vimeoId` (`id` or `id?h=hash`), `title`, `source: 'home' \| 'work'`, `slug?`, `poster \| null`, `sizes`, `muted`, `label`, `className` | **Client.** `dnt=1` always; `Escape`/`CLOSE ×` unmount; focus returns to play. `poster: null` renders the `bg-surface` block (honest missing state); a poster gets a `bg-scrim-soft` overlay so the play button and label read over bright frames. Fires `track('reel_play', { source, slug })` on click. |
| `StillsGallery` | `src/components/media/StillsGallery.tsx` | Two-column grid of stills (one below `md`) that owns the `Lightbox` state | `stills: Still[]`, `className` | **Client.** Images sized from data (`width`/`height`, `sizes` 50vw/100vw) → no CLS; hover lift −4 px; each button labelled `Open still: <alt>`; focus returns natively on close. Replaced the dev `StillsBench`. |
| `Lightbox` | `src/components/media/Lightbox.tsx` | Native `<dialog>` for one still | `still: Still \| null`, `onClose` | **Client.** State lives in the gallery. `showModal()`; backdrop click + Escape close; browser restores focus; `lenis.stop()/start()` while open. `next/image` with the still's width/height, `sizes="90vw"`. |

## Components — `motion/` (client wrappers)

| Name | Path | Purpose | Key props | Notes |
| --- | --- | --- | --- | --- |
| `MotionProvider` + `useLenis()` | `src/components/motion/MotionProvider.tsx` | Registers GSAP plugins once; owns the single Lenis instance and the ticker sync; `ScrollTrigger.refresh()` on `fonts.ready` | `children` | Wrapped around the body in `layout.tsx`. No Lenis under reduced motion (watched live). `useLenis()` returns the instance or `null` — via `useSyncExternalStore`, not context. |
| `Reveal` | `src/components/motion/Reveal.tsx` | Triggered reveal at `top 85%`, once | `variant: 'wipe' \| 'soft'` (default wipe), `delay` (s, a `DUR.*`/`STAGGER.*` value), `start` (ScrollTrigger start; cards use `top 60%`), `className` | Start state is CSS (`[data-reveal]`), see motion-rules → No flash. Reduced: `DUR.fast` fade. |
| `ScaleIn` | `src/components/motion/ScaleIn.tsx` | Full-bleed poster settles 1.1 → 1 on entry, once | `className`, children | Outer box clips, inner `[data-scale-in]` scales (CSS start state, see motion-rules → No flash). Reduced: no tween, no CSS start state. `SCALE_IN.from`. |
| `Marquee` | `src/components/motion/Marquee.tsx` | Infinite text marquee, hover pause, Lenis-velocity boost | `items: string[]`, `className` | Two identical tracks (2nd `aria-hidden`), row `xPercent: -50` per `MARQUEE.loopSec` → seamless, width-independent (no CLS). Reduced motion is CSS: duplicate hidden, first track wraps static; same markup server/client. |
| `StaggerChars` | `src/components/motion/StaggerChars.tsx` | Characters light up one by one on entry (opacity `CHAR_DIM` → 1, `STAGGER.chars`) | `text`, `className` | For the contact email only. `sr-only` full text + `aria-hidden` chars. CSS start state `[data-stagger-char]`; reduced: nothing. |
| `OpeningExit` | `src/components/motion/OpeningExit.tsx` | Scene 01 exit: media push-in 1.08 + dim 0.4, text parallax 1.4 | `className`, children with `[data-opening-media]` and `[data-opening-text]` | Scene-specific by design: one scrubbed timeline, one ScrollTrigger (`top top` → `bottom top`). Reduced: nothing moves. Values in `OPENING_EXIT` (`lib/motion.ts`). |
| `Pin` + `usePin()` | `src/components/motion/Pin.tsx` | Pins a scene `vh`% and owns its one scrubbed timeline | `vh` (always `PIN.*`), `className` | Children in `motion/` add tweens via `usePin()` (null on server — guard). Reduced: no pin, `progress(1)`. |
| `ScrubWords` | `src/components/motion/ScrubWords.tsx` | Words faint → primary as the pin scrubs; last word `accent` in the final 10 % | `text` (≤ 20 words), `className` | Must be inside `<Pin>`. `aria-label` carries the sentence; spans are `aria-hidden`. Start state CSS (`[data-scrub-word]`). |
| `dev/TriggerCount` | `src/components/motion/dev/TriggerCount.tsx` | Live `ScrollTrigger.getAll().length` | — | Dev only (`/dev/motion`). Deleted in 21. |
| `readCssPx()` | `src/components/motion/cssVars.ts` | Read a px token from `:root` (e.g. `--nav-h`) in client code | `name` | Keeps layout numbers single-sourced in `@theme`. |
| `useMediaQuery()` | `src/components/motion/useMediaQuery.ts` | Live `matchMedia` as an external store | `query` | `true`/`false` on the client, `null` during SSR/hydration. Used by `MotionProvider` (reduced motion) and `VideoLoop` (reduced motion + reduced data). |

## Scenes — `scenes/`

| Scene | Path | Composes | Assets | Notes |
| --- | --- | --- | --- | --- |
| 07 About | `src/components/scenes/07-About.tsx` | `Section` (eyebrow h2, **`contained`**) › grid: `Reveal` wipe › 4:5 portrait (`next/image fill` or the `surface` block while `portrait` is null) + `Reveal` soft × 3 bio lines (staggered `delay`) + mono list (`Based in` · `Available for` · `Tools:`) | `site.assets.portrait` (**null today**) | Aspect box always rendered → zero CLS. One column below `md`. |
| 09 Title card (`/work/[slug]`) | `src/components/scenes/09-TitleCard.tsx` | `<section>` full viewport, centered: `Reveal` wipe › `h1` title (`text-display`), `Reveal` soft › `MonoLabel` client · year · roles; `← WORK` link top-left under the nav | none | The script's centered-text exception. Props: `project`. Scroll-driven hand-off to the hero (no timer). |
| 10 Case hero (`/work/[slug]`) | `src/components/scenes/10-CaseHero.tsx` | `Section id="hero"` › `ScaleIn` › `LazyVimeo` (muted, `source="work"`, `slug`) when `vimeoId` exists, else the poster (`next/image`, `priority`) | `project.loop.poster`, optional `project.vimeoId` | Props: `project`. All five demo projects are poster-only today. |
| 13 Next project (`/work/[slug]`) | `src/components/scenes/13-NextProject.tsx` | `Section id="next"` (hidden h2, `bleed`) › `TrackLink` strip `h-[50svh]` (`work_open`, `from: 'next'`, `transitionTypes={['dissolve']}`) › next poster at 70 % + scrim + `Eyebrow` NEXT + title | next project's poster | `getNextProject` wraps to the first. Exports `DISSOLVE`; `page.tsx` maps it in `<ViewTransition>`. Hover un-dim; inset focus ring. |
| 12 Stills (`/work/[slug]`) | `src/components/scenes/12-Stills.tsx` | `Section id="stills"` (eyebrow h2) › `StillsGallery` | `project.stills` (only northern-light today) | Returns `null` when the project has no stills (empty state = omitted). Props: `project`. |
| 11 Credits (`/work/[slug]`) | `src/components/scenes/11-Credits.tsx` | `Section id="credits"` (eyebrow h2, `contained`) › `Reveal` soft › `<dl>` rows `grid-cols-[minmax(8rem,1fr)_2fr]`, `border-t border-line py-3`, `MonoLabel as="dt"` + `dd` primary mono | none | Empty values omitted; renders nothing if no rows. Props: `project`. |
| 08 Contact | `src/components/scenes/08-Contact.tsx` | `Section` (eyebrow h2) › `TrackLink mailto:` (`contact_click` email) › `StaggerChars`; `ul` of `TrackLink`s with `SocialIcon` (`contact_click` instagram/vimeo/linkedin, new tab) | none | Email is `text-display-xl` with `[overflow-wrap:anywhere]`; accent underline draws on hover/focus. Global `Footer` follows from layout. |
| 06 Clients | `src/components/scenes/06-Clients.tsx` | `Section` (hidden h2, `bleed`, `py-section`) › `Marquee items={getClients()}` | none | Names are `{{CLIENT_NN}}` placeholders until the developer's list. |
| 05 Showreel | `src/components/scenes/05-Showreel.tsx` | `Section` (hidden h2, `bleed`, `pt-section`) › `ScaleIn` › `LazyVimeo` (`source="home"`, label `Showreel {year} · {reelRuntime}`) | `site.assets.reelPoster` (demo frame from the developer's loop), `site.vimeoReelId` (demo `22439234`, a public embed that actually plays — Big Buck Bunny `1084537` never left the spinner) | The only scene with sound. ⏸ HUMAN: own poster frame + own reel id. |
| 03 Selected Work | `src/components/scenes/03-SelectedWork.tsx` | `Section` (hidden h2, `bleed`) › `parts/StickyStack` › `parts/WorkCard` × n (`TrackLink` card › `VideoLoop dim` + scrim + `Eyebrow` index + `Reveal` wipe `h3` + `MonoLabel` client · year + `Badge` roles) | 5 project loops + posters (demo: one clip ×5) | Cards link to `/work/[slug]` (404 until 17). Empty state `WORK COMING SOON`. Hover un-dim via `group-hover`. Focus ring inset (`-outline-offset-8`). |
| 02 Statement | `src/components/scenes/02-Statement.tsx` | `Section` (hidden h2) › `Pin` 150 vh › `ScrubWords` (`site.statement`, `text-display`, `max-w-[20ch]`) | none | No gap before/after (pinned). Reduced: no pin, sentence lit. Sentence is the script's placeholder until the developer writes his. |
| 01 Opening | `src/components/scenes/01-Opening.tsx` | `OpeningExit` › `VideoLoop` (hero, `priority`) + `Reveal` wipe (`h1` name) + `Reveal` soft (meta, `delay={DUR.base}`) + `ScrollCue` | `site.assets.heroLoop` (demo 576p — replace) | `<section id="opening">`, `-mt-(--nav-h)`, `overflow-hidden`. Text in the bottom band over a `from-scrim` gradient; cue bottom-right. Prologue (07) hands off into this section. |

## Patterns

_Reusable layouts and compositions (e.g. "text in bottom band over dimmed video",
"two-column mono table"). Added as they emerge, with a pointer to the first file that
uses them._

- **Eyebrow** → promoted to `ui/Eyebrow` in feature 10. Remaining inline copies (dev pages, `01-Opening` meta) are fine to migrate opportunistically.
- **Mono label** → promoted to `ui/MonoLabel` in feature 10. `Nav`, `Footer`, `SkipLink` keep inline classes because theirs carry link hover/focus states.
- **Stack-and-cover** (`parts/StickyStack`: `<ul relative>` › `<li sticky top-0 h-svh>`) — pure CSS, first in `03-SelectedWork`. Not for lists > 8.
- **Page dissolve** (React `<ViewTransition enter/exit={{ dissolve, default: 'none' }} default="none">` around the page content in `page.tsx` + `Link transitionTypes={['dissolve']}` on the triggering link + `::view-transition-old/new(.dissolve)` in `globals.css`) — first in `app/work/[slug]/page.tsx` ← `13-NextProject`. Opacity only; `animation: none` under reduced motion. Untagged navigations stay instant.
- **Underline draw** (`relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform … hover:after:scale-x-100 focus-visible:after:scale-x-100`) — first in `08-Contact` (email). Copy the `UNDERLINE` string; promote to `ui/TextLink` at the 3rd use.
- **Text in the bottom band over dimmed footage** (`absolute inset-x-0 bottom-0 … p-gutter pb-band` over `bg-linear-to-t from-scrim to-transparent`) — `01-Opening` and `parts/WorkCard`.
- **Mono link hover** (`transition-colors duration-(--dur-fast) ease-out hover:text-text-primary focus-visible:text-text-primary motion-reduce:transition-none`) — `Nav.tsx`, `Footer.tsx`. Reduced motion handled by the Tailwind `motion-reduce:` variant, no custom class.
- **Missing-reel card** (`bg-surface rounded-sm p-8 md:p-12 max-w-[65ch]`) — `not-found.tsx`. The only card surface so far.

## Deprecated

_Anything replaced goes here with what replaced it, so the agent avoids it._
