/**
 * Creates an object composed of the picked object properties.
 * @param {Object} object
 * @param {String[]} keys
 */
export const pick = (object, keys) =>
  keys.reduce((acc, key) => {
    if (key in object) {
      acc[key] = object[key];
    }
    return acc;
  }, {});

/**
 * Creates an object composed of the inverted keys and values of object.
 * If object contains duplicate values, subsequent values overwrite property assignments of previous values.
 * @param {Object} object - The object to invert.
 */
export const invert = (object) =>
  Object.keys(object).reduce((acc, key) => {
    acc[object[key]] = key;
    return acc;
  }, {});
