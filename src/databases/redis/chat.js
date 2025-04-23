const express = require('express');
const router = express.Router();
const redis = require('./redis'); // Asegurate de que este cliente esté bien configurado

// Enviar un mensaje
router.post('/enviar', async (req, res) => {
  const { from_id, to_id, message } = req.body;
  const timestamp = Date.now();
  const messageId = `${from_id}:${to_id}:${timestamp}`;

  try {
    await redis.hSet(`messages:${from_id}:${to_id}`, { [messageId]: message });
    res.status(200).json({ message: 'Mensaje enviado correctamente.' });
  } catch (err) {
    console.error('Error al enviar mensaje:', err);
    res.sendStatus(500);
  }
});

// Obtener mensajes entre dos usuarios
router.get('/:from_id/:to_id', async (req, res) => {
  const { from_id, to_id } = req.params;

  try {
    const messages = await redis.hGetAll(`messages:${from_id}:${to_id}`);
    res.json(messages);
  } catch (err) {
    console.error('Error al obtener mensajes:', err);
    res.sendStatus(500);
  }
});

module.exports = router;