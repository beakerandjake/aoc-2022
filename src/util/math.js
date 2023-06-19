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
 * Checks if value is between start and up to, but not including end.
 * @param {Number} value
 * @param {Number} start
 * @param {Number} end
 */
export const inRange = (value, start, end) => value >= start && value < end;

/**
 * Returns a random integer in range zero to max (exclusive).
 * @param {Number} max - The max random integer value to use.
 */
export const randomInt = (max) => Math.floor(Math.random() * max);
