const stream = require('stream');
const os = require('os');
const eol = os.EOL;

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this._buffer = '';
    this._t;
  }

  _transform(chunk, encoding, callback) {
    let items;
    this._buffer += chunk.toString();

    callback();

    if (!this._buffer.includes(eol)) {
      return;
    }

    items = this._buffer.split(eol);

    this._buffer = items.pop();

    for (let i in items) {
      this.emit('data', items[i]);
    }
  }

  _flush(callback) {
    callback(null, this._buffer);
  }
}

module.exports = LineSplitStream;
