'use strict';

const bcoin = require('@bcoin-org/bcoin');

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

process.on('unhandledRejection', (err, promise) => {
  throw err;
});

process.on('SIGINT', async () => {
  await node.close();
});

(async () => {
  await node.open();
  await node.connect();

  console.log('WEBHOOK: %s', process.env.WEBHOOK);

  // node.on('connect', (entry, block) => {
  //   console.log('%s (%d) added to chain.', entry.rhash(), entry.height);
  // });

  await node.startSync();
})().catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
