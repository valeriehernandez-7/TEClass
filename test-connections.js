const connectCassandra = require('./src/databases/cassandra/cassandra.js');
const connectMongo = require('./src/databases/mongo/mongo.js');
const connectNeo4j = require('./src/databases/neo4j/neo4j.js');
const connectRedis = require('./src/databases/redis/redis.js');

async function testConnections() {
  // MongoDB
  try {
    const { db, client } = await connectMongo();
    console.log('✅ MongoDB conectado');
    await client.close();
  } catch (err) {
    console.error('❌ MongoDB error:', err.message);
  }

  // Redis
  try {
    const redisClient = await connectRedis();
    console.log('✅ Redis conectado');
    await redisClient.quit();
  } catch (err) {
    console.error('❌ Redis error:', err.message);
  }

  // Neo4j
  try {
    const neo4jDriver = await connectNeo4j();
    console.log('✅ Neo4j conectado');
    await neo4jDriver.close();
  } catch (err) {
    console.error('❌ Neo4j error:', err.message);
  }

  // Cassandra
  try {
    const cassandraClient = await connectCassandra();

    // Crear keyspace temporal
    const keyspace = 'test_keyspace_temp';
    await cassandraClient.execute(`
      CREATE KEYSPACE IF NOT EXISTS ${keyspace}
      WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}
    `);

    console.log('✅ Cassandra conectado (keyspace temporal creado)');

    // Borrar keyspace (limpio)
    await cassandraClient.execute(`DROP KEYSPACE IF EXISTS ${keyspace}`);
    await cassandraClient.shutdown();
  } catch (err) {
    console.error('❌ Cassandra error:', err.message);
  }
}

testConnections();

