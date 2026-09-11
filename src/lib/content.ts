import { clients } from '@/data/clients';
import { craft } from '@/data/craft';
import { projects } from '@/data/projects';
import { prologue } from '@/data/prologue';
import { site } from '@/data/site';
import type { CraftBeat, Project, PrologueConfig, Site } from '@/types/content';

// The ONLY door to src/data/*. Pure, synchronous, typed. Components import from here;
// an ESLint rule blocks direct imports of @/data elsewhere (architecture.md → Invariants).

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

/** Projects in Selected Work order. */
export function getProjects(): Project[] {
  return [...projects].sort((a, b) => a.order - b.order);
}

export function getProject(slug: string): Result<Project> {
  const project = projects.find((p) => p.slug === slug);
  return project ? { ok: true, data: project } : { ok: false, error: `Unknown project "${slug}"` };
}

/** The project after `slug` in order; wraps to the first after the last. */
export function getNextProject(slug: string): Result<Project> {
  const ordered = getProjects();
  const index = ordered.findIndex((p) => p.slug === slug);
  if (index === -1) return { ok: false, error: `Unknown project "${slug}"` };
  const next = ordered[(index + 1) % ordered.length];
  return next ? { ok: true, data: next } : { ok: false, error: 'No projects' };
}

export function getSite(): Site {
  return site;
}

export function getClients(): string[] {
  return clients;
}

export function getPrologue(): PrologueConfig {
  return prologue;
}

export function getCraft(): CraftBeat[] {
  return craft;
}
