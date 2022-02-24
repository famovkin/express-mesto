const User = require('../models/user');
const Card = require('../models/card');
const showError = require('../utils/showError');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');

const {
  OK_CODE,
  CREATED_CODE,
  SERVER_ERROR_CODE,
  BAD_REQUEST_CODE,
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

module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    } else if (String(card.owner) === String(req.user._id)) {
      const deletedCard = await Card.findByIdAndDelete(req.params.cardId);
      res.status(OK_CODE).send(deletedCard);
    } else {
      throw new ForbiddenError('Вы не можете удалять чужие карточки');
    }
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(BAD_REQUEST_CODE).send({ message: err.message });
    } else {
      next(err);
    }
  }
};

module.exports.addLikeCard = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await User.findById(id);
    if (user) {
      const updatedCardInfo = await Card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: id } }, // добавить _id в массив, если его там нет
        { new: true },
      );
      if (updatedCardInfo) {
        res.status(OK_CODE).send(updatedCardInfo);
      } else {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
    } else {
      throw new BadRequestError('Невозможно выполнить операцию, так как пользователя с таким ID не существует');
    }
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(BAD_REQUEST_CODE).send({ message: err.message });
    } else {
      next(err);
    }
  }
};

module.exports.removeLikeCard = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await User.findById(id);
    if (user) {
      const updatedCardInfo = await Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: id } },
        { new: true },
      );
      if (updatedCardInfo) {
        res.status(OK_CODE).send(updatedCardInfo);
      } else {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
    } else {
      throw new BadRequestError('Невозможно выполнить операцию, так как пользователя с таким ID не существует');
    }
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(BAD_REQUEST_CODE).send({ message: err.message });
    } else {
      next(err);
    }
  }
};
