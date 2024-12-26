import {
  Avatar,
  AvatarIcon,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from '@nextui-org/react';
import { Bitcoin } from './Bitcoin';

export interface MessageProps {
  author?: string;
  message: string;
  amount: number;
}
export const Message = ({ author, message, amount }: MessageProps) => (
  <Card>
    <CardHeader className="justify-between">
      <div className="flex gap-5">
        <Avatar isBordered radius="full" size="md" icon={<AvatarIcon />} />
        <div className="flex flex-col gap-1 items-start justify-center">
          <h4 className="text-small font-semibold leading-none text-default-600">
            {author || 'Anonymous'}
          </h4>
        </div>
      </div>
    </CardHeader>
    <CardBody>
      <p>{message}</p>
    </CardBody>
    <CardFooter className="gap-3 text-default-400">
      <Bitcoin amount={amount} />
    </CardFooter>
  </Card>
);
