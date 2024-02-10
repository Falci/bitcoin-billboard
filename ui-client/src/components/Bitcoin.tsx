import { BsCurrencyBitcoin } from 'react-icons/bs';

export interface BitcoinProps {
  amount: number;
}
export const Bitcoin = ({ amount }: BitcoinProps) => {
  const satsToString = (sats: number): string => {
    if (sats === 0) return '0';

    const log = Math.log10(sats);
    const fractions = Math.max(8 - log, 2);

    return (sats / 1e8).toFixed(fractions);
  };

  return (
    <div className="flex gap-1 items-center">
      <p className="font-semibold text-default-400 text-small">
        {satsToString(amount)}
      </p>
      <BsCurrencyBitcoin className="text-default-400" />
    </div>
  );
};
