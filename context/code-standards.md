<!-- ═══════════════════════════════════════════════════════════
     EDIT LEVEL: SLOTS — PART A is ENGINE (leave it). PART B is project-specific.
     These conventions prevent pattern drift across sessions.
     ═══════════════════════════════════════════════════════════ -->

# Code Standards

# ─────────────────────────────────────────────

# PART A — UNIVERSAL (ENGINE, do not edit)

# ─────────────────────────────────────────────

## Engineering mindset

The agent operates as a senior engineer:

- Think before implementing — understand what and why before writing a line.
- Read the context files first — never assume; verify against them.
- Scope is sacred — build only what the current feature requires.
- Every feature must be testable — if it can't be verified now, it's incomplete.
- Clean over clever — readable code a junior can follow beats clever abstractions.
- One thing at a time — finish one feature fully before the next.
- Failures are expected — wrap risky operations in try/catch, log, never let one
  failure crash everything.

## Typing & correctness

- Strictest type checking the language allows — on, no exceptions.
- No escape hatches (`any`, untyped casts) unless commented with why.
- All function inputs and outputs explicitly typed.
- Handle the error path explicitly — never swallow errors, never leave a promise unhandled.
- Prefer immutability; reassign only when necessary.

## Structure

- One component/module per file; named exports; no god-files.
- Business logic lives in the logic layer, never inside UI components.
- Route handlers contain no business logic — they delegate.
- Use the project's import alias; never deep relative paths (`../../../`).

## Error handling

- Never empty catch blocks — always log or handle.
- Logs include a context prefix: `[area/function]`.
- User-facing errors are human-readable — never expose raw internals.
- Functions that can fail return a consistent result shape (see PART B).

## Comments

- Explain WHY, not WHAT. Code should be self-explanatory otherwise.
- No TODOs left in committed code.

## Dependency discipline

Before installing anything, ask:

1. Does the framework already provide it?
2. Does an approved library already cover it?
3. Is there a simpler native solution (CSS, platform API)?
   Only then add it — and record it in PART B's approved list first.

# ─────────────────────────────────────────────

# PART B — PROJECT-SPECIFIC

# ─────────────────────────────────────────────

## Framework conventions (Next.js 16, App Router)

- **Always read the official docs before using a framework API.** Next.js 16 is newer
  than model training data. Append `.md` to any `nextjs.org/docs/...` URL to get
  agent-readable markdown. Verify: `params` is a Promise in pages/layouts/metadata
  (`const { slug } = await params`), caching semantics, `next/image` props,
  `next/font` usage, `ImageResponse` import path.
- **Server Components by default.** A file gets `'use client'` only if it uses refs,
  effects, state, or browser APIs. Allowed client folders: `components/motion/*`,
  `components/media/*`, `Lightbox`, `Nav` (scroll state). Anything else needing
  `'use client'` is a design smell — raise it.
- **Static only.** No `dynamic = 'force-dynamic'`, no `revalidate`, no server actions,
  no route handlers, no middleware in v1.
- **Data access** is compile-time: import from `@/lib/content` in Server Components.
  Never pass the whole `projects` array to a client component — pass the minimal
  props it renders.
- **Metadata** via `generateMetadata` / `metadata` exports only. OG images via
  `opengraph-image.tsx` colocated with the route.
- **Images** always `next/image` with explicit `width`/`height` or `fill` + `sizes`.
  Never a raw `<img>` (except inside `ImageResponse`).
- **Fonts** only via `next/font/google` in `layout.tsx`, exposed as CSS variables that
  `ui-tokens.md` maps to `--font-*`.
- **Links** always `next/link`. External links get `rel="noopener noreferrer"`.

## File & folder naming

| Thing                 | Casing                                                       | Example                                                |
| --------------------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| Folders               | kebab-case                                                   | `components/motion/`, `work/[slug]/`                   |
| React components      | PascalCase file + named export                               | `GradeWipe.tsx` → `export function GradeWipe`          |
| Scenes                | `NN-Name.tsx`                                                | `03-SelectedWork.tsx` → `export function SelectedWork` |
| Hooks                 | `useX.ts`                                                    | `useVideoRegistry.ts`                                  |
| Lib / utils           | camelCase                                                    | `content.ts`, `format.ts`                              |
| Types                 | PascalCase types in `types/*.ts`                             | `Project`, `CraftBeat`                                 |
| Data files            | camelCase, export a `const`                                  | `projects.ts` → `export const projects: Project[]`     |
| Scripts               | kebab-case `.mjs`                                            | `encode-video.mjs`                                     |
| Assets                | kebab-case, per-slug folders                                 | `public/video/salt-roads/loop.mp4`                     |
| CSS custom properties | `--color-*`, `--font-*`, `--radius-*`, `--ease-*`, `--dur-*` | see ui-tokens.md                                       |

