<!-- ═══════════════════════════════════════════════════════════
     EDIT LEVEL: PROJECT — this is the agent's map of WHAT and WHY.
     Update when scope changes. Never let the agent widen scope on its own.
     ═══════════════════════════════════════════════════════════ -->

# Project Overview

## About the project

REELFRAME is a single-client portfolio site for a filmmaker who directs, edits and
color-grades. The site itself behaves like a short film: a dark, quiet opening, a
statement, a sequence of selected works that play as you scroll, a look behind the
craft (edit + grade), a full showreel, and a closing contact card. Everything on the
page exists to make the work look as good as it is — the site never competes with the
footage.

It is also a personal portfolio piece for the developer: the repo, the context system
and the motion work are meant to be shown on GitHub.

## The problem it solves

Filmmakers' portfolios are usually a Vimeo link or a template site that treats their
work like thumbnails in a grid. Neither communicates taste, rhythm or craft — which is
exactly what a director or editor is hired for. This site presents the work with the
pacing and restraint of an edit, so a producer landing here understands in ten seconds
that this person knows how to hold a shot.

## Client status

There is a _potential_ client. Until confirmed, every client-specific fact is a visible
placeholder in `src/data/site.ts` (`{{FILMMAKER_NAME}}`, `{{TAGLINE}}`, `{{CITY}}`…).
Sample projects are fictional and clearly labelled as such in the data file. The agent
must never invent real-sounding names, brands, awards or credits.

## Pages

```
/                → The film. Full narrative homepage (all scenes, see experience-script.md)
/work/[slug]     → Case study for one project: hero video, credits, stills, next project
/not-found       → 404 as a "missing reel" card, same visual language
```

Everything else (about, contact, showreel) is a _scene_ on `/`, not a page.

## Core user flow

1. Visitor lands on `/`. Nine plates carrying the filmmaker's frames float in black; scrolling gathers them into a contact sheet and closes them into one image. Real footage is on screen from the first frame; the whole prologue takes ≤ 4 s of scroll and is skipped on repeat visits.
2. That one image is the hero: muted looping footage full-bleed, the filmmaker's name reveals, a one-line role, a scroll cue.
3. Scrolling pins the **Statement**: one sentence, words lighting up as you scroll.
4. **Selected Work**: 4–6 projects. Each card fills the viewport as it arrives; its loop plays on entry, pauses on exit. Title, client, year, role. Click → `/work/[slug]`.
5. **Craft**: three beats — Direction / Edit / Color. The Color beat is a scroll-driven wipe between an ungraded frame and the graded one.
6. **Showreel**: full-bleed poster, one play button, opens the reel with sound.
7. **Clients** marquee, **About** (portrait + 3-line bio), **Contact** (one large email, socials, colophon).
8. On `/work/[slug]`: title card → hero video → credits table → stills → "Next project" transition back into the sequence.

## Features in scope (v1)

- All homepage scenes listed above, fully scroll-driven, mobile-first.
- Prologue in two layers: DOM/GSAP version at first release; Blender-rendered frame sequence (Phase 5) replacing it without touching other scenes.
- Case-study page driven entirely by `src/data/projects.ts`.
- Self-hosted muted preview loops (MP4 + WebM, poster frames) per project.
- Full showreel and case-study heroes embedded from Vimeo (unlisted), lazy-loaded on click.
- Smooth scroll (Lenis) with GSAP ScrollTrigger sync.
- Reduced-motion variant of every scene (no autoplay loops, fades instead of scrubs).
- SEO: metadata, Open Graph image per project, sitemap, robots.
- Vercel Analytics with three custom events (see code-standards.md).
- Lighthouse ≥ 90 on Performance/Accessibility/Best Practices/SEO (mobile).

## Features OUT of scope (v1 — do not build)

- CMS, admin panel, database, auth, user accounts.
- Contact form / backend email. Contact is a `mailto:` link.
- Blog, news, journal, "latest" sections.
- WebGL / Three.js / shaders / particle effects (the rendered prologue is a pre-rendered sequence, not real-time 3D).
- Video hosting pipeline (Mux, Cloudflare Stream). Vimeo embed only.
- i18n. English only.
- Dark/light theme toggle. The site is dark, period.
- Cookie banners, third-party trackers beyond Vercel Analytics.
- Client-side routing tricks between pages beyond a fade (no shared-element transitions in v1).
- Filtering / sorting / search of projects.
- Testimonials carousel, pricing, services list, "book a call" widgets.

## Target user

- **Primary:** producers, agencies, brand marketing leads deciding whom to hire. They open the site on a laptop between meetings, or on a phone from an Instagram link. They give it 10–20 seconds. They expect it to load fast and feel expensive.
- **Secondary:** other filmmakers and recruiters checking the developer's GitHub. They expect clean code and a readable repo.

## Success criteria

- Real footage visible within 5 s of landing (prologue plates or hero poster), LCP under 2.5 s on a throttled 4G mobile profile.
- Scrolling the full homepage never drops below ~55 fps on a mid-range phone (Chrome performance panel, no long tasks > 100 ms).
- Zero layout shift from video/image loading (CLS < 0.05).
- Every scene has a reduced-motion version that still reads correctly.
- A producer can go from landing to watching the showreel with sound in two interactions (scroll/tap + play).
- Swapping the placeholder client for a real one requires editing only `src/data/*` and `public/` assets — no component changes.
- `pnpm typecheck && pnpm lint && pnpm build` pass on every commit to `main`.
