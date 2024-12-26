'use strict';
const https = require('https');

const plugin = exports;

class Plugin {
  constructor(node) {
    node.on('connect', (entry) => {
      const data = JSON.stringify({ height: entry.height });
      const options = {
        hostname: process.env.BB_WEBHOOK,
        port: 443,
        path: '/rest/v1/rpc/process_block',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
          apikey: process.env.BB_API_KEY,
          'content-profile': 'btc',
        },
      };
      const req = https.request(options, (res) => {
        console.log(`Sent to Supabase: ${entry.height}`);
      });
      req.on('error', (error) => {
        console.error(error);
      });
      req.write(data);
      req.end();
    });
  }
}

plugin.init = function init(node) {
  return new Plugin(node);
};

plugin.id = 'bitcoin-billboard';
