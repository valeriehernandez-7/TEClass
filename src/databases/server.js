const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const mongoRouter = require('./mongo/m_routes');
const redisRouter = require('./redis/r_routes');
const cassandraRouter = require('./cassandra/c_routes');
const neo4jRouter = require('./neo4j/n_routes');
const { driver } = require('./neo4j/n_connection');

app.use(cors({}));
app.use(express.json({ limit: '10mb' }));

app.use('/api/mongo', mongoRouter);
app.use('/api/neo4j', neo4jRouter);
app.use('/api/redis', redisRouter);
app.use('/api/cassandra', cassandraRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
/* 
The databse will run in port 4000, because the port 3000 is used by the react app.
*/

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});

/* This process closes the neo4j driver correctly */

process.on('SIGINT', async () => {
  console.log('\nCerrando conexiones...');
  try {
    await driver.close();
    console.log('Conexión con Neo4j cerrada correctamente.');
  } catch (error) {
    console.error('Error cerrando Neo4j:', error);
  } finally {
    process.exit(0);
  }
});