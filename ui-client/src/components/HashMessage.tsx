import { Code } from '@nextui-org/react';
import { PropsWithChildren } from 'react';

export const HashMessage = ({ children }: PropsWithChildren) => {
  if (!children) {
    return null;
  }

  return (
    <div>
      <h2>Message to sign:</h2>
      <Code size="lg">{children}</Code>
    </div>
  );
};
