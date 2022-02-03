function isArrayItemExists(array, item) {
  for (var i = 0; i < array.length; i++) {
    if (JSON.stringify(array[i]) == JSON.stringify(item)) {
      return true;
    }
  }
  return false;
}

module.exports = { isArrayItemExists };
