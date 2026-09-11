<!-- ═══════════════════════════════════════════════════════════
     EDIT LEVEL: SLOTS — the protocol is ENGINE (leave it). One section per
     library. This file is NOT a copy of official docs — it's how THIS project
     uses each library. Fill "Version pinned" from pnpm-lock after feature 01.
     ═══════════════════════════════════════════════════════════ -->

# Library Docs (project-specific usage)

## Before using any library (ENGINE — do not edit)

Order of authority when writing code against a third-party library:

```
Official docs (fetched now)  →  installed skill  →  this file (project rules)  →  general knowledge
```

1. Fetch the current official docs for the exact API you're about to call.
2. Check for an installed skill (`.claude/skills/`, or vendor skills like `gsap-skills`).
3. Read this file for the project-specific rules that override general knowledge.
4. Only then fall back to general knowledge — and treat it as possibly outdated.

Never rely on training knowledge alone for library APIs. They change frequently.
Record the exact installed version here after `pnpm install`.

---

### Next.js

**Check first:** `https://nextjs.org/docs` — append `.md` to any docs URL for markdown.
Key pages: App Router `page.js` / `layout.js` file conventions, `generateStaticParams`,
`generateMetadata`, `opengraph-image`, `next/image`, `next/font`, `not-found`.
**Version pinned:** next 16.3.4, react 19.2.8, react-dom 19.2.8, typescript 5.9.3,
eslint 9.39.5, eslint-config-next 16.3.4 (installed 2026-09-11, feature 01).
**How we use it here:** fully static App Router site. Server Components everywhere
except motion/media leaves. Content is imported at build time from `@/lib/content`.
No server-side features.
**Canonical snippet:**

```tsx
// src/app/work/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProject, getProjects } from '@/lib/content';

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = getProject(slug);
  if (!r.ok) return {};
  return { title: r.data.title, description: r.data.summary };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getProject(slug);
  if (!r.ok) notFound();
  return <CaseStudy project={r.data} />;
}
```

**Gotchas:**

- `params` and `searchParams` are Promises — always `await`.
- `next/image` with `fill` requires a positioned parent with a declared aspect ratio and a `sizes` prop, or it downloads the largest candidate.
- `next/font/google` must be called at module scope in `layout.tsx`, not inside a component body.
- Turbopack is the default bundler; if a GSAP import path misbehaves, check the docs' "Turbopack" notes before blaming GSAP.
- `ImageResponse` import path and font loading for OG images: verify in docs at feature 20.
  **Rules:** no `'use client'` in `app/`; no `dynamic`, `revalidate`, actions, route handlers, middleware; `next/link` and `next/image` always.

### Tailwind CSS v4

**Check first:** `https://tailwindcss.com/docs` (v4: theme variables, `@theme`, `@tailwindcss/postcss`).
**Version pinned:** tailwindcss 4.3.3, @tailwindcss/postcss 4.3.3, prettier 3.9.6,
prettier-plugin-tailwindcss 0.8.1 (installed 2026-09-11, feature 01).
**How we use it here:** CSS-first. One `@theme` block in `globals.css` (copied from
`ui-tokens.md`). No `tailwind.config.*`. Default color/font/radius namespaces reset
with `--color-*: initial` etc. so only project tokens produce utilities.
**Canonical snippet:** see `ui-tokens.md` → Token definitions.
**Gotchas:**

- `@theme` variables generate utilities by namespace: `--color-x` → `bg-x/text-x/border-x`, `--font-x` → `font-x`, `--text-x` → `text-x`, `--spacing-x` → `p-x/gap-x/…`, `--radius-x` → `rounded-x`.
- Arbitrary values (`bg-[#000]`) still compile — the lint grep in `review` is what blocks them.
- `prettier-plugin-tailwindcss` sorts classes; don't hand-order.
- Use `size-16` (v4) rather than `w-16 h-16`.
  **Rules:** tokens only; no `@apply` in components (write utilities in JSX); component-scoped CSS only for `clip-path`/`::after` tricks in `globals.css` under `@layer components`.

### GSAP + ScrollTrigger + @gsap/react

