const express = require('express');
const { celebrate, Joi } = require('celebrate');
const validateURL = require('../utils/validateURL');

const userRoutes = express.Router();

const {
  getUsers,
  getUser,
  getCurrentUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.get('/me', getCurrentUser);
userRoutes.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getUser);
userRoutes.patch('/me', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
userRoutes.patch('/me/avatar', express.json(), celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(validateURL, 'URL validation').required(),
  }),
}), updateUserAvatar);

module.exports = userRoutes;
