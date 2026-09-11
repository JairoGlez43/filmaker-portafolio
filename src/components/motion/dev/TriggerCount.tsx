'use client';

import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useState } from 'react';

/**
 * Dev-only readout of `ScrollTrigger.getAll().length`, polled twice a second. It is the
 * leak detector for the Done check of feature 04 ("unmount leaves zero ScrollTriggers").
 * Used by /dev/motion only; deleted in feature 21.
 */
export function TriggerCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const read = () => setCount(ScrollTrigger.getAll().length);
    read();
    const id = window.setInterval(read, 500);
    return () => window.clearInterval(id);
  }, []);

  return <span data-trigger-count>{count ?? '…'}</span>;
}
