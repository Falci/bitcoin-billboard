alter role anon set statement_timeout = '10s';


CREATE EXTENSION http
WITH
  SCHEMA extensions;

CREATE SCHEMA btc;

GRANT USAGE ON SCHEMA btc TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA btc TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA btc TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA btc TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA btc GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA btc GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA btc GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

SET search_path TO btc;
create type prev_out as (value int8, tx_index int8, n int8);
create type input as (prev_out prev_out);
create type outpoint as (n int8);
create type output as (spending_outpoints outpoint[], n int8, addr text, value int8);
create type transaction as (tx_index int8, fee int8, inputs input[], out output[]);
-- create type block as (tx transaction[]);


CREATE OR REPLACE FUNCTION get_utxo_from_addr(address text) RETURNS table(
  tx int8,
  index int8,
  value int8
) AS $$
DECLARE 
  data json;
  row_count int;
BEGIN
  set statement_timeout to 60000;

  select 
    content::json
  into data
  from extensions.http_get('https://blockchain.info/rawaddr/' || address);
  
RETURN QUERY
  select outputs.tx, outputs.index, outputs.value
  from 
    (
      select 
        tx_index as "tx", 
        (out->>'n')::int8 index,
        out->'spending_outpoints' spending_outpoints,
        out->>'addr' addr,
        (out->>'value')::int8 value
      from 
        (
          select tx_index, json_array_elements(array_to_json(out)) as out 
          from json_populate_recordset(null::transaction, data->'txs') as txs
        ) as output
    ) as outputs
  where addr = address
  and json_array_length(spending_outpoints) = 0;

  GET DIAGNOSTICS row_count = ROW_COUNT;
  IF FOUND AND (data->>'n_unredeemed')::int > row_count THEN
    RAISE EXCEPTION 'Too much transactions for this address. Found % of %', row_count, data->>'n_unredeemed';
  END IF;
END;
$$ LANGUAGE plpgsql;


CREATE TABLE tinted (
  tx INT8 NOT NULL,
  index INT8 NOT NULL,
  value INT8 NOT NULL,
  tinted INT8 NOT NULL
);

CREATE INDEX tinted_tx_index ON tinted(tx, index);

CREATE TABLE block (
  height INT8 PRIMARY KEY,
  added int NOT NULL DEFAULT 0,
  removed int NOT NULL DEFAULT 0
);

CREATE OR REPLACE FUNCTION process_block(height int)
RETURNS VOID
AS $$
DECLARE
  added int;
  removed int;
BEGIN
  SET statement_timeout TO 60000;

  -- TODO: check if block exists

  CREATE TEMP TABLE _tinted AS
    SELECT 
      tx,
      tinted / inputs as tinted_input_ratio,
      unnest(out) out,
      old_tx,
      old_index
    FROM (
      SELECT 
        tx.tx_index as tx, 
        sum(((inp).prev_out).value) inputs, 
        sum(coalesce(t.tinted, 0)) tinted,
        t.tx old_tx,
        t.index old_index, 
        out 
      FROM (
        SELECT tx_index, unnest(inputs) as inp, out FROM json_populate_recordset(null::transaction,
          (SELECT content::json->'tx' FROM extensions.http_get('https://blockchain.info/rawblock/' || height)) 
        ) as data
      ) AS tx
      LEFT JOIN tinted t ON t.tx=((inp).prev_out).tx_index AND t.index=((inp).prev_out).n
      GROUP BY tx_index, out, t.tx, t.index
    ) AS inputs
    WHERE tinted > 0;

  DELETE FROM tinted t
    USING _tinted
    WHERE old_tx=t.tx AND old_index=t.index;

  GET DIAGNOSTICS removed = ROW_COUNT; 

  INSERT INTO tinted
    select 
      _d.tx,
      (out).n,
      (out).value,
      ROUND((out).value * tinted_input_ratio) tinted
    from _tinted as _d;

  GET DIAGNOSTICS added = ROW_COUNT; 

  INSERT INTO block (height, added, removed) VALUES (height, added, removed);

END;
$$ LANGUAGE plpgsql;