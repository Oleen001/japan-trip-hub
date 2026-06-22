/** Single source of truth for the JPY→THB rate used across the whole site. */
export const JPY_TO_THB = 0.23;

export function yenToThb(yen: number): number {
  return Math.round(yen * JPY_TO_THB);
}

/** "13,180" */
export function fmtYen(yen: number): string {
  return yen.toLocaleString('en-US');
}

/** "3,031" — baht, rounded to whole baht */
export function fmtThb(yen: number): string {
  return yenToThb(yen).toLocaleString('en-US');
}
