const redis = require('./redis');

async function testRedisConnection() {
  try {
    const pong = await redis.ping();
    console.log('✅ PING recibido:', pong);
  } catch (err) {
    console.error('❌ Error al hacer PING a Redis:', err);
  }
}

testRedisConnection();