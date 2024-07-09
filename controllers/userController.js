const userModel = require('../models/userModel');

async function getUsers(req, res) {
    try {
        const users = await userModel.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

async function getUser(req, res) {
    try {
        const user = await userModel.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

async function createUser(req, res) {
    try {
        const user = await userModel.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

async function updateUser(req, res) {
    try {
        const user = await userModel.updateUser(req.params.id, req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

async function deleteUser(req, res) {
    try {
        await userModel.deleteUser(req.params.id);
        res.status(200).send('User deleted');
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
};