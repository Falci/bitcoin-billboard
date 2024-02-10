import Sentry from '../helpers/sentry.ts';
import { hashMessage } from '../helpers/validate.ts';

Deno.serve(async (req) => {
  try {
    const { author, link, message } = await req.json();
    const hash = hashMessage({ author, link, message });
    const msgToSign = [Deno.env.get('HASH_PREFIX'), hash].join('');

    return new Response(JSON.stringify({ msgToSign }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });
  } catch (error) {
    Sentry.captureException(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
});
