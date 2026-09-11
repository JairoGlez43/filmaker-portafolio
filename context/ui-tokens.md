<!-- ═══════════════════════════════════════════════════════════
     EDIT LEVEL: PROJECT — the ONLY colors/type/spacing the agent may use.
     The @theme block below IS the source; globals.css must match it exactly.
     If a value is missing, add it here and in globals.css first, then use it.
     ═══════════════════════════════════════════════════════════ -->

# UI Tokens

## How to use

Tokens are Tailwind v4 `@theme` variables in `src/app/globals.css`. Tailwind generates
utilities from them (`bg-bg`, `text-text-primary`, `font-display`…). Where a raw
CSS variable is needed (GSAP, `clip-path`, `ImageResponse`), use `var(--color-*)`.

```
Correct:  className="bg-surface text-text-primary font-mono"
Correct:  style={{ color: 'var(--color-accent)' }}          // only when a utility can't apply
Never:    className="bg-[#0a0a0a] text-gray-300"
Never:    className="bg-black text-white"                    // Tailwind defaults are disabled
```

The default Tailwind palette is removed (`--color-*: initial`) so `text-gray-400`
simply does not exist and fails visibly.

## Token definitions (paste into `globals.css`)

```css
@import 'tailwindcss';

@theme {
  /* Kill defaults so only project tokens exist */
  --color-*: initial;
  --font-*: initial;
  --radius-*: initial;

  /* Fonts — set by next/font in layout.tsx as --font-inter-tight / --font-jetbrains-mono.
     display and sans are the SAME family on purpose (one file, one voice); the display
     token stays so a future change of the display face is one line here. */
  --font-display: var(--font-inter-tight), system-ui, sans-serif;
  --font-sans: var(--font-inter-tight), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;

  /* Backgrounds / surfaces — a black room with two greys */
  --color-bg: #0a0a0a; /* page */
  --color-surface: #121212; /* cards, dialog */
  --color-surface-2: #1c1c1c; /* timeline bars, dividers' bg */

  /* Borders / lines */
  --color-line: #262626; /* 1px rules */
  --color-line-strong: #3a3a3a; /* outline badges, focus base */

  /* Text — warm off-white so it sits with film, not UI */
  --color-text-primary: #f2f0eb;
  --color-text-muted: #8f8d87;
  --color-text-faint: #4f4e4a; /* inactive words in Statement, indices */

  /* Accent — a single record-light red. Sparingly. */
  --color-accent: #e5392d;
  --color-accent-soft: #e5392d33; /* 20% — underline glow, hover fill */

  /* States (used almost only on the dev page and 404) */
  --color-error: #e5392d;
  --color-success: #7fb069;

  /* Overlays over video */
  --color-scrim: #0a0a0ab3; /* 70% dim */
  --color-scrim-soft: #0a0a0a66; /* 40% */

  /* Radius — near-square; film frames aren't round */
  --radius-none: 0px;
  --radius-sm: 2px;
  --radius-full: 9999px; /* play button only */

  /* Type scale — fluid, clamp(min, preferred, max) */
  --text-display-xl: clamp(3rem, 10vw, 11rem); /* hero name, contact email */
  --text-display: clamp(2.25rem, 5vw, 5rem); /* scene titles, statement */
  --text-h2: clamp(1.5rem, 2.5vw, 2.25rem); /* project titles on cards */
  --text-body: clamp(1rem, 1.1vw, 1.125rem);
  --text-mono: 0.8125rem; /* 13px — labels, credits */
  --text-mono-sm: 0.6875rem; /* 11px — indices, eyebrow */

  /* Spacing — 8-based, plus gutters and the letterbox band */
  --spacing-gutter: clamp(1rem, 4vw, 3rem); /* page side padding */
  --spacing-band: clamp(1.25rem, 3vw, 2.5rem); /* bottom/top safe band over video */
  --spacing-section: clamp(6rem, 12vw, 12rem); /* between scenes */

  /* Motion (CSS side; GSAP side in src/lib/motion.ts) */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.87, 0, 0.13, 1);
  --dur-fast: 300ms;
  --dur-base: 600ms;
  --dur-slow: 1100ms;

  /* Layout */
  --container-max: 1600px;
  --nav-h: 64px;
}
```

Note: the `--text-*` and `--spacing-*` entries produce `text-display`, `p-gutter`,
`gap-section` etc. as utilities. Tailwind's numeric spacing scale (`p-4`, `gap-8`)
stays available and is the right tool for component-internal spacing.

## Color usage guide

