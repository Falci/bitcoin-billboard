import { Link } from 'react-router-dom';
import { Messages } from '../components/Messages';
import { Button } from '@nextui-org/react';

export const HomePage = () => (
  <div className="flex flex-col justify-around items-center h-full">
    <div>
      <h1 className="bg-clip-text tracking-tight text-transparent bg-gradient-to-r from-violet-500 via-indigo-700 to-purple-500 dark:from-violet-300 dark:via-indigo-500 dark:to-purple-300 pb-1 mb-4 text-3xl md:text-5xl pr-10">
        Bitcoin Billboard
      </h1>
    </div>
    <Messages />
    <Link to="/add">
      <Button>Add a message</Button>
    </Link>
  </div>
);
