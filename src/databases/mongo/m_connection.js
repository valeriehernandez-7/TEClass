const { MongoClient } = require('mongodb');

// Using localhost in docker:
//const uri = 'mongodb://localhost:27017';
// Using Mongo Atlas: 
const uri = 'mongodb+srv://wjv668:668@schoolify.z67yugl.mongodb.net/?retryWrites=true&w=majority&appName=Schoolify';

const client = new MongoClient(uri);

async function connectMongo() {
  await client.connect();
  const db = client.db('proyectodb2');
  return { db, client };
}

module.exports = connectMongo;
