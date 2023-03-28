/**
 * Removes the first element of the array.
 * Does not mutate the original array but instead returns a new copy.
 * @param {Array} arr
 */
export const popHead = (arr) => arr.slice(1);

/**
 * Adds the element to the end of the array.
 * Does not mutate the original array but instead returns a new copy.
 * @param {Array} arr
 * @param {Any} item
 */
export const append = (arr, item) => [...arr, item];

/**
 * Converts the string to a number.
 * For speed not for sanity, this can easily fail if the string is not valid.
 * @param {String} x
 */
export const number = (x) => +x;

/**
 * Returns the result of the lhs added to the rhs.
 * @param {Number} a
 * @param {Number} b
 */
export const add = (a, b) => a + b;

/**
 * Returns the result of the lhs multiplied by the rhs.
 * @param {Number} a
 * @param {Number} b
 */
export const multiply = (a, b) => a * b;

/**
 * Match the string to the regex and return the first capture result.
 * @param {String} str
 * @param {RegExp} regex
 */
export const firstCapture = (str, regex) => str.match(regex)[1];
