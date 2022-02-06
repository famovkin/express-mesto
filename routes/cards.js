const express = require('express');

const cardRoutes = express.Router();
const {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  removeLikeCard,
} = require('../controllers/cards');

cardRoutes.get('/', getCards);
cardRoutes.post('/', express.json(), createCard);
cardRoutes.delete('/:cardId', deleteCard);
cardRoutes.put('/:cardId/likes', addLikeCard);
cardRoutes.delete('/:cardId/likes', removeLikeCard);

module.exports = cardRoutes;
