const { DUPLICATE_CODE } = require('../utils/constants');

class DuplicateError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = DUPLICATE_CODE;
  }
}

module.exports = DuplicateError;
