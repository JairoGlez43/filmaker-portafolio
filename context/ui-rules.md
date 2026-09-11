<!-- ═══════════════════════════════════════════════════════════
     EDIT LEVEL: PROJECT — the UI patterns that keep every screen consistent.
     Tokens live in ui-tokens.md; motion in motion-rules.md. This file is layout,
     components, states, accessibility and the banned list.
     ═══════════════════════════════════════════════════════════ -->

# UI Rules

## Font

Two families, loaded once in `src/app/layout.tsx` with `next/font/google`
(`display: 'swap'`, `subsets: ['latin']`, `variable` names matching `ui-tokens.md`):

- **Inter Tight** (variable, 400 and 600 used, no italic) — display AND body. The voice
  of the site: a tight, neutral grotesque; the hero name at 600, everything else at 400.
  Chosen on 2026-09-11 on `/dev/type` over serif and extended candidates, for one-family
  coherence and zero extra bytes.
- **JetBrains Mono** (400) — everything that is a label, credit, index or nav item.
  Provisional: the mono is re-judged against Inter Tight before feature 03 ships the Nav.
  Rule: never a third family; never a system fallback visible in production
  (`next/font` guarantees this if used correctly — no `<link>` to Google Fonts).

## Layout

- **Full-bleed by default.** Scenes span the viewport width; text sits inside
  `px-gutter`. Only About and Credits use `--container-max`.
- **Letterbox bands.** Any text over video/imagery lives in the bottom band
  (`pb-band`) or top band (`pt-band`), left-aligned, never centered over the frame
  (exceptions: play button, title card).
- **Vertical rhythm:** pinned/stacked scenes have no gap; flowing scenes are separated
  by `gap-section`.
- **Nav:** one `position: sticky` bar from the top of the page (never `fixed`, never
  duplicated). Transparent over the hero; after 100 vh (`stuck`, via an
  IntersectionObserver sentinel) it gains `border-line` and `bg-bg`. Height `--nav-h`.
  Three anchors max. Decided in feature 03: CSS cannot switch absolute→sticky mid-scroll.
- **No sidebar, no hamburger.** Mobile nav is the same three mono words, smaller.
- **Breakpoints:** mobile-first; `md` (768) switches two-column layouts; `lg` (1024)
  widens gutters. Design at 390 px and 1440 px, check 320 and 1920.
- **Prologue plates in 9:16:** the 3×3 grid keeps square-ish tiles by scaling the
  hero image `cover`; plates never leave the viewport horizontally during the scatter
  (scatter radius is a fraction of the shorter viewport side).
- **Aspect ratios are declared** (`aspect-video`, `aspect-[4/5]`) on every media
  container so nothing shifts while loading.

## Core components

