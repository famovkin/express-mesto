const express = require('express');

const userRoutes = express.Router();

const { getUsers, getUser, createUser } = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.get('/:id', getUser);
userRoutes.post('/', express.json(), createUser);

module.exports = userRoutes;
