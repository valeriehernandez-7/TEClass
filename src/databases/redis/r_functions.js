const path = require('path');
const redis = require('./r_connection');

const { getUserById } = require('../mongo/m_functions');

/* Send messages and files between two users */

async function sendMessage({ from_id, to_id, message, file }) {
    const timestamp = Date.now();
    const messageId = `${from_id}:${to_id}:${timestamp}`;

    const newFrom = await getUserById(from_id);

    const messageObject = {
        from: newFrom.username,
        text: message || null,
        fileUrl: file ? `/uploads/${file.filename}` : null,
        fileType: file ? file.mimetype : null,
        timestamp
    };
    await redis.hSet(`messages:${from_id}:${to_id}`, {
        [messageId]: JSON.stringify(messageObject)
    });

    return { message: 'Mensaje enviado correctamente.' };
}

/* Obtained messages between two users.
It retrieves messages from both directions (fromId to toId and vice versa). */

async function getMessages(fromId, toId) {
    const [messagesRaw1, messagesRaw2] = await Promise.all([
        redis.hGetAll(`messages:${fromId}:${toId}`),
        redis.hGetAll(`messages:${toId}:${fromId}`)
    ]);
    const mensajes1 = Object.values(messagesRaw1).map(msg => JSON.parse(msg));
    const mensajes2 = Object.values(messagesRaw2).map(msg => JSON.parse(msg));
    const todosLosMensajes = [...mensajes1, ...mensajes2];
    todosLosMensajes.sort((a, b) => a.timestamp - b.timestamp);

    return todosLosMensajes;
}

module.exports = {
  sendMessage,
  getMessages
};
