import { useSyncExternalStore } from 'react';
import { LIMITS } from '@/lib/constants';

// Which <video> elements are currently allowed to play. At most LIMITS.maxPlayingVideos
// decode at once (motion-rules → Performance budget): when a new loop asks to play and
// the set is full, the oldest one is paused. Module-level store, published through
// useSyncExternalStore for the dev readout — an external system, not React state.

const playing = new Set<HTMLVideoElement>();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

/** Reserve a decode slot and start playback; pauses the oldest loop if the budget is full. */
export function requestPlay(video: HTMLVideoElement, slug: string): void {
  if (playing.has(video)) return;
  if (playing.size >= LIMITS.maxPlayingVideos) {
    const oldest = playing.values().next().value;
    if (oldest) {
      oldest.pause();
      playing.delete(oldest);
    }
  }
  playing.add(video);
  notify();
  video.play().catch((error: unknown) => {
    // Autoplay can be refused (iOS low-power mode, data saver); the poster stays visible.
    console.warn(`[media/VideoLoop] play failed: ${slug}`, error);
    playing.delete(video);
    notify();
  });
}

/** Pause and free the slot. Safe to call for a video that is not playing. */
export function release(video: HTMLVideoElement): void {
  if (!video.paused) video.pause();
  if (playing.delete(video)) notify();
}

/** Live count of loops holding a decode slot (dev bench). */
export function usePlayingCount(): number {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => playing.size,
    () => 0,
  );
}
