const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Проверь правильность ввода аватара. В этом поле должна быть ссылка на картинку',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Проверьте правильность ввода электронной почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: (v) => validator.isStrongPassword(v),
      message: 'Слабый пароль. Попробуйте использовать пароль посложнее',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
