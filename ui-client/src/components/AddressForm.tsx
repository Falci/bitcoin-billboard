import { Button, Input } from '@nextui-org/react';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { getAddrBalance } from '../database';
import { FormType } from '../types';
import { AddressesList } from './AddressesList';

interface AddressFormType {
  address: string;
  signature: string;
}

export interface AddressFormProps {
  hash: string;
}
export const AddressForm = ({ hash }: AddressFormProps) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<AddressFormType>();
  const { control } = useFormContext<FormType>();
  const { append, fields } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = (data: AddressFormType) => {
    getAddrBalance({ ...data, message: hash }).then((res) => {
      if (res.error) {
        setError('signature', {
          message: res.error.message,
        });
        return;
      }

      const value = res.data.reduce((acc: number, { value }) => acc + value, 0);
      const tinted = res.data.reduce(
        (acc: number, { tinted }) => acc + tinted,
        0
      );

      append({
        address: data.address,
        signature: data.signature,
        value,
        tinted,
      });
    });
  };

  return (
    <form
      className="flex flex-col gap-2 mb-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex gap-2">
        <Input
          size="sm"
          label="Address"
          {...register('address', { required: 'Required' })}
        />
        <Input
          size="sm"
          label="Signature"
          isInvalid={!!errors?.signature}
          errorMessage={errors?.signature?.message}
          {...register('signature', { required: 'Required' })}
        />
        <Button type="submit" size="lg" color="secondary">
          Add
        </Button>
      </div>
      <AddressesList items={fields} />
    </form>
  );
};
