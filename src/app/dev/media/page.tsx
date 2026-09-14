import { LazyVimeo } from '@/components/media/LazyVimeo';
import { VideoLoop } from '@/components/media/VideoLoop';
import { getProject, getProjects, getSite } from '@/lib/content';
import { PlayingCount } from './PlayingCount';
import { StillsBench } from './StillsBench';

/**
 * Temporary media bench for feature 05 (deleted in feature 21). Six real loops stacked
 * one per viewport to check lazy loading and the two-decoding budget, the demo reel for
 * LazyVimeo, and the northern-light stills for the Lightbox.
 */
export default function MediaBench() {
  const site = getSite();
  const projects = getProjects();
  const withStills = getProject('northern-light');

  return (
    <main className="px-gutter py-section flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <p className="text-mono-sm text-text-faint font-mono tracking-[0.12em] uppercase">
          05 / Media primitives — temporary bench
        </p>
        <h1 className="font-display text-display text-text-primary leading-[1] tracking-[-0.01em]">
          VideoLoop · LazyVimeo · Lightbox
        </h1>
        <p className="text-body text-text-muted max-w-[65ch] font-sans leading-[1.55]">
          Open the Network tab and scroll: loops attach their sources only near the viewport, and
          never more than two decode at once. Playing now: <PlayingCount />. Under reduced motion or
          reduced data the posters stand alone and no video is requested.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <p className="text-mono-sm text-text-faint font-mono tracking-[0.12em] uppercase">
          hero · {site.assets.heroLoop.durationSec} s · not dimmed
        </p>
        <VideoLoop
          loop={site.assets.heroLoop}
          slug="hero"
          priority
          sizes="100vw"
          className="aspect-video w-full"
        />
      </section>

      {projects.map((project) => (
        <section key={project.slug} className="flex flex-col gap-3">
          <p className="text-mono-sm text-text-faint font-mono tracking-[0.12em] uppercase">
            {String(project.order).padStart(2, '0')} · {project.slug} · {project.loop.durationSec} s
            · dimmed 70 %
          </p>
          <VideoLoop
            loop={project.loop}
            slug={project.slug}
            dim
            sizes="100vw"
            className="aspect-video w-full"
          />
        </section>
      ))}

      <section className="border-line flex flex-col gap-3 border-t pt-8">
        <p className="text-mono-sm text-text-faint font-mono tracking-[0.12em] uppercase">
          LazyVimeo · iframe mounts only after the click · Escape closes
        </p>
        <LazyVimeo
          vimeoId={site.vimeoReelId}
          title="Showreel"
          source="home"
          poster={null}
          label={`Showreel · ${site.reelRuntime}`}
        />
      </section>

      <section className="border-line flex flex-col gap-3 border-t pt-8">
        <p className="text-mono-sm text-text-faint font-mono tracking-[0.12em] uppercase">
          Lightbox · native dialog · Escape, backdrop and Close ×
        </p>
        {withStills.ok ? (
          <StillsBench stills={withStills.data.stills} />
        ) : (
          <p className="text-mono text-error font-mono">{withStills.error}</p>
        )}
      </section>
    </main>
  );
}
