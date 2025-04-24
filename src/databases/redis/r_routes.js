const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { sendMessage, getMessages } = require('./r_functions');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

/* This route uses a function that send a message and store it with both user's id */

router.post('/send-message', upload.single('file'), async (req, res) => {
    const { from_id, to_id, message } = req.body;
    const file = req.file;

    try {
        const result = await sendMessage({ from_id, to_id, message, file });
        res.status(200).json(result);
    } catch (err) {
        console.error('Error al enviar mensaje:', err);
        res.sendStatus(500);
    }
});

/* This route uses a function that upload the chat between users */

router.get('/chat-upload/:fromId/:toId', async (req, res) => {
    const { fromId, toId } = req.params;

    try {
        const mensajes = await getMessages(fromId, toId);
        res.json(mensajes);
    } catch (err) {
        console.error('Error al obtener mensajes:', err);
        res.sendStatus(500);
    }
});

module.exports = router;