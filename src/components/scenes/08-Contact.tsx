import Link from 'next/link';
import { Section } from '@/components/layout/Section';
import { StaggerChars } from '@/components/motion/StaggerChars';
import { SocialIcon, toSocialTarget } from '@/components/ui/SocialIcon';
import { TrackLink } from '@/components/ui/TrackLink';
import { getSite } from '@/lib/content';

/** Text link with the accent underline that draws left → right (ui-tokens → Link). */
const UNDERLINE =
  'relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-(--dur-fast) after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100 motion-reduce:after:transition-none';

const SOCIAL_LINK =
  'flex items-center gap-2 font-mono text-mono tracking-[0.06em] text-text-muted uppercase transition-colors duration-(--dur-fast) ease-out hover:text-text-primary focus-visible:text-text-primary motion-reduce:transition-none';

/**
 * Scene 08 · Contact (experience-script §08). Hiring is one tap: the email is the largest
 * text on the page (`mailto:`), the socials sit under it in mono with their glyphs, and
 * the global Footer (colophon) follows. `contact_click` fires once per link.
 * ⏸ HUMAN: email and social URLs — `{{EMAIL}}`, `{{INSTAGRAM_URL}}`… render literally.
 */
export function Contact() {
  const site = getSite();

  return (
    <Section
      id="contact"
      label="Contact"
      heading="eyebrow"
      className="py-section flex min-h-svh flex-col justify-center gap-12"
    >
      <TrackLink
        href={`mailto:${site.email}`}
        event="contact_click"
        payload={{ target: 'email' }}
        className={`${UNDERLINE} font-display text-display-xl text-text-primary inline-block max-w-full leading-[0.9] font-semibold tracking-[-0.02em] [overflow-wrap:anywhere]`}
      >
        <StaggerChars text={site.email} />
      </TrackLink>

      <ul className="flex flex-wrap gap-x-8 gap-y-3" aria-label="Social profiles">
        {site.socials.map((social) => {
          const target = toSocialTarget(social.label);
          return (
            <li key={social.label}>
              {target ? (
                <TrackLink
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  event="contact_click"
                  payload={{ target }}
                  className={SOCIAL_LINK}
                >
                  <SocialIcon target={target} />
                  {social.label}
                </TrackLink>
              ) : (
                <Link
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={SOCIAL_LINK}
                >
                  {social.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
