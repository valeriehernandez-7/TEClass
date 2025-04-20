const express = require('express');
const router = express.Router();
const { getUserById, 
        getUserByUsername, 
        registerUser,
        validateUser,
        updateUser 
} = require('./m_functions');

/* 
In this file, all the routes for every mongo function are made.
A route is needed beacuse the functions are not directly accessible from the client side.
The routes are made using express, and the functions are imported from m_functions.js.
This routes will be used in the server.js file to create the API.
*/

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

router.put('/update/:id', async (req, res) => {
    const userId = req.params.id;
    const newData = req.body;
    try {
        const updatedUser = await updateUser(newData, userId);
        if (!updatedUser) return res.status(404).send('User not found');
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to update user');
    }
});

module.exports = router;
