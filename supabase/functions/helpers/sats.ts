export const satsToString = (sats: number): string => {
  if (sats === 0) return '0';

  const log = Math.log10(sats);
  const fractions = Math.max(8 - log, 2);

  return (sats / 1e8).toFixed(fractions);
};
