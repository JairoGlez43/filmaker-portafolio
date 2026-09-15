import { Section } from '@/components/layout/Section';
import { Marquee } from '@/components/motion/Marquee';
import { getClients } from '@/lib/content';

/**
 * Scene 06 · Clients (experience-script §06). Credibility without a logo wall: one mono
 * uppercase row of names, infinite marquee, hover pause. Names are `{{CLIENT_NN}}`
 * placeholders until the developer supplies the list.
 */
export function Clients() {
  return (
    <Section id="clients" label="Clients" bleed className="py-section">
      <Marquee items={getClients()} />
    </Section>
  );
}
