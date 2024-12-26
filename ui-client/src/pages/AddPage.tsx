import { Button } from '@nextui-org/react';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AddressForm } from '../components/AddressForm';
import { HashMessage } from '../components/HashMessage';
import { MessageForm } from '../components/MessageForm';
import { hashMessage } from '../database';
import { FormType } from '../types';
import { MIN_SATS } from '@/constants';

type State = 'form' | 'coins';

export const AddPage = () => {
  const form = useForm<FormType>({});
  const values = form.watch();
  const [state, setState] = useState<State>('form');
  const [hash, setHash] = useState<string>('');

  useEffect(() => {
    if (state !== 'form') {
      hashMessage(values).then(setHash);
    } else {
      setHash('');
    }
  }, [values, state]);

  const disableContinue = !values.message?.trim();
  const total = useMemo(
    () =>
      values.items?.reduce(
        (acc, { value, tinted }) => acc + value - tinted,
        0
      ) || 0,
    [values]
  );

  const onSubmit = (data: FormType) => {
    console.log(data);
  };

  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-8">
        <MessageForm onSubmit={onSubmit} readOnly={state !== 'form'} />

        {state === 'form' ? (
          <div>
            <Button
              onPress={() => !disableContinue && setState('coins')}
              disabled={disableContinue}
              color={disableContinue ? 'default' : 'primary'}
              disableRipple={disableContinue}
              disableAnimation={disableContinue}
            >
              Continue
            </Button>
          </div>
        ) : (
          <HashMessage hash={hash} />
        )}

        {state === 'coins' && (
          <div>
            <h2 className="mb-4 text-2xl">Addresses</h2>
            <AddressForm hash={hash!} />
          </div>
        )}

        {total >= MIN_SATS && (
          <div className="text-center">
            <Button
              onPress={() => onSubmit(form.getValues())}
              color="primary"
              size="lg"
            >
              Post message
            </Button>
          </div>
        )}
      </div>
    </FormProvider>
  );
};
