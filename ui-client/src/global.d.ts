import { Database as DB } from '@/database/generated.schema';

declare global {
  type Database = DB;
  type Block = DB['btc']['Tables']['block']['Row'];
  type Message = DB['btc']['Tables']['message']['Row'];
  type Tinted = DB['btc']['Tables']['tinted']['Row'];
}
