const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://wjv668:668@schoolify.z67yugl.mongodb.net/?retryWrites=true&w=majority&appName=Schoolify';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('ProyectoBD2');
    const users = db.collection('User');
    const allUsers = await users.find().toArray();
    console.log(allUsers);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
