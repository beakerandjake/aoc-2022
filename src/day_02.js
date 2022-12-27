/**
 * Contains solutions for Day 1
 * Puzzle Description: https://adventofcode.com/2022/day/2
 */

const convertCodeToNumber = (code) => {
  switch (code) {
    // ROCK
    case 'A':
    case 'X':
      return 1;
    // PAPER
    case 'B':
    case 'Y':
      return 2;
    // SCISSOR
    case 'C':
    case 'Z':
      return 3;
    default:
      throw RangeError('Unknown code', code);
  }
};

/**
 * TODO pre-compute score table, there's a tiny number of possible hands
 * so it's quick and easy to compute. Do this at the module level so it doesn't
 * count against our functions execution time.
 *
 * Then the functions can do one map of string -> score using the lookup.
 */

/**
 * Returns the solution for part one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const partOne = ({ input, lines }) => input
  .split('\n')
  .map((roundText) => {
    const converted = roundText.split(' ').map(convertCodeToNumber);
    const outcome = converted[0] - converted[1];
    let outcomeScore = 0;

    if (outcome === 0) {
      outcomeScore = 3;
    }
    if (outcome === -1 || outcome === 2) {
      outcomeScore = 6;
    }

    return converted[1] + outcomeScore;
  })
  .reduce((acc, x) => acc + x, 0);

/**
 * Returns the solution for part two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const partTwo = ({ input, lines }) => {
  // your code here
};
