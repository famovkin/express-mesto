const express = require('express');
const userRoutes = require('./users');
const cardRoutes = require('./cards');

const routes = express.Router();

routes.use('/users', userRoutes);
routes.use('/cards', cardRoutes);

module.exports = routes;
