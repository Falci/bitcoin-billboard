import { ONE_BTC } from '@/constants';
import { BsCurrencyBitcoin } from 'react-icons/bs';

export interface BitcoinProps {
  amount: number;
}
export const Bitcoin = ({ amount }: BitcoinProps) => {
  const satsToString = (sats: number): string => {
    return (sats / ONE_BTC).toFixed(8).replace(/\.?0+$/, '');
  };

  return (
    <div className="inline-flex gap-0.5 items-center">
      <p className="font-semibold">{satsToString(amount)}</p>
      <BsCurrencyBitcoin />
    </div>
  );
};
