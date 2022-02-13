const User = require('../models/user');
const showError = require('../utils/showError');
const {
  OK_CODE,
  CREATED_CODE,
  SERVER_ERROR_CODE,
  NOT_FOUND_CODE,
  BAD_REQUEST_CODE,
} = require('../utils/constants');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(OK_CODE).send(users);
  } catch (err) {
    res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user) {
      res.status(OK_CODE).send(user);
    } else {
      res.status(NOT_FOUND_CODE).send({ message: 'Невозможно выполнить операцию, так как пользователя с таким ID не существует' });
    }
  } catch (err) {
    res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(CREATED_CODE).send(newUser);
  } catch (err) {
    showError(res, err);
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const id = req.user._id;
    const { name, about } = req.body;
    const user = await User.findById(id);
    if (user) {
      const updatedUserInfo = await User.findByIdAndUpdate(
        id,
        { name, about },
        {
          new: true, // на выходе будет обновлённая запись
          runValidators: true, // данные будут валидированы перед изменением
        },
      );
      res.status(OK_CODE).send(updatedUserInfo);
    } else {
      res.status(BAD_REQUEST_CODE).send({ message: 'Невозможно выполнить операцию, так как пользователя с таким ID не существует' });
    }
  } catch (err) {
    showError(res, err);
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  try {
    const id = req.user._id;
    const { avatar } = req.body;
    const user = await User.findById(id);
    if (user) {
      const updatedUserInfo = await User.findByIdAndUpdate(
        id,
        { avatar },
        {
          new: true,
          runValidators: true,
        },
      );
      res.status(OK_CODE).send(updatedUserInfo);
    } else {
      res.status(BAD_REQUEST_CODE).send({ message: 'Невозможно выполнить операцию, так как пользователя с таким ID не существует' });
    }
  } catch (err) {
    showError(res, err);
  }
};
