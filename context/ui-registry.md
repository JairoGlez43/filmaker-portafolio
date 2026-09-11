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

| Name    | Path | Purpose | Key props | Notes |
| ------- | ---- | ------- | --------- | ----- |
| _empty_ |      |         |           |       |

## Components — `layout/`

| Name | Path | Purpose | Key props | Notes |
| --- | --- | --- | --- | --- |
| `Section` | `src/components/layout/Section.tsx` | Scene wrapper: `<section id>` + the scene's one `<h2>`, `px-gutter` full-bleed | `id`, `label`, `heading: 'eyebrow' \| 'hidden'` (default hidden), `contained` (About/Credits only), `className` | Server component. `aria-labelledby` wired to the h2. Anchor target for Nav links. |
| `Nav` | `src/components/layout/Nav.tsx` | Sticky primary nav: name left, `WORK · REEL · CONTACT` right | `name: string` | **Client** (IntersectionObserver on a 100 svh sentinel → `stuck`: `border-line` + `bg-bg`). Sticky from the top, not absolute→sticky. Links are hash anchors until Lenis (04) takes `scrollTo`. Needs `body.relative`. |
| `SkipLink` | `src/components/layout/SkipLink.tsx` | `SKIP TO WORK`, first focusable on every page | — | `sr-only` until `focus-visible`. Must stay the first child of `<body>`. |
| `Footer` | `src/components/layout/Footer.tsx` | Colophon: © year name · Site by dev · type credit | — | Server component; reads `getSite()`. Year computed at build. Links `text-muted` by default here (ui-rules). |

## Components — `media/` (video, embeds, images)

| Name    | Path | Purpose | Key props | Notes |
| ------- | ---- | ------- | --------- | ----- |
| _empty_ |      |         |           |       |

## Components — `motion/` (client wrappers)

| Name    | Path | Purpose | Key props | Notes |
| ------- | ---- | ------- | --------- | ----- |
| _empty_ |      |         |           |       |

## Scenes — `scenes/`

| Scene   | Path | Composes | Assets | Notes |
| ------- | ---- | -------- | ------ | ----- |
| _empty_ |      |          |        |       |

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
