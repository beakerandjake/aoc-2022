/**
 * Contains solutions for Day 6
 * Puzzle Description: https://adventofcode.com/2022/day/6
 */

const findMarkerInSignal = (signal, uniqueCharacterLength) => {
  const length = signal.length - uniqueCharacterLength + 1;
  for (let index = 0; index < length; index++) {
    const slice = signal.slice(index, index + uniqueCharacterLength);
    if (new Set(slice).size === uniqueCharacterLength) {
      return index + uniqueCharacterLength;
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
export const levelOne = ({ input }) => findMarkerInSignal(input, 4);

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ input }) => findMarkerInSignal(input, 14);
