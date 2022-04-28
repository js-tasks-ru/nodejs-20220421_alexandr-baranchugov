function sum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Sum function argument type error');
  }

  return a + b;
}

module.exports = sum;
