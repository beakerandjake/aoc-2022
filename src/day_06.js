/**
 * Contains solutions for Day 6
 * Puzzle Description: https://adventofcode.com/2022/day/6
 */

const startOfPacketLength = 4;

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input }) => {
  const length = input.length - startOfPacketLength + 1;
  for (let index = 0; index < length; index++) {
    const slice = input.slice(index, index + startOfPacketLength);
    const uniq = new Set(slice);
    if (uniq.size === startOfPacketLength) {
      return index + startOfPacketLength;
    }
  }

  throw new Error('could not find start-of-packet-marker');
};

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
