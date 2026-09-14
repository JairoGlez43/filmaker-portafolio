// Small pure formatters for indices, runtimes and years (ui-rules → Copy rules).

/** 1-based index as `01`. */
export function padIndex(n: number): string {
  return String(n).padStart(2, '0');
}

/** `01 / 05` */
export function indexOf(n: number, total: number): string {
  return `${padIndex(n)} / ${padIndex(total)}`;
}
