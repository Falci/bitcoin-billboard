import { Link } from '@nextui-org/react';
import { FormType } from '../types';
import { Bitcoin } from './Bitcoin';

export interface AddressesListProps {
  items?: (FormType['items'][number] & { id: string })[];
}
export const AddressesList = ({ items = [] }: AddressesListProps) => {
  const subtotal = items.reduce((acc, { value }) => acc + value, 0);
  const tinted = items.reduce((acc, { tinted }) => acc + tinted, 0);
  const total = subtotal - tinted;
  return (
    <div className="pt-4">
      {items.map((item) => (
        <div key={item.id} className="flex gap-4 justify-end">
          <div>
            <Link
              href={`https://mempool.space/address/${item.address}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.address}
            </Link>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-success">
              + <Bitcoin amount={item.value} />
            </div>
            <div className="text-danger">
              - <Bitcoin amount={item.tinted} />
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-end gap-4 border-t py-2 my-2 border-default">
        <div>
          <div className="text-right">Subtotal:</div>
          <div className="text-right">Tinted:</div>
        </div>
        <div>
          <div className="text-success text-right">
            <Bitcoin amount={subtotal} />
          </div>
          <div className="text-danger text-right">
            <Bitcoin amount={tinted} />
          </div>
        </div>
      </div>
      <div className="text-right border-t py-2 my-2 border-default">
        <div className="text-bold text-xl">
          Total:{' '}
          <span className="text-success">
            <Bitcoin amount={total} />
          </span>
        </div>
      </div>
    </div>
  );
};
