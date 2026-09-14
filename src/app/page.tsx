import { Section } from '@/components/layout/Section';
import { Opening } from '@/components/scenes/01-Opening';
import { Statement } from '@/components/scenes/02-Statement';
import { SelectedWork } from '@/components/scenes/03-SelectedWork';
import { Eyebrow } from '@/components/ui/Eyebrow';

/**
 * The film. Scenes are composed here in script order (experience-script.md → Scene index).
 * Scene 00 (Prologue) mounts above the Opening once its plates exist (feature 07). The
 * placeholder sections below give the Nav anchors somewhere to land until their scenes
 * arrive.
 */
const PLACEHOLDER_SCENES = [
  { id: 'reel', label: 'Showreel', arrives: '13' },
  { id: 'contact', label: 'Contact', arrives: '16' },
] as const;

export default function Home() {
  return (
    <>
      <Opening />
      <Statement />
      <SelectedWork />

      {PLACEHOLDER_SCENES.map((scene) => (
        <Section
          key={scene.id}
          id={scene.id}
          label={scene.label}
          heading="eyebrow"
          className="border-line flex min-h-svh flex-col justify-center gap-4 border-t"
        >
          <Eyebrow>Placeholder — scene arrives in feature {scene.arrives}</Eyebrow>
        </Section>
      ))}
    </>
  );
}