| Element                                                              | Token                                       |
| -------------------------------------------------------------------- | ------------------------------------------- |
| Page background                                                      | `bg-bg`                                     |
| Card / dialog / 404 card                                             | `bg-surface`                                |
| Timeline bars, contact-sheet slots                                   | `bg-surface-2`                              |
| Rules, table row dividers, nav bottom line                           | `border-line`                               |
| Outline badges (roles), inactive play ring                           | `border-line-strong`                        |
| Headings, project titles, active words                               | `text-text-primary`                         |
| Meta lines, captions, credits values                                 | `text-text-muted`                           |
| Indices `01 / 05`, inactive Statement words                          | `text-text-faint`                           |
| Last Statement word, wipe line, playhead, underline draw, focus ring | `accent`                                    |
| Hover fill on play button, link hover glow                           | `accent-soft`                               |
| Gradient under text on video                                         | `from-scrim to-transparent` (bottom → up)   |
| Dimmed loop (whole video)                                            | `opacity-70` on the `<video>` (not a color) |

Accent appears **at most once per viewport**. If two accent elements are visible at
the same time, one of them is wrong.

## Typography

| Element                                   | Font           | Size token        | Weight | Line height | Tracking          | Color               |
| ----------------------------------------- | -------------- | ----------------- | ------ | ----------- | ----------------- | ------------------- |
| Hero name, contact email                  | `font-display` | `text-display-xl` | 600    | 0.9         | -0.02em           | `text-text-primary` |
| Statement, scene titles, case-study title | `font-display` | `text-display`    | 400    | 1.0         | -0.01em           | `text-text-primary` |
| Project title on card                     | `font-display` | `text-h2`         | 400    | 1.05        | 0                 | `text-text-primary` |
| Body (bio, summary)                       | `font-sans`    | `text-body`       | 400    | 1.55        | 0                 | `text-text-muted`   |
| Mono labels, nav, credits, badges         | `font-mono`    | `text-mono`       | 400    | 1.4         | 0.06em, uppercase | `text-text-muted`   |
| Eyebrow / index / `LOADING REEL`          | `font-mono`    | `text-mono-sm`    | 400    | 1.2         | 0.12em, uppercase | `text-text-faint`   |

Display and body are one family (Inter Tight); the difference between levels is size and
weight, never face. Only two weights exist on the site: **600** for the hero name and the
contact email, **400** for everything else. No italic is loaded: emphasis on a single word
in the Statement or a title is weight 600 or the opacity change the scene already uses.

## Spacing

| Step                | Use                                                       |
| ------------------- | --------------------------------------------------------- |
| `1`–`2` (4–8px)     | Inside badges, between label and value                    |
| `3`–`4` (12–16px)   | Between stacked mono lines, table cell padding            |
| `6`–`8` (24–32px)   | Between title and meta on a card, inside dialog           |
| `12`–`16` (48–64px) | Between blocks inside a scene                             |
| `gutter`            | Left/right page padding, always                           |
| `band`              | Distance of text from the top/bottom edge when over video |
| `section`           | Between scenes (only where scenes aren't pinned/stacked)  |

## Component tokens

| Component             | Spec                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Section**           | `px-gutter`, full-bleed by default; `max-w-[var(--container-max)] mx-auto` only for About and Credits                           |
| **Nav**               | `h-[var(--nav-h)]`, mono, `text-text-muted`, hover → `text-text-primary`; bottom `border-line` appears only when sticky         |
| **Work card**         | `h-screen sticky top-0`; video `object-cover opacity-70`; gradient `bg-gradient-to-t from-scrim`; text block `p-gutter pb-band` |
| **Badge (role)**      | `font-mono text-mono-sm uppercase tracking-[0.12em] border border-line-strong rounded-sm px-2 py-1 text-text-muted`             |
| **Play button**       | `size-16 rounded-full border border-text-primary`; hover `bg-accent-soft border-accent`; icon triangle `text-text-primary`      |
| **Mono label**        | `font-mono text-mono uppercase tracking-[0.06em] text-text-muted`                                                               |
| **Eyebrow**           | as Mono label but `text-mono-sm tracking-[0.12em] text-text-faint`                                                              |
| **Link (text)**       | `text-text-primary`; `::after` 1px `bg-accent` scaleX 0 → 1 on hover, `var(--ease-out) var(--dur-fast)`                         |
| **Credits table**     | 2 cols, `border-t border-line` per row, `py-3`, label = Mono label, value = `text-text-primary font-mono`                       |
| **Dialog (lightbox)** | `bg-bg/95` backdrop, image `max-h-[90vh]`, close = Mono label top-right                                                         |
| **Focus ring**        | `outline-2 outline-offset-4 outline-accent` via `focus-visible:` everywhere                                                     |
| **Prologue plate**    | `aspect-video`, `bg-surface`, image `object-cover`; edge `ring-1 ring-line/40`; chosen-cut state `ring-accent`                  |
| **Marquee**           | Mono label, items separated by `·` with `mx-6`                                                                                  |

## Invariants

- Never use hex values directly in components — always tokens.
- Never use Tailwind's built-in color classes — they are disabled; project tokens only.
- If a needed value doesn't exist, ADD it here (and in `globals.css`) first, then use it.
- `accent` is the only chromatic color. No blues, greens, purples anywhere (success is dev-only).
- No white `#fff` anywhere: `text-primary` is the brightest value on the site.
- Radius is `none` or `sm` except the play button.
- Fluid type comes from the `--text-*` clamps; never a media-query font-size ladder.
