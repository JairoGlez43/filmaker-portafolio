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

| Name    | Path | Purpose | Key props | Notes |
| ------- | ---- | ------- | --------- | ----- |
| _empty_ |      |         |           |       |

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

## Deprecated

_Anything replaced goes here with what replaced it, so the agent avoids it._