**Check first:** `https://gsap.com/docs/v3/` and install the vendor skill:
`npx skills add https://github.com/greensock/gsap-skills` (core, timeline,
scrolltrigger, react, performance modules). GSAP 3.13+ is fully free including all
plugins; install from public npm, no `.npmrc`.
**Version pinned:** gsap 3.13.x, @gsap/react 2.x — fill exact.
**How we use it here:** only inside `src/components/motion/*`. Every tween/timeline
is created within `useGSAP(() => {...}, { scope })` so cleanup is automatic. Reduced
motion via `gsap.matchMedia()`. Scrubbed scenes use `ease: 'none'` + `scrub`.
Plugins used: `ScrollTrigger` only (SplitText not needed — words split in React).
**Canonical snippet:** `architecture.md` → Integration patterns (Reveal). Pin + scrub:

```tsx
useGSAP(
  () => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: `+=${PIN.statementVh}%`,
          pin: true,
          pinSpacing: true,
          scrub: SCRUB.base,
        },
      });
      tl.to('.word', { opacity: 1, ease: 'none', stagger: { each: 0.1 } });
    });
  },
  { scope: ref },
);
```

**Gotchas:**

- Register plugins once at module top: `gsap.registerPlugin(ScrollTrigger, useGSAP)`.
- `ScrollTrigger.refresh()` after layout-affecting loads (fonts, hero poster). `MotionProvider` does this once; don't sprinkle it.
- Selectors inside `useGSAP` are scoped to `scope` — use class selectors, not `document.querySelector`.
- SSR: `gsap` imports are fine in client components; never import in Server Components.
- `pin` + Lenis works only with the ticker sync in `MotionProvider`; never `scrollerProxy` (that's for other smooth-scroll libs).
  **Rules:** no `gsap` outside `motion/`; no tween outside `useGSAP`; no `setTimeout` sequencing; ease/duration from `@/lib/motion`.

### Lenis

**Check first:** `https://github.com/darkroomengineering/lenis` (README + `lenis/react` notes).
**Version pinned:** 1.x — fill exact.
**How we use it here:** one instance in `MotionProvider`, plain class (not the React
wrapper, to keep the GSAP ticker as the single raf). Destroyed on unmount. Not created
under reduced motion.
**Canonical snippet:** `architecture.md` → Lenis + ScrollTrigger sync.
**Gotchas:**

- Requires `html.lenis, html.lenis body { height: auto }` and `.lenis.lenis-smooth { scroll-behavior: auto }` base CSS (from the README) — add to `globals.css` base layer.
- `position: fixed` elements fight Lenis transforms → this is why ui-rules bans it.
- `lenis.scrollTo('#work')` for nav anchors (with `offset: -NAV_H`); native anchor jumps break the sync.
- Native `<dialog>` scroll lock: call `lenis.stop()` when the lightbox opens, `lenis.start()` on close.
  **Rules:** one instance, one raf (GSAP ticker), destroyed on unmount, off under reduced motion.

### @vercel/analytics

**Check first:** `https://vercel.com/docs/analytics/quickstart` and `.../custom-events`.
**Version pinned:** fill exact.
**How we use it here:** `<Analytics />` in `layout.tsx`; `track()` wrapped in
`@/lib/analytics` so event names are typed and centralized.
**Canonical snippet:**

```ts
// src/lib/analytics.ts
import { track as vercelTrack } from '@vercel/analytics';
type Events = {
  reel_play: { source: 'home' | 'work'; slug?: string };
  work_open: { slug: string; from: 'home' | 'next' };
  contact_click: { target: 'email' | 'instagram' | 'vimeo' | 'linkedin' };
};
export function track<K extends keyof Events>(name: K, props: Events[K]): void {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production')
    console.info('[analytics/track]', name, props);
  vercelTrack(name, props);
}
```

**Gotchas:** custom events require the Analytics feature enabled on the Vercel project; property values must be primitives.
**Rules:** three events only (see `code-standards.md`); no other analytics/tracking.

### Vimeo player (iframe, no SDK)

**Check first:** `https://developer.vimeo.com/player/sdk/embed` (URL parameters).
**Version pinned:** n/a (hosted player).
**How we use it here:** iframe mounted on user intent only, URL from `architecture.md`.
Always `dnt=1`. `title=0&byline=0&portrait=0`. Muted autoplay for case-study heroes,
sound for the showreel (after click).
**Gotchas:** unlisted videos need the `h=` hash param in the URL — store the full
`vimeoId` as `"123456789?h=abcdef"` if unlisted, or make the video public-unlisted with
domain-level privacy. Autoplay with sound is blocked without a user gesture; our click
is the gesture, so mount inside the click handler's effect.
**Rules:** no Vimeo SDK; no iframe before interaction; `title` attribute on the iframe.

### Node (scripts)

**Check first:** `node --version` ≥ 24; `https://nodejs.org/api/typescript.html` (type stripping).
**Version pinned:** Node 24.16.0 on the developer's machine (2026-09-11).
**How we use it here:** `scripts/*.mjs` import `src/data/*.ts` and `src/lib/constants.ts`
directly — Node strips the types natively, so the scripts read the same data and limits
as the site with no extra dependency (no `tsx`, no `ts-node`). `package.json` has
`"type": "module"` so Node does not warn about the `.ts` modules.
**Gotchas:** only erasable TypeScript syntax is allowed in files a script imports —
`import type`, annotations, `as const`, `satisfies`. No `enum`, no `namespace`, no
parameter properties, no `import x = require()`. Value imports of `@/…` aliases do not
resolve in Node: data files may only `import type` from `@/types/*`, and scripts import
data by relative path, never `src/lib/content.ts`.
**Rules:** scripts import data and constants, never components; a script never writes
under `src/`.

### ffmpeg (tooling)

**Check first:** `ffmpeg -version` ≥ 6; `https://trac.ffmpeg.org/wiki/Encode/H.264`, `.../Encode/VP9`.
**Version pinned:** whatever Homebrew/apt provides; record here.
**How we use it here:** only through `scripts/encode-video.mjs` (`pnpm asset:video`).
Presets in `asset-pipeline.md`.
**Gotchas:** VP9 two-pass writes `ffmpeg2pass-0.log` in CWD — the script deletes it;
`-an` is mandatory (loops must have no audio track, or iOS may refuse autoplay).
**Rules:** never hand-tune encodes; change the script.

### Canvas frame sequence (no library — Phase 5)

**Check first:** MDN `createImageBitmap`, `CanvasRenderingContext2D.drawImage`, `devicePixelRatio`.
**How we use it here:** `FrameSequence` in `src/components/prologue/`. Frames decoded once
to `ImageBitmap`, drawn cover-fit, nearest-loaded fallback, DPR capped at `SEQ.dprCap`.
**Canonical snippet:** `architecture.md` → Frame sequence on canvas.
**Gotchas:** `ImageBitmap` must be `.close()`d on unmount (memory); resize the canvas on
`resize` with a debounce and redraw the current frame; Safari needs `willReadFrequently`
off (default) for speed; never `drawImage` from an `<img>` that hasn't `decode()`d.
**Rules:** one canvas, one `ScrollTrigger`, no per-frame allocations in `onUpdate`.

### Blender (tooling, Phase 5)

**Check first:** `https://docs.blender.org/manual/en/latest/` (Cycles render settings,
Image Texture node, Mix Shader, Depth of Field, Motion Blur, Output → PNG sequence).
**Version pinned:** Blender 4.x LTS — record exact.
**How we use it here:** one `.blend` (`~/reelframe-sources/prologue/prologue.blend`,
outside the repo) with 9 textured planes, two cameras (16:9, 9:16), 150 frames at 24 fps.
Output PNG sequences → `pnpm asset:seq`. The Blender chat owns the step-by-step.
**Gotchas:** color management — the view transform (AgX/Filmic/Standard) must make frame
150 match `hero-poster.jpg`; test one frame before rendering 150. Render both cameras
with identical frame ranges. Denoise on, or WebP will amplify noise.
**Rules:** never commit `.blend` or PNG renders; only the converted WebP sets.
