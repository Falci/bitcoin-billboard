import { Button, Input } from '@nextui-org/react';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { getAddrBalance } from '../database';
import { FormType } from '../types';
import { AddressesList } from './AddressesList';
import { useState } from 'react';

interface AddressFormType {
  address: string;
  signature: string;
}

export interface AddressFormProps {
  hash: string;
}
export const AddressForm = ({ hash }: AddressFormProps) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    reset,
  } = useForm<AddressFormType>();
  const { control } = useFormContext<FormType>();
  const { append, fields } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = (data: AddressFormType) => {
    if (fields.some((item) => item.address === data.address)) {
      setError('address', { message: 'Address already added' });
      return;
    }

    setLoading(true);
    getAddrBalance({ ...data, message: hash }).then((res) => {
      setLoading(false);
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
      reset();
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
          isInvalid={!!errors?.address}
          errorMessage={errors?.address?.message}
          {...register('address', { required: 'Required' })}
        />
        <Input
          size="sm"
          label="Signature"
          isInvalid={!!errors?.signature}
          errorMessage={errors?.signature?.message}
          {...register('signature', { required: 'Required' })}
        />
        <Button type="submit" size="lg" color="secondary" isLoading={loading}>
          {!loading && 'Add'}
        </Button>
      </div>
      <AddressesList items={fields} />
    </form>
  );
};
