const connectMongo = require('./m_connection');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');

/* This function gets an user from the db, searching it by id. */

async function getUserById(userId) {
    const { db } = await connectMongo();
    return await db.collection('User').findOne({ _id: new ObjectId(userId) });
}

/* This function gets an user from the db, searching it by username. */

async function getUserByUsername(username) {
    const { db } = await connectMongo();
    return await db.collection('User').findOne({ username });
}

/* This function generates the salt that is stablished for every user. */

function generateSalt() {
    return crypto.randomBytes(16).toString('hex');
}

/* 
This function uses the password introduced by the user and the salt
generated to create an strong hash password.
*/

function hashPassword(password, salt) {
    return crypto
        .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
        .toString('hex');
}

/* 
This function recives the user info in JSON format, 
and creates a new user in the db.
*/

async function registerUser(userData) {
    const { db } = await connectMongo();
    
    const salt = generateSalt();
    const hashedPassword = hashPassword(userData.password, salt);
  
    const newUser = {
        username: userData.username,
        password: hashedPassword,
        salt: salt,
        first_name: userData.first_name,
        last_name: userData.last_name,
        birth_date: new Date(userData.birth_date),
        avatar_url: userData.avatar_url,
        role: userData.role,
    };
  
    await db.collection('User').insertOne(newUser);
  
    return {
        message: 'User registered successfully',
        username: newUser.username,
        role: newUser.role,
    };
}

/* 
This function recives the username and password introduced by the user,
and checks if the user exists in the db. If the user exists, 
it checks if the password is correct and let the user in.
*/

async function validateUser(username, plainPassword) {
    const user = await getUserByUsername(username);
    if (!user) return null;
    
    const hashed = hashPassword(plainPassword, user.salt);
    if (hashed === user.password) {
        return {
            id: user._id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            birth_date: user.birth_date,
            avatar_url: user.avatar_url,
            role: user.role
        };
    }
    return null;
}

/* 
This function uses id to update the user info in the db.
It is used when the user wants to edit his profile.
*/

async function updateUser(newData, userId) {
    const { db } = await connectMongo();
    const user = await getUserById(userId);
    if (!user) return null;

    const updatedFields = {};

    if (newData.first_name) updatedFields.first_name = newData.first_name;
    if (newData.last_name) updatedFields.last_name = newData.last_name;
    if (newData.avatar_url) updatedFields.avatar_url = newData.avatar_url;
    if (newData.birth_date) updatedFields.birth_date = new Date(newData.birth_date);

    if (newData.password) {
        const salt = generateSalt();
        const hashedPassword = hashPassword(newData.password, salt);
        updatedFields.password = hashedPassword;
        updatedFields.salt = salt;
    }

    await db.collection('User').updateOne(
        { _id: new ObjectId(userId) },
        { $set: updatedFields }
    );  

    const updatedUser = await getUserById(userId);

    return {
        id: updatedUser.id,
        username: updatedUser.username,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        avatar_url: updatedUser.avatar_url,
        birth_date: updatedUser.birth_date,
        role: updatedUser.role
    };
}

/* 
This function returns all users stored in the database,
excluding the password and salt fields.
It is used to show the list of users in the search user window.
*/

async function getAllUsers(currentUserId) {
    const { db } = await connectMongo();
    return await db
        .collection('User')
        .find({ _id: { $ne: new ObjectId(currentUserId) } }) // excluye al usuario actual
        .project({ password: 0, salt: 0, birth_date: 0 })     // excluye campos sensibles
        .toArray();
}

/* This funtion returns the information from a list with user's id */

async function getUserDetailsByIds(ids) {
    const { db } = await connectMongo();
    const objectIds = ids.map(id => new ObjectId(id));
  
    return await db
      .collection('User')
      .find({ _id: { $in: objectIds } })
      .project({ username: 1, first_name: 1, last_name: 1, avatar_url: 1, role: 1 })
      .toArray();
}


//Courses functions will begin here

/**
This function will receive a JSON with data to enter a new course


**/


async function NewCourse(CourseData) {
    const { db } = await connectMongo();
    
    const newCourse = {
        code: CourseData.code,
        name: CourseData.name,
        description: CourseData.description,
        image_url: CourseData.image_url,
        status: CourseData.status,
        start_date: new Date(CourseData.start_date),
        end_date: new Date(CourseData.end_date),
        section: CourseData.section,
    };
  
    await db.collection('Course').insertOne(newCourse);
  
    return {
        message: 'Course registered successfully',
    };
}

async function getCourseByCode(code) {
    const { db } = await connectMongo();
    return await db.collection('Course').findOne({ code });
}


async function getCourseById(id) {
    const { db } = await connectMongo();
    return await db.collection('Course').findOne({ _id: new ObjectId(id) });
}

async function getCourseByName(name) {
    const { db } = await connectMongo();
    return await db.collection('Course').findOne({ name });
}

async function getAllCourses() {
    const { db } = await connectMongo();
    return await db.collection('Course').find({}).toArray();
}

async function insertSection(courseId, section) {
    const { db } = await connectMongo();
    return await db.collection('Course').updateOne(
        { _id: new ObjectId(courseId) },
        { $set: { section } }
    );
}

async function insertsubsection(courseId, subsection) {
    const { db } = await connectMongo();
    return await db.collection('Course').updateOne(
        { _id: new ObjectId(courseId) },
        { $set: { subsection } }
    );
}

async function getCursosCreados(userId) {
    const { db, client } = await connectMongo();
    try {
      const cursos = await db.collection('cursos').find({ creadorId: userId }).toArray();
      return cursos;
    } catch (error) {
      console.error('Error obteniendo cursos creados:', error);
      throw error;
    } finally {
      await client.close();
    }
  }

  async function getCursosMatriculados(userId) {
    const { db, client } = await connectMongo();
    try {
      const cursos = await db.collection('cursos').find({ estudiantes: userId }).toArray();
      return cursos;
    } catch (error) {
      console.error('Error obteniendo cursos matriculados:', error);
      throw error;
    } finally {
      await client.close();
    }
  }
  
  async function getEstudiantesDelCurso(codigoCurso) {
    const { db, client } = await connectMongo();
    try {
      const curso = await db.collection('cursos').findOne({ codigo: codigoCurso });
  
      if (!curso || !Array.isArray(curso.estudiantes)) return [];
  
      const estudiantes = await db.collection('usuarios')
        .find({ _id: { $in: curso.estudiantes.map(id => id.toString()) } })
        .project({ _id: 1, nombre: 1 })
        .toArray();
  
      return estudiantes;
    } catch (error) {
      console.error('Error obteniendo estudiantes del curso:', error);
      throw error;
    } finally {
      await client.close();
    }
  }
  

  async function getCoursesbyId(coursesId) {
    const { db } = await connectMongo();
    const objectIds = coursesId.map(id => new ObjectId(id));

    return await db.collection('Course').find({ _id: { $in: objectIds } }).toArray();
  }

module.exports = {
    getUserById,
    getUserByUsername,
    registerUser,
    validateUser,
    updateUser,
    getAllUsers,
    getUserDetailsByIds,
    NewCourse,
    getAllCourses,
    getCourseById,
    insertSection,
    getCursosCreados,
    getCursosMatriculados,
    getEstudiantesDelCurso,
    getCoursesbyId,
};