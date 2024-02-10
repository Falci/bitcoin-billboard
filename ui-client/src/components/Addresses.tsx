import { Button, Input } from '@nextui-org/react';
import { useFieldArray, useFormContext } from 'react-hook-form';

export const Addresses = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'addresses',
  });

  return (
    <div>
      <h2 className="mb-4 text-2xl">Addresses</h2>
      <div className="flex flex-col gap-2 mb-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-center">
            <Input {...field} label="Address" />
            <Input {...field} label="Signature" />
            <Button type="button" onClick={() => remove(index)}>
              Remove
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" onClick={() => append({})}>
        Add
      </Button>
    </div>
  );
};
