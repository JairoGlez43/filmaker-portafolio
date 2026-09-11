<!-- ═══════════════════════════════════════════════════════════
     EDIT LEVEL: PROJECT — the agent's map of HOW the system is built.
     Keep it a map, not prose. Append to "Key architectural decisions" when
     the architect skill records a choice.
     ═══════════════════════════════════════════════════════════ -->

# Architecture

## Stack

| Layer                 | Tool                                                                          | Purpose                                                  |
| --------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------- |
| Framework             | Next.js 16.x (App Router, `output` default, static generation)                | Routing, RSC, metadata, image/font optimization          |
| Language              | TypeScript 5.x, `strict: true`                                                | Type safety across data → components                     |
| UI                    | React 19                                                                      | Components                                               |
| Styling               | Tailwind CSS v4 (`@tailwindcss/postcss`, CSS-first `@theme`)                  | Tokens as CSS variables + utilities                      |
| Motion                | GSAP 3.13+ (`gsap`, `gsap/ScrollTrigger`), `@gsap/react` (`useGSAP`)          | Timelines, scroll-scrubbed and pinned scenes             |
| Smooth scroll         | `lenis`                                                                       | Inertial scroll, synced to ScrollTrigger                 |
| Fonts                 | `next/font/google` — Inter Tight (display + body), JetBrains Mono            | Self-hosted at build, zero layout shift                  |
| Images                | `next/image` (AVIF/WebP)                                                      | Posters, stills, portrait, OG                            |
| Video (loops)         | Static MP4 (H.264) + WebM (VP9) in `public/video/`                            | Muted autoplay previews                                  |
| Video (full)          | Vimeo unlisted embeds (`player.vimeo.com`)                                    | Showreel and case-study heroes with sound                |
| Prologue v1           | DOM `<img>` plates + CSS 3D transforms driven by GSAP                         | Frames-assemble choreography, shippable without Blender  |
| Prologue v2 (Phase 5) | Blender (Cycles) → WebP frame sequence → `<canvas>` scrubbed by ScrollTrigger | Same choreography with DOF, motion blur, cinematic light |
| Sequence tooling      | `cwebp`, `sharp` (script only)                                                | Convert renders, verify last frame vs poster             |
| Analytics             | `@vercel/analytics`                                                           | Page views + 3 custom events                             |
| Lint/format           | ESLint (`eslint-config-next`), Prettier, `prettier-plugin-tailwindcss`        | Consistency                                              |
| Hosting               | Vercel (Git integration, preview per PR)                                      | Deploy, edge CDN for `public/`                           |
| Package manager       | pnpm                                                                          | Installs and scripts                                     |

## Folder structure

```
reelframe/
├── CLAUDE.md                     # agent entry point
├── memory.md                     # lessons + resume snapshot
├── context/                      # this folder — the spec
├── .claude/skills/               # architect, imprint, review, recover, remember, asset-check
├── public/
│   ├── video/<slug>/loop.mp4|loop.webm      # per-project preview loops (encoded, see asset-pipeline)
│   ├── video/hero/loop.mp4|loop.webm
│   ├── img/prologue/plate-01…09.jpg + first.jpg     # 9 plate frames, sequence frame 1
│   ├── seq/prologue/d/f-001…150.webp                # Phase 5 rendered sequence, 16:9
│   ├── seq/prologue/m/f-001…150.webp                # Phase 5 rendered sequence, 9:16
│   ├── img/<slug>/poster.jpg|still-01.jpg…  # source posters/stills, consumed by next/image
│   ├── img/craft/…                          # storyboard.svg, frames/, log.jpg, grade.jpg
│   ├── img/portrait.jpg
│   └── og/default.jpg
├── scripts/
│   ├── encode-video.mjs          # ffmpeg wrapper: pnpm asset:video <input> <slug>
│   ├── encode-seq.mjs            # cwebp wrapper + last-frame diff: pnpm asset:seq <dir> <d|m>
│   └── content-check.mjs         # slugs, order, asset paths exist
├── src/
│   ├── app/
│   │   ├── layout.tsx            # <html>, fonts, MotionProvider, Analytics
│   │   ├── page.tsx              # "/" — composes the scenes in script order
│   │   ├── work/[slug]/page.tsx  # case study; generateStaticParams from projects
│   │   ├── work/[slug]/opengraph-image.tsx
│   │   ├── not-found.tsx
│   │   ├── sitemap.ts · robots.ts
│   │   └── globals.css           # @import "tailwindcss" + @theme tokens + base + keyframes
│   ├── components/
│   │   ├── scenes/               # one file per scene (00–13). Server Components; import motion leaves
│   │   ├── prologue/             # 'use client' — Prologue (boundary), PlateField (v1 DOM), FrameSequence (v2 canvas)
│   │   ├── motion/               # 'use client' — MotionProvider, LenisProvider, Reveal, ScrubWords, GradeWipe, Marquee…
│   │   ├── media/                # VideoLoop, LazyVimeo, Poster (client where they need refs)
│   │   ├── ui/                   # Badge, MonoLabel, Eyebrow, Button, FocusRing… (presentational)
│   │   └── layout/               # Nav, Footer, Gutter, Section
│   ├── data/
│   │   ├── site.ts               # filmmaker identity + placeholders + VIMEO_REEL_ID
│   │   ├── projects.ts           # Project[] — the whole portfolio
│   │   ├── clients.ts            # string[]
│   │   ├── prologue.ts           # 9 plates {src, alt, tile}, grid, sequence {count, pattern, sizes} (Phase 5)
│   │   └── craft.ts              # the three Craft beats
│   ├── lib/
│   │   ├── content.ts            # typed accessors: getProjects(), getProject(slug), getNextProject(slug)
│   │   ├── constants.ts          # numeric limits, durations, breakpoints (single source)
│   │   ├── analytics.ts          # track(event, props) — the ONLY place events are named
│   │   ├── motion.ts             # shared easings, durations, reduced-motion helpers
│   │   └── format.ts             # pad index "01", runtime "01:48", year
│   └── types/
│       └── content.ts            # Project, Credit, CraftBeat, Site types
├── next.config.ts · postcss.config.mjs · tsconfig.json · eslint.config.mjs · .prettierrc
└── package.json · pnpm-lock.yaml
```

