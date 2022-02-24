const {
  BAD_REQUEST_CODE,
  SERVER_ERROR_CODE,
} = require('./constants');

const showError = (res, error) => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    res.status(BAD_REQUEST_CODE).send({ message: error.message }); // ошибка валидации
  } else {
    res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' }); // ошибка по умолчанию
  }
};

module.exports = showError;