## Canonical code shapes

**Scene (Server Component):**

```tsx
// src/components/scenes/03-SelectedWork.tsx
import { getProjects } from '@/lib/content';
import { Section } from '@/components/layout/Section';
import { WorkCard } from '@/components/scenes/parts/WorkCard';

export function SelectedWork() {
  const projects = getProjects();
  return (
    <Section id="work" label="Selected work">
      {projects.map((p, i) => (
        <WorkCard key={p.slug} project={p} index={i} total={projects.length} />
      ))}
    </Section>
  );
}
```

**Motion wrapper (Client Component):** see `architecture.md` → Integration patterns.
Rules: `gsap.registerPlugin` at module top; all tweens inside `useGSAP` with `scope`;
`gsap.matchMedia()` for reduced motion; no DOM queries outside `scope`.

**Lib function with a result shape:**

```ts
export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export function getProject(slug: string): Result<Project> {
  const p = projects.find((x) => x.slug === slug);
  return p ? { ok: true, data: p } : { ok: false, error: `Unknown project "${slug}"` };
}
```

Pages call `notFound()` on `!ok`. Never throw for expected misses.

**Analytics call:**

```ts
import { track } from '@/lib/analytics';
track('work_open', { slug, from: 'home' });
```

**Constants usage:**

```ts
import { LIMITS } from '@/lib/constants';
if (playing.size >= LIMITS.maxPlayingVideos) pauseOldest();
```

## Data/client usage

- No backend client. The "client" is `@/lib/content` (pure, synchronous, typed).
- `@vercel/analytics` is imported only in `layout.tsx` (`<Analytics />`) and
  `@/lib/analytics` (`track`). Nowhere else.
- Vimeo is never called via API; only the iframe URL from `architecture.md`.

## Tracked events (analytics)

Rule: never invent an event without adding it here first.

| Event           | Fires when                                                       | Properties                                                    |
| --------------- | ---------------------------------------------------------------- | ------------------------------------------------------------- |
| `reel_play`     | User clicks play on the Showreel (scene 05) or a case-study hero | `{ source: 'home' \| 'work', slug?: string }`                 |
| `work_open`     | User navigates to `/work/[slug]` from a card or the Next strip   | `{ slug: string, from: 'home' \| 'next' }`                    |
| `contact_click` | User clicks the email or a social link                           | `{ target: 'email' \| 'instagram' \| 'vimeo' \| 'linkedin' }` |

## Environment variables

| Variable                                                                      | Used in                                              | Public?              | Purpose                                  |
| ----------------------------------------------------------------------------- | ---------------------------------------------------- | -------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                                        | `layout.tsx` metadataBase, `sitemap.ts`, `robots.ts` | yes                  | Absolute URLs for OG/sitemap             |
| `NEXT_PUBLIC_VERCEL_ENV`                                                      | `analytics.ts`                                       | yes (auto by Vercel) | Log events to console outside production |
| No secrets. If a feature needs one, it is a scope change — stop and raise it. |
| Rule: never hardcode a URL or key. `.env.example` lists every variable.       |

## Project constants (`src/lib/constants.ts`)