## System boundaries

| Folder                     | Owns                                                                                                              | Must NOT contain                                      |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `src/app/`                 | Routes, layouts, metadata, static params                                                                          | Business logic, GSAP code, hardcoded copy             |
| `src/components/scenes/`   | Composition of one scene from ui/media/motion parts + data                                                        | Direct `gsap` imports, fetching, `'use client'`       |
| `src/components/motion/`   | Every `'use client'` GSAP/Lenis behavior, as thin wrappers                                                        | Copy, data imports, layout decisions                  |
| `src/components/prologue/` | The one scene that owns its renderer: `Prologue` picks `PlateField` (DOM) or `FrameSequence` (canvas); skip logic | Anything scenes 01+ depend on; gsap outside `useGSAP` |
| `src/components/media/`    | `<video>`, Vimeo iframe, poster handling, lazy-loading                                                            | Scene-specific styling                                |
| `src/components/ui/`       | Small presentational primitives                                                                                   | State, effects, data                                  |
| `src/data/`                | Content as typed literals                                                                                         | Functions, formatting, React                          |
| `src/lib/`                 | Pure functions, accessors, constants, analytics wrapper                                                           | React components, DOM access (except `analytics.ts`)  |
| `src/types/`               | Shared types only                                                                                                 | Values                                                |
| `public/`                  | Committed, encoded, final assets                                                                                  | Raw exports, source footage, anything > limits        |

## Data flow

```
Content (static)
  src/data/projects.ts ──▶ src/lib/content.ts ──▶ scenes/*.tsx (RSC) ──▶ HTML
                                                  └──▶ work/[slug]/page.tsx (generateStaticParams)

Scroll → motion
  wheel/touch ──▶ Lenis (raf) ──▶ ScrollTrigger.update() ──▶ scrubbed timelines ──▶ transform/opacity only

Video loop lifecycle
  IntersectionObserver (near viewport) ──▶ set <source src> ──▶ ScrollTrigger onEnter play() / onLeave pause()
                                                             └──▶ max 2 playing (VideoLoop registry in motion/)

Prologue (v1 DOM)
  scroll ──▶ ScrollTrigger (pin 250vh, scrub) ──▶ per-plate transform/opacity ──▶ un-pin ──▶ Opening.play()

Prologue (v2 canvas, Phase 5)
  hero poster loaded ──▶ FrameSequence preloads f-001… (priority order) ──▶ ImageBitmap cache
  scroll progress p ──▶ frame = round(p × (count−1)) ──▶ drawImage(nearest loaded) ──▶ frame 150 == poster ──▶ un-pin

Showreel
  click ──▶ track('reel_play') ──▶ mount <LazyVimeo> iframe ──▶ Escape/close ──▶ unmount

Analytics
  component ──▶ src/lib/analytics.ts track() ──▶ @vercel/analytics track()
```

