const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const showError = require('../utils/showError');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const AuthError = require('../errors/authError');
const DuplicateError = require('../errors/duplicateError');
const ServerError = require('../errors/serverError');

const {
  OK_CODE,
  CREATED_CODE,
  MONGO_DUPLICATE_ERROR_CODE,
  SALT_ROUND,
  NODE_ENV,
  JWT_SECRET,
} = require('../utils/constants');

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(OK_CODE).send(users);
  } catch (err) {
    next(new ServerError('Произошла ошибка'));
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user) {
      res.status(OK_CODE).send(user);
    } else {
      throw new NotFoundError('Невозможно выполнить операцию, так как пользователя с таким ID не существует');
    }
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = await User.find({ _id: req.user._id });
    res.status(OK_CODE).send(currentUser);
  } catch (err) {
    next(new BadRequestError('Произошла ошибка'));
  }
};

module.exports.createUser = async (req, res, next) => {
  const { email: mail, password } = req.body;
  if (!mail || !password) {
    throw new BadRequestError('Не передан email или пароль');
  }

  bcrypt.hash(password, SALT_ROUND)
    .then((hash) => {
      User.create({ ...req.body, password: hash })
        .then(({
          name,
          avatar,
          about,
          email,
        }) => {
          res.status(CREATED_CODE).send({
            name,
            avatar,
            about,
            email,
          });
        })
        .catch((err) => {
          if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
            throw new DuplicateError('Такой пользователь уже существует');
          } else {
            showError(res, err);
          }
        })
        .catch(next);
    })
    .catch(() => next(new BadRequestError('Произошла ошибка')));
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const id = req.user._id;
    const { name, about } = req.body;
    if (id === undefined) {
      throw new NotFoundError('В запросе отсутствуют данные о пользователе');
    }
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
    if (err.name === 'ValidationError') {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
};

module.exports.updateUserAvatar = async (req, res, next) => {
  try {
    const id = req.user._id;
    const { avatar } = req.body;
    if (id === undefined) {
      throw new NotFoundError('В запросе отсутствуют данные о пользователе');
    }
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
    if (err.name === 'ValidationError') {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Не передан email или пароль');
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неверные почта или пароль');
      }

      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неверные почта или пароль');
          }
          // eslint-disable-next-line no-underscore-dangle
          const token = jwt.sign({ _id: user._doc._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          res.send({ token });
        });
    })
    .catch(next);
};
