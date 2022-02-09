const express = require('express');
const userRoutes = require('./users');
const cardRoutes = require('./cards');

const routes = express.Router();

routes.use('/users', userRoutes);
routes.use('/cards', cardRoutes);
routes.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена. Проверьте URL' });
});

module.exports = routes;
