import { Input, Textarea } from '@nextui-org/react';
import { useFormContext } from 'react-hook-form';
import { FormType } from '../types';
import { Message } from './Message';
import { MIN_SATS } from '@/constants';
import { useMemo } from 'react';

export interface FormProps {
  onSubmit: (data: FormType) => void;
  readOnly: boolean;
}
export const MessageForm = ({ onSubmit, readOnly }: FormProps) => {
  const { handleSubmit, register, watch } = useFormContext<FormType>();
  const values = watch();

  const total = useMemo(() => values.items?.reduce((acc, { value, tinted }) => acc + value - tinted, 0) || 0, [values]);

  return (
    <div className="flex gap-4 flex-col md:flex-row">
      <div className="flex-1">
        <h2 className="mb-4 text-2xl">Editor</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 flex-col">
          <div className="flex gap-4">
            <Input
              label="Author"
              {...register('author')}
              readOnly={readOnly}
              variant={readOnly ? 'bordered' : 'flat'}
            />

          </div>
          <Textarea
            label="Message"
            {...register('message')}
            readOnly={readOnly}
            variant={readOnly ? 'bordered' : 'flat'}
          />
        </form>
      </div>
      {values.message && (
        <div className="flex-1">
          <h2 className="mb-4 text-2xl">Preview</h2>
          <Message {...values} amount={total > MIN_SATS ? total : MIN_SATS} />
        </div>
      )}
    </div>
  );
};
