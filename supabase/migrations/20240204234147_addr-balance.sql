SET search_path TO btc;

CREATE OR REPLACE FUNCTION get_addr_balance(address text) RETURNS table(
  tx int8,
  index int8,
  value int8,
  tinted int8
) AS $$
DECLARE 
  data json;
  row_count int;
BEGIN
  RETURN QUERY
    select utxo.*, coalesce(t.tinted, 0) from btc.get_utxo_from_addr(address) utxo
    left join btc.tinted t on t.tx=utxo.tx and t.index=utxo.index;
  
END;
$$ LANGUAGE plpgsql;

SET search_path TO public;