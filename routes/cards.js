const express = require('express');
const { celebrate, Joi } = require('celebrate');
const validateURL = require('../utils/validateURL');

const cardRoutes = express.Router();
const {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  removeLikeCard,
} = require('../controllers/cards');

cardRoutes.get('/', getCards);
cardRoutes.post('/', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().custom(validateURL, 'URL validation').required(),
  }),
}), createCard);
cardRoutes.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteCard);
cardRoutes.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), addLikeCard);
cardRoutes.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), removeLikeCard);

module.exports = cardRoutes;
