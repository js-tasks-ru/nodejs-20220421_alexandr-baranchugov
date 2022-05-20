const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.totalSize = 0;
    this.limit = options.limit || 0;
  }

  _transform(chunk, encoding, callback) {
    this.totalSize += Buffer.byteLength(chunk, encoding);

    if (this.totalSize > this.limit) {
      this.emit('error', new LimitExceededError('А вот... Превышен допустимый лимит передачи данных в поток'));
      return;
    }

    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
