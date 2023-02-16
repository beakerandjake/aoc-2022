/**
 * Contains solutions for Day 6
 * Puzzle Description: https://adventofcode.com/2022/day/6
 */

/**
 * Determines whether or not the provided string is a valid marker.
 * A marker is valid if every character is unique.
 * @param {String} slice
 */
const isMarker = (slice) => {
  let uniqueSet = 0;
  let mask = 0;
  for (let index = slice.length; index--; ) {
    mask = 1 << (slice.charCodeAt(index) - 97);
    if (uniqueSet & mask) {
      return false;
    }
    uniqueSet |= mask;
  }
  return true;
};

/**
 * Searches the input signal for a marker of specified length.
 * @param {String} input
 * @param {Number} markerLength
 * @returns {Number} The number of characters processed before the signal was found.
 */
const findMarker = (input, markerLength) => {
  const length = input.length - markerLength + 1;
  for (let index = 0; index < length; index++) {
    if (isMarker(input.substring(index, index + markerLength))) {
      return index + markerLength;
    }
  }

  throw new Error('could not find marker in signal');
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input }) => findMarker(input, 4);

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ input }) => findMarker(input, 14);
