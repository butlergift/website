/**
 * Function that converts recursively keys in an object to camel case
 */
export function snakeToCamel(obj) {
  if (typeof obj !== 'object') {
    return obj;
  }

  return Object.keys(obj).reduce((camelized, key) => {
    let value = obj[key];

    if (Array.isArray(value)) {
      // If the value is an array, camelize the keys of its elements
      value = value.map(snakeToCamel);
    } else if (typeof value === 'object') {
      // If the value is an object, camelize its keys recursively
      value = snakeToCamel(value);
    }

    // Camelize the key
    let camelizedKey = key.replace(/[_.-](\w|$)/g, (_, p1) => p1.toUpperCase());

    // Lowercase the first character if it's uppercase
    if (/^[A-Z]/.test(camelizedKey)) {
      camelizedKey = camelizedKey[0].toLowerCase() + camelizedKey.slice(1);
    }

    // eslint-disable-next-line no-param-reassign
    camelized[camelizedKey] = value;
    return camelized;
  }, {});
}

/**
 * Function that converts recursively keys in an object to snake case
 */
export function camelToSnake(obj) {
  if (typeof obj !== 'object') {
    return obj;
  }

  return Object.keys(obj).reduce((snakeized, key) => {
    let value = obj[key];

    if (Array.isArray(value)) {
      // If the value is an array, snakeize the keys of its elements
      value = value.map(camelToSnake);
    } else if (typeof value === 'object') {
      // If the value is an object, snakeize its keys recursively
      value = camelToSnake(value);
    }

    // Snakeize the key
    const snakeizedKey = key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);

    // eslint-disable-next-line no-param-reassign
    snakeized[snakeizedKey] = value;
    return snakeized;
  }, {});
}
