/*const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1', 
  keyspace: 'proyectobd2'
});

async function connectCassandra() {
  await client.connect();
  return client;
}

module.exports = connectCassandra;*/

const cassandra = require('cassandra-driver');

async function connectCassandra() {
  const client = new cassandra.Client({
    contactPoints: ['127.0.0.1', '127.0.0.2'],
    localDataCenter: 'datacenter1',
    keyspace: 'proyectobd2'
  });

  await client.connect();
  return client;
}

module.exports = connectCassandra;