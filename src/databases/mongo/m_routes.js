const express = require('express');
const router = express.Router();
const { getUserById, 
        getUserByUsername, 
        registerUser,
        validateUser
} = require('./m_functions');

router.get('/by-username/:username', async (req, res) => {
    try {
        const user = await getUserByUsername(req.params.username);
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.get('/by-id/:id', async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.post('/register', async (req, res) => {
    try {
        const result = await registerUser(req.body);
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to register user');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await validateUser(username, password);
        if (!user) {
            return res.status(401).send('Invalid username or password');
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
