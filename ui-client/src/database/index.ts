import { createClient } from '@supabase/supabase-js';
import { AddrSignature, BoardMessage } from '../types';

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const getMessages = () =>
  supabase.schema('btc').from('messages').select();

export const hashMessage = ({
  message,
  author = '',
}: BoardMessage) =>
  supabase
    .schema('btc')
    .rpc('hash_message', {
      message,
      author,
      link: '',
    })
    .then(({ data }) => data || '');

export const getAddrBalance = ({
  address,
  message,
  signature,
}: AddrSignature) =>
  supabase.schema('btc').rpc('get_addr_balance', {
    address,
    message,
    signature,
  });
