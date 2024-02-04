import { createClient } from "../helpers/supa.ts";
import Sentry from "../helpers/sentry.ts";

Deno.serve(async (req) => {
  try {
    const supabase = createClient()
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
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/on-new-block' \
  --header 'Content-Type: application/json' \
  --data '{"height":828347}'

*/
