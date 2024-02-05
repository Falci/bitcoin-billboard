import { createClient as create } from 'supabase'

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
const options = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  }
};

export const createClient = (authHeader?: string) => create(supabaseUrl, supabaseKey, {
  ...options,
  ...(authHeader ? { headers: { Authorization: authHeader } } : {})
});
