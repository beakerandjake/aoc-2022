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
  for (let index = 0; index < slice.length; index++) {
    const mask = 1 << (slice[index].charCodeAt() - 97);

    if ((uniqueSet & mask) !== 0) {
      return false;
    }

    uniqueSet |= mask;
  }
  return true;
};

const findMarkerInSignalBitwise = (signal, uniqueCharacterLength) => {
  const length = signal.length - uniqueCharacterLength + 1;
  const slice = [...signal.slice(0, uniqueCharacterLength)];

  if (isUnique(slice)) {
    return uniqueCharacterLength;
  }

  for (let index = 1; index < length; index++) {
    slice.shift();
    slice.push(signal[index + uniqueCharacterLength]);

    if (isUnique(slice)) {
      return index + uniqueCharacterLength + 1;
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
export const levelOne = ({ input }) => findMarkerInSignalBitwise(input, 4);

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ input }) => findMarkerInSignalBitwise(input, 14);
