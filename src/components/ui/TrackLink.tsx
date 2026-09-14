'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { track, type EventName, type EventProps } from '@/lib/analytics';

type TrackLinkProps<K extends EventName> = ComponentProps<typeof Link> & {
  /** Event fired on click, before navigation (code-standards → Tracked events). */
  event: K;
  payload: EventProps<K>;
};

/**
 * A `next/link` that fires one analytics event on click. The smallest possible client
 * leaf: no state, no effects — it exists so Server Component scenes can emit `work_open`
 * and `contact_click` without becoming client components themselves.
 */
export function TrackLink<K extends EventName>({
  event,
  payload,
  onClick,
  children,
  ...rest
}: TrackLinkProps<K>) {
  return (
    <Link
      {...rest}
      onClick={(e) => {
        track(event, payload);
        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
}
