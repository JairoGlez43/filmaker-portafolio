/**
 * Temporary token proof for feature 01. Replaced by the scene composition in phase 2
 * (build-plan.md → 07 Prologue / 08 Opening). It exists to verify the two font
 * families and the @theme tokens render as ui-tokens.md specifies.
 */
export default function Home() {
  return (
    <main className="px-gutter py-section flex min-h-svh flex-col justify-center gap-8">
      <p className="text-mono-sm text-text-faint font-mono tracking-[0.12em] uppercase">
        01 / Scaffold, tokens, fonts
      </p>

      <h1 className="font-display text-display-xl text-text-primary leading-[0.9] font-semibold tracking-[-0.02em]">
        {'{{FILMMAKER_NAME}}'}
      </h1>

      <span className="bg-accent block h-px w-24" />

      <p className="text-mono text-text-muted font-mono tracking-[0.06em] uppercase">
        Direction · Edit · Color
      </p>

      <p className="font-display text-display text-text-primary leading-[1] tracking-[-0.01em]">
        Handgloves 0123456789 — statement size, weight 400
      </p>

      <p className="text-body text-text-muted max-w-[65ch] font-sans leading-[1.55]">
        Two families, loaded once through next/font: Inter Tight for display and body — 600 for the
        name, 400 for everything else — and JetBrains Mono for labels and indices. Every value on
        this page comes from the @theme block in globals.css: no hardcoded color, size or spacing.
      </p>
    </main>
  );
}
