import { Code } from '@nextui-org/react';
import { useHashMessage } from '../hooks/useHashMessage';

export interface HashMessageType {
  author?: string;
  link?: string;
  message: string;
}
export const HashMessage = (props: HashMessageType) => {
  const { data } = useHashMessage(props);

  if (data) {
    return (
      <div>
        <h2>Message to sign:</h2>
        <Code size="lg">{data.msgToSign}</Code>
      </div>
    );
  }
};
