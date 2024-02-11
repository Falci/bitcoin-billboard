'use strict';

const bcoin = require('@bcoin-org/bcoin');
const axios = require('axios');

const node = new bcoin.SPVNode({
  file: true,
  argv: true,
  env: true,
  logFile: true,
  logConsole: true,
  logLevel: 'debug',
  db: 'leveldb',
  memory: false,
  persistent: true,
  workers: true,
  listen: true,
  loader: require,
});

// Temporary hack
if (!node.config.bool('no-wallet') && !node.has('walletdb')) {
  const plugin = require('../lib/wallet/plugin');
  node.use(plugin);
}

process.on('unhandledRejection', (err, promise) => {
  throw err;
});

process.on('SIGINT', async () => {
  await node.close();
});

(async () => {
  await node.open();
  await node.connect();

  node.on('connect', (entry, block) => {
    axios.post(process.env.WEBHOOK, {
      height: entry.height,
    });
  });

  await node.startSync();
})().catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
