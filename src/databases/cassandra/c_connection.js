const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1', 
  keyspace: 'proyectodb2'
});

async function connectCassandra() {
  await client.connect();
  return client;
}

module.exports = connectCassandra;
