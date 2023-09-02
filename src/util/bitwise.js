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

/**
 * Inverts the bits.
 */
export const invert = (value) => ~value;

/**
 * Returns a string representation of the number in binary.
 * @param {Number} number - The number to convert to binary.
 * @param {Number} minDigits - The amount of digits to pad with zeros to ensure consistent string length.
 */
export const binaryToString = (number, minStringLength) =>
  number.toString(2).padStart(minStringLength, '0');
