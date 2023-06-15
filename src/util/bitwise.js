/**
 * Returns true if the bit at the values index is not zero.
 * @param {Number} value
 * @param {Number} index
 */
export const isBitSet = (value, index) => (value & (1 << index)) !== 0;

/**
 * Returns the value with the bit at the index set to 1.
 * @param {Number} value
 * @param {Number} index
 */
export const setBit = (value, index) => value | (1 << index);

/**
 * Shift the bits one to the left.
 * @param {Number} value
 */
export const leftShift = (value) => value << 1;

/**
 * Shift the bits one to the right.
 * @param {Number} value
 */
export const rightShift = (value) => value >> 1;
