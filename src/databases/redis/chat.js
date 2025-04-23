const express = require('express');
const router = express.Router();
const redis = require('./redis'); 


router.post('/', async (req, res) => {
  const { from_id, to_id, message } = req.body;
  const timestamp = Date.now();
  const messageId = `${from_id}:${to_id}:${timestamp}`;

  const messageObject = {
    from: from_id,
    text: message,
    timestamp
  };

  try {
    await redis.hSet(`messages:${from_id}:${to_id}`, {
      [messageId]: JSON.stringify(messageObject)
    });
    res.status(200).json({ message: 'Mensaje enviado correctamente.' });
  } catch (err) {
    console.error('Error al enviar mensaje:', err);
    res.sendStatus(500);
  }
});


router.get('/:fromId/:toId', async (req, res) => {
  const { fromId, toId } = req.params;

  try {
    const [messagesRaw1, messagesRaw2] = await Promise.all([
      redis.hGetAll(`messages:${fromId}:${toId}`),
      redis.hGetAll(`messages:${toId}:${fromId}`)
    ]);

    const mensajes1 = Object.values(messagesRaw1).map(msg => JSON.parse(msg));
    const mensajes2 = Object.values(messagesRaw2).map(msg => JSON.parse(msg));

    const todosLosMensajes = [...mensajes1, ...mensajes2];

    todosLosMensajes.sort((a, b) => a.timestamp - b.timestamp);

    res.json(todosLosMensajes);
  } catch (err) {
    console.error('Error al obtener mensajes:', err);
    res.sendStatus(500);
  }
});

module.exports = router;