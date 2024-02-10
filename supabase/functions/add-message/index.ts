import Sentry from '../helpers/sentry.ts';
import { hashMessage, validateBitcoinSignature } from '../helpers/validate.ts';
import { createClient } from '../helpers/supa.ts';
import { satsToString } from '../helpers/sats.ts';

Deno.serve(async (req) => {
  try {
    const { author, link, message, addresses } = await req.json();
    const hash = hashMessage({ author, link, message });
    const msgToSign = [Deno.env.get('HASH_PREFIX'), hash].join('');

    const client = createClient(req);

    const coins: any[] = [];
    let amount = 0;

    for (const { address, signature } of addresses) {
      const valid = await validateBitcoinSignature(
        address,
        msgToSign,
        signature
      );

      if (!valid) {
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          status: 400,
        });
      }

      const { data: transactions } = await client
        .schema('btc')
        .rpc('get_addr_balance', { address })
        .throwOnError();

      const total = transactions.reduce(
        (acc: number, tx: any) => acc + tx.value - tx.tinted,
        0
      );

      if (total <= 0) continue;

      amount += total;

      coins.push({
        addr: address,
        signature,
        utxo: transactions,
      });
    }

    const minAmount = Deno.env.get('MSG_MIN_VALUE_IN_SATS');
    if (amount < minAmount) {
      return new Response(
        JSON.stringify({
          error: `Not enough coins provided. Provided ${satsToString(
            amount
          )}, required: ${satsToString(minAmount)}`,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const { data, error } = await client.schema('btc').from('messages').insert({
      id: hash,
      author,
      link,
      message,
      coins,
      amount,
    });

    if (error) {
      throw new Error(error);
    }

    return new Response(JSON.stringify({ success: true, hash }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', e: error }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
