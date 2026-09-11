import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getCraft, getPrologue, getProjects, getSite } from '@/lib/content';

/**
 * Temporary content inspector for feature 02 (deleted in feature 21). Lists every
 * project, its roles and every asset path the data references; a path whose file is
 * missing under public/ renders in `error`. Server Component: the existence check runs
 * at build time (or per request in dev) — it is the one place in src/ allowed to touch
 * node:fs, because it is a dev tool and not part of the site.
 */

function exists(publicPath: string): boolean {
  return existsSync(join(process.cwd(), 'public', publicPath));
}

function AssetPath({ path }: { path: string }) {
  const ok = exists(path);
  return (
    <li className={`text-mono font-mono ${ok ? 'text-success' : 'text-error'}`}>
      <span aria-hidden="true">{ok ? '✓' : '✗'}</span> {path}
    </li>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-mono-sm text-text-faint font-mono tracking-[0.12em] uppercase">{children}</p>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-line flex flex-col gap-4 border-t pt-6">
      <h2 className="text-mono text-text-muted font-mono tracking-[0.06em] uppercase">{title}</h2>
      {children}
    </section>
  );
}

export default function ContentInspector() {
  const projects = getProjects();
  const site = getSite();
  const prologue = getPrologue();
  const craft = getCraft();

  const allPaths = [
    ...projects.flatMap((p) => [
      p.loop.mp4,
      p.loop.webm,
      p.loop.poster,
      ...p.stills.map((s) => s.src),
    ]),
    site.assets.heroLoop.mp4,
    site.assets.heroLoop.webm,
    site.assets.heroLoop.poster,
    site.assets.reelPoster,
    site.assets.portrait.src,
    site.assets.ogDefault,
    ...prologue.plates.map((plate) => plate.src),
    ...craft.flatMap((beat) => Object.values(beat.assets)),
  ];
  const presentCount = allPaths.filter(exists).length;

  return (
    <main className="px-gutter py-section flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <Label>02 / Content model — temporary inspector</Label>
        <h1 className="font-display text-display text-text-primary leading-[1] tracking-[-0.01em]">
          {projects.length} projects · {allPaths.length} asset paths
        </h1>
        <p className="text-mono text-text-muted font-mono">
          <span className="text-success">{presentCount} present</span> ·{' '}
          <span className="text-error">{allPaths.length - presentCount} missing</span> — run{' '}
          <code>pnpm content:check</code> for the deliverable list
        </p>
      </header>

      {projects.map((p) => (
        <Block key={p.slug} title={`${String(p.order).padStart(2, '0')} / ${p.slug}`}>
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <span className="font-display text-h2 text-text-primary leading-[1.05]">{p.title}</span>
            <span className="text-mono text-text-muted font-mono">
              {p.client} · {p.year}
              {p.runtime ? ` · ${p.runtime}` : ''}
            </span>
            <ul className="flex gap-2">
              {p.roles.map((role) => (
                <li
                  key={role}
                  className="border-line-strong text-mono-sm text-text-muted rounded-sm border px-2 py-1 font-mono tracking-[0.12em] uppercase"
                >
                  {role}
                </li>
              ))}
            </ul>
          </div>
          <ul className="flex flex-col gap-1">
            <AssetPath path={p.loop.mp4} />
            <AssetPath path={p.loop.webm} />
            <AssetPath path={p.loop.poster} />
            {p.stills.map((still) => (
              <AssetPath key={still.src} path={still.src} />
            ))}
          </ul>
        </Block>
      ))}

      <Block title="site assets">
        <ul className="flex flex-col gap-1">
          <AssetPath path={site.assets.heroLoop.mp4} />
          <AssetPath path={site.assets.heroLoop.webm} />
          <AssetPath path={site.assets.heroLoop.poster} />
          <AssetPath path={site.assets.reelPoster} />
          <AssetPath path={site.assets.portrait.src} />
          <AssetPath path={site.assets.ogDefault} />
        </ul>
      </Block>

      <Block title={`prologue plates · ${prologue.grid.cols}×${prologue.grid.rows}`}>
        <ul className="flex flex-col gap-1">
          {prologue.plates.map((plate) => (
            <AssetPath key={plate.tile} path={plate.src} />
          ))}
        </ul>
      </Block>

      {craft.map((beat) => (
        <Block key={beat.id} title={`craft · ${beat.id}`}>
          <p className="font-display text-h2 text-text-primary leading-[1.05]">{beat.caption}</p>
          <ul className="flex flex-col gap-1">
            {Object.values(beat.assets).map((path) => (
              <AssetPath key={path} path={path} />
            ))}
          </ul>
        </Block>
      ))}
    </main>
  );
}
