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

const isUnique = (slice) => {
  let uniqueSet = 0;
  let mask = 0;
  for (let index = 0; index < slice.length; index++) {
    mask = 1 << (slice.charCodeAt(index) - 97);
    if (uniqueSet & mask) {
      return false;
    }
    uniqueSet |= mask;
  }
  return true;
};

const findMarkerInSignalBitwise = (signal, uniqueCharacterLength) => {
  const length = signal.length - uniqueCharacterLength + 1;
  for (let index = 0; index < length; index++) {
    if (isUnique(signal.substring(index, index + uniqueCharacterLength))) {
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
export const levelTwo = ({ input }) => findMarkerInSignalBitwise(input, 14);
