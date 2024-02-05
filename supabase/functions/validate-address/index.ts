
import Sentry from "../helpers/sentry.ts";
import { validateBitcoinSignature } from "../helpers/validate.ts";
import { createClient } from "../helpers/supa.ts";

Deno.serve(async (req) => {
  try {
    const { msg, addr, sign } = await req.json()
    const valid = await validateBitcoinSignature(addr, msg, sign);
    
    if (!valid) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400 })
    }

    const client = createClient(req);

    const {data, error} = await client.schema('btc')
      .rpc('get_addr_balance', { address: addr })

    if (error) {  
      throw new Error(error);
    }

    return new Response(JSON.stringify(data), { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    });


  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
});