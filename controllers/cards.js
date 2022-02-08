const Card = require('../models/card');
const showError = require('../utils/showError');
const checkUserExist = require('../utils/checkUserExist');
const {
  OK_CODE,
  CREATED_CODE,
  SERVER_ERROR_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
} = require('../utils/constants');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.status(OK_CODE).send(cards);
  } catch (err) {
    res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
  }
};

module.exports.createCard = async (req, res) => {
  const { name, link } = req.body;
  try {
    const newCard = await Card.create({ name, link, owner: req.user._id });
    const cardWithLinkInfo = await newCard.populate(['owner', 'likes']);
    res.status(CREATED_CODE).send(cardWithLinkInfo);
  } catch (err) {
    showError(res, err);
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (card) {
      res.status(OK_CODE).send(card);
    } else {
      res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
    }
  } catch (err) {
    res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
  }
};

module.exports.addLikeCard = (req, res) => {
  const id = req.user._id;
  checkUserExist({
    id,
    callback: async () => {
      try {
        const updatedCardInfo = await Card.findByIdAndUpdate(
          req.params.cardId,
          { $addToSet: { likes: id } }, // добавить _id в массив, если его там нет
          { new: true },
        ).populate(['owner', 'likes']);
        if (updatedCardInfo) {
          res.status(OK_CODE).send(updatedCardInfo);
        } else {
          res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
        }
      } catch (err) {
        showError(res, err);
      }
    },
    response: res,
    errCode: BAD_REQUEST_CODE,
    errText: 'Невозможно выполнить операцию, так как пользователя с таким ID не существует',
  });
};

module.exports.removeLikeCard = (req, res) => {
  const id = req.user._id;
  checkUserExist({
    id,
    callback: async () => {
      try {
        const updatedCardInfo = await Card.findByIdAndUpdate(
          req.params.cardId,
          { $pull: { likes: id } },
          { new: true },
        ).populate(['owner', 'likes']);
        if (updatedCardInfo) {
          res.status(OK_CODE).send(updatedCardInfo);
        } else {
          res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
        }
      } catch (err) {
        showError(res.err);
      }
    },
    response: res,
    errCode: BAD_REQUEST_CODE,
    errText: 'Невозможно выполнить операцию, так как пользователя с таким ID не существует',
  });
};