## Data model (no DB — typed literals)

```ts
// src/types/content.ts
export type Role = 'director' | 'editor' | 'colorist' | 'dop';

export interface Credit {
  label: string;
  value: string;
} // { label: 'DOP', value: '{{NAME}}' }

export interface Project {
  slug: string; // 'northern-light' — folder name under public/video and public/img
  title: string;
  client: string; // '{{CLIENT_01}}' until real
  year: number;
  roles: Role[];
  order: number; // position in Selected Work and Next-project chain
  runtime?: string; // '01:48'
  vimeoId?: string; // case-study hero; optional → poster only
  loop: Loop; // { mp4, webm, poster, durationSec }
  stills: Still[]; // { src, alt, width, height }
  credits: Credit[];
  summary: string; // 1–2 sentences for the case study + OG description
  fictional: true; // stays true until a real client replaces the data
}

export interface CraftBeat {
  id: 'direction' | 'edit' | 'color';
  caption: string;
  assets: Record<string, string>; // beat-specific paths, see experience-script §04
}

export interface ProloguePlate {
  src: string;
  alt: string;
  tile: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}
export interface PrologueConfig {
  plates: ProloguePlate[]; // exactly 9
  grid: { cols: 3; rows: 3 };
  sequence?: {
    // Phase 5; absent → DOM version renders
    count: number; // 150 or 120
    pattern: string; // '/seq/prologue/{set}/f-{n}.webp'
    sizes: { d: [1600, 900]; m: [900, 1600] };
  };
}

export interface Site {
  name: string;
  city: string;
  roleLine: string;
  statement: string;
  bio: [string, string, string];
  availability: string;
  email: string;
  socials: { label: string; href: string }[];
  vimeoReelId: string;
  reelRuntime: string;
  developer: { name: string; href: string };
  assets: SiteAssets; // hero loop, reel poster, portrait, OG default — assets that belong to no project
}

export interface SiteAssets {
  heroLoop: Loop;
  reelPoster: string;
  portrait: Still;
  ogDefault: string;
}
```

Validation: `scripts/content-check.mjs` (`pnpm content:check`) imports the data files
directly and checks slugs, contiguous `order`, canonical asset paths per slug, still
dimensions and alt text, and — for files that exist — size limits from `constants.ts`.
Missing files are reported as the ⏸ HUMAN deliverable list (`--allow-missing` lets
phases 1–2 pass without assets). `src/lib/content.ts` stays pure: accessors only.

## Storage

None. All assets are committed under `public/`. Hard limits and encoding live in
`asset-pipeline.md`. If total `public/video` exceeds 40 MB, that is a signal to
move loops to a video host — raise it, don't silently do it.

## Authentication

None in v1.

## Rendering strategy

- Every route is statically generated at build. No `dynamic`, no `revalidate`, no
  server actions, no route handlers in v1.
- `opengraph-image.tsx` per project uses `ImageResponse` at build time.
- Client boundaries are leaves: `MotionProvider` (Lenis + GSAP registration, once in
  `layout.tsx`), motion wrappers, `VideoLoop`, `LazyVimeo`, `Lightbox`. Scenes stay
  server-rendered so the HTML is complete without JS (progressive enhancement:
  posters and copy are visible before hydration).

## Integration patterns

**GSAP inside a client component (canonical):**

```tsx
'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { EASE, DUR } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(ref.current, {
          yPercent: 100,
          duration: DUR.slow,
          ease: EASE.out,
          scrollTrigger: { trigger: ref.current, start: 'top 85%' },
        });
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.from(ref.current, { opacity: 0, duration: DUR.fast });
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="overflow-hidden">
      {children}
    </div>
  );
}
```

`useGSAP` handles cleanup (`gsap.context` revert) on unmount. Never call `gsap.to`
outside it in React code.

**Lenis + ScrollTrigger sync (only in `MotionProvider`):**

```tsx
const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
const tick = (t: number) => lenis.raf(t * 1000);
gsap.ticker.add(tick);
gsap.ticker.lagSmoothing(0);
return () => {
  gsap.ticker.remove(tick);
  lenis.destroy();
};
```

Disabled entirely under `prefers-reduced-motion: reduce` (native scroll).

**Video loop element (canonical attributes):**

```tsx
<video muted playsInline loop preload="metadata" poster={poster} aria-hidden="true">
  <source data-src={webm} type="video/webm" />
  <source data-src={mp4} type="video/mp4" />
</video>
```

`data-src` → `src` is set by `VideoLoop` when within 1 viewport of the screen.

