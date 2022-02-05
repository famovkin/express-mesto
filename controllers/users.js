const User = require('../models/user');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).send(newUser);
  } catch (err) {
    if (err.errors.name.name === 'ValidatorError') {
      res.status(400).send({ message: err.errors.name.message });
    }
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};