| Component                | Rule                                                                                                                                                                                                |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nav**                  | Name (mono) left; `WORK · REEL · CONTACT` right; `text-muted` → `text-primary` on hover/focus; current section not highlighted (it's a film, not a dashboard).                                      |
| **Work card**            | Full viewport, sticky. Video dimmed 70% + bottom scrim. Bottom-left: index, title, client · year. Bottom-right: role badges. Entire card is one `<a>`; inner elements are not separately focusable. |
| **Badge**                | Outline only, never filled. Uppercase mono-sm. Max 3 per card.                                                                                                                                      |
| **Play button**          | 64 px circle, outline, centered on poster; the only round thing on the site. Has `aria-label="Play showreel"`.                                                                                      |
| **Mono label / Eyebrow** | Uppercase, tracked. Never used for sentences longer than ~6 words.                                                                                                                                  |
| **Credits table**        | Two columns, mono, row rules. Omit empty rows; never show "—".                                                                                                                                      |
| **Lightbox**             | Native `<dialog>`; `showModal()`; backdrop click and `Escape` close; focus returns to the trigger.                                                                                                  |
| **Marquee**              | Text only; `aria-hidden` on the duplicated track; the first track is readable by screen readers.                                                                                                    |
| **Prologue plates**      | Nine `<img>` with descriptive `alt` (they are real frames); container `role="img"` with an `aria-label` summarizing the scene; never trap focus; skipped under reduced motion and on repeat visits. |
| **Footer**               | Mono, one line on desktop, stacked on mobile; the only place a second link color (`text-muted`) is default.                                                                                         |

## Typography hierarchy

Exactly four levels visible to a user. Reference `ui-tokens.md` Typography for values.

1. **Display** — one per scene at most (hero name, statement, email).
2. **Title** — project titles, case-study title.
3. **Body** — bio, summaries. Max width `65ch`.
4. **Mono** — labels, nav, credits, badges, indices.
   Never introduce an in-between size; if two elements fight for the same level, one of
   them becomes mono.

## Copy rules

- No exclamation marks. No "welcome". No first-person "I'm passionate".
- Labels uppercase; sentences sentence-case.
- Years as `2026`, runtimes as `01:48`, indices as `01 / 05`.
- Placeholders render literally (`{{FILMMAKER_NAME}}`) so gaps are obvious in review.

## States (never skip)

- **Loading:** posters are the loading state — a `<video>` shows its poster until it
  can play; images reserve space via declared dimensions; nothing spins. The prologue
  plates load with the page (they are tiny); the Phase 5 sequence loads after LCP and
  draws the nearest ready frame, so it is never blank.
- **Empty:** `projects.length === 0` → Selected Work renders a single mono line
  `WORK COMING SOON` inside a `bg-surface` viewport-height block. Stills empty → the
  gallery section is omitted. Credits empty → table omitted.
- **Error:** a loop that fails to load falls back to its poster silently (log
  `[media/VideoLoop] play failed: <slug>`); Vimeo failing shows `REEL UNAVAILABLE —
{{EMAIL}}` in mono. Never a raw error string.
- **Not found:** `/work/unknown` → `not-found.tsx` "missing reel" card, `← WORK` link.
- **Hover (pointer only):** cards un-dim; links draw underline; play button fills soft.
- **Focus:** `focus-visible:outline-accent` on every interactive element. Cards show it
  as an inset ring so it's visible over video.
- **Reduced motion:** see `motion-rules.md`. Every scene, checked, part of Done.

## Accessibility (minimum bar)

- Every image has descriptive `alt`; decorative loops are `aria-hidden="true"` with the
  card title as the link text.
- Color is never the only signal: the active Statement word changes **opacity**
  (a contrast change, not a hue change); badges and states use text, not color.
- Contrast: `text-muted` on `bg` = 5.3:1 ✔; `text-faint` is decorative only (indices),
  never for information.
- Full keyboard path: Nav → cards → play → About links → Contact → footer, in DOM order.
- Skip link `SKIP TO WORK` as first focusable element (visible on focus).
- `<h1>` = filmmaker name (hero); one `<h2>` per scene, visually the mono eyebrow or
  visually hidden when the scene has no heading.
- Videos never autoplay with sound; the Vimeo iframe has a `title` attribute.
- `prefers-reduced-motion` honored everywhere; `prefers-reduced-data` → posters only
  (progressive enhancement, cheap to add in `VideoLoop`).
- Touch targets ≥ 44 px (nav items get padding, not just text size).

## Do nots

- Never use Tailwind default color classes or raw hex/rgb in components.
- Never `position: fixed` (breaks with Lenis and pinning); use `sticky`/`absolute`.
- Never center body text; never justify text.
- Never put text over a face or over the center of a frame.
- Never a colored card background; surfaces are the two greys only.
- Never show raw error messages, spinners, or skeleton shimmer.
- Never a logo wall, a testimonial slider, or a "services" grid.
- Never a hamburger menu, a cookie banner, a chat widget, a scroll-progress bar,
  a preloader or a percentage counter.
- Never an icon library; the play triangle and the close `×` are inline SVG/text.
- Never `100vh` on mobile hero containers — use `100svh`/`100dvh` (address bar).
- Never round corners beyond `radius-sm` except the play button.
- Never more than one `accent` element visible per viewport.
