import { Link } from 'react-router-dom';
import { Messages } from '../components/Messages';
import { Button } from '@nextui-org/react';

export const HomePage = () => (
  <div className="flex flex-col justify-around items-center h-full">
    <div>big hero section</div>
    <Messages />
    <Link to="/add">
      <Button>Add a message</Button>
    </Link>
  </div>
);