| Name                                                                                 | Value                      | Used by                                         |
| ------------------------------------------------------------------------------------ | -------------------------- | ----------------------------------------------- |
| `LIMITS.maxPlayingVideos`                                                            | `2`                        | `VideoLoop` registry                            |
| `LIMITS.videoLoadMarginPx`                                                           | `800`                      | IntersectionObserver `rootMargin`               |
| `LIMITS.curtainMaxMs`                                                                | `2500`                     | Scene 00                                        |
| `LIMITS.loopMaxBytes`                                                                | `3 * 1024 * 1024`          | `asset-check`, `content:check`                  |
| `LIMITS.heroLoopMaxBytes`                                                            | `4 * 1024 * 1024`          | same                                            |
| `LIMITS.sceneVideoMaxBytes`                                                          | `15 * 1024 * 1024`         | Selected Work total                             |
| `PIN.statementVh`                                                                    | `150`                      | Scene 02                                        |
| `PIN.craftVh`                                                                        | `120`                      | Scene 04                                        |
| `PIN.prologueVh`                                                                     | `250`                      | Scene 00                                        |
| `SEQ.count`                                                                          | `150`                      | `FrameSequence`, `asset:seq`                    |
| `SEQ.firstFrameMs`                                                                   | `1500`                     | fallback to DOM prologue if frame 1 isn't ready |
| `SEQ.dprCap`                                                                         | `1.5`                      | canvas sizing                                   |
| `SEQ.priorityStride`                                                                 | `[8, 4, 1]`                | preload order                                   |
| `LIMITS.seqMaxBytes`                                                                 | `{ d: 6.5 MB, m: 4.5 MB }` | `asset:seq`, `asset-check`                      |
| `LIMITS.posterMaxBytes` | `250 KB` | `content:check` (project, hero and reel posters) |
| `LIMITS.stillMaxBytes` | `400 KB` | `content:check` |
| `LIMITS.plateMaxBytes` | `150 KB` | `content:check` (prologue plates) |
| `LIMITS.portraitMaxBytes` | `300 KB` | `content:check` |
| `LIMITS.ogMaxBytes` | `200 KB` | `content:check` |
| `LIMITS.craftStoryboardMaxBytes` / `craftDirectionMaxBytes` / `craftFrameMaxBytes` / `craftGradeMaxBytes` | `40 KB` / `300 KB` / `60 KB` / `300 KB` | `content:check` (scene 04 assets) |
| `LIMITS.loopDurationSec` / `heroLoopDurationSec` | `{ min: 6, max: 8 }` / `{ min: 8, max: 12 }` | `content:check` |
| `LIMITS.maxRolesPerProject` | `3` | `content:check` (ui-rules → Badge: max 3 per card) |
| `PROLOGUE_SKIP_KEY`                                                                  | `'rf:prologue-seen'`       | sessionStorage flag                             |
| `BREAKPOINT.md / .lg`                                                                | `768` / `1024`             | `gsap.matchMedia` queries, `sizes`              |

Motion values (`EASE`, `DUR`) live in `src/lib/motion.ts` and mirror `ui-tokens.md`.
Rule: never write these literals anywhere else.

## Lint & format

- ESLint: the stock flat config from `create-next-app` — `eslint-config-next/core-web-vitals`
  + `eslint-config-next/typescript`. Nothing else. Type-checked rules
  (`@typescript-eslint/recommended-type-checked`) were considered in feature 01 and
  dropped: they need a `projectService` setup that is the most brittle part of the
  toolchain, for rules `tsc --noEmit` mostly already covers. Do not add them back
  without a concrete bug they would have caught.
- The `no-restricted-imports` guards (`gsap`/`lenis` only inside
  `src/components/motion/**` and `src/components/prologue/**`; `@/data/*` only inside
  `src/lib/content.ts`) land with the folders they protect — data guard in feature 02,
  motion guard in feature 04 — not before.
- Prettier with `prettier-plugin-tailwindcss` (class order), `printWidth: 100`, single quotes.
  `.prettierignore` excludes markdown: `CLAUDE.md`, `memory.md` and `context/` are the
  spec and must not be reformatted by tooling.
- Tailwind class strings: utilities only from `@theme` tokens. `grep` guard in
  `review`: `text-gray|bg-gray|text-white|bg-black|#[0-9a-f]{3,6}` in `src/components` → 0 hits.

## Approved dependencies

Runtime: `next`, `react`, `react-dom`, `gsap`, `@gsap/react`, `lenis`, `@vercel/analytics`.
Dev: `typescript`, `tailwindcss`, `@tailwindcss/postcss`, `postcss`, `eslint`,
`eslint-config-next`, `typescript-eslint`, `prettier`, `prettier-plugin-tailwindcss`,
`@types/node`, `@types/react`, `@types/react-dom`.
Dev, scripts only (never imported by `src/`): `sharp` (last-frame diff in `encode-seq.mjs`).
Tooling (not in package.json): `ffmpeg` ≥ 6 and `cwebp` (libwebp) on PATH; Blender 4.x for Phase 5.

Explicitly **not** approved: `framer-motion`, `three`, `@react-three/*`, `clsx`/`cn`
helpers (use template literals or a 3-line local `cx`), `lodash`, UI kits (shadcn,
Radix, MUI), state libraries, `sharp` direct usage (next/image handles it).
Rule: don't add to this list without a clear reason written into `architecture.md` decisions.
