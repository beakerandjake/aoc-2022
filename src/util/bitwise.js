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
 * Returns a bitmask with n bits set to one starting from the least significant bit.
 * @param {Number} length
 */
export const bitmask = (length) => {
  if (length < 1) {
    throw new RangeError('length must be at least one');
  }
  return (1 << length) - 1;
};

/**
 * Returns a string representation of the number in binary.
 * @param {Number} number - The number to convert to binary.
 * @param {Number} minDigits - The amount of digits to pad with zeros to ensure consistent string length.
 */
export const binaryToString = (number, minStringLength) =>
  number.toString(2).padStart(minStringLength, '0');
