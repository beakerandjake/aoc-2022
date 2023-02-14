/**
 * Contains solutions for Day 4
 * Puzzle Description: https://adventofcode.com/2022/day/4
 */

const parseRange = (value) => {
  const split = value.split('-');
  const lhs = Number.parseInt(split[0], 10);
  const rhs = Number.parseInt(split[1], 10);
  return [lhs, rhs];
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ lines }) => {
  const toReturn = lines.reduce((acc, line) => {
    const pairs = line.split(',');
    const lhs = parseRange(pairs[0]);
    const rhs = parseRange(pairs[1]);
    return (lhs[0] >= rhs[0] && lhs[1] <= rhs[1]) ||
      (rhs[0] >= lhs[0] && rhs[1] <= lhs[1])
      ? acc + 1
      : acc;
  }, 0);

  return toReturn;
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
