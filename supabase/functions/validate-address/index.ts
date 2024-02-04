
import Sentry from "../helpers/sentry.ts";
import { validateBitcoinSignature } from "../helpers/validate.ts";

Deno.serve(async (req, res) => {
  try {
    const { msg, addr, sign } = await req.json()
    const valid = await validateBitcoinSignature(addr, msg, sign);
    
    if (valid) {
      return new Response(JSON.stringify({ success: true, message: 'Signature is valid' }), { status: 200 })
    } else {
      return new Response(JSON.stringify({ success: false, message: 'Invalid signature' }), { status: 400 })
    }

  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
    return new Response(JSON.stringify({ success: false, message: 'Internal Server Error' }), { status: 500 })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/validate-address' \
    --header 'Content-Type: application/json' \
    --data '{"msg":"test", "addr":"1F26pNMrywyZJdr22jErtKcjF8R3Ttt55G", "sign":"HwX5"}'
*/
