import { Section } from '@/components/layout/Section';
import { Pin } from '@/components/motion/Pin';
import { ScrubWords } from '@/components/motion/ScrubWords';
import { PIN } from '@/lib/constants';
import { getSite } from '@/lib/content';

/**
 * Scene 02 · Statement (experience-script §02). The only "voice" moment: a pinned black
 * viewport, one sentence whose words light up as the visitor scrolls, the last word
 * turning accent in the final 10 %. The heading is hidden — the scene has no title.
 * The sentence is `site.statement` (⏸ HUMAN: the placeholder until the developer writes his own).
 */
export function Statement() {
  const site = getSite();

  return (
    <Section id="statement" label="Statement">
      <Pin vh={PIN.statementVh} className="flex min-h-svh items-center">
        <ScrubWords
          text={site.statement}
          className="font-display text-display text-text-primary max-w-[20ch] leading-[1] tracking-[-0.01em]"
        />
      </Pin>
    </Section>
  );
}
