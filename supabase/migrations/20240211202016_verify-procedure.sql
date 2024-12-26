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

  RETURN QUERY
    select utxo.*, coalesce(t.tinted, 0) from btc.get_utxo_from_addr(address) utxo
    left join btc.tinted t on t.tx=utxo.tx and t.index=utxo.index;
  
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION btc.hash_message(author text, link text, message text) RETURNS TEXT AS $$
select CONCAT('btc.falci.me: ', encode(extensions.digest('{"author": "' || author || '", "link": "' || link || '", "message": "' || message || '"}', 'sha256'::text), 'hex'));  
$$ LANGUAGE sql;

SET search_path TO public;