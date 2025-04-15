const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://<user>:<password>@schoolify.z67yugl.mongodb.net/?retryWrites=true&w=majority&appName=Schoolify';
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


// Insertar datos
/*

const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://wjv668:668@schoolify.z67yugl.mongodb.net/?retryWrites=true&w=majority&appName=Schoolify';
const client = new MongoClient(uri);

const user = {
    username: "maria_venegas",
    password: "hashed_password_123",
    salt: "random_salt_value",
    first_name: "Maria",
    last_name: "Venegas",
    birth_date: new Date("1999-05-10"),
    avatar_url: "https://example.com/avatars/maria.png"
};

const course = {
    code: "CS101",
    title: "Introducción a la Programación",
    description: "Curso básico de programación con JavaScript.",
    image_url: "https://example.com/images/cs101.jpg",
    status: "published",
    start_date: new Date("2025-05-01"),
    end_date: new Date("2025-08-01"),
    section: {
      section_title: "Unidad 1: Fundamentos",
      section_text: "Conceptos básicos de programación.",
      resources: ["text", "https://example.com/docs/intro.pdf"],
      sub_section: {
        sub_title: "Variables y tipos",
        sub_text: "Explicación de variables, tipos y operadores.",
        sub_resources: ["video", "https://example.com/videos/variables.mp4"]
      }
    }
};

async function run() {
  try {
    await client.connect();
    const db = client.db('ProyectoBD2');
      
    await db.collection("User").insertOne(user);
    console.log("Usuario insertado con éxito.");

    await db.collection("Course").insertOne(course);
    console.log("Curso insertado con éxito.");

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}
run();


*/
