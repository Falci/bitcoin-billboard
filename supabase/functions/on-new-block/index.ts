import { createClient } from 'https://esm.sh/@supabase/supabase-js'
import * as Sentry from "https://deno.land/x/sentry/index.mjs";

const dsn = Deno.env.get('SENTRY_DSN') ?? ''
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
const options = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
}

Sentry.init({
  dsn,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

Deno.serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey, options)
    const { height } = await req.json()

    // async
    supabase
      .schema('btc')
      .rpc('process_block', { height })
      .then(({ error }) => {
        Sentry.captureException(error);
      });
      
      return new Response(JSON.stringify({ height }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      })
    } catch (err) {
    Sentry.captureException(err);
    return new Response(String(err?.message ?? err), { status: 500 })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/on-new-block' \
  --header 'Content-Type: application/json' \
  --data '{"height":828347}'

*/
