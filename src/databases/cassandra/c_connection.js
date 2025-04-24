const cassandra = require('cassandra-driver');

async function connectCassandra() {
  const client = new cassandra.Client({
    contactPoints: ['127.0.0.1', '127.0.0.2'],
    localDataCenter: 'datacenter1',
    keyspace: 'proyectodb2'
  });

  await client.connect();
  return client;
}

module.exports = connectCassandra;