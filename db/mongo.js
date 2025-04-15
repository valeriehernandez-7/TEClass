const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://wjv668:668@schoolify.z67yugl.mongodb.net/?retryWrites=true&w=majority&appName=Schoolify';
const client = new MongoClient(uri);

async function connectMongo() {
  await client.connect();
  const db = client.db('ProyectoBD2');
  return { db, client };
}

module.exports = connectMongo;
