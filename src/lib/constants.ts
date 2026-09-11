// Single source for every numeric limit. Mirrors code-standards.md → Project constants and
// asset-pipeline.md → Inventory. Never write these literals anywhere else.

const KB = 1024;
const MB = 1024 * KB;

export const LIMITS = {
  maxPlayingVideos: 2,
  videoLoadMarginPx: 800,
  curtainMaxMs: 2500,

  loopMaxBytes: 3 * MB,
  heroLoopMaxBytes: 4 * MB,
  sceneVideoMaxBytes: 15 * MB,
  seqMaxBytes: { d: 6.5 * MB, m: 4.5 * MB },

  posterMaxBytes: 250 * KB,
  stillMaxBytes: 400 * KB,
  plateMaxBytes: 150 * KB,
  portraitMaxBytes: 300 * KB,
  ogMaxBytes: 200 * KB,
  craftStoryboardMaxBytes: 40 * KB,
  craftDirectionMaxBytes: 300 * KB,
  craftFrameMaxBytes: 60 * KB,
  craftGradeMaxBytes: 300 * KB,

  /** Loop durations in seconds (asset-pipeline.md → Inventory). */
  loopDurationSec: { min: 6, max: 8 },
  heroLoopDurationSec: { min: 8, max: 12 },

  /** ui-rules.md → Badge: max 3 role badges per card. */
  maxRolesPerProject: 3,
} as const;

export const PIN = {
  statementVh: 150,
  craftVh: 120,
  prologueVh: 250,
} as const;

export const SEQ = {
  count: 150,
  firstFrameMs: 1500,
  dprCap: 1.5,
  priorityStride: [8, 4, 1],
} as const;

export const PROLOGUE_SKIP_KEY = 'rf:prologue-seen';

export const BREAKPOINT = {
  md: 768,
  lg: 1024,
} as const;
