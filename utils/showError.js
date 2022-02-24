const BadRequestError = require('../errors/badRequestError');
const ServerError = require('../errors/serverError');

const showError = (res, error) => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    throw new BadRequestError(error.message); // ошибка валидации
  } else {
    throw new ServerError('Произошла ошибка'); // ошибка по умолчанию
  }
};

module.exports = showError;
