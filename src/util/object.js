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
