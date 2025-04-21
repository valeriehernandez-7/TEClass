const connectMongo = require('./m_connection');
const crypto = require('crypto');

/* This function gets an user from the db, searching it by id. */

async function getUserById(id) {
    const { db } = await connectMongo();
    return await db.collection('User').findOne({ id });
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
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role
        };
    }
    return null;
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
    return await db.collection('Course').findOne({ id });
}

async function getCourseByName(name) {
    const { db } = await connectMongo();
    return await db.collection('Course').findOne({ name });
}

async function getAllCourses() {
    const { db } = await connectMongo();
    return await db.collection('Course').find({}).toArray();
}





module.exports = {
    getUserById,
    getUserByUsername,
    registerUser,
    validateUser,
    NewCourse,
    getAllCourses
};