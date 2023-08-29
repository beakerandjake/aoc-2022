/**
 * Returns the result of a added to b.
 * @param {Number} a
 * @param {Number} b
 */
export const add = (a, b) => a + b;

/**
 * Returns the result of a multiplied by b.
 * @param {Number} a
 * @param {Number} b
 */
export const multiply = (a, b) => a * b;

/**
 * Returns the result of a subtracted by b.
 * @param {Number} a
 * @param {Number} b
 */
export const subtract = (a, b) => a - b;

/**
 * Returns the result of a divided by b.
 * @param {Number} a
 * @param {Number} b
 */
export const divide = (a, b) => a / b;

/**
 * Checks if value is between start and up to, but not including end.
 * @param {Number} value
 * @param {Number} start
 * @param {Number} end
 */
export const inRange = (value, start, end) => value >= start && value < end;

/**
 * Checks if value is between start and up to, and including end.
 * @param {Number} value
 * @param {Number} start
 * @param {Number} end
 */
export const inRangeInclusive = (value, start, end) => value >= start && value <= end;

/**
 * Returns a random integer in range zero to max (exclusive).
 * @param {Number} max - The max random integer value to use.
 */
export const randomInt = (max) => Math.floor(Math.random() * max);

/**
 * Returns the modulo of a and b.
 * @param {Number} a
 * @param {Number} b
 */
export const mod = (a, b) => ((a % b) + b) % b;
