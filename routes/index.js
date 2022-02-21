const express = require('express');
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { login, createUser } = require('../controllers/users');

const routes = express.Router();

routes.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), login);
routes.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), createUser);
routes.use(auth);
routes.use('/users', userRoutes);
routes.use('/cards', cardRoutes);
routes.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена. Проверьте URL' });
});

module.exports = routes;
