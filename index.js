const connectMongo = require('./db/mongo');

async function main() {
  const { db: mongo, client: mongoClient } = await connectMongo();

  const users = await mongo.collection('User').find().toArray();
  console.log('Users:', users);

  await mongoClient.close(); 
}

main().catch(console.error);