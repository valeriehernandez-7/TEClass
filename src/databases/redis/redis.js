const { createClient } = require('redis');

const client = createClient({
  url: 'redis://localhost:7001'
});

async function connectRedis() {
  client.on('error', err => console.error('Redis Client Error', err));
  await client.connect();
  return client;
}

module.exports = connectRedis;