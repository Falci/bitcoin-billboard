import { Input, Textarea } from '@nextui-org/react';
import { useFormContext } from 'react-hook-form';
import { FormType } from '../types';
import { Message } from './Message';

export interface FormProps {
  onSubmit: (data: FormType) => void;
  readOnly: boolean;
}
export const Form = ({ onSubmit, readOnly }: FormProps) => {
  const { handleSubmit, register, watch } = useFormContext<FormType>();
  const values = watch();

  return (
    <div className="flex gap-4 flex-col md:flex-row">
      <div className="flex-1">
        <h2 className="mb-4 text-2xl">Form</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 flex-col">
          <div className="flex gap-4">
            <Input
              label="Author"
              {...register('author')}
              readOnly={readOnly}
              variant={readOnly ? 'bordered' : 'flat'}
            />
            <Input
              label="Link"
              type="url"
              {...register('link')}
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
          <Message {...values} amount={120000000} />
        </div>
      )}
    </div>
  );
};
