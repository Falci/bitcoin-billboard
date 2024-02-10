import {
  Avatar,
  AvatarIcon,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from '@nextui-org/react';
import { ComponentPropsWithoutRef } from 'react';
import { Bitcoin } from './Bitcoin';

export interface MessageProps {
  author?: string;
  link?: string;
  message: string;
  amount: number;
}
export const Message = ({ author, link, message, amount }: MessageProps) => (
  <Card>
    <CardHeader className="justify-between">
      <div className="flex gap-5">
        <Avatar isBordered radius="full" size="md" icon={<AvatarIcon />} />
        <div className="flex flex-col gap-1 items-start justify-center">
          <h4 className="text-small font-semibold leading-none text-default-600">
            {author || 'Anonymous'}
          </h4>
          <h5 className="text-small tracking-tight text-default-400">
            <Link href={link} />
          </h5>
        </div>
      </div>
    </CardHeader>
    <CardBody>
      <p>{message}</p>
    </CardBody>
    <CardFooter className="gap-3">
      <Bitcoin amount={amount} />
    </CardFooter>
  </Card>
);

const Link = ({ href, children }: ComponentPropsWithoutRef<'a'>) => {
  const text =
    children ||
    (() => {
      try {
        const url = new URL(href!);
        return url.hostname || url.pathname;
      } catch (e) {
        return href;
      }
    })();

  return (
    <a
      href={href}
      className="underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {text}
    </a>
  );
};
