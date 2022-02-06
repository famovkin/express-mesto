const express = require('express');

const userRoutes = express.Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.get('/:id', getUser);
userRoutes.post('/', express.json(), createUser);
userRoutes.patch('/me', express.json(), updateUser);
userRoutes.patch('/me/avatar', express.json(), updateUserAvatar);

module.exports = userRoutes;
