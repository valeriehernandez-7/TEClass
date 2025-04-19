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
            avatar_url: user.avatar_url,
            role: user.role
        };
    }
    return null;
}

module.exports = {
    getUserById,
    getUserByUsername,
    registerUser,
    validateUser
};