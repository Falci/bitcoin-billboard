
import * as Sentry from "sentry";

Sentry.init({
  dsn: Deno.env.get('SENTRY_DSN') ?? '',
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

export default Sentry;