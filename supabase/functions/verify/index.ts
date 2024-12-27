import { serve } from 'https://deno.land/std@0.170.0/http/server.ts';
import { Verifier } from 'npm:bip322-js';

Deno.serve(async (req) => {
  try {
    const { address, message, signature } = await req.json();

    if (!address || !message || !signature) {
      return new Response(
        JSON.stringify({
          error: 'Missing required parameters for verification',
        }),
        { status: 400 }
      );
    }

    let isValid = Verifier.verifySignature(address, message, signature);
    let format: string | null = null;

    if (isValid) {
      format = 'bip322';
    } else {
      const res = await fetch(`https://spv.btc.wholecoiners.club`, {
        headers: {
          'Content-Type': 'application/json',
          'X-APIKEY': '7d0d2962-fc02-4253-8e79-f1676726983f',
        },
        method: 'POST',
        body: JSON.stringify({
          method: 'verifymessage',
          params: [address, signature, message],
        }),
      }).then((res) => res.json());

      isValid = !!res.result;

      if (isValid) {
        format = 'legacy';
      }
    }

    return new Response(JSON.stringify({ isValid, format }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'An error occurred', details: error.message }),
      { status: 500 }
    );
  }
});
