/**
 * The one thing on the site allowed to animate on a timer besides the marquee
 * (motion-rules → Principles): a 1 px line that breathes, with `SCROLL` in eyebrow type.
 * Decorative — hidden from assistive tech. Static under reduced motion.
 */
export function ScrollCue({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex flex-col items-center gap-3 ${className}`}>
      <span className="animate-breathe bg-text-muted block h-12 w-px origin-top motion-reduce:animate-none" />
      <span className="text-mono-sm text-text-faint font-mono tracking-[0.12em] uppercase [writing-mode:vertical-rl]">
        Scroll
      </span>
    </div>
  );
}
