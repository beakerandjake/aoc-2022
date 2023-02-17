/**
 * Contains solutions for Day 6
 * Puzzle Description: https://adventofcode.com/2022/day/6
 */

/**
 * Maps each possible character in the signal to a bitmask which
 * can be used to indicate the presence of the character in a signal.
 */
const maskMap = [...Array(26)].reduce((acc, _, index) => {
  acc[String.fromCharCode(index + 97)] = 1 << index;
  return acc;
}, {});

/**
 * Determines whether or not the provided string is a valid marker.
 * A marker is valid if every character is unique.
 * @param {String} slice
 * @returns {Boolean}
 */
const isMarker = (slice) => {
  let uniqueSet = 0;
  for (let index = slice.length; index--; ) {
    const mask = maskMap[slice[index]];
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
  let end = markerLength;
  for (let index = 0; index < length; index++, end++) {
    if (isMarker(input.substring(index, end))) {
      return end;
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