**Frame sequence on canvas (Phase 5, canonical core):**

```tsx
const frames: (ImageBitmap | undefined)[] = [];
const draw = (i: number) => {
  let j = i;
  while (j >= 0 && !frames[j]) j--; // nearest loaded frame ≤ i
  if (j < 0) return;
  const img = frames[j],
    c = canvas.current!,
    ctx = c.getContext('2d')!;
  const s = Math.max(c.width / img.width, c.height / img.height); // cover
  ctx.drawImage(
    img,
    (c.width - img.width * s) / 2,
    (c.height - img.height * s) / 2,
    img.width * s,
    img.height * s,
  );
};
ScrollTrigger.create({
  trigger,
  start: 'top top',
  end: `+=${PIN.prologueVh}%`,
  pin: true,
  scrub: SCRUB.base,
  onUpdate: (st) => draw(Math.round(st.progress * (count - 1))),
});
```

Frames are fetched with `createImageBitmap(await (await fetch(url)).blob())` in the
priority order from `asset-pipeline.md`, after the hero poster's `load` event.

**Vimeo (lazy):**
`https://player.vimeo.com/video/${id}?autoplay=1&muted=${muted ? 1 : 0}&title=0&byline=0&portrait=0&dnt=1`
Mounted only after user intent. `dnt=1` always (no Vimeo tracking cookies).

## Key architectural decisions

_Appended by the `architect` skill: date · decision · why._

- 2026-09 · Static Next.js over Astro · The developer wants Next.js/Vercel experience on the portfolio; RSC + `next/image` + OG generation cover every v1 need without a server.
- 2026-09 · GSAP over Framer Motion / CSS scroll-timeline · Pinning, scrubbing and Lenis sync are first-class in ScrollTrigger; scroll-driven CSS animations lack pin semantics and Safari coverage was judged insufficient for the signature scenes.
- 2026-09 · Text marquee for clients, no logos · Avoids logo licensing, matches the typographic language, cheaper to ship.
- 2026-09 · Vimeo for sound-on video, self-hosted for muted loops · Loops need instant, controllable playback (play/pause on scroll); the reel needs adaptive bitrate and sound. Two different problems, two tools.

- 2026-09 · Prologue = frames assembling into the hero image (not an abstract camera) · Tells the editor's story, shows real footage from 0 % (5-second rule), works in 9:16, seam-free hand-off, and the plates are swappable per client.
- 2026-09 · Prologue shipped twice: DOM/GSAP first (Phase 2), Blender frame sequence later (Phase 5) · The choreography is simple enough for CSS 3D; the render adds DOF/motion blur/light. A release never waits on Blender.
- 2026-09 · No Three.js in v1 or v2 · The pre-rendered sequence gives higher visual fidelity than real-time for a non-interactive prologue, at a fraction of the risk. Revisit only if interactivity becomes a requirement.
- 2026-09-11 · The project root is the git repo root; the existing `create-next-app` scaffold was reorganized into `src/` instead of regenerated · one root, one `package.json`, the GitHub remote already points here, and the scaffold was untouched default output.
- 2026-09-11 · Tooling stays as close to framework defaults as possible · stock `eslint-config-next` flat config, no type-checked lint layer, no config the framework does not ship; deviations must earn their place with a concrete failure they prevent.
- 2026-09-11 · One text family: Inter Tight for display and body, weights 600/400, no italic; JetBrains Mono for labels (provisional) · chosen by the developer on the `/dev/type` specimen against serif, extended and condensed candidates — coherence of a single voice, one font file for all text, and a neutral grotesque that never competes with the footage. The `--font-display` token is kept so the display face stays a one-line change.

## Invariants

- Scenes never import `gsap` or `lenis`; only `src/components/motion/*` and `src/components/prologue/*` may.
- The prologue never delays the hero: sequence assets download after LCP, and the DOM version is always available as fallback.
- Components never read `src/data/*` directly; they go through `src/lib/content.ts`.
- No route is dynamic at runtime. If a feature needs a server, stop and raise it.
- Every `<video>` is muted, has a poster, and is registered with `VideoLoop` (play/pause/limit).
- No third-party script or iframe mounts before a user interaction (Vimeo, none other).
- All numeric limits (video size, max playing videos, durations) come from `src/lib/constants.ts`.
- All analytics event names come from `src/lib/analytics.ts`; nowhere else.
- No secrets exist in this project. If one appears (API key), it's a scope change.
- `public/` receives only encoded outputs from `asset-pipeline.md`, never raw exports.
