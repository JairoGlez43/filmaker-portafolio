// Shared content types. Values live in src/data/*, access goes through src/lib/content.ts.
// Shape mirrors architecture.md → Data model; change both together.

export type Role = 'director' | 'editor' | 'colorist' | 'dop';

export interface Credit {
  label: string;
  value: string;
}

export interface Still {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Loop {
  mp4: string;
  webm: string;
  poster: string;
  durationSec: number;
}

export interface Project {
  /** Kebab-case; also the folder name under public/video and public/img. */
  slug: string;
  title: string;
  /** '{{CLIENT_01}}' until a real client replaces it. */
  client: string;
  year: number;
  roles: Role[];
  /** Position in Selected Work and in the Next-project chain, contiguous from 1. */
  order: number;
  /** '01:48' */
  runtime?: string;
  /** Case-study hero; absent → poster only. */
  vimeoId?: string;
  loop: Loop;
  stills: Still[];
  credits: Credit[];
  /** 1–2 sentences for the case study and its OG description. */
  summary: string;
  /** Stays true until a real client replaces the data. */
  fictional: true;
}

export interface CraftBeat {
  id: 'direction' | 'edit' | 'color';
  caption: string;
  /** Beat-specific asset paths, see experience-script.md §04. */
  assets: Record<string, string>;
}

export type PlateTile = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface ProloguePlate {
  src: string;
  alt: string;
  tile: PlateTile;
}

export interface PrologueConfig {
  /** Exactly 9. */
  plates: ProloguePlate[];
  grid: { cols: 3; rows: 3 };
  /** Phase 5; absent → the DOM version renders. */
  sequence?: {
    count: number;
    /** '/seq/prologue/{set}/f-{n}.webp' */
    pattern: string;
    sizes: { d: [1600, 900]; m: [900, 1600] };
  };
}

export interface SocialLink {
  label: string;
  href: string;
}

/** Site-wide assets that belong to no project (asset-pipeline.md → Inventory). */
export interface SiteAssets {
  heroLoop: Loop;
  /** `/img/reel/poster.jpg`, or null until the frame exists — LazyVimeo then shows its surface block. */
  reelPoster: string | null;
  /** 4:5 B&W portrait at `/img/portrait.jpg`, or null until it is shot — About then shows a surface block. */
  portrait: Still | null;
  ogDefault: string;
}

export interface Site {
  name: string;
  city: string;
  roleLine: string;
  statement: string;
  bio: [string, string, string];
  availability: string;
  /** Mono list in About: `TOOLS: …` (experience-script §07). */
  tools: string[];
  email: string;
  socials: SocialLink[];
  vimeoReelId: string;
  reelRuntime: string;
  developer: { name: string; href: string };
  assets: SiteAssets;
}
