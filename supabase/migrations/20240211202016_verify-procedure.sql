SET search_path TO btc;

CREATE OR REPLACE FUNCTION verify(address text, message text, signature text)
  RETURNS boolean AS
$$
DECLARE
  data jsonb;
BEGIN
   SELECT value INTO data FROM public.settings WHERE key = 'edge_functions';

   SELECT content::jsonb
   INTO data
   FROM extensions.http((
      'POST',
      data->>'url' || '/functions/v1/verify',
      ARRAY[extensions.http_header('authorization', concat('Bearer ', data->>'key'))],
      'application/json',
      '{"address": "' || address || '", "message": "' || message || '", "signature": "' || signature || '"}'
   )::extensions.http_request);

   RETURN coalesce((data->>'isValid'), 'false')::boolean;
END
$$ LANGUAGE plpgsql STABLE STRICT;

CREATE OR REPLACE FUNCTION get_addr_balance(address text, message text, signature text) RETURNS table(
  tx int8,
  index int8,
  value int8,
  tinted int8
) AS $$
DECLARE 
  data json;
  row_count int;
BEGIN
  if NOT verify(address, message, signature) then
    RAISE EXCEPTION 'Invalid signature';
  end if;

  RETURN QUERY select btc.get_addr_balance(address);
  
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION btc.hash_message(author text, message text) RETURNS TEXT AS $$
DECLARE 
  settings jsonb;
BEGIN
  SELECT value INTO settings FROM public.settings WHERE key = 'public_site';

  RETURN 
    CONCAT(settings->>'domain', ': ', encode(extensions.digest('{"author": "' || author || '", "message": "' || message || '"}', 'sha256'::text), 'hex'));  

END;
$$ LANGUAGE plpgsql;

SET search_path TO public;