SET search_path TO btc;

create type coin_utxo as (tx int8, index int8, value int8, tinted int8);
create type message_coin as (addr TEXT, utxo coin_utxo[], signature TEXT);

CREATE TABLE IF NOT EXISTS messages (
    id CHAR(64) PRIMARY KEY,
    author TEXT,
    link TEXT,
    message TEXT NOT NULL,
    amount INT8 NOT NULL,
    coins message_coin[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SET search_path TO public;