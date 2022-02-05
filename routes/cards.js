const express = require('express');

const cardRoutes = express.Router();
const { getCards, createCard, deleteCard } = require('../controllers/cards');

cardRoutes.get('/', getCards);
cardRoutes.post('/', express.json(), createCard);
cardRoutes.delete('/:cardId', deleteCard);

module.exports = cardRoutes;
