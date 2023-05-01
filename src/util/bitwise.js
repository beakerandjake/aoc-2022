/**
 * Returns true if the bit at the values index is not zero.
 * @param {Number} value
 * @param {Number} index
 */
export const isBitSet = (value, index) => value & (1 << index);

/**
 * Returns the value with the bit at the index set to 1.
 * @param {Number} value
 * @param {Number} index
 */
export const setBit = (value, index) => value | (1 << index);
