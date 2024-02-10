import { Button } from '@nextui-org/react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Form } from '../components/Form';
import { HashMessage } from '../components/HashMessage';
import { BoardMessage } from '../types';
import { Addresses } from '../components/Addresses';

type State = 'form' | 'coins';

export const AddPage = () => {
  const form = useForm<BoardMessage>({});
  const values = form.watch();
  const [state, setState] = useState<State>('form');

  const onSubmit = (data: BoardMessage) => {
    console.log(data);
  };

  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-8">
        <Form onSubmit={onSubmit} readOnly={state !== 'form'} />

        {state === 'form' ? (
          <Button onClick={() => setState('coins')}>Continue</Button>
        ) : (
          <HashMessage {...values} />
        )}

        {state !== 'form' && <Addresses />}
      </div>
    </FormProvider>
  );
};
