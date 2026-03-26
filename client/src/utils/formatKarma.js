/**
 * Format karma for display (e.g. 1200 → "1.2k").
 */
export function formatKarma(karma) {
  if (karma >= 1_000_000) return (karma / 1_000_000).toFixed(1) + 'm';
  if (karma >= 1_000) return (karma / 1_000).toFixed(1) + 'k';
  return String(karma);
}
