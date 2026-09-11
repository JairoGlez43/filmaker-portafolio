/**
 * Reads a px-valued CSS custom property from `:root` (e.g. `--nav-h`) so layout numbers
 * stay single-sourced in the @theme block instead of being repeated in JS. Client only.
 */
export function readCssPx(name: string): number {
  if (typeof window === 'undefined') return 0;
  const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isFinite(value) ? value : 0;
}
