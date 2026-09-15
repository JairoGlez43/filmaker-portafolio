import { Opening } from '@/components/scenes/01-Opening';
import { Statement } from '@/components/scenes/02-Statement';
import { SelectedWork } from '@/components/scenes/03-SelectedWork';
import { Showreel } from '@/components/scenes/05-Showreel';
import { Clients } from '@/components/scenes/06-Clients';
import { About } from '@/components/scenes/07-About';
import { Contact } from '@/components/scenes/08-Contact';

/**
 * The film. Scenes are composed here in script order (experience-script.md → Scene index).
 * Still to mount once their assets exist: scene 00 Prologue above the Opening (feature 07),
 * scene 04 Craft between Selected Work and the Showreel (11–12). The global Footer
 * (colophon) follows Contact from layout.tsx.
 */
export default function Home() {
  return (
    <>
      <Opening />
      <Statement />
      <SelectedWork />
      <Showreel />
      <Clients />
      <About />
      <Contact />
    </>
  );
}
