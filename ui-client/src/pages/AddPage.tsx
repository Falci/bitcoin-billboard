import { Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AddressForm } from '../components/AddressForm';
import { HashMessage } from '../components/HashMessage';
import { MessageForm } from '../components/MessageForm';
import { hashMessage } from '../database';
import { FormType } from '../types';

type State = 'form' | 'coins';

export const AddPage = () => {
  const form = useForm<FormType>({});
  const values = form.watch();
  const [state, setState] = useState<State>('form');
  const [hash, setHash] = useState('');

  useEffect(() => {
    if (state !== 'form') {
      hashMessage(values).then(setHash);
    } else {
      setHash('');
    }
  }, [values, state]);

  const onSubmit = (data: FormType) => {
    console.log(data);
  };

  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-8">
        <MessageForm onSubmit={onSubmit} readOnly={state !== 'form'} />

        {state === 'form' ? (
          <Button onClick={() => setState('coins')}>Continue</Button>
        ) : (
          <HashMessage>{hash}</HashMessage>
        )}

        {state !== 'form' && (
          <div>
            <h2 className="mb-4 text-2xl">Addresses</h2>
            <AddressForm hash={hash} />
          </div>
        )}
      </div>
    </FormProvider>
  );
};
