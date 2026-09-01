const UNITS_EN_MS: Record<string, number> = {
  ms: 1,
  s: 1000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

export function toMilliseconds(duration: string): number {
  const match = duration.match(/^(\d+)(ms|s|m|h|d)$/);
  if (!match) {
    throw new Error(`Duree invalide : "${duration}" (format attendu : 15m, 7d, etc.)`);
  }
  const [, value, unit] = match;
  return Number(value) * UNITS_EN_MS[unit];
}