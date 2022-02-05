const Card = require('../models/card');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

module.exports.createCard = async (req, res) => {
  const id = req.user._id;
  try {
    const newCard = await Card.create({ ...req.body, owner: id });
    res.status(201).send(newCard);
  } catch (err) {
    if (err.errors.name.name === 'ValidatorError') {
      res.status(400).send({ message: err.errors.name.message });
    }
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (card) {
      res.status(200).send(card);
    } else {
      res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка ' });
  }
};
