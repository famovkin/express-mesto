const User = require('../models/user');
const { BAD_REQUEST_CODE } = require('./constants');

const checkUserExist = async ({
  id,
  callback,
  response,
  errCode,
  errText,
}) => {
  try {
    const user = await User.findById(id);
    if (user) {
      callback(user);
    } else {
      response.status(errCode).send({ message: errText });
      // ошибка для случаев, когда пользователь не нашелся
    }
  } catch (err) {
    response.status(BAD_REQUEST_CODE).send({ message: 'Упс! Что-то пошло не так' }); // ошибка по умолчанию
  }
};

module.exports = checkUserExist;
