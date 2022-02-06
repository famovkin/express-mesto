const User = require('../models/user');
const showError = require('../utils/showError');
const checkUserExist = require('../utils/checkUserExist');
const {
  OK_CODE,
  CREATED_CODE,
  SERVER_ERROR_CODE,
  NOT_FOUND_CODE,
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
  checkUserExist({
    id: req.params.id,
    callback: (data) => res.status(OK_CODE).send(data),
    response: res,
    errCode: NOT_FOUND_CODE,
    errText: 'Запрашиваемый пользователь не найден',
  });
};

module.exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(CREATED_CODE).send(newUser);
  } catch (err) {
    showError(res, err);
  }
};

module.exports.updateUser = (req, res) => {
  const id = req.user._id;
  checkUserExist({
    id,
    callback: async () => {
      try {
        const { name, about } = req.body;
        const updatedUserInfo = await User.findByIdAndUpdate(
          id,
          { name, about },
          {
            new: true, // на выходе будет обновлённая запись
            runValidators: true, // данные будут валидированы перед изменением
          },
        );
        res.status(OK_CODE).send(updatedUserInfo);
      } catch (err) {
        showError(res, err);
      }
    },
    response: res,
    errCode: NOT_FOUND_CODE,
    errText: 'Запрашиваемый пользователь не найден',
  });
};

module.exports.updateUserAvatar = (req, res) => {
  const id = req.user._id;
  checkUserExist({
    id,
    callback: async () => {
      try {
        const { avatar } = req.body;
        const updatedUserInfo = await User.findByIdAndUpdate(
          id,
          { avatar },
          {
            new: true,
            runValidators: true,
          },
        );
        res.status(OK_CODE).send(updatedUserInfo);
      } catch (err) {
        showError(res, err);
      }
    },
    response: res,
    errCode: NOT_FOUND_CODE,
    errText: 'Запрашиваемый пользователь не найден',
  });
};
