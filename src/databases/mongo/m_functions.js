const connectMongo = require('./m_connection');
const crypto = require('crypto');

async function getUserById(id) {
    const { db } = await connectMongo();
    return await db.collection('User').findOne({ id });
}

async function getUserByUsername(username) {
    const { db } = await connectMongo();
    return await db.collection('User').findOne({ username });
}

function generateSalt() {
    return crypto.randomBytes(16).toString('hex');
}
  
function hashPassword(password, salt) {
    return crypto
        .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
        .toString('hex');
}
  
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

async function validateUser(username, plainPassword) {
    const user = await getUserByUsername(username);
    if (!user) return null;
    
    // Cambiar en el login final
    const hashed = hashPassword(plainPassword, user.salt);
    if (plainPassword === user.password) {
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

module.exports = {
    getUserById,
    getUserByUsername,
    registerUser,
    validateUser
};