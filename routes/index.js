const express = require('express');
const auth = require('../middlewares/auth');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { login, createUser } = require('../controllers/users');

const routes = express.Router();

routes.post('/signin', express.json(), login);
routes.post('/signup', express.json(), createUser);
routes.use(auth);
routes.use('/users', userRoutes);
routes.use('/cards', cardRoutes);
routes.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена. Проверьте URL' });
});

module.exports = routes;
