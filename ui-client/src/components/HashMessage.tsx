import { Code } from '@nextui-org/react';
import { BiCopy } from 'react-icons/bi';
import {useCopyToClipboard} from 'react-use';

export interface HashMessageProps {
  hash?: string;
}
export const HashMessage = ({ hash }: HashMessageProps) => {
  const [, copyToClipboard] = useCopyToClipboard();

  if (!hash) {
    return null;
  }

  return (
    <div>
      <h2>Message to sign:</h2>

      <div className='flex items-center gap-2'>
        <Code size="lg">{hash}</Code>
        <BiCopy className='w-5 h-5 hover:text-gray-600 transition-colors duration-250 cursor-pointer ring-neutral-200' onClick={() => copyToClipboard(hash)} />
      </div>
    </div>
  );
};