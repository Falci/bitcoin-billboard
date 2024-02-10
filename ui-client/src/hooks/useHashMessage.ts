import { useQuery } from '@tanstack/react-query';
import { BoardMessage } from '../types';

export const useHashMessage = (message: BoardMessage) =>
  useQuery({
    queryKey: ['hash-message', message],
    queryFn: async () => {
      const response = await fetch('/v1/hash-message', {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });
      return response.json();
    },
  });
