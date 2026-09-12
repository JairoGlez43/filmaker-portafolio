'use client';

import { usePlayingCount } from '@/components/media/videoRegistry';
import { LIMITS } from '@/lib/constants';

/** Dev readout: loops currently holding a decode slot vs the budget. */
export function PlayingCount() {
  const count = usePlayingCount();
  return (
    <span className={count > LIMITS.maxPlayingVideos ? 'text-error' : 'text-success'}>
      {count} / {LIMITS.maxPlayingVideos}
    </span>
  );
}
